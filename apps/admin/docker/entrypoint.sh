#!/bin/sh
# Прод-энтрипоинт: кешируем конфиг, накатываем миграции, при необходимости
# заводим первого админа из env и запускаем сервер. PORT приходит от платформы
# (Render/Koyeb его задают); по умолчанию 8080.
set -e

php artisan config:cache
php artisan view:cache
php artisan migrate --force

# Разовый бутстрап: создаёт первого админа, если заданы ADMIN_EMAIL/ADMIN_PASSWORD
# и такого пользователя ещё нет (существующего никогда не перезаписывает).
# После первого входа эти переменные лучше убрать.
if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
    php artisan app:make-admin --from-env || true
fi

exec frankenphp php-server --root public/ --listen ":${PORT:-8080}"
