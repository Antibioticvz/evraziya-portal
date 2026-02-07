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
