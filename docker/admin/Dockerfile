# Laravel + Filament на FrankenPHP (один контейнер вместо связки nginx+fpm).
# Dev: исходники монтируются в /app бинд-маунтом (см. docker-compose.yml).
FROM dunglas/frankenphp:1-php8.4

RUN install-php-extensions \
    pdo_pgsql \
    intl \
    zip \
    opcache

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Непривилегированный пользователь; для порта 8080 root не нужен
RUN useradd --uid 1000 --create-home app \
    && mkdir -p /data/caddy /config/caddy \
    && chown -R app:app /data /config

ENV XDG_CONFIG_HOME=/config \
    XDG_DATA_HOME=/data

WORKDIR /app
USER app

EXPOSE 8080
CMD ["frankenphp", "php-server", "--root", "public/", "--listen", ":8080"]
