# Evraziya Portal

B2B-портал для группы компаний ЕВРАЗИЯ — оптовая дистрибуция итальянских изделий из кожи и аксессуаров.

## Стек технологий

| Категория            | Технология                            |
| -------------------- | ------------------------------------- |
| Framework            | Next.js 16 (App Router) + React 19    |
| Язык                 | TypeScript 5 (strict mode)            |
| База данных / Auth   | Supabase (PostgreSQL, Auth, Realtime) |
| Стили                | Tailwind CSS 4 + shadcn/ui + Radix UI |
| Серверное состояние  | TanStack React Query                  |
| Клиентское состояние | Zustand                               |
| URL-состояние        | nuqs                                  |
| Формы                | React Hook Form + Zod                 |
| Иконки               | Lucide React                          |
| Анимации             | Framer Motion                         |
| Пакетный менеджер    | yarn                                  |

## Быстрый старт

```bash
# Установка зависимостей
yarn install

# Копирование переменных окружения
cp .env.local.example .env.local
# Заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY

# Запуск dev-сервера
yarn dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Скрипты

| Команда           | Описание                  |
| ----------------- | ------------------------- |
| `yarn dev`        | Запуск dev-сервера        |
| `yarn build`      | Продакшн-сборка           |
| `yarn start`      | Запуск продакшн-сервера   |
| `yarn lint`         | ESLint проверка           |
| `yarn lint:fix`     | ESLint с автоисправлением |
| `yarn type-check`   | Проверка типов TypeScript |
| `yarn format`       | Prettier форматирование   |
| `yarn format:check` | Проверка форматирования   |

## Структура проекта

```
src/
├── app/
│   ├── (marketing)/        # Публичные страницы (главная, бренды, контакты)
│   ├── (auth)/             # Авторизация (логин)
│   ├── (dashboard)/        # Защищённые страницы (панель, админка, клиенты)
│   └── api/                # API маршруты
├── components/
│   ├── ui/                 # shadcn/ui компоненты (button, input, toast)
│   ├── layout/             # Header, Footer, навигация
│   ├── features/           # Компоненты по фичам (auth, brands)
│   ├── providers/          # React-провайдеры (QueryClient, Toast)
│   └── shared/             # Общие компоненты
├── lib/
│   ├── supabase/           # Клиенты Supabase (client, server, admin)
│   ├── validations/        # Zod-схемы валидации
│   └── utils.ts            # Утилиты (cn)
├── types/                  # TypeScript интерфейсы
├── hooks/                  # Кастомные React-хуки
├── stores/                 # Zustand-сторы
└── middleware.ts            # Middleware для auth и маршрутизации
supabase/
├── migrations/             # SQL-миграции
├── seed.sql                # Начальные данные
└── config.toml             # Конфигурация Supabase
```

## Разработка с Claude Code (Wave-Per-Session)

Проект настроен для структурированной разработки с Claude Code по методологии [Wave-Per-Session](../Wave-Per-Session.md).

### Что настроено

- **CLAUDE.md** — инструкции для Claude: команды сборки, конвенции кода, структура проекта, лог ошибок
- **Wave-скиллы** — `/wave-start` и `/wave-verify` для выполнения и проверки волн задач
- **Скиллы стека** — специализированные команды для работы с технологиями проекта

### Доступные скиллы (slash-команды)

| Команда             | Описание                                                 |
| ------------------- | -------------------------------------------------------- |
| `/wave-start`       | Выполнить следующую волну задач                          |
| `/wave-verify`      | Проверить завершённость волны (build + lint + review)    |
| `/add-page`         | Создать новую страницу Next.js App Router                |
| `/add-api-route`    | Создать новый API-маршрут с Supabase                     |
| `/add-shadcn`       | Добавить/настроить shadcn/ui компонент                   |
| `/supabase-migrate` | Создать новую миграцию Supabase + обновить типы          |
| `/add-feature`      | Создать полную фичу (страница + API + компоненты + типы) |

### Как начать работу над фичей

```bash
cd evraziya-portal

# Для средних фич (6-15 задач) — Standard mode
export CLAUDE_CODE_TASK_LIST_ID="evraziya-portal-my-feature"
claude
```

Опишите фичу в промпте:

```
Мне нужно реализовать [ОПИСАНИЕ ФИЧИ].

Прочитай кодовую базу, чтобы понять существующие паттерны.
Задай уточняющие вопросы перед тем, как продолжить.

Затем:
1. Создай план реализации с файлами, зависимостями и критериями приёмки
2. Построй граф зависимостей
3. Рассчитай волны выполнения
4. Создай Tasks для каждого пункта
5. Сохрани человекочитаемый план в tasks.md
```

Далее выполняйте волны: `/wave-start` → `/wave-verify` → commit → repeat.

### Для мелких задач (3-5 задач) — Lite mode

```bash
export CLAUDE_CODE_TASK_LIST_ID="evraziya-portal-small-task"
claude
```

```
Мне нужно реализовать [ФИЧА].

Прочитай кодовую базу, спланируй задачи и выполни их с параллельными
суб-агентами где возможно. Запусти build и тесты после каждой задачи.
```

## Переменные окружения

Скопируйте `.env.local.example` в `.env.local` и заполните:

| Переменная                      | Описание                            |
| ------------------------------- | ----------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL проекта Supabase                |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Публичный ключ Supabase             |
| `SUPABASE_SERVICE_ROLE_KEY`     | Сервисный ключ (для admin-операций) |
| `NEXT_PUBLIC_APP_URL`           | URL приложения                      |
| `NEXT_PUBLIC_APP_NAME`          | Название приложения                 |

## Git-стратегия

Проект использует **GitHub Flow** с ветками:

| Префикс | Назначение | Базовая ветка |
|---------|-----------|--------------|
| `feature/` | Новые фичи | develop |
| `fix/` | Баг-фиксы | develop |
| `hotfix/` | Срочные фиксы продакшна | main |
| `chore/` | Рефакторинг, инфра, конфиг | develop |

Каждая фича разрабатывается в отдельной ветке с PR в целевую ветку.

## Code Style

- **Без точек с запятой** (enforced Prettier + ESLint)
- **Одинарные кавычки** для строк
- **Trailing commas** везде
- **100 символов** ширина строки
- Конфигурация: `.prettierrc`, `eslint.config.mjs`

## Деплой

Проект настроен для деплоя на Vercel с автоматическим CI/CD через GitHub Actions (`.github/workflows/`).
