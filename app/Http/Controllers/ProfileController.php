<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        return Inertia::render('Profile/Profile', [
            'auth' => ['user' => Auth::user()]
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'address' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:6|confirmed',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            // Jika ada password baru, update password
            if ($request->filled('password')) {
                $user->password = bcrypt($request->password);
            }

            // Jika ada file foto profil baru
            if ($request->hasFile('profile_picture')) {
                // Log untuk debugging
                \Illuminate\Support\Facades\Log::info('Processing profile picture upload', [
                    'original_name' => $request->file('profile_picture')->getClientOriginalName(),
                    'mime_type' => $request->file('profile_picture')->getMimeType(),
                    'size' => $request->file('profile_picture')->getSize(),
                ]);

                // Hapus foto lama jika ada
                if ($user->profile_picture) {
                    \Illuminate\Support\Facades\Storage::delete('public/' . $user->profile_picture);
                }

                try {
                    // Simpan foto baru dengan nama file yang lebih pendek
                    $extension = $request->file('profile_picture')->getClientOriginalExtension();
                    $filename = 'user_' . $user->id . '_' . time() . '.' . $extension;
                    $path = $request->file('profile_picture')->storeAs('profile_pictures', $filename, 'public');

                    // Verifikasi file berhasil disimpan
                    if (\Illuminate\Support\Facades\Storage::disk('public')->exists($path)) {
                        $user->profile_picture = $path;
                        \Illuminate\Support\Facades\Log::info('Profile picture saved successfully', ['path' => $path]);
                    } else {
                        \Illuminate\Support\Facades\Log::error('Failed to save profile picture', ['path' => $path]);
                    }
                } catch (\Exception $e) {
                    \Illuminate\Support\Facades\Log::error('Error saving profile picture: ' . $e->getMessage());
                }
            }

            // Update data lainnya
            $user->first_name = $request->first_name;
            $user->last_name = $request->last_name;
            $user->email = $request->email;
            $user->address = $request->address;
            $user->save();

            return redirect()->back()->with('success', 'Profil berhasil diperbarui!');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error updating profile: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui profil. Silakan coba lagi.');
        }
    }

    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        try {
            // Hapus foto lama jika ada
            if ($user->profile_picture) {
                Storage::delete('public/' . $user->profile_picture);
            }

            // Simpan foto baru
            $path = $request->file('profile_picture')->store('profile_pictures', 'public');
            $user->update(['profile_picture' => $path]);

            return redirect()->back()->with('success', 'Foto profil berhasil diperbarui!');
        } catch (\Exception $e) {
            // Log error
            \Illuminate\Support\Facades\Log::error('Error updating profile picture: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal mengupload foto profil. Silakan coba lagi.');
        }
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();

        // Hapus akun pengguna
        $user->delete();

        return redirect('/')->with('success', 'Akun berhasil dihapus.');
    }
}
