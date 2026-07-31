function required(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Не задана обязательная переменная окружения ${name}`)
  }
  return value
}

export const config = {
  databaseUrl: required('DATABASE_URL'),
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? '0.0.0.0',
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
}
