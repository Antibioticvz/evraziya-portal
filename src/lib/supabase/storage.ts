import { createClient } from '@/lib/supabase/client'

const BUCKET_NAME = 'brand-images'

/**
 * Загружает изображение бренда в Supabase Storage.
 * Возвращает публичный URL загруженного файла.
 */
export async function uploadBrandImage(
  file: File,
  brandSlug: string,
  type: 'logo' | 'hero' | 'gallery',
): Promise<string> {
  const supabase = createClient()

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const filePath = `${brandSlug}/${type}/${timestamp}.${ext}`

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })

  if (error) {
    throw new Error(`Ошибка загрузки файла: ${error.message}`)
  }

  return getBrandImageUrl(filePath)
}

/**
 * Удаляет изображение бренда из Supabase Storage.
 */
export async function deleteBrandImage(path: string): Promise<void> {
  const supabase = createClient()

  // Извлекаем путь файла из полного URL, если передан URL
  const storagePath = extractStoragePath(path)

  const { error } = await supabase.storage.from(BUCKET_NAME).remove([storagePath])

  if (error) {
    throw new Error(`Ошибка удаления файла: ${error.message}`)
  }
}

/**
 * Возвращает публичный URL для файла в хранилище.
 */
export function getBrandImageUrl(path: string): string {
  const supabase = createClient()

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)

  return publicUrl
}

/**
 * Извлекает путь файла в Storage из полного публичного URL.
 * Если передан уже относительный путь — возвращает как есть.
 */
function extractStoragePath(urlOrPath: string): string {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`
  const index = urlOrPath.indexOf(marker)

  if (index !== -1) {
    return urlOrPath.slice(index + marker.length)
  }

  return urlOrPath
}
