export default defineEventHandler(async (event) => {
  const expected = process.env.VINYL_PIN
  const body = await readBody<{ pin?: string }>(event)

  if (!expected || body?.pin !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Неверный PIN' })
  }

  return { ok: true }
})
