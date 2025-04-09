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

            $googleUser = Socialite::driver('google')->stateless()->user();
            Log::info('Google user retrieved', ['email' => $googleUser->email, 'name' => $googleUser->name]);
            Log::debug('Google user object', ['user' => json_encode($googleUser)]);

            // Log email verification status from Google
            $emailVerified = isset($googleUser->user['email_verified']) ? $googleUser->user['email_verified'] : false;
            Log::info('Google email verification status', [
                'email' => $googleUser->email,
                'verified' => $emailVerified
            ]);

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

            $emailVerified = isset($googleUser->user['email_verified']) ? $googleUser->user['email_verified'] : false;
            Log::info('Checking email verification status', [
                'email' => $user->email,
                'has_verified_email' => $user->hasVerifiedEmail(),
                'google_verified' => $emailVerified
            ]);

            if (!$user->hasVerifiedEmail()) {
                if ($user->is_google_account && $emailVerified) {
                    $user->markEmailAsVerified();
                    Log::info('Email marked as verified for Google user', ['email' => $user->email]);
                } else {
                    Log::info('Redirecting to verification notice', ['email' => $user->email]);
                    return redirect(route('verification.notice'));
                }
            }

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
                // Update user dengan data Google
                $user->update([
                    'google_id' => $googleUser->id,
                    'is_google_account' => true,
                    'avatar' => $googleUser->avatar,
                ]);

                // Jika user belum punya profile_picture, gunakan avatar dari Google
                if (!$user->profile_picture && $googleUser->avatar) {
                    $user->update(['profile_picture' => $this->saveGoogleAvatar($googleUser->avatar, $user->id)]);
                }
                return $user;
            }

            // If user doesn't exist, create a new one
            Log::info('Creating new user', ['email' => $googleUser->email]);
            $nameParts = explode(' ', $googleUser->name, 2);
            $firstName = $nameParts[0];
            $lastName = isset($nameParts[1]) ? $nameParts[1] : '';

            // Simpan avatar Google jika ada
            $profilePicture = null;
            if ($googleUser->avatar) {
                $profilePicture = $this->saveGoogleAvatar($googleUser->avatar, 'new_user_' . time());
            }

            $userData = [
                'first_name' => $firstName,
                'last_name' => $lastName,
                'email' => $googleUser->email,
                'google_id' => $googleUser->id,
                'is_google_account' => true,
                'avatar' => $googleUser->avatar,
                'profile_picture' => $profilePicture,
                'password' => Hash::make(Str::random(16)),
                'email_verified_at' => null,
                'address' => null,
            ];

            Log::info('Attempting to create user with data', ['userData' => $userData]);
            $fillable = (new User())->getFillable();
            Log::info('User model fillable fields', ['fillable' => $fillable]);
            $user = User::create($userData);

            if ($user && $user->exists) {
                Log::info('New user created successfully', ['id' => $user->id]);

                Log::info('New user created', ['email' => $user->email]);

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

    /**
     * Save Google avatar to storage and return the path.
     *
     * @param string $avatarUrl
     * @param string|int $userId
     * @return string|null
     */
    protected function saveGoogleAvatar($avatarUrl, $userId)
    {
        try {
            Log::info('Attempting to save Google avatar', ['url' => $avatarUrl]);

            // Gunakan avatar langsung dari Google tanpa menyimpan ke storage lokal
            // Ini menghindari masalah permission dan file system
            return null; // Kembalikan null agar sistem menggunakan avatar dari Google langsung
        } catch (\Exception $e) {
            Log::error('Error handling Google avatar: ' . $e->getMessage());
            return null;
        }
    }
}
