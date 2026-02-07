-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- ROLES TABLE
-- ===========================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL CHECK (name IN ('admin', 'user')),
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (name, description, permissions) VALUES
    ('admin', 'Администратор системы', '{"users": ["create", "read", "update", "delete"], "clients": ["create", "read", "update", "delete"], "orders": ["create", "read", "update", "delete"], "brands": ["create", "read", "update", "delete"]}'),
    ('user', 'Обычный пользователь', '{"clients": ["read"], "orders": ["read"], "brands": ["read"]}');

-- ===========================================
-- PROFILES TABLE (extends auth.users)
-- ===========================================

CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role_id UUID REFERENCES roles(id),
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to set default role on profile creation
CREATE OR REPLACE FUNCTION set_default_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role_id IS NULL THEN
        SELECT id INTO NEW.role_id FROM roles WHERE name = 'user' LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profile_default_role
    BEFORE INSERT ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION set_default_role();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, phone)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.raw_user_meta_data->>'phone'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- ===========================================
-- CLIENTS TABLE (B2B клиенты: ИП и ООО)
-- ===========================================

CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_type TEXT NOT NULL CHECK (client_type IN ('ip', 'ooo')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    company_name TEXT NOT NULL,
    trade_name TEXT,
    inn VARCHAR(12) NOT NULL,
    kpp VARCHAR(9),
    ogrn VARCHAR(15) NOT NULL,
    legal_address TEXT NOT NULL,
    actual_address TEXT,
    ceo_name TEXT,
    ceo_position TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT inn_format CHECK (
        (client_type = 'ooo' AND LENGTH(inn) = 10 AND inn ~ '^[0-9]+$') OR
        (client_type = 'ip' AND LENGTH(inn) = 12 AND inn ~ '^[0-9]+$')
    ),
    CONSTRAINT kpp_format CHECK (
        kpp IS NULL OR (LENGTH(kpp) = 9 AND kpp ~ '^[0-9]+$')
    ),
    CONSTRAINT ogrn_format CHECK (
        (client_type = 'ooo' AND LENGTH(ogrn) = 13 AND ogrn ~ '^[0-9]+$') OR
        (client_type = 'ip' AND LENGTH(ogrn) = 15 AND ogrn ~ '^[0-9]+$')
    )
);

CREATE INDEX idx_clients_inn ON clients(inn);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_type ON clients(client_type);

-- ===========================================
-- CLIENT BANK DETAILS
-- ===========================================

CREATE TABLE client_bank_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    bank_name TEXT NOT NULL,
    bik VARCHAR(9) NOT NULL,
    correspondent_account VARCHAR(20) NOT NULL,
    settlement_account VARCHAR(20) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT bik_format CHECK (LENGTH(bik) = 9 AND bik ~ '^[0-9]+$'),
    CONSTRAINT corr_account_format CHECK (LENGTH(correspondent_account) = 20 AND correspondent_account ~ '^[0-9]+$'),
    CONSTRAINT settlement_account_format CHECK (LENGTH(settlement_account) = 20 AND settlement_account ~ '^[0-9]+$')
);

CREATE INDEX idx_bank_details_client ON client_bank_details(client_id);

-- ===========================================
-- CLIENT CONTACTS
-- ===========================================

CREATE TABLE client_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    contact_type TEXT DEFAULT 'general',
    full_name TEXT NOT NULL,
    position TEXT,
    phone TEXT,
    email TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contacts_client ON client_contacts(client_id);

-- ===========================================
-- BRANDS TABLE
-- ===========================================

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    logo_url TEXT,
    hero_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_active ON brands(is_active);

-- ===========================================
-- PRODUCTS TABLE
-- ===========================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    sku TEXT UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_sku ON products(sku);

-- ===========================================
-- ORDERS TABLE
-- ===========================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE,
    client_id UUID NOT NULL REFERENCES clients(id),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(12, 2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_client ON orders(client_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part TEXT;
    seq_num INTEGER;
BEGIN
    year_part := TO_CHAR(NOW(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INTEGER)), 0) + 1
    INTO seq_num
    FROM orders
    WHERE order_number LIKE 'EVR-' || year_part || '-%';
    NEW.order_number := 'EVR-' || year_part || '-' || LPAD(seq_num::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();

-- ===========================================
-- ORDER ITEMS TABLE
-- ===========================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ===========================================
-- CONTACT REQUESTS TABLE
-- ===========================================

CREATE TABLE contact_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    company TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'spam')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_requests_status ON contact_requests(status);

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles p
        JOIN roles r ON p.role_id = r.id
        WHERE p.id = auth.uid() AND r.name = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- UPDATE TRIGGERS
-- ===========================================

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_contact_requests_updated_at BEFORE UPDATE ON contact_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_bank_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage all profiles" ON profiles
    FOR ALL USING (is_admin());

CREATE POLICY "Service role bypass" ON profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Clients policies
CREATE POLICY "Authenticated users can view clients" ON clients
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create clients" ON clients
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage clients" ON clients
    FOR ALL USING (is_admin());

-- Client bank details
CREATE POLICY "Auth users can view bank details" ON client_bank_details
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage bank details" ON client_bank_details
    FOR ALL USING (is_admin());

-- Client contacts
CREATE POLICY "Auth users can view contacts" ON client_contacts
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage contacts" ON client_contacts
    FOR ALL USING (is_admin());

-- Orders policies
CREATE POLICY "Auth users can view orders" ON orders
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage orders" ON orders
    FOR ALL USING (is_admin());

CREATE POLICY "Auth users can view order items" ON order_items
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage order items" ON order_items
    FOR ALL USING (is_admin());

-- Contact requests policies (public insert)
CREATE POLICY "Anyone can insert contact requests" ON contact_requests
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage contact requests" ON contact_requests
    FOR ALL USING (is_admin());

-- Brands (public read for active)
CREATE POLICY "Anyone can view active brands" ON brands
    FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can view all brands" ON brands
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage brands" ON brands
    FOR ALL USING (is_admin());

CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (is_active = true);
CREATE POLICY "Auth users can view all products" ON products
    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (is_admin());
