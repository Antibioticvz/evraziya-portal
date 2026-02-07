'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ImageUpload } from '@/components/shared/image-upload'
import { deleteBrandImage } from '@/lib/supabase/storage'
import Image from 'next/image'

interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  hero_image_url: string | null
  preview_images: string[] | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string | null
}

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null)
  const [saving, setSaving] = useState(false)

  // Состояние для изображений (управляется вне формы)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null)
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const fetchBrands = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/brands')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка загрузки брендов')
      }

      setBrands(data.brands || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBrands()
  }, [fetchBrands])

  const handleSave = async (formData: FormData) => {
    setSaving(true)
    setError(null)

    const payload = {
      name: formData.get('name') as string,
      slug: formData.get('slug') as string,
      description: (formData.get('description') as string) || null,
      logo_url: logoUrl,
      hero_image_url: heroImageUrl,
      preview_images: previewImages.length > 0 ? previewImages : null,
      sort_order: parseInt((formData.get('sort_order') as string) || '0', 10),
      is_active: formData.get('is_active') === 'true',
    }

    try {
      const url = editingBrand ? `/api/admin/brands/${editingBrand.id}` : '/api/admin/brands'
      const method = editingBrand ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сохранения бренда')
      }

      if (editingBrand) {
        setBrands(brands.map((b) => (b.id === editingBrand.id ? data.brand : b)))
      } else {
        setBrands([...brands, data.brand])
      }

      closeModal()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingBrand) return

    setSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/brands/${deletingBrand.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Ошибка удаления бренда')
      }

      setBrands(brands.map((b) => (b.id === deletingBrand.id ? { ...b, is_active: false } : b)))
      setShowDeleteModal(false)
      setDeletingBrand(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setSaving(false)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBrand(null)
    setLogoUrl(null)
    setHeroImageUrl(null)
    setPreviewImages([])
  }

  const openCreateModal = () => {
    setEditingBrand(null)
    setLogoUrl(null)
    setHeroImageUrl(null)
    setPreviewImages([])
    setShowModal(true)
  }

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand)
    setLogoUrl(brand.logo_url)
    setHeroImageUrl(brand.hero_image_url)
    setPreviewImages(brand.preview_images || [])
    setShowModal(true)
  }

  const openDeleteModal = (brand: Brand) => {
    setDeletingBrand(brand)
    setShowDeleteModal(true)
  }

  const handleRemoveGalleryImage = async (index: number) => {
    const imageUrl = previewImages[index]
    try {
      await deleteBrandImage(imageUrl)
    } catch {
      // Если не удалось удалить из хранилища — всё равно убираем из списка
    }
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Получаем slug из формы или из editingBrand для загрузки
  const currentSlug = editingBrand?.slug || 'new-brand'

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Бренды</h1>
          <p className="mt-1 text-sm text-gray-500">Управление брендами каталога</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={openCreateModal}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Добавить бренд
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Лого
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Описание
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Порядок
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Активен
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Загрузка...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Нет брендов
                </td>
              </tr>
            ) : (
              brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {brand.logo_url ? (
                      <div className="relative h-8 w-8 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={brand.logo_url}
                          alt={brand.name}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-400">—</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {brand.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                    {brand.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {brand.description || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {brand.sort_order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        brand.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700',
                      )}
                    >
                      {brand.is_active ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(brand)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      {brand.is_active && (
                        <button
                          onClick={() => openDeleteModal(brand)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <Modal
          title={editingBrand ? 'Редактировать бренд' : 'Добавить бренд'}
          onClose={closeModal}
          wide
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSave(new FormData(e.currentTarget))
            }}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
                <Input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingBrand?.name || ''}
                  placeholder="Например: Gianni Conti"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                <Input
                  type="text"
                  name="slug"
                  required
                  defaultValue={editingBrand?.slug || ''}
                  placeholder="gianni-conti"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Используется в URL. Только латинские буквы, цифры и дефисы.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  name="description"
                  defaultValue={editingBrand?.description || ''}
                  placeholder="Краткое описание бренда"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#03000d] focus:outline-none focus:ring-1 focus:ring-[#03000d]"
                />
              </div>

              {/* Логотип — загрузка файла */}
              <ImageUpload
                label="Логотип"
                currentUrl={logoUrl}
                brandSlug={currentSlug}
                imageType="logo"
                onUpload={(url) => setLogoUrl(url)}
                onRemove={() => setLogoUrl(null)}
              />

              {/* Hero-изображение — загрузка файла */}
              <ImageUpload
                label="Hero-изображение"
                currentUrl={heroImageUrl}
                brandSlug={currentSlug}
                imageType="hero"
                onUpload={(url) => setHeroImageUrl(url)}
                onRemove={() => setHeroImageUrl(null)}
              />

              {/* Галерея изображений */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Галерея изображений
                </label>

                {previewImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {previewImages.map((url, index) => (
                      <div key={url} className="relative group">
                        <div className="relative h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <Image
                            src={url}
                            alt={`Изображение ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 33vw, 150px"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(index)}
                          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <XIcon className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <ImageUpload
                  label="Добавить изображение в галерею"
                  brandSlug={currentSlug}
                  imageType="gallery"
                  onUpload={(url) => setPreviewImages((prev) => [...prev, url])}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Порядок сортировки
                </label>
                <Input
                  type="number"
                  name="sort_order"
                  defaultValue={editingBrand?.sort_order ?? 0}
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Активен</label>
                <select
                  name="is_active"
                  defaultValue={editingBrand ? (editingBrand.is_active ? 'true' : 'false') : 'true'}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#03000d] focus:outline-none focus:ring-1 focus:ring-[#03000d]"
                >
                  <option value="true">Да</option>
                  <option value="false">Нет</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>
                Отмена
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingBrand && (
        <Modal
          title="Деактивировать бренд"
          onClose={() => {
            setShowDeleteModal(false)
            setDeletingBrand(null)
          }}
        >
          <p className="text-gray-600">
            Вы уверены, что хотите деактивировать бренд <strong>{deletingBrand.name}</strong>? Бренд
            будет скрыт из каталога, но данные сохранятся.
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setDeletingBrand(null)
              }}
            >
              Отмена
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving ? 'Деактивация...' : 'Деактивировать'}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function Modal({
  title,
  children,
  onClose,
  wide,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className={cn(
            'relative transform overflow-hidden rounded-xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full',
            wide ? 'sm:max-w-2xl' : 'sm:max-w-lg',
          )}
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  )
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
