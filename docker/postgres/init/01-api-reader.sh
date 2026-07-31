#!/bin/sh
# Создаёт read-only роль для публичного Node API.
# Выполняется один раз при первом старте контейнера postgres (пустой data dir).
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE ROLE api_reader LOGIN PASSWORD '${API_READER_PASSWORD}';
  GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO api_reader;
  GRANT USAGE ON SCHEMA public TO api_reader;
  -- уже существующие таблицы
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO api_reader;
  -- таблицы, которые создадут миграции позже (от имени ${POSTGRES_USER})
  ALTER DEFAULT PRIVILEGES FOR ROLE ${POSTGRES_USER} IN SCHEMA public
    GRANT SELECT ON TABLES TO api_reader;
EOSQL
