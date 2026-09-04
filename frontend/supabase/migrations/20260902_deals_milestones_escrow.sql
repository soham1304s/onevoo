-- ==========================================================================
-- ONEVOO ENTERPRISE ARCHITECTURE: DEALS, MILESTONES & CONTENT VAULT DDL
-- Implements suggestionv2.md (Section 1.D)
-- ==========================================================================

-- 1. Create Enums for State Machine
DO $$ BEGIN
    CREATE TYPE deal_status AS ENUM ('DRAFT', 'ACTIVE_PRODUCING', 'UNDER_REVIEW', 'COMPLETED', 'LOCKED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE milestone_status AS ENUM ('PENDING_ESCROW', 'ESCROWED', 'RELEASED', 'DISPUTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create onevoo_deals Table
CREATE TABLE IF NOT EXISTS public.onevoo_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  campaign_title TEXT NOT NULL,
  total_deal_value NUMERIC(12, 2) NOT NULL,
  status deal_status DEFAULT 'DRAFT' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Create onevoo_milestones Table with Digital Escrow States
CREATE TABLE IF NOT EXISTS public.onevoo_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.onevoo_deals(id) ON DELETE CASCADE NOT NULL,
  milestone_title TEXT NOT NULL,
  payment_amount NUMERIC(12,2) NOT NULL,
  escrow_state milestone_status DEFAULT 'PENDING_ESCROW' NOT NULL,
  content_version_ref TEXT, -- Links directly to the cryptographic content vault hash
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Create content_vault Table for Multi-Version Review
CREATE TABLE IF NOT EXISTS public.content_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.onevoo_deals(id) ON DELETE CASCADE NOT NULL,
  version_number INT DEFAULT 1 NOT NULL,
  s3_storage_path TEXT NOT NULL,
  brand_approved BOOLEAN DEFAULT FALSE NOT NULL,
  comments_json JSONB DEFAULT '[]'::jsonb NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Row Level Security Policies
ALTER TABLE public.onevoo_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onevoo_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_vault ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view deals they participate in
CREATE POLICY "Users can view associated deals" ON public.onevoo_deals
  FOR SELECT USING (auth.uid() = brand_id OR auth.uid() = creator_id);

CREATE POLICY "Users can view milestones for their deals" ON public.onevoo_milestones
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.onevoo_deals d
    WHERE d.id = onevoo_milestones.deal_id AND (d.brand_id = auth.uid() OR d.creator_id = auth.uid())
  ));

CREATE POLICY "Users can view content vault for their deals" ON public.content_vault
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.onevoo_deals d
    WHERE d.id = content_vault.deal_id AND (d.brand_id = auth.uid() OR d.creator_id = auth.uid())
  ));
