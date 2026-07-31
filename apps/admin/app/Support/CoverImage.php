<?php

namespace App\Support;

/**
 * Обложки отдаются через image-прокси weserv — ровно так же, как на сайте
 * (apps/web/app/components/Card.vue). Прокси обходит защиту от хотлинка на
 * vinylpark.ru, поэтому предпросмотр в админке показывает именно то, что
 * увидит посетитель: если картинка не открылась здесь, не откроется и там.
 */
class CoverImage
{
    /** Ссылка на обложку через прокси или null, если url пустой/небезопасный. */
    public static function proxy(?string $url, int $width = 400): ?string
    {
        $url = trim((string) $url);

        if ($url === '' || ! self::isHttpUrl($url)) {
            return null;
        }

        $noScheme = preg_replace('#^https?://#i', '', $url);

        return 'https://images.weserv.nl/?url='.rawurlencode('ssl:'.$noScheme)
            ."&w={$width}&q=82&output=webp";
    }

    /**
     * Только http/https: строка попадает в атрибут src, а туда нельзя пускать
     * javascript:/data: — это была бы XSS.
     */
    public static function isHttpUrl(?string $url): bool
    {
        $scheme = strtolower((string) parse_url((string) $url, PHP_URL_SCHEME));

        return in_array($scheme, ['http', 'https'], true)
            && filled(parse_url((string) $url, PHP_URL_HOST));
    }
}
