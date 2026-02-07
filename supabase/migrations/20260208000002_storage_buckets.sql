-- ===========================================
-- MIGRATION: Supabase Storage for Brand Images
-- Date: 2026-02-08
-- Description: Creates brand-images public storage bucket with RLS policies
--              for public read access and authenticated upload/delete.
-- ===========================================

-- ===========================================
-- 1. CREATE STORAGE BUCKET
-- ===========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'brand-images',
    'brand-images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- ===========================================
-- 2. RLS POLICIES FOR STORAGE OBJECTS
-- ===========================================

-- Public read access: anyone can view brand images
CREATE POLICY "Public read access for brand images"
ON storage.objects FOR SELECT
USING (bucket_id = 'brand-images');

-- Authenticated users can upload brand images
CREATE POLICY "Authenticated users can upload brand images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'brand-images'
    AND auth.role() = 'authenticated'
);

-- Authenticated users can update their uploaded brand images
CREATE POLICY "Authenticated users can update brand images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'brand-images'
    AND auth.role() = 'authenticated'
);

-- Authenticated users can delete brand images
CREATE POLICY "Authenticated users can delete brand images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'brand-images'
    AND auth.role() = 'authenticated'
);
