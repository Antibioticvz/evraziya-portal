-- ===========================================
-- MIGRATION: Schema Alignment with TypeScript Types
-- Date: 2026-02-08
-- Description: Adds missing columns, new tables (audit_log, brand_images),
--              and audit trigger function to align DB schema with src/types/database.ts
-- ===========================================

-- ===========================================
-- 1. ORDERS TABLE — add missing columns
-- ===========================================

ALTER TABLE orders ADD COLUMN currency TEXT DEFAULT 'RUB';
ALTER TABLE orders ADD COLUMN payment_terms TEXT;
ALTER TABLE orders ADD COLUMN delivery_address TEXT;
ALTER TABLE orders ADD COLUMN manager_id UUID REFERENCES profiles(id);
ALTER TABLE orders ADD COLUMN created_by UUID REFERENCES profiles(id);

CREATE INDEX idx_orders_manager ON orders(manager_id);
CREATE INDEX idx_orders_created_by ON orders(created_by);

-- ===========================================
-- 2. ORDER ITEMS TABLE — add computed total_price
-- ===========================================

ALTER TABLE order_items
    ADD COLUMN total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED;

-- ===========================================
-- 3. CONTACT REQUESTS TABLE — add missing columns
-- ===========================================

ALTER TABLE contact_requests ADD COLUMN source_page TEXT;
ALTER TABLE contact_requests ADD COLUMN assigned_to UUID REFERENCES profiles(id);

CREATE INDEX idx_contact_requests_assigned ON contact_requests(assigned_to);

-- ===========================================
-- 4. AUDIT LOG TABLE
-- ===========================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- RLS for audit_log
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log" ON audit_log
    FOR SELECT USING (is_admin());

CREATE POLICY "Service role can insert audit log" ON audit_log
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role bypass audit log" ON audit_log
    FOR ALL USING (auth.role() = 'service_role');

-- ===========================================
-- 5. BRAND IMAGES TABLE
-- ===========================================

CREATE TABLE brand_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    image_type TEXT DEFAULT 'gallery' CHECK (image_type IN ('logo', 'hero', 'gallery', 'preview')),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_brand_images_brand ON brand_images(brand_id);

-- RLS for brand_images
ALTER TABLE brand_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active brand images" ON brand_images
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM brands
            WHERE brands.id = brand_images.brand_id
            AND brands.is_active = true
        )
    );

CREATE POLICY "Auth users can view all brand images" ON brand_images
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage brand images" ON brand_images
    FOR ALL USING (is_admin());

-- ===========================================
-- 6. BRANDS TABLE — add preview_images JSONB column
-- ===========================================

ALTER TABLE brands ADD COLUMN preview_images JSONB DEFAULT '[]';

-- ===========================================
-- 7. AUDIT TRIGGER FUNCTION
-- ===========================================

CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    audit_user_id UUID;
    audit_action TEXT;
    audit_old JSONB;
    audit_new JSONB;
    audit_record_id UUID;
BEGIN
    -- Try to get current user, NULL if not authenticated (e.g. service_role)
    BEGIN
        audit_user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        audit_user_id := NULL;
    END;

    IF TG_OP = 'INSERT' THEN
        audit_action := 'INSERT';
        audit_old := NULL;
        audit_new := to_jsonb(NEW);
        audit_record_id := NEW.id;
    ELSIF TG_OP = 'UPDATE' THEN
        audit_action := 'UPDATE';
        audit_old := to_jsonb(OLD);
        audit_new := to_jsonb(NEW);
        audit_record_id := NEW.id;
    ELSIF TG_OP = 'DELETE' THEN
        audit_action := 'DELETE';
        audit_old := to_jsonb(OLD);
        audit_new := NULL;
        audit_record_id := OLD.id;
    END IF;

    INSERT INTO audit_log (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (audit_user_id, audit_action, TG_TABLE_NAME, audit_record_id, audit_old, audit_new);

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- 8. ATTACH AUDIT TRIGGERS TO KEY TABLES
-- ===========================================

-- Orders audit
CREATE TRIGGER audit_orders_insert
    AFTER INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_orders_update
    AFTER UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_orders_delete
    AFTER DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Brands audit
CREATE TRIGGER audit_brands_insert
    AFTER INSERT ON brands
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_brands_update
    AFTER UPDATE ON brands
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_brands_delete
    AFTER DELETE ON brands
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Contact requests audit
CREATE TRIGGER audit_contact_requests_insert
    AFTER INSERT ON contact_requests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_contact_requests_update
    AFTER UPDATE ON contact_requests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_contact_requests_delete
    AFTER DELETE ON contact_requests
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
