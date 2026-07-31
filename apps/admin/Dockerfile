# Production-образ: исходники запечены внутрь, работает от непривилегированного
# пользователя. (Локальный dev использует docker/admin/Dockerfile с бинд-маунтом.)

FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --no-scripts --no-autoloader --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --optimize --no-dev --no-scripts

FROM dunglas/frankenphp:1-php8.4

RUN install-php-extensions \
    pdo_pgsql \
    intl \
    zip \
    opcache

RUN useradd --uid 1000 --create-home app \
    && mkdir -p /data/caddy /config/caddy \
    && chown -R app:app /data /config \
    # Базовый образ выдаёт frankenphp cap_net_bind_service, чтобы слушать
    # :80/:443. Мы слушаем :8080, а песочницы вроде Render отказываются
    # запускать бинарник с file capabilities — снимаем.
    && setcap -r /usr/local/bin/frankenphp

ENV XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data

WORKDIR /app
COPY --chown=app:app . .
COPY --from=vendor --chown=app:app /app/vendor ./vendor

# Ассеты Filament (css/js/шрифты) публикуются здесь, а не коммитятся в git
RUN php artisan package:discover --ansi \
    && php artisan filament:assets \
    && chmod +x docker/entrypoint.sh \
    && chown -R app:app storage bootstrap/cache public

USER app

EXPOSE 8080
ENTRYPOINT ["docker/entrypoint.sh"]
