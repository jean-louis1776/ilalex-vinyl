import { Redis } from '@upstash/redis'

// Ключ, под которым храним массив id купленных пластинок
export const PURCHASED_KEY = 'vinyl:purchased'

let client: Redis | null = null

/**
 * Возвращает клиент Upstash Redis или null, если переменные окружения не заданы
 * (тогда фронтенд откатывается на localStorage).
 * Поддерживаем оба варианта именования: Vercel KV и нативный Upstash.
 */
export function getKv(): Redis | null {
  if (client) return client

  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null

  client = new Redis({ url, token })
  return client
}
