<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;

/**
 * Читает характеристики издания со страницы магазина, на которую ссылается
 * пластинка. Источник выбран не случайно: там описано ровно то издание,
 * которое лежит в коллекции, — а не абстрактный релиз из музыкальной базы.
 *
 * Разбираемый кусок страницы выглядит так:
 *   Жанр и год выхода альбома Поп, 1984
 *   Информация об издании Оригинал, 1984, Англия, лейбл Capitol
 *   Состояние винила и конверта ? EX+, есть следы использования / EX
 */
class StoreDetails
{
    /** Оценки по шкале Goldmine, от лучшей к худшей. */
    private const GRADES = 'SS|M-|M|NM|EX\+\+|EX\+|EX|VG\+\+|VG\+|VG|G\+|G|P';

    /**
     * Наличие и цена — то, что меняется со временем и требует пересверки.
     *
     * @return array{sold_out: bool, price: ?int}|null
     *         null — страницу не удалось получить или разобрать
     */
    public function fetchAvailability(?string $url): ?array
    {
        $html = $this->download($url);

        return $html === null ? null : $this->parseAvailability($html);
    }

    /** @return array{sold_out: bool, price: ?int}|null */
    public function parseAvailability(string $html): ?array
    {
        $text = $this->plainText($html);

        // Признаки взаимоисключающие: либо лот можно положить в корзину,
        // либо на его месте написано, что пластинку выкупили
        $soldOut = str_contains($text, 'Пластинку выкупили');
        $onSale = str_contains($text, 'В корзину') || str_contains($text, 'В наличии');

        if (! $soldOut && ! $onSale) {
            return null;
        }

        return [
            'sold_out' => $soldOut,
            'price' => $soldOut
                // «Пластинку выкупили. Последняя цена — 689 ₽»
                ? $this->price($text, '/Последняя цена\s*[—–-]\s*([\d\s]+)\s*₽/u')
                // «В корзину, 2431 ₽» — цена уже со скидкой, её же видит покупатель
                : $this->price($text, '/В корзину,?\s*([\d\s]+)\s*₽/u'),
        ];
    }

    private function price(string $text, string $pattern): ?int
    {
        if (! preg_match($pattern, $text, $m)) {
            return null;
        }

        $digits = preg_replace('/\D/', '', $m[1]) ?? '';

        return $digits === '' ? null : (int) $digits;
    }

    /**
     * @return array{genre: ?string, country: ?string, label: ?string, condition: ?string}|null
     *         null — страницу не удалось получить или разобрать
     */
    public function fetch(?string $url): ?array
    {
        $html = $this->download($url);

        return $html === null ? null : $this->parse($html);
    }

    /** Скачивает страницу магазина; null — ссылка негодная или сайт не ответил. */
    private function download(?string $url): ?string
    {
        // В сеть ходим только по http(s): javascript:/file: сюда попасть не должны
        if (! $url || ! preg_match('#^https?://#i', $url)) {
            return null;
        }

        try {
            $response = Http::withHeaders(['User-Agent' => 'Mozilla/5.0 (ilalex-vinyl catalog)'])
                ->timeout(20)
                ->retry(2, 2000)
                ->get($url);
        } catch (\Throwable) {
            return null;
        }

        return $response->successful() ? $response->body() : null;
    }

    /** @return array{genre: ?string, country: ?string, label: ?string, condition: ?string}|null */
    public function parse(string $html): ?array
    {
        $text = $this->plainText($html);

        $genre = $this->between($text, 'Жанр и год выхода альбома', 'Информация об издании');
        $edition = $this->between($text, 'Информация об издании', 'Состояние винила');
        $condition = $this->between($text, 'Состояние винила и конверта ?', 'Описание');

        // Ни одного знакомого блока — страница либо изменилась, либо это 404
        if ($genre === null && $edition === null) {
            return null;
        }

        return [
            // «Поп, 1984» → «Поп»: год уже хранится отдельным полем
            'genre' => $this->cleanGenre($genre),
            'country' => $this->editionPart($edition, 'country'),
            'label' => $this->editionPart($edition, 'label'),
            'condition' => $this->cleanCondition($condition),
        ];
    }

    private function plainText(string $html): string
    {
        $html = preg_replace('#<(script|style)[^>]*>.*?</\1>#is', ' ', $html) ?? $html;
        $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        // На страницах попадаются невидимые метки направления письма и
        // неразрывные пробелы — иначе они оседают в названии лейбла
        $text = preg_replace('/[\x{200B}-\x{200F}\x{202A}-\x{202E}\x{FEFF}\x{00AD}]/u', '', $text) ?? $text;
        $text = str_replace("\u{00A0}", ' ', $text);

        return trim(preg_replace('/\s+/u', ' ', $text) ?? $text);
    }

    private function between(string $text, string $start, string $end): ?string
    {
        $from = mb_strpos($text, $start);
        if ($from === false) {
            return null;
        }

        $from += mb_strlen($start);
        $to = mb_strpos($text, $end, $from);
        $slice = $to === false ? mb_substr($text, $from, 200) : mb_substr($text, $from, $to - $from);

        $slice = trim($slice, " \t\n\r\0\x0B,");

        return $slice === '' ? null : $slice;
    }

    private function cleanGenre(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        // Отрезаем год: «Поп, 1984» → «Поп», «Рок, поп, 1975» → «Рок, поп»
        $value = preg_replace('/,?\s*\d{4}\s*$/u', '', $value) ?? $value;
        $value = trim($value, ' ,');

        return $value === '' ? null : mb_substr($value, 0, 255);
    }

    /**
     * Разбирает «Оригинал, 1984, Англия, лейбл Capitol».
     * Порядок частей на страницах плавает, поэтому опираемся не на позицию,
     * а на сам вид куска: год — четыре цифры, лейбл — с приставкой «лейбл».
     */
    private function editionPart(?string $edition, string $want): ?string
    {
        if ($edition === null) {
            return null;
        }

        $parts = array_filter(array_map('trim', explode(',', $edition)), fn ($p) => $p !== '');
        $country = null;
        $label = null;

        foreach ($parts as $part) {
            if (preg_match('/^лейбл\s+(.+)$/ui', $part, $m)) {
                $label = trim($m[1]);
                continue;
            }
            if (preg_match('/^\d{4}$/', $part)) {
                continue;
            }
            if (preg_match('/^(оригинал|переиздание|переиздан|reissue)/ui', $part)) {
                continue;
            }
            // Что осталось и не похоже на служебное — это страна
            $country ??= $part;
        }

        $value = $want === 'label' ? $label : $country;

        return $value === null ? null : mb_substr($value, 0, 255);
    }

    /**
     * «EX+, есть следы использования / EX» → «EX+ / EX»: сначала винил,
     * затем конверт.
     *
     * Блока «Описание» на части карточек нет, и обрезать по нему нельзя —
     * вытянулся бы хвост страницы с ценой и меню. Поэтому забираем не «всё
     * до разделителя», а именно две оценки по шкале Goldmine.
     */
    private function cleanCondition(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $grade = self::GRADES;
        // \b здесь не годится: после плюса он не срабатывает, и «EX+»
        // молча усекается до «EX». Проверяем, что дальше не идёт часть оценки.
        $tail = '(?![A-Za-z+])';

        if (preg_match("/^\s*({$grade}){$tail}[^\/]*\/\s*({$grade}){$tail}/u", $value, $m)) {
            return "{$m[1]} / {$m[2]}";
        }

        // Одна оценка на всё издание — тоже допустимый вид записи
        if (preg_match("/^\s*({$grade}){$tail}/u", $value, $m)) {
            return $m[1];
        }

        return null;
    }
}
