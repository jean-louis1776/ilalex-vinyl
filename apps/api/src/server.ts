import cors from '@fastify/cors'
import etag from '@fastify/etag'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import Fastify, { type FastifyError } from 'fastify'

import { config } from './config.js'
import { fetchCatalog, fetchVinyl, pool } from './db.js'
import { parseCatalogQuery } from './query.js'

const app = Fastify({
  logger: true,
  trustProxy: true,
})

await app.register(helmet)
// Публичный read-only API без кук и авторизации — "*" (по умолчанию) здесь
// безопасно; задайте CORS_ORIGINS списком через запятую, чтобы ограничить
await app.register(cors, {
  origin: config.corsOrigins.includes('*') || config.corsOrigins.length === 0 ? true : config.corsOrigins,
  methods: ['GET'],
})
await app.register(rateLimit, {
  max: 120,
  timeWindow: '1 minute',
})
// ETag + no-cache: браузер перепроверяет данные при каждой загрузке страницы
// и получает дешёвый 304, если ничего не изменилось — правки в админке
// видны сразу после обновления страницы
await app.register(etag)

// Публичный API: в ответах об ошибках нет ни стектрейсов, ни внутренностей
app.setErrorHandler((error: FastifyError, request, reply) => {
  request.log.error(error)
  const statusCode = error.statusCode && error.statusCode < 500 ? error.statusCode : 500
  reply.status(statusCode).send({
    error: statusCode >= 500 ? 'Internal Server Error' : error.message,
  })
})

app.get('/healthz', async () => {
  await pool.query('SELECT 1')
  return { status: 'ok' }
})

/**
 * Каталог страницами. Поиск, фильтры, сортировка и пагинация считаются в SQL,
 * поэтому браузер получает ровно одну страницу, а не всю коллекцию.
 * Параметры: page, perPage, q, tab, sort, decade, tags — см. query.ts.
 */
app.get('/api/vinyls', async (request, reply) => {
  const query = parseCatalogQuery(request.query as Record<string, unknown>)
  const page = await fetchCatalog(query)

  reply.header('cache-control', 'no-cache')
  return page
})

/** Карточка одной пластинки для страницы /vinyl/:id на сайте. */
app.get('/api/vinyls/:id', async (request, reply) => {
  const id = Number.parseInt((request.params as { id: string }).id, 10)

  if (!Number.isInteger(id) || id < 1) {
    return reply.status(400).send({ error: 'Некорректный id' })
  }

  const result = await fetchVinyl(id)
  if (!result) {
    return reply.status(404).send({ error: 'Пластинка не найдена' })
  }

  reply.header('cache-control', 'no-cache')
  return result
})

const shutdown = async () => {
  await app.close()
  await pool.end()
  process.exit(0)
}
process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

try {
  await app.listen({ port: config.port, host: config.host })
} catch (error) {
  app.log.error(error)
  process.exit(1)
}
