<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Scout\Searchable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, Searchable;

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
        return new Attribute(function ($value) {
            return $value ? env('APP_DISK_URL').'/'.$value : null;
        });
    }

    /**
     * Deletes the user's avatar from storage.
     */
    public function deleteAvatar(): bool
    {
        if (! $this->getRawOriginal('avatar')) {
            return true;
        }

        return Storage::disk(env('APP_DISK', 's3'))->delete($this->getRawOriginal('avatar'));
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
