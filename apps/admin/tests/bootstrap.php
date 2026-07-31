<?php

/*
|--------------------------------------------------------------------------
| Изоляция тестовой базы
|--------------------------------------------------------------------------
|
| В контейнере DB_* приходят из env_file, то есть попадают в $_SERVER.
| Значения из секции <php><env> в phpunit.xml ложатся в getenv() и $_ENV,
| но $_SERVER не трогают — а Laravel читает окружение в первую очередь
| именно из $_SERVER. Без этой зачистки тесты шли бы в рабочую базу,
| и RefreshDatabase стирал бы каталог пластинок.
|
| Поэтому подключение к sqlite :memory: прибивается здесь, до того как
| приложение вообще создано.
|
*/

foreach (['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_URL', 'DB_SSLMODE'] as $key) {
    unset($_SERVER[$key], $_ENV[$key]);
    putenv($key);
}

foreach (['DB_CONNECTION' => 'sqlite', 'DB_DATABASE' => ':memory:', 'APP_ENV' => 'testing'] as $key => $value) {
    $_SERVER[$key] = $value;
    $_ENV[$key] = $value;
    putenv("{$key}={$value}");
}

require __DIR__.'/../vendor/autoload.php';
