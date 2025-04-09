<?php
namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'address',
        'password',
        'profile_picture',
        'google_id',
        'is_google_account',
        'avatar',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $_hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * Get the user's full name.
     *
     * @return string
     */
    public function getNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getProfilePictureUrlAttribute()
    {
        try {
            // Jika user memiliki profile_picture dan file ada di storage
            if ($this->profile_picture && \Illuminate\Support\Facades\Storage::disk('public')->exists($this->profile_picture)) {
                return asset('storage/' . $this->profile_picture);
            }

            // Jika user memiliki avatar dari Google
            if ($this->avatar) {
                return $this->avatar; // Gunakan avatar dari Google jika ada
            }

            // Default avatar dari ui-avatars dengan nama user
            return 'https://ui-avatars.com/api/?name=' . urlencode($this->first_name . ' ' . $this->last_name) . '&background=153832&color=fff';
        } catch (\Exception $e) {
            // Jika terjadi error, gunakan ui-avatars sebagai fallback
            \Illuminate\Support\Facades\Log::error('Error getting profile picture URL: ' . $e->getMessage());
            return 'https://ui-avatars.com/api/?name=' . urlencode($this->first_name . ' ' . $this->last_name) . '&background=153832&color=fff';
        }
    }

    /**
     * Get the fillable attributes for the model.
     *
     * @return array
     */
    public function getFillable()
    {
        return $this->fillable;
    }

    /**
     * Get the land listings for the user.
     */
    public function landListings()
    {
        return $this->hasMany(LandListing::class);
    }

    /**
     * Get the payments for the user.
     */
    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
