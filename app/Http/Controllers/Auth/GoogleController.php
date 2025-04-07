<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirect()
    {
        Log::info('Google redirect method called');
        try {
            $redirectUrl = Socialite::driver('google')
                ->stateless()
                ->with([
                    'prompt'      => 'select_account',
                    'access_type' => 'offline',
                ])
                ->redirect();

            Log::info('Google redirect URL generated successfully');
            return $redirectUrl;
        } catch (\Exception $e) {
            Log::error('Error in Google redirect: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            throw $e;
        }
    }

    public function callback()
    {
        try {
            Log::info('Google callback started');
            Log::info('Request data', ['request' => request()->all()]);
            Log::info('Session data', ['session' => session()->all()]);
            Log::info('Auth check', ['is_logged_in' => Auth::check(), 'user_id' => Auth::id()]);

            try {
                // Disable SSL verification for development
                $originalHandler = \GuzzleHttp\HandlerStack::create();
                $handler         = \GuzzleHttp\HandlerStack::create();
                $handler->push(function (callable $handler) {
                    return function (\GuzzleHttp\Psr7\Request $request, array $options) use ($handler) {
                        $options['verify'] = false;
                        return $handler($request, $options);
                    };
                });

                $googleUser = Socialite::driver('google')
                    ->setHttpClient(new \GuzzleHttp\Client(['handler' => $handler]))
                    ->stateless()
                    ->user();

                Log::info('Google user object', ['user' => json_encode($googleUser)]);
            } catch (\Exception $e) {
                Log::error('Error getting Google user: ' . $e->getMessage());
                Log::error($e->getTraceAsString());
                throw $e;
            }

            Log::info('Checking if user exists with google_id: ' . $googleUser->id);
            $user = User::where('google_id', $googleUser->id)->first();

            Log::info('User not found by google_id, checking by email: ' . $googleUser->email);
            if (!$user) {
                Log::info('User not found by google_id, checking by email: ' . $googleUser->email);
                $user = User::where('email', $googleUser->email)->first();

                if ($user) {
                    Log::info('User found by email, updating with Google info', ['user_id' => $user->id]);
                    try {
                        $user->update([
                            'google_id'         => $googleUser->id,
                            'is_google_account' => true,
                            'avatar'            => $googleUser->avatar,
                        ]);
                        Log::info('User updated successfully');
                    } catch (\Exception $e) {
                        Log::error('Error updating user: ' . $e->getMessage());
                        Log::error($e->getTraceAsString());
                    }
                } else {
                    Log::info('User not found, creating new user');
                    $nameParts = explode(' ', $googleUser->name, 2);
                    $firstName = $nameParts[0];
                    $lastName  = isset($nameParts[1]) ? $nameParts[1] : '';

                    try {
                        // Dump data yang akan digunakan untuk membuat user
                        $userData = [
                            'first_name'        => $firstName,
                            'last_name'         => $lastName,
                            'email'             => $googleUser->email,
                            'google_id'         => $googleUser->id,
                            'is_google_account' => true,
                            'avatar'            => $googleUser->avatar,
                            'password'          => Hash::make(Str::random(16)), // Password acak
                            'email_verified_at' => now(),                       // Email sudah diverifikasi oleh Google
                        ];
                        Log::info('Creating new user with data', ['user_data' => $userData]);

                        $fillable = (new User())->getFillable();
                        Log::info('User fillable columns', ['fillable' => $fillable]);

                        $user = User::create($userData);
                        Log::info('New user created successfully', ['user_id' => $user->id]);

                        event(new Registered($user));
                    } catch (\Exception $e) {
                        Log::error('Error creating user: ' . $e->getMessage());
                        Log::error($e->getTraceAsString());
                        throw $e;
                    }
                }
            } else {
                Log::info('User found by google_id', ['user_id' => $user->id]);
            }

            Log::info('All users in database before login:', [
                'count' => User::count(),
                'users' => User::all(['id', 'email', 'google_id', 'is_google_account'])->toArray(),
            ]);

            Log::info('Logging in user', ['id' => $user->id, 'email' => $user->email]);
            try {
                if (!$user || !$user->exists) {
                    Log::error('Invalid user object', ['user' => $user]);
                    return redirect()->route('login')
                        ->with('error', 'Invalid user object. Please try again.');
                }

                Auth::login($user, true);
                Log::info('User logged in successfully');

                if (Auth::check()) {
                    Log::info('User is authenticated, auth id: ' . Auth::id());

                    session()->flash('success', 'Login dengan Google berhasil!');

                    Log::info('Session data after login', ['session' => session()->all()]);

                    Log::info('Redirecting to home page');
                    return redirect('/')
                        ->with('auth_debug', [
                            'user_id'      => Auth::id(),
                            'is_logged_in' => Auth::check(),
                            'timestamp'    => now()->toDateTimeString(),
                        ]);
                } else {
                    Log::error('User authentication failed after login');
                    return redirect()->route('login')
                        ->with('error', 'Authentication failed. Please try again.');
                }
            } catch (\Exception $e) {
                Log::error('Error during login: ' . $e->getMessage());
                Log::error($e->getTraceAsString());
                return redirect()->route('login')
                    ->with('error', 'Login failed. Please try again.');
            }
        } catch (\Exception $e) {
            Log::error('Google login error: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return redirect()->route('login')
                ->with('error', 'Login dengan Google gagal. Silakan coba lagi.');
        }
    }
}
