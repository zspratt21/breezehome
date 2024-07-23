<?php

namespace App\Models;

use App\Traits\HasFileAttribute;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, HasFileAttribute, Notifiable, Searchable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'two_factor_secret' => 'encrypted',
        'two_factor_recovery_codes' => 'encrypted',
    ];

    /**
     * Append the disk URL to the avatar url when accessed.
     */
    protected function avatar(): Attribute
    {
        return $this->fileAttribute();
    }

    /**
     * Deletes the user's avatar from storage.
     */
    public function deleteAvatar(): bool
    {
        return $this->deleteFile('avatar');
    }

    /**
     * Deletes the user and their associated avatar from storage.
     */
    public function delete(): bool
    {
        $this->deleteAvatar();

        return parent::delete();
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, string>
     */
    public function toSearchableArray(): array
    {
        $array = $this->toArray();

        return [
            'name' => $array['name'],
            'email' => $array['email'],
        ];
    }
}
