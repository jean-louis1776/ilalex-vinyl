import { getKv, PURCHASED_KEY } from '../utils/kv'

export default defineEventHandler(async (event) => {
  const kv = getKv()
  if (!kv) {
    throw createError({ statusCode: 503, statusMessage: 'Хранилище не настроено' })
  }

  const expected = process.env.VINYL_PIN
  const pin = getHeader(event, 'x-vinyl-pin')
  if (!expected || pin !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный PIN' })
  }

  const body = await readBody<{ ids?: unknown }>(event)
  const ids = Array.isArray(body?.ids)
    ? body.ids.filter((n): n is number => Number.isInteger(n))
    : []

  await kv.set(PURCHASED_KEY, ids)
  return { ids }
})
