/**
 * Обложки грузим через image-прокси weserv: он обходит защиту от хотлинка
 * на vinylpark.ru, отдаёт через CDN и ужимает в WebP (меньше трафика).
 */
export function coverUrl(raw: string | null | undefined, width = 600): string {
  if (!raw) return ''
  const noScheme = raw.replace(/^https?:\/\//, '')
  return `https://images.weserv.nl/?url=${encodeURIComponent('ssl:' + noScheme)}&w=${width}&q=82&output=webp`
}
