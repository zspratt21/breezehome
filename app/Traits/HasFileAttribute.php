<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

trait HasFileAttribute
{
    /**
     * Get the URL for a file attribute.
     */
    public function fileAttribute(): Attribute
    {
        return new Attribute(function ($value) {
            return $value ? Storage::url($value) : null;
        });
    }

    /**
     * Delete the file from storage.
     */
    public function deleteFile(string $attribute): bool
    {
        if ($this->getRawOriginal($attribute)) {
            return Storage::disk()->delete($this->getRawOriginal($attribute));
        }

        return true;
    }
}
