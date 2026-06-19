import { getKv, PURCHASED_KEY } from '../utils/kv'

export default defineEventHandler(async () => {
  const kv = getKv()
  if (!kv) {
    // Хранилище не настроено — фронтенд использует localStorage
    return { ids: [] as number[], configured: false }
  }

  const ids = (await kv.get<number[]>(PURCHASED_KEY)) || []
  return { ids, configured: true }
})
