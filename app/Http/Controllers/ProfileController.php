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
        ]);

        // Jika ada password baru, update password
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }

        $user->update($request->except('password'));

        return redirect()->back()->with('success', 'Profil berhasil diperbarui!');
    }

    public function updateProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();

        // Hapus foto lama jika ada
        if ($user->profile_picture) {
            Storage::delete('public/' . $user->profile_picture);
        }

        // Simpan foto baru
        $path = $request->file('profile_picture')->store('profile_pictures', 'public');
        $user->update(['profile_picture' => $path]);

        return redirect()->back()->with('success', 'Foto profil berhasil diperbarui!');
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();
        
        // Hapus akun pengguna
        $user->delete();

        return redirect('/')->with('success', 'Akun berhasil dihapus.');
    }
}
