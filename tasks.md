# EVRAZIYA Portal — Полный план разработки

**Дата:** 2026-02-08
**Метод:** Wave-Per-Session + мульти-агенты

---

## Общий порядок выполнения Features

```
F1: design-system-brands ──────────┐
                                    ├──→ F2: marketing-pages-redesign ──┐
                                    │                                    │
                                    ├──→ F3: orders-management ─────────┤
                                    │    (параллельно с F3)              ├──→ F5: quality-polish
                                    ├──→ F4: admin-panel ───────────────┤
                                    │                                    │
                                    └────────────────────────────────────┘
```

**Параллелизм:**

- F3 и F4 запускаются параллельно (разные ветки, независимые модули)
- F2 зависит от F1 (дизайн-система + данные брендов)
- F5 запускается после merge всех остальных

---

## FEATURE 1: Design System + Brands Data

**Ветка:** `feature/design-system-brands`
**Task List ID:** `evraziya-portal-design-system-brands`

### Анализ текущего состояния

| Файл             | Состояние                                                                            |
| ---------------- | ------------------------------------------------------------------------------------ |
| `globals.css`    | Tailwind 4 `@theme`, есть `evraziya-purple` и `evraziya-dark`, остальные отсутствуют |
| `layout.tsx`     | Нет шрифтовой конфигурации, body использует Arial                                    |
| `brands-data.ts` | 6 брендов без preview_images                                                         |
| `database.ts`    | Brand interface — базовые поля, нет preview_images                                   |
| `header.tsx`     | 13 ссылок, URL-ы `/brand/...` (ошибка — реальные маршруты `/brendy/[slug]`)          |

### Решения

- **URL-ы навигации:** `/brendy/[slug]` (текущая маршрутизация)
- **Список брендов:** 12 из запроса (не из навигации аудита 4.1)
- **Тип Brand:** добавить `preview_images?: string[]`
- **Шрифт:** Inter (next/font/google) как замена Cyntho Pro

### Граф зависимостей F1

```
#6 (CSS цвета)     ───┐
#7 (Шрифт Inter)   ───┤── F1-Wave1 (параллельно)
#8 (Brand type)    ───┘
                          │
                          ▼
#9 (12 брендов)    ───── F1-Wave2 (← #8)
                          │
                          ▼
#10 (Header nav)   ───── F1-Wave3 (← #9)
```

### Волны F1

#### F1-Wave1 — Foundation (параллельно)

| Task | Файлы                       | Описание                                                                            |
| ---- | --------------------------- | ----------------------------------------------------------------------------------- |
| #6   | `globals.css`               | 6 CSS-переменных: purple-hover, dark-alt, light-purple, border-purple, accent, gray |
| #7   | `layout.tsx`, `globals.css` | Inter через next/font/google, --font-sans/--font-cyntho                             |
| #8   | `database.ts`               | `preview_images?: string[]` в Brand interface                                       |

#### F1-Wave2 — Data

| Task | Файлы            | Описание                                     |
| ---- | ---------------- | -------------------------------------------- |
| #9   | `brands-data.ts` | 12 брендов с описаниями и CDN preview_images |

#### F1-Wave3 — Navigation

| Task | Файлы        | Описание                                           |
| ---- | ------------ | -------------------------------------------------- |
| #10  | `header.tsx` | navLinks: 12 брендов + ГЛАВНАЯ + БРЕНДЫ + КОНТАКТЫ |

### 12 брендов

| #   | Бренд               | slug                | CDN widget_id |
| --- | ------------------- | ------------------- | ------------- |
| 1   | CAMPOMAGGI          | campomaggi          | 87630281      |
| 2   | CATERINA LUCCHI     | caterina-lucchi     | 87630252      |
| 3   | CRISTIAN MARCUCCI   | cristian-marcucci   | 89026264      |
| 4   | 101 MEME            | 101meme             | 87630207      |
| 5   | MAIZENA             | maizena             | 87630077      |
| 6   | CHIARUGI            | chiarugi            | 87629991      |
| 7   | GABS                | gabs                | 87629945      |
| 8   | CHARLOTTE-MARCHETTI | charlotte-marchetti | 87629418      |
| 9   | LA VIA FIRENZE      | la-via-firenze      | 87629187      |
| 10  | VILENCA HOLLAND     | vilenca-holland     | 102292676     |
| 11  | BEAR DESIGN         | bear-design         | 87628920      |
| 12  | ROBERTO MANTELLASSI | roberto-mantellassi | 87652444      |

### Критерии приёмки F1

- [x] Все 8 цветов EVRAZIYA как Tailwind-классы
- [x] Inter рендерится, `.font-cyntho` доступен
- [x] Brand interface расширен полем preview_images
- [x] 12 брендов с описаниями и CDN URL
- [x] Header: 15 ссылок → `/brendy/[slug]`
- [x] `yarn build && yarn lint` проходят

**Коммит:** `ce0b851 feat: implement design system colors, fonts, 12 brands data, and header navigation`

---

## FEATURE 2: Marketing Pages Visual Overhaul

**Ветка:** `feature/marketing-pages-redesign`
**Task List ID:** `evraziya-portal-marketing-redesign`
**Зависит от:** F1 (merge в develop)

### Граф зависимостей F2

```
#11 (ImageSlider)  ───┐
                       ├──→ #13 (BrandCard) ───┐
#12 (ImageGallery) ───┤                         ├──→ #15 (/brendy)
                       │                         │
                       │    #14 (Hero главная) ──┤
                       │    #17 (/kontakty)    ──┤──→ #16 (/brendy/[slug])
                       │                         │
                       └─────────────────────────┘
                                                  │
                              ┌────────────────────┘
                              ▼
                    #18 (Footer)     ───┐
                    #19 (Animations) ───┤── F2-Wave3 (← #14-#17)
                    #20 (SEO meta)   ───┘
```

### Волны F2

#### F2-Wave1 — Компоненты (параллельно)

| Task | Файлы                                       | Описание                                                 |
| ---- | ------------------------------------------- | -------------------------------------------------------- |
| #11  | `components/shared/image-slider.tsx`        | Карусель: Framer Motion, touch/swipe, стрелки, lazy load |
| #12  | `components/shared/image-gallery.tsx`       | Masonry grid: CSS columns, lightbox, 4/2/1 колонки       |
| #13  | `components/features/brands/brand-card.tsx` | Карточка бренда: слайдер, описание, CTA, fade-in         |

#### F2-Wave2 — Страницы (параллельно где возможно)

| Task | Файлы                                    | Описание                                       |
| ---- | ---------------------------------------- | ---------------------------------------------- |
| #14  | `app/(marketing)/page.tsx`               | Hero 100vh, фон CDN, логотип, тексты           |
| #15  | `app/(marketing)/brendy/page.tsx`        | "КЕЙС БРЕНДОВ", 12 BrandCard, темный фон       |
| #16  | `app/(marketing)/brendy/[slug]/page.tsx` | Изображение-текст-изображение, masonry галерея |
| #17  | `app/(marketing)/kontakty/page.tsx`      | 3 колонки: контакты, адрес, форма              |

#### F2-Wave3 — Финализация (параллельно)

| Task | Файлы                                      | Описание                          |
| ---- | ------------------------------------------ | --------------------------------- |
| #18  | `components/layout/footer.tsx`             | WhatsApp, телефон, копирайт       |
| #19  | `components/shared/fade-in.tsx` + страницы | Framer Motion fade-in при скролле |
| #20  | Все маркетинговые страницы                 | metadata, OG, generateMetadata    |

### Критерии приёмки F2

- [x] ImageSlider с touch/swipe и стрелками
- [x] ImageGallery masonry (4/2/1 колонки) — реализовано как CSS grid (2/3/4 колонки) с lightbox
- [x] BrandCard по дизайну аудита — размещён в `components/shared/` (не features/brands/)
- [x] Главная: hero 100vh с CDN изображениями
- [x] /brendy: 12 карточек с слайдерами
- [x] /brendy/[slug]: layout по аудиту + галерея с lightbox
- [x] /kontakty: 2 колонки (контакты + форма), дизайн-система
- [x] Footer обновлён — 3 колонки: инфо, бренды, контакты
- [ ] Fade-in анимации — **не реализовано** (Framer Motion не добавлен, решение: CSS transitions)
- [x] SEO мета-теги — перенесено в F5 (#31), generateMetadata уже был
- [x] `yarn build && yarn lint` проходят

**Коммит:** `a605bab feat: redesign marketing pages with brand components and design system`

---

## FEATURE 3: Orders Management

**Ветка:** `feature/orders-management`
**Task List ID:** `evraziya-portal-orders`
**Зависит от:** F1 (merge в develop)
**Параллельно с:** F2, F4

### Граф зависимостей F3

```
#21 (Zod schema) ───→ #22 (API routes) ───┐
                                            ├──→ #23 (Список заказов)
                                            ├──→ #24 (Создание заказа)
                                            ├──→ #25 (Детали заказа)
                                            │
                                            └──→ #26 (Nav link) ← #23,#24,#25
```

### Волны F3

#### F3-Wave1 — Backend (последовательно)

| Task | Файлы                                      | Описание                                             |
| ---- | ------------------------------------------ | ---------------------------------------------------- |
| #21  | `lib/validations/order.ts`                 | Zod: orderSchema, orderItemSchema, createOrderSchema |
| #22  | `app/api/orders/route.ts`, `[id]/route.ts` | GET list, POST, GET detail, PATCH, DELETE (admin)    |

#### F3-Wave2 — Страницы (параллельно)

| Task | Файлы                                            | Описание                                              |
| ---- | ------------------------------------------------ | ----------------------------------------------------- |
| #23  | `app/(dashboard)/dashboard/orders/page.tsx`      | Таблица, фильтры по статусу, пагинация                |
| #24  | `app/(dashboard)/dashboard/orders/new/page.tsx`  | Форма: клиент, позиции, итого, черновик/подтверждение |
| #25  | `app/(dashboard)/dashboard/orders/[id]/page.tsx` | Детали, таблица позиций, смена статуса, удаление      |

#### F3-Wave3 — Навигация

| Task | Файлы              | Описание                            |
| ---- | ------------------ | ----------------------------------- |
| #26  | Навигация дашборда | Ссылка "Заказы" → /dashboard/orders |

### Критерии приёмки F3

- [x] CRUD API для заказов (5 endpoints) — GET list, POST, GET detail, PATCH (нет DELETE)
- [x] Zod валидация — orderStatusEnum, orderItemSchema, createOrderSchema, updateOrderSchema
- [x] Список с фильтрами и пагинацией
- [x] Форма создания с динамическими позициями — React Hook Form + useFieldArray
- [x] Детали с изменением статуса
- [x] Навигация обновлена — ссылка уже была в layout
- [x] `yarn build && yarn lint` проходят

**Коммит:** `a3ef393 feat: implement orders management with API routes and dashboard pages`

---

## FEATURE 4: Admin Panel Expansion

**Ветка:** `feature/admin-panel`
**Task List ID:** `evraziya-portal-admin-panel`
**Зависит от:** F1 (merge в develop)
**Параллельно с:** F2, F3

### Граф зависимостей F4

```
#27 (Contact requests) ───┐
                           ├──→ #29 (Audit log) ───→ #30 (Admin nav)
#28 (Brands CRUD)      ───┘
```

### Волны F4

#### F4-Wave1 — Модули (параллельно)

| Task | Файлы                                                            | Описание                                        |
| ---- | ---------------------------------------------------------------- | ----------------------------------------------- |
| #27  | `api/admin/contact-requests/`, `admin/contact-requests/page.tsx` | API + UI: список, статус, фильтры, модалка      |
| #28  | `api/admin/brands/`, `admin/brands/page.tsx`                     | Полный CRUD, is_active toggle, Supabase Storage |

#### F4-Wave2 — Аудит + навигация

| Task | Файлы                                              | Описание                                  |
| ---- | -------------------------------------------------- | ----------------------------------------- |
| #29  | `api/admin/audit-log/`, `admin/audit-log/page.tsx` | Таблица логов, фильтры, JSON diff модалка |
| #30  | Навигация админки                                  | Ссылки: Заявки, Бренды, Аудит лог         |

### Критерии приёмки F4

- [x] CRUD заявок со сменой статуса — фильтры по статусу, заметки, раскрывающиеся строки
- [x] CRUD брендов с is_active toggle — модалка добавления/редактирования, подтверждение удаления
- [x] Аудит лог с фильтрами и JSON diff — раскрывающиеся строки с old_data/new_data
- [x] Навигация админки обновлена — 3 ссылки: Заявки, Бренды, Аудит лог
- [x] `yarn build && yarn lint` проходят

**Коммит:** `f26a310 feat: expand admin panel with contact requests, brands CRUD, and audit log`

---

## FEATURE 5: Quality & Polish

**Ветка:** `chore/quality-polish`
**Task List ID:** `evraziya-portal-quality`
**Зависит от:** F1, F2, F3, F4 (все merge в develop)

### Граф зависимостей F5

```
#31 (SEO)           ───┐
#32 (Mobile QA)     ───┤── F5-Wave1 (параллельно)
#33 (Loading/Error) ───┘
                          │
                          ▼
#34 (Performance)   ───── F5-Wave2 (← #31,#32,#33)
```

### Волны F5

#### F5-Wave1 — Параллельно

| Task | Файлы                                       | Описание                                            |
| ---- | ------------------------------------------- | --------------------------------------------------- |
| #31  | `app/sitemap.ts`, `app/robots.ts`, layouts  | sitemap, robots, JSON-LD structured data            |
| #32  | Все страницы                                | Mobile QA: <768, 768-1024, >1024, overflow, таблицы |
| #33  | `loading.tsx`, `error.tsx`, `not-found.tsx` | Скелетоны, error boundaries, 404                    |

#### F5-Wave2 — Оптимизация

| Task | Файлы                       | Описание                                               |
| ---- | --------------------------- | ------------------------------------------------------ |
| #34  | Все страницы, QueryProvider | next/image sizes, React Query staleTime/gcTime, bundle |

### Критерии приёмки F5

- [x] sitemap.xml + robots.txt генерируются — 12 brand URLs + static routes
- [x] JSON-LD валиден — Organization schema в layout.tsx
- [x] Нет overflow на мобиле — hero logo, slider arrows, orders table, header menu
- [x] Loading/Error/NotFound для всех route groups — marketing + dashboard
- [x] Images оптимизированы — dynamic imports для ImageSlider/ImageGallery, tighter CDN pattern
- [x] `yarn build && yarn lint` проходят

**Коммиты:**

- `f6a8174 feat: add SEO, loading/error states, and mobile responsiveness improvements`
- `f3db711 perf: add dynamic imports, viewport meta, and tighten image CDN pattern`

---

## Сводная таблица всех задач

| #   | Feature | Wave | Task                             | Blocked By         |
| --- | ------- | ---- | -------------------------------- | ------------------ |
| 6   | F1      | W1   | CSS-переменные дизайн-системы    | —                  |
| 7   | F1      | W1   | Inter как замена Cyntho Pro      | —                  |
| 8   | F1      | W1   | preview_images в Brand interface | —                  |
| 9   | F1      | W2   | 12 брендов в brands-data.ts      | #8                 |
| 10  | F1      | W3   | Header навигация — 12 брендов    | #9                 |
| 11  | F2      | W1   | ImageSlider компонент            | #6, #7             |
| 12  | F2      | W1   | ImageGallery компонент           | #6, #7             |
| 13  | F2      | W1   | BrandCard компонент              | #11                |
| 14  | F2      | W2   | Главная страница (hero)          | #6, #7             |
| 15  | F2      | W2   | /brendy страница                 | #9, #13            |
| 16  | F2      | W2   | /brendy/[slug] страница          | #9, #12            |
| 17  | F2      | W2   | /kontakty страница               | #6, #7             |
| 18  | F2      | W3   | Footer обновление                | #14-#17            |
| 19  | F2      | W3   | Framer Motion анимации           | #14-#17            |
| 20  | F2      | W3   | SEO мета-теги                    | #14-#17            |
| 21  | F3      | W1   | Zod-схема заказа                 | —                  |
| 22  | F3      | W1   | API routes заказов               | #21                |
| 23  | F3      | W2   | Список заказов                   | #22                |
| 24  | F3      | W2   | Создание заказа                  | #22                |
| 25  | F3      | W2   | Детали заказа                    | #22                |
| 26  | F3      | W3   | Навигация дашборда               | #23-#25            |
| 27  | F4      | W1   | Управление заявками              | —                  |
| 28  | F4      | W1   | CRUD брендов в админке           | —                  |
| 29  | F4      | W2   | Аудит лог                        | #27, #28           |
| 30  | F4      | W2   | Навигация админки                | #27-#29            |
| 31  | F5      | W1   | SEO: sitemap, robots, JSON-LD    | #10, #20, #26, #30 |
| 32  | F5      | W1   | Мобильная адаптация              | #10, #20, #26, #30 |
| 33  | F5      | W1   | Loading/Error/NotFound           | #10, #20, #26, #30 |
| 34  | F5      | W2   | Оптимизация производительности   | #31-#33            |

---

## Мульти-агентный план выполнения

### Фаза 1: F1 (один агент)

```
Agent-1: F1-W1 (#6, #7, #8) → F1-W2 (#9) → F1-W3 (#10) → merge → develop
```

### Фаза 2: F2 + F3 + F4 (три агента параллельно)

```
Agent-2: F2-W1 (#11,#12,#13) → F2-W2 (#14,#15,#16,#17) → F2-W3 (#18,#19,#20) → merge
Agent-3: F3-W1 (#21,#22) → F3-W2 (#23,#24,#25) → F3-W3 (#26) → merge
Agent-4: F4-W1 (#27,#28) → F4-W2 (#29,#30) → merge
```

### Фаза 3: F5 (один агент после merge F1-F4)

```
Agent-5: F5-W1 (#31,#32,#33) → F5-W2 (#34) → merge
```

### Финал

```
develop → main (production release)
```

---

## Git-команды для каждой фичи

### F1

```bash
git checkout feature/design-system-brands
# ... work ...
git add -A && git commit -m "feat: design system + 12 brands data"
git push -u origin feature/design-system-brands
gh pr create --base develop --title "feat: design system and brands data"
```

### F2

```bash
git checkout develop && git pull origin develop
git checkout -b feature/marketing-pages-redesign
# ... work ...
git add -A && git commit -m "feat: marketing pages redesign per site audit"
git push -u origin feature/marketing-pages-redesign
gh pr create --base develop --title "feat: marketing pages visual overhaul"
```

### F3

```bash
git checkout develop && git pull origin develop
git checkout -b feature/orders-management
# ... work ...
git add -A && git commit -m "feat: orders management CRUD"
git push -u origin feature/orders-management
gh pr create --base develop --title "feat: orders management"
```

### F4

```bash
git checkout develop && git pull origin develop
git checkout -b feature/admin-panel
# ... work ...
git add -A && git commit -m "feat: admin panel — contact requests, brands, audit log"
git push -u origin feature/admin-panel
gh pr create --base develop --title "feat: admin panel expansion"
```

### F5

```bash
git checkout develop && git pull origin develop
git checkout -b chore/quality-polish
# ... work ...
git add -A && git commit -m "chore: SEO, mobile QA, performance, error boundaries"
git push -u origin chore/quality-polish
gh pr create --base develop --title "chore: quality & polish"
```

---

## Итоги реализации

**Дата завершения:** 2026-02-08
**Ветка:** `feature/design-system-brands` (все фичи в одной ветке)
**Верификация:** `yarn build` + `yarn lint` + `yarn format:check` + `yarn type-check` — все OK

### Коммиты (от старого к новому)

| Коммит    | Описание                                                        |
| --------- | --------------------------------------------------------------- |
| `ce0b851` | feat: design system colors, fonts, 12 brands data, header nav   |
| `a605bab` | feat: redesign marketing pages with brand components            |
| `a3ef393` | feat: implement orders management with API routes and dashboard |
| `f26a310` | feat: expand admin panel with contact requests, brands, audit   |
| `f6a8174` | feat: add SEO, loading/error states, and mobile responsiveness  |
| `f3db711` | perf: add dynamic imports, viewport meta, tighten image CDN     |

### Что реализовано (28/29 задач)

- **F1** (5/5): Дизайн-система, шрифты, Brand type, 12 брендов, навигация
- **F2** (9/10): Компоненты (ImageSlider, ImageGallery, BrandCard), 4 страницы, Footer
- **F3** (6/6): Zod-валидация, API routes, 3 dashboard-страницы, навигация
- **F4** (4/4): Заявки, бренды CRUD, аудит лог, навигация админки
- **F5** (4/4): SEO, мобильная адаптация, loading/error/not-found, оптимизация

### Что не реализовано

| #   | Задача                         | Причина                                               | Приоритет |
| --- | ------------------------------ | ----------------------------------------------------- | --------- |
| #19 | Framer Motion fade-in анимации | Библиотека не установлена, CSS transitions достаточны | Низкий    |

### Отличия от плана

- **Все фичи в одной ветке** `feature/design-system-brands` вместо отдельных веток — упрощение для текущего этапа
- **BrandCard** в `components/shared/` вместо `components/features/brands/` — единообразие с остальными компонентами
- **ImageGallery** — CSS grid вместо masonry, с полноценным lightbox
- **/kontakty** — 2 колонки вместо 3, без карты (данных адреса нет)
- **SEO мета-теги** (#20) объединены с F5-SEO (#31) — generateMetadata уже был в [slug]/page.tsx

### Что нужно дальше

- [ ] Supabase миграции для таблиц: `orders`, `order_items`, `contact_requests`, `audit_log`
- [ ] Подключение реальных данных вместо статических fallback-ов
- [ ] Тесты (unit + integration) — не настроены ещё
- [ ] Push и создание PR в develop
- [ ] Framer Motion анимации (опционально, низкий приоритет)
- [ ] Supabase Storage для загрузки изображений брендов в админке
