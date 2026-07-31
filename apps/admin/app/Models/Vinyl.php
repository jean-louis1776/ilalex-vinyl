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
        'condition',
        'sold_out',
        'checked_at',
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
            'sold_out' => 'boolean',
            'checked_at' => 'datetime',
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

        // Порядок считается сам: новая пластинка встаёт в конец списка.
        // В форме этого поля нет — на сортировку каталога оно не влияет,
        // им задаётся только порядок строк в таблице админки.
        static::creating(function (Vinyl $vinyl): void {
            if (blank($vinyl->sort_order)) {
                $vinyl->sort_order = (int) static::max('sort_order') + 1;
            }
        });
    }

    /**
     * Применяет к пластинке то, что вычитали со страницы магазина.
     * Одним методом пользуются и команда app:check-availability, и кнопка
     * «Проверить наличие» в админке — чтобы они не разъезжались в поведении.
     *
     * @param  array{sold_out: bool, price: ?int}  $state
     * @return array{became_sold_out: bool, old_price: ?int}  что именно изменилось
     */
    public function applyAvailability(array $state, bool $withPrice = true): array
    {
        $becameSoldOut = $state['sold_out'] && ! $this->sold_out;
        $oldPrice = null;

        $this->sold_out = $state['sold_out'];

        if ($withPrice && $state['price'] !== null && $state['price'] !== $this->price) {
            $oldPrice = $this->price;
            $this->price = $state['price'];
        }

        $this->checked_at = now();
        $this->save();

        return ['became_sold_out' => $becameSoldOut, 'old_price' => $oldPrice];
    }

    /** Год, по которому пластинка сортируется и фильтруется на сайте. */
    public function getYearAttribute(): ?int
    {
        return $this->original_year ?? $this->repress_year;
    }
}
