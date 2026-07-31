<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use RuntimeException;

abstract class TestCase extends BaseTestCase
{
    /**
     * Страховка от катастрофы: RefreshDatabase чистит ту базу, на которую
     * настроено приложение. Проверяем окружение до parent::setUp() — то есть
     * до того, как RefreshDatabase успеет что-либо стереть.
     *
     * @see tests/bootstrap.php — там же объясняется, почему $_SERVER важнее
     */
    protected function setUp(): void
    {
        $connection = $_SERVER['DB_CONNECTION'] ?? null;
        $database = $_SERVER['DB_DATABASE'] ?? null;

        if ($connection !== 'sqlite' || $database !== ':memory:') {
            throw new RuntimeException(
                'Тесты должны идти в sqlite :memory:, а окружение задаёт '
                .var_export($connection, true).'/'.var_export($database, true).'. '
                .'Проверьте tests/bootstrap.php — рабочая база в опасности.',
            );
        }

        parent::setUp();
    }
}
