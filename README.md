# ILALEX Vinyl — монорепа

Коллекция виниловых пластинок: публичный сайт, админка и read-only API.

```
ilalex-vinyl/
├─ apps/
│  ├─ web/      Nuxt 4 — публичный сайт
│  ├─ api/      Fastify + TypeScript — публичный read-only JSON API
│  └─ admin/    Laravel 13 + Filament 4 — админка каталога
├─ docker/      Dockerfile'ы и init-скрипты
└─ docker-compose.yml
```

**Как ходят данные:** источник правды — админка. Она хранит пластинки в
PostgreSQL, там же живёт переключатель «куплено». Node-овый API читает ту же
базу под ролью с правами только на `SELECT` и отдаёт сайту готовые страницы
каталога. Поиск, фильтры, сортировка и пагинация считаются в SQL — браузер
получает одну страницу, а не всю коллекцию. Пока каталог не пришёл, сайт
показывает полноэкранный лоадер с крутящейся пластинкой и до минуты
дожидается, если бэкенд на бесплатном тарифе засыпал.

## Быстрый старт (локально)

Нужны: Docker Desktop, Node 20+, Yarn 1.

```bash
cp .env.example .env && cp apps/admin/.env.example apps/admin/.env && cp apps/api/.env.example apps/api/.env && cp apps/web/.env.example apps/web/.env
```

Подставьте случайные пароли (`openssl rand -hex 16`): `POSTGRES_PASSWORD` из
корневого `.env` продублируйте в `apps/admin/.env` (`DB_PASSWORD`), а
`API_READER_PASSWORD` — в `apps/api/.env` внутри `DATABASE_URL`.

```bash
docker compose up -d --build
```

Разовая настройка админки:

```bash
docker compose exec admin php artisan key:generate
```

```bash
docker compose up -d --force-recreate admin
```

```bash
docker compose exec admin php artisan migrate --seed
```

```bash
docker compose exec admin php artisan app:import-descriptions
```

Свой аккаунт (учёток по умолчанию не существует):

```bash
docker compose exec admin php artisan app:make-admin
```

Сайт:

```bash
yarn install && yarn dev:web
```

| Сервис | Адрес |
|---|---|
| Сайт (dev) | http://localhost:3000 |
| Админка | http://localhost:8090 |
| API | http://localhost:3001/api/vinyls |

Порты меняются в `.env` (`ADMIN_PORT`, `API_PORT`), если заняты другим
проектом. Сайт можно поднять на своём порту: `yarn dev:web --port 3010`.

### Если админка отдаёт 500 при первом запуске

Почти всегда это пустой `APP_KEY`. Переменные из `env_file` подставляются в
момент создания контейнера, поэтому после `key:generate` контейнер нужно
пересоздать (`docker compose up -d --force-recreate admin`), а не просто
перезапустить.

## Админка

Панель Filament по адресу из `APP_URL`. Основное:

- **Пластинки** — CRUD каталога. Ссылка на обложку показывает живой
  предпросмотр через тот же прокси, что и сайт: не видно здесь — не будет
  видно и посетителю.
- **Переключатель «Куплено»** — прямо в списке, без захода в карточку. Дата
  покупки проставляется автоматически.
- **Описание, лейбл, страна, жанр** — попадают на страницу пластинки. Если
  описание пустое, сайт соберёт короткую сводку сам.
- **«Показывать на сайте»** — черновик: строка остаётся в базе, но в API
  не уходит.

Описания для всех 170 пластинок лежат в
`apps/admin/database/seeders/data/descriptions-*.json` и заливаются командой
`php artisan app:import-descriptions`. Она не трогает описания,
отредактированные руками, — для перезаписи есть флаг `--overwrite`.

## API

| Метод | Назначение |
|---|---|
| `GET /healthz` | проверка живости |
| `GET /api/vinyls` | страница каталога |
| `GET /api/vinyls/:id` | одна пластинка + 4 рекомендации |

Параметры каталога: `page`, `perPage`, `q`, `tab` (`all` / `purchased` /
`not-purchased`), `sort`, `decade`, `tags`. Всё, что приходит из браузера,
приводится к замкнутому набору значений, а в SQL уходят только плейсхолдеры.

Ответ содержит `items` и `meta` со счётчиками табов, статистикой коллекции и
списком доступных десятилетий.

## Тесты

```bash
docker compose exec admin php artisan test
```

Тесты идут в sqlite `:memory:`. Изоляция задана в
`apps/admin/tests/bootstrap.php`: секция `<env>` в `phpunit.xml` не перекрывает
`$_SERVER`, откуда Laravel читает окружение в первую очередь, — без этой
зачистки `RefreshDatabase` вычистил бы рабочую базу. В `TestCase` стоит
дополнительная проверка, падающая до того, как что-либо будет стёрто.

## Безопасность

- **Секреты** в git не попадают: у каждого приложения есть `.env.example`,
  реальные `.env` в `.gitignore`.
- **Админка:** двухфакторная аутентификация (TOTP с кодами восстановления),
  argon2id, ограничение попыток входа, шифрование сессий, security-заголовки,
  `APP_DEBUG=false` вне локальной среды, принудительный HTTPS в проде.
  Аккаунты заводятся только через `php artisan app:make-admin`.
- **API:** подключается ролью `api_reader` (только `SELECT`, создаётся
  скриптом `docker/postgres/init/01-api-reader.sh`) — физически не может
  ничего записать. Плюс helmet, ограничение 120 запросов в минуту и ответы об
  ошибках без стектрейсов.
- **Сеть:** PostgreSQL живёт во внутренней docker-сети и наружу не
  публикуется; все проброшенные порты слушают только `127.0.0.1`.

## Деплой: Neon + Render

База — на Neon (бесплатный Postgres самого Render протухает через 30 дней),
админка и API — бесплатными docker-сервисами на Render, сайт — статикой на
Vercel.

**1. База на Neon**

1. Создайте проект на neon.tech, регион Frankfurt (тот же, что в `render.yaml`).
2. Скопируйте host, имя базы, пользователя и пароль из строки подключения.
3. В SQL-редакторе Neon создайте read-only роль для API:

```sql
CREATE ROLE api_reader LOGIN PASSWORD '<надёжный-пароль>';
GRANT CONNECT ON DATABASE <база> TO api_reader;
GRANT USAGE ON SCHEMA public TO api_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO api_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO api_reader;
```

**2. Сервисы на Render**

1. Render Dashboard → New → Blueprint, указать этот репозиторий: `render.yaml`
   поднимет `ilalex-vinyl-admin` и `ilalex-vinyl-api`.
2. Заполните переменные, помеченные `sync: false`:
   - `APP_KEY` — из `docker compose exec admin php artisan key:generate --show`;
   - `DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` — данные Neon;
   - `DATABASE_URL` у API —
     `postgres://api_reader:<пароль>@<host>/<база>?sslmode=require`;
   - `APP_URL` — адрес админки, вписать после первого деплоя.
3. Первого админа заведите, временно добавив переменные `ADMIN_EMAIL` и
   `ADMIN_PASSWORD`: энтрипоинт создаст пользователя при старте и никогда не
   перезапишет существующего. После первого входа переменные удалите.
4. Миграции накатываются энтрипоинтом сами. Каталог залейте один раз из Render
   Shell: `php artisan db:seed --force`, затем `php artisan app:import-descriptions`.

**3. Сайт**

Деплоится на Vercel из папки `apps/web`. Задайте `NUXT_PUBLIC_API_BASE` —
адрес сервиса API на Render.

На бесплатном тарифе Render сервисы засыпают после простоя, поэтому первая
загрузка сайта может занять до минуты — всё это время показывается лоадер.
