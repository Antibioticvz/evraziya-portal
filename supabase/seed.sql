-- ===========================================
-- SEED USERS (admin + user)
-- ===========================================
-- Admin:  admin@evraziyagroup.com / Admin123!
-- User:   user@evraziyagroup.com  / User123!

-- Create admin user
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'admin@evraziyagroup.com',
    crypt('Admin123!', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Администратор"}',
    NOW(),
    NOW(),
    '', '', '', ''
);

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    jsonb_build_object('sub', 'a0000000-0000-0000-0000-000000000001', 'email', 'admin@evraziyagroup.com'),
    'email',
    'a0000000-0000-0000-0000-000000000001',
    NOW(),
    NOW(),
    NOW()
);

-- Set admin role (trigger created profile with default 'user' role)
UPDATE profiles
SET role_id = (SELECT id FROM roles WHERE name = 'admin'),
    full_name = 'Администратор',
    phone = '+7 499 126 75 60'
WHERE id = 'a0000000-0000-0000-0000-000000000001';

-- Create regular user
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, recovery_token,
    email_change_token_new, email_change
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'b0000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'user@evraziyagroup.com',
    crypt('User123!', gen_salt('bf')),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Менеджер"}',
    NOW(),
    NOW(),
    '', '', '', ''
);

INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
) VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000002',
    jsonb_build_object('sub', 'b0000000-0000-0000-0000-000000000002', 'email', 'user@evraziyagroup.com'),
    'email',
    'b0000000-0000-0000-0000-000000000002',
    NOW(),
    NOW(),
    NOW()
);

-- Update regular user profile name
UPDATE profiles
SET full_name = 'Менеджер',
    phone = '+7 933 399 03 72'
WHERE id = 'b0000000-0000-0000-0000-000000000002';

-- ===========================================
-- SEED BRANDS
-- ===========================================

INSERT INTO brands (slug, name, short_description, full_description, is_active, sort_order) VALUES
    ('campomaggi', 'CAMPOMAGGI', 'Кожа, абсолютный герой всех коллекций Campomaggi, является живым материалом, который может быть сформирован и обработан без изменения.', 'Руководствуясь идеей создания сумок и предметов, которые отражают это, Марко Кампомаджи думает, мечтает и разрабатывает коллекции, в которых древнее искусство обработки кожи сочетается с творчеством, точностью в деталях и почти маниакальной осторожностью в ремесленном процессе.', true, 1),
    ('caterina-lucchi', 'CATERINA LUCCHI', 'Художественное использование цветов, способность играть с различными материалами, утонченная женственность и устойчивое производство являются основными характеристиками бренда.', NULL, true, 2),
    ('101meme', '101 MEME', 'На название нас вдохновила тетя Мем, которая в возрасте 101 года продолжала собирать хорошо сшитые сумки и любить аутентичные вещи.', 'На название нас вдохновила тетя Мем, которая в возрасте 101 года продолжала собирать хорошо сшитые сумки и любить аутентичные вещи, потому что то, что является "истинным", не всегда идеально, но, безусловно, уникально.', true, 3),
    ('maizena', 'MAIZENA', 'Наша цель – создавать неподвластные времени, оригинальные, шикарные и модные сумки.', 'Наша цель – создавать неподвластные времени, оригинальные, шикарные и модные сумки. Мы всегда ищем новые и эффективные формы, которые универсальны и удобны в носке. Нам нравится думать, что, надев одну из наших сумок, человек может почувствовать себя лучшей версией себя.', true, 4),
    ('chiarugi', 'CHIARUGI', 'Chiarugi демонстрирует неподвластный времени стиль, коллекции производятся исключительно в Италии.', 'Chiarugi демонстрирует неподвластный времени стиль, коллекции производятся исключительно в Италии с использованием только итальянской рабочей силы, чтобы передать безошибочный признак подлинного made in italy.', true, 5),
    ('gabs', 'GABS', 'Простые и функциональные материалы, цвета и формы являются ключевыми элементами этого бренда.', 'Простые и функциональные материалы, цвета и формы являются ключевыми элементами этого бренда. Принты являются оригинальными и уникальными в каждой коллекции.', true, 6),
    ('gianfranco-lotti', 'GIANFRANCO LOTTI', 'Итальянский бренд премиальных кожаных изделий.', NULL, true, 7),
    ('dr-amsterdam', 'dR. AMSTERDAM', 'Голландский бренд стильных сумок и аксессуаров.', NULL, true, 8),
    ('vilenca-holland', 'VILENCA HOLLAND', 'Сумки и аксессуары изготавливаются вручную из премиальной кожи.', 'Сумки и аксессуары изготавливаются вручную из премиальной кожи производства Индии. Благодаря использованию цельной кожи и специальной бренд популярен и востребован уже много лет в Европе и России.', true, 9),
    ('bear-design', 'BEAR Design', 'Сумки и аксессуары Bear Design изготавливаются вручную из хорошей и прочной кожи.', 'Сумки и аксессуары Bear Design изготавливаются вручную из хорошей и прочной кожи производства Индии. Благодаря использованию цельной кожи и специальной отделке сумки Bear Design популярны и востребованы уже много лет.', true, 10),
    ('hexagona', 'HEXAGONA', 'Французский бренд женских сумок и аксессуаров.', NULL, true, 11),
    ('roberto-mantellassi', 'ROBERTO MANTELLASSI', 'Фирменный аксессуар — это философия жизни.', 'Фирменный аксессуар Роберто Мантелласси — это философия жизни. Это решимость, смелость, честолюбие. Это каждый день направлять себя, вспоминая наши силы, через уникальный браслет, брелок, аксессуар.', true, 12);

-- ===========================================
-- SEED BRAND IMAGES
-- ===========================================

INSERT INTO brand_images (brand_id, url, alt_text, image_type, sort_order) VALUES
    ((SELECT id FROM brands WHERE slug = 'campomaggi'), '/images/brands/campomaggi/logo.webp', 'Логотип Campomaggi', 'logo', 0),
    ((SELECT id FROM brands WHERE slug = 'campomaggi'), '/images/brands/campomaggi/hero.webp', 'Campomaggi — коллекция сумок', 'hero', 0),
    ((SELECT id FROM brands WHERE slug = 'campomaggi'), '/images/brands/campomaggi/gallery-1.webp', 'Campomaggi сумка через плечо', 'gallery', 1),
    ((SELECT id FROM brands WHERE slug = 'campomaggi'), '/images/brands/campomaggi/gallery-2.webp', 'Campomaggi рюкзак', 'gallery', 2),
    ((SELECT id FROM brands WHERE slug = 'campomaggi'), '/images/brands/campomaggi/preview.webp', 'Campomaggi превью', 'preview', 0),
    ((SELECT id FROM brands WHERE slug = 'caterina-lucchi'), '/images/brands/caterina-lucchi/logo.webp', 'Логотип Caterina Lucchi', 'logo', 0),
    ((SELECT id FROM brands WHERE slug = 'caterina-lucchi'), '/images/brands/caterina-lucchi/hero.webp', 'Caterina Lucchi — коллекция', 'hero', 0),
    ((SELECT id FROM brands WHERE slug = 'caterina-lucchi'), '/images/brands/caterina-lucchi/preview.webp', 'Caterina Lucchi превью', 'preview', 0),
    ((SELECT id FROM brands WHERE slug = '101meme'), '/images/brands/101meme/logo.webp', 'Логотип 101 MEME', 'logo', 0),
    ((SELECT id FROM brands WHERE slug = '101meme'), '/images/brands/101meme/hero.webp', '101 MEME — коллекция сумок', 'hero', 0),
    ((SELECT id FROM brands WHERE slug = '101meme'), '/images/brands/101meme/preview.webp', '101 MEME превью', 'preview', 0),
    ((SELECT id FROM brands WHERE slug = 'gabs'), '/images/brands/gabs/logo.webp', 'Логотип GABS', 'logo', 0),
    ((SELECT id FROM brands WHERE slug = 'gabs'), '/images/brands/gabs/hero.webp', 'GABS — коллекция', 'hero', 0),
    ((SELECT id FROM brands WHERE slug = 'gabs'), '/images/brands/gabs/gallery-1.webp', 'GABS трансформер', 'gallery', 1),
    ((SELECT id FROM brands WHERE slug = 'gabs'), '/images/brands/gabs/preview.webp', 'GABS превью', 'preview', 0);

-- Update brands with preview_images JSONB
UPDATE brands SET preview_images = '["/images/brands/campomaggi/preview.webp"]'
WHERE slug = 'campomaggi';

UPDATE brands SET preview_images = '["/images/brands/caterina-lucchi/preview.webp"]'
WHERE slug = 'caterina-lucchi';

UPDATE brands SET preview_images = '["/images/brands/101meme/preview.webp"]'
WHERE slug = '101meme';

UPDATE brands SET preview_images = '["/images/brands/gabs/preview.webp"]'
WHERE slug = 'gabs';

-- ===========================================
-- SEED CLIENTS (for order seed data)
-- ===========================================

INSERT INTO clients (id, client_type, status, company_name, trade_name, inn, kpp, ogrn, legal_address, ceo_name, ceo_position, phone, email) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'ooo', 'active', 'ООО "Кожаный Мир"', 'Кожаный Мир', '7701234567', '770101001', '1027700123456', 'г. Москва, ул. Тверская, д. 10', 'Иванов Иван Иванович', 'Генеральный директор', '+7 495 123 45 67', 'info@kozhamir.ru'),
    ('c0000000-0000-0000-0000-000000000002', 'ip', 'active', 'ИП Петрова А.С.', NULL, '770312345678', NULL, '304770312345678', 'г. Москва, ул. Арбат, д. 25', 'Петрова Анна Сергеевна', 'Индивидуальный предприниматель', '+7 495 987 65 43', 'petrova@mail.ru');

-- ===========================================
-- SEED PRODUCTS (for order items)
-- ===========================================

INSERT INTO products (id, brand_id, sku, name, description, price, is_active, sort_order) VALUES
    ('d0000000-0000-0000-0000-000000000001', (SELECT id FROM brands WHERE slug = 'campomaggi'), 'CM-BAG-001', 'Сумка через плечо Campomaggi', 'Классическая сумка из натуральной кожи', 25500.00, true, 1),
    ('d0000000-0000-0000-0000-000000000002', (SELECT id FROM brands WHERE slug = 'campomaggi'), 'CM-BAG-002', 'Рюкзак Campomaggi', 'Рюкзак из состаренной кожи', 32000.00, true, 2),
    ('d0000000-0000-0000-0000-000000000003', (SELECT id FROM brands WHERE slug = 'gabs'), 'GB-BAG-001', 'Сумка-трансформер GABS', 'Многофункциональная сумка с принтом', 18900.00, true, 1);

-- ===========================================
-- SEED ORDERS (with new columns)
-- ===========================================

INSERT INTO orders (id, client_id, status, total_amount, currency, payment_terms, delivery_address, manager_id, created_by, notes) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'confirmed', 83000.00, 'RUB', 'Предоплата 50%, остаток при получении', 'г. Москва, ул. Тверская, д. 10, склад', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Первый заказ клиента'),
    ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'draft', 18900.00, 'RUB', NULL, NULL, NULL, 'b0000000-0000-0000-0000-000000000002', NULL),
    ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'pending', 57500.00, 'EUR', 'Оплата по факту доставки', 'г. Москва, ул. Тверская, д. 10, офис 5', 'b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Заказ итальянских брендов');

-- ===========================================
-- SEED ORDER ITEMS (total_price is auto-computed)
-- ===========================================

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price) VALUES
    ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Сумка через плечо Campomaggi', 2, 25500.00),
    ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002', 'Рюкзак Campomaggi', 1, 32000.00),
    ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000003', 'Сумка-трансформер GABS', 1, 18900.00),
    ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'Сумка через плечо Campomaggi', 1, 25500.00),
    ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', 'Рюкзак Campomaggi', 1, 32000.00);

-- ===========================================
-- SEED CONTACT REQUESTS (with new columns)
-- ===========================================

INSERT INTO contact_requests (name, phone, email, company, message, status, source_page, assigned_to, notes) VALUES
    ('Сидоров Алексей', '+7 916 111 22 33', 'sidorov@company.ru', 'ООО "Модный Дом"', 'Хотели бы узнать условия оптовых закупок брендов Campomaggi и GABS.', 'in_progress', '/brands/campomaggi', 'b0000000-0000-0000-0000-000000000002', 'Перезвонить в понедельник'),
    ('Козлова Мария', '+7 926 333 44 55', 'kozlova@mail.ru', NULL, 'Интересует каталог продукции на 2026 год.', 'new', '/contacts', NULL, NULL),
    ('Волков Дмитрий', '+7 903 555 66 77', 'volkov@leather.ru', 'ИП Волков Д.А.', 'Готовы обсудить дилерское соглашение.', 'completed', '/', 'a0000000-0000-0000-0000-000000000001', 'Встреча состоялась, договор подписан');

-- ===========================================
-- SEED AUDIT LOG (sample entries)
-- ===========================================

INSERT INTO audit_log (user_id, action, table_name, record_id, old_data, new_data) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'INSERT', 'orders', 'e0000000-0000-0000-0000-000000000001', NULL, '{"status": "confirmed", "total_amount": 83000}'),
    ('a0000000-0000-0000-0000-000000000001', 'INSERT', 'brands', (SELECT id FROM brands WHERE slug = 'campomaggi'), NULL, '{"slug": "campomaggi", "name": "CAMPOMAGGI"}'),
    ('b0000000-0000-0000-0000-000000000002', 'UPDATE', 'contact_requests', NULL, '{"status": "new"}', '{"status": "in_progress", "assigned_to": "b0000000-0000-0000-0000-000000000002"}');
