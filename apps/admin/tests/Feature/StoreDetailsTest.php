<?php

namespace Tests\Feature;

use App\Support\StoreDetails;
use Tests\TestCase;

class StoreDetailsTest extends TestCase
{
    private function page(string $genre, string $edition, string $condition, bool $withDescription = true): string
    {
        return '<html><body><div>Жанр и год выхода альбома</div><span>'.$genre.'</span>'
            .'<div>Информация об издании</div><span>'.$edition.'</span>'
            .'<div>Состояние винила и конверта ?</div><span>'.$condition.'</span>'
            .($withDescription ? '<div>Описание</div><p>Текст</p>' : '<div>2431 ₽ В корзину ← Каталог</div>')
            .'</body></html>';
    }

    public function test_parses_a_typical_card(): void
    {
        $details = (new StoreDetails)->parse($this->page(
            'Поп, 1984',
            'Оригинал, 1984, Англия, лейбл Capitol',
            'EX+, есть следы использования / EX',
        ));

        $this->assertSame('Поп', $details['genre']);
        $this->assertSame('Англия', $details['country']);
        $this->assertSame('Capitol', $details['label']);
        $this->assertSame('EX+ / EX', $details['condition']);
    }

    /** Плюс в оценке не должен теряться — «EX+» это не «EX». */
    public function test_keeps_plus_in_the_grade(): void
    {
        $details = (new StoreDetails)->parse($this->page('Рок, 1986', 'Оригинал, 1986, Канада, лейбл Chrysalis', 'EX+ / NM'));

        $this->assertSame('EX+ / NM', $details['condition']);
    }

    /**
     * Блока «Описание» на части карточек нет: без якоря в состояние затекал
     * хвост страницы с ценой и меню.
     */
    public function test_does_not_swallow_the_page_tail_without_a_description_block(): void
    {
        $details = (new StoreDetails)->parse($this->page(
            'Диско, 1988',
            'Оригинал, 1988, США, лейбл Solar',
            'NM, проигрывался редко / EX',
            withDescription: false,
        ));

        $this->assertSame('NM / EX', $details['condition']);
    }

    public function test_strips_invisible_characters_from_the_label(): void
    {
        $details = (new StoreDetails)->parse($this->page(
            'Рок, 1986',
            "Оригинал, 1986, Канада, лейбл Chrysalis\u{200E}",
            'EX / EX',
        ));

        $this->assertSame('Chrysalis', $details['label']);
    }

    /** Жанр из нескольких слов не должен обрезаться по первой запятой. */
    public function test_keeps_multi_word_genre_without_the_year(): void
    {
        $details = (new StoreDetails)->parse($this->page('Рок, поп, 1975', 'Переиздание, 2015, Европа, лейбл Legacy', 'SS / SS'));

        $this->assertSame('Рок, поп', $details['genre']);
        $this->assertSame('Европа', $details['country']);
    }

    public function test_returns_null_for_an_unrelated_page(): void
    {
        $this->assertNull((new StoreDetails)->parse('<html><body>Страница не найдена</body></html>'));
    }

    public function test_rejects_non_http_links(): void
    {
        $store = new StoreDetails;

        $this->assertNull($store->fetch(null));
        $this->assertNull($store->fetch(''));
        $this->assertNull($store->fetch('javascript:alert(1)'));
    }
}
