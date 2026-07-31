<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vinyl extends Model
{
    protected $fillable = [
        'artist',
        'name',
        'price',
        'link',
        'image',
        'description',
        'label',
        'country',
        'genre',
        'original_year',
        'repress_year',
        'important',
        'sealed',
        'purchased',
        'purchased_at',
        'is_published',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'integer',
            'original_year' => 'integer',
            'repress_year' => 'integer',
            'important' => 'boolean',
            'sealed' => 'boolean',
            'purchased' => 'boolean',
            'purchased_at' => 'datetime',
            'is_published' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        // Дата покупки проставляется сама по переключателю «куплено»,
        // чтобы её не приходилось помнить руками
        static::saving(function (Vinyl $vinyl): void {
            if ($vinyl->isDirty('purchased')) {
                $vinyl->purchased_at = $vinyl->purchased ? now() : null;
            }
        });
    }

    /** Год, по которому пластинка сортируется и фильтруется на сайте. */
    public function getYearAttribute(): ?int
    {
        return $this->original_year ?? $this->repress_year;
    }
}
