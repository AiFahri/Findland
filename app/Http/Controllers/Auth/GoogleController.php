<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redirect()
    {
        Log::info('Google redirect started');
        try {
            // Use stateless mode to avoid session issues
            return Socialite::driver('google')
                ->stateless()
                ->redirect();
        } catch (\Exception $e) {
            Log::error('Google redirect error: ' . $e->getMessage());
            return redirect()->route('login')
                ->with('error', 'Failed to connect to Google. Please try again.');
        }
    }

    /**
     * Obtain the user information from Google.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function callback()
    {
        try {
            Log::info('Google callback started');

            // Get the Google user
            // Our SocialiteServiceProvider will handle disabling SSL verification
            $googleUser = Socialite::driver('google')->stateless()->user();
            Log::info('Google user retrieved', ['email' => $googleUser->email, 'name' => $googleUser->name]);
            Log::debug('Google user object', ['user' => json_encode($googleUser)]);

            if (empty($googleUser->email)) {
                Log::error('Google user email is empty');
                return redirect()->route('login')
                    ->with('error', 'Could not get email from Google. Please try again.');
            }
            $user = $this->findOrCreateUser($googleUser);

            if (!$user) {
                Log::error('Failed to find or create user');
                return redirect()->route('login')
                    ->with('error', 'Failed to login with Google. Please try again.');
            }

            Auth::login($user, true);
            Log::info('User logged in', ['id' => $user->id, 'email' => $user->email]);

            return redirect('/');

        } catch (Exception $e) {
            Log::error('Google login error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return redirect()->route('login')
                ->with('error', 'Failed to login with Google. Please try again.');
        }
    }

    /**
     * Find or create a user based on Google user data.
     *
     * @param  \Laravel\Socialite\Two\User  $googleUser
     * @return \App\Models\User|null
     */
    protected function findOrCreateUser($googleUser)
    {
        try {
            $user = User::where('google_id', $googleUser->id)->first();

            if ($user) {
                Log::info('User found by google_id', ['id' => $user->id]);
                return $user;
            }

            // If not found, try to find by email
            $user = User::where('email', $googleUser->email)->first();

            if ($user) {
                Log::info('User found by email, updating google_id', ['id' => $user->id]);
                $user->update([
                    'google_id' => $googleUser->id,
                    'is_google_account' => true,
                    'avatar' => $googleUser->avatar,
                ]);
                return $user;
            }

            // If user doesn't exist, create a new one
            Log::info('Creating new user', ['email' => $googleUser->email]);
            $nameParts = explode(' ', $googleUser->name, 2);
            $firstName = $nameParts[0];
            $lastName = isset($nameParts[1]) ? $nameParts[1] : '';

            $userData = [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'is_google_account' => true,
                'avatar' => $googleUser->avatar,
                'password' => Hash::make(Str::random(16)),
                'email_verified_at' => now(),
                'address' => null, // Explicitly set address to null (now that it's nullable)
            ];

            Log::info('Attempting to create user with data', ['userData' => $userData]);
            $fillable = (new User())->getFillable();
            Log::info('User model fillable fields', ['fillable' => $fillable]);
            $user = User::create($userData);

            if ($user && $user->exists) {
                Log::info('New user created successfully', ['id' => $user->id]);
                return $user;
            } else {
                Log::error('Failed to create user');
                return null;
            }

        } catch (Exception $e) {
            Log::error('Error finding or creating user: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return null;
        }
    }
}
