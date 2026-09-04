import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root or local directory
const envCandidates = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env')
];
for (const envFile of envCandidates) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    break;
  }
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.warn('⚠️ DATABASE_URL environment variable is not configured. Please set DATABASE_URL in .env');
}

export const sql = neon(dbUrl || 'postgresql://placeholder:placeholder@ep-placeholder.neon.tech/neondb');

/**
 * Auto-initialize Neon PostgreSQL Database Schema for Authentication & Onevoo OS
 */
export async function initializeDatabase() {
  console.log('🔄 Initializing Neon Database tables...');
  try {
    // 1. Enable UUID Extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

    // 2. Users Table for Authentication
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        role TEXT DEFAULT 'creator',
        verification_status TEXT DEFAULT 'approved',
        avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
        phone TEXT,
        city TEXT DEFAULT 'Mumbai',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 3. Creator Profiles Table
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        email TEXT NOT NULL,
        full_name TEXT NOT NULL,
        handle TEXT,
        niche TEXT DEFAULT 'Lifestyle & Tech',
        city TEXT DEFAULT 'Mumbai',
        followers_count INT DEFAULT 450000,
        engagement_rate NUMERIC(4,2) DEFAULT 4.8,
        verification_status TEXT DEFAULT 'approved',
        verified_at TIMESTAMPTZ DEFAULT now(),
        bio TEXT DEFAULT 'Creator managed by Onevoo Content Production OS',
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // Ensure columns exist on existing databases
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;`;
    await sql`ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;`;

    // 4. User Sessions Table (Persistent Tokens)
    await sql`
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 5. Public community events (shown on the opportunities page) with proof & expiration
    await sql`
      CREATE TABLE IF NOT EXISTS community_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        details TEXT NOT NULL,
        location TEXT NOT NULL,
        event_date DATE NOT NULL,
        event_time TEXT DEFAULT '18:00',
        category TEXT DEFAULT 'Creator Meetup',
        image_url TEXT,
        proof_url TEXT,
        proof_details TEXT,
        organizer_name TEXT DEFAULT 'Community Member',
        organizer_contact TEXT,
        edit_passcode TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // Ensure backwards compatibility with existing columns
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS event_time TEXT DEFAULT '18:00';`;
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Creator Meetup';`;
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS proof_url TEXT;`;
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS proof_details TEXT;`;
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS organizer_name TEXT DEFAULT 'Community Member';`;
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS organizer_contact TEXT;`;
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS edit_passcode TEXT;`;
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';`;
    await sql`ALTER TABLE community_events ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();`;

    // 5. Onevoo Deals Table
    await sql`
      CREATE TABLE IF NOT EXISTS onevoo_deals (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
        brand_name TEXT NOT NULL,
        campaign_title TEXT NOT NULL,
        deal_value NUMERIC(12,2) NOT NULL,
        status TEXT DEFAULT 'OPEN',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 6. Onevoo Milestones Table
    await sql`
      CREATE TABLE IF NOT EXISTS onevoo_milestones (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        deal_id UUID REFERENCES onevoo_deals(id) ON DELETE CASCADE,
        milestone_title TEXT NOT NULL,
        amount NUMERIC(12,2) NOT NULL,
        escrow_state TEXT DEFAULT 'PENDING_ESCROW',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // =========================================================================
    // v7 ENTERPRISE EXTENSIONS: GLOBAL SCALING, FACTORING, ESG & AI COMPLIANCE
    // =========================================================================

    // 7. FX Hedging Contracts Table
    await sql`
      CREATE TABLE IF NOT EXISTS currency_hedge_contracts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        deal_id UUID,
        deal_title TEXT DEFAULT 'Global Brand Campaign',
        base_currency TEXT NOT NULL DEFAULT 'USD',
        target_currency TEXT NOT NULL DEFAULT 'INR',
        base_amount NUMERIC(14,2) NOT NULL,
        locked_exchange_rate NUMERIC(12,6) NOT NULL,
        actual_rate_settlement NUMERIC(12,6),
        fx_buffer_applied NUMERIC(5,4) DEFAULT 0.0300,
        target_payout_val NUMERIC(14,2),
        buffer_refunded_brand NUMERIC(14,2) DEFAULT 0,
        residual_gain_loss NUMERIC(14,2) DEFAULT 0,
        escrow_settled BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 8. Currency Ledger Entries (Double-Entry Ledger)
    await sql`
      CREATE TABLE IF NOT EXISTS currency_ledger_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        hedge_contract_id UUID REFERENCES currency_hedge_contracts(id) ON DELETE CASCADE,
        account_name TEXT NOT NULL,
        debit_amount NUMERIC(14,4) NOT NULL DEFAULT 0,
        credit_amount NUMERIC(14,4) NOT NULL DEFAULT 0,
        currency TEXT NOT NULL,
        exchange_rate_applied NUMERIC(12,6) NOT NULL,
        entry_timestamp TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 9. Invoice Factoring Requests Table
    await sql`
      CREATE TABLE IF NOT EXISTS invoice_factoring_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        deal_id UUID,
        deal_title TEXT NOT NULL,
        creator_name TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        invoice_value NUMERIC(12,2) NOT NULL,
        factoring_fee_rate NUMERIC(4,4) DEFAULT 0.0500,
        disbursed_amount NUMERIC(12,2) NOT NULL,
        approval_risk_score INT NOT NULL,
        status TEXT DEFAULT 'APPROVED',
        payout_reference TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 10. AI Content QA & Safe-Zone Compliance Scans Table
    await sql`
      CREATE TABLE IF NOT EXISTS content_compliance_scans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        media_title TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        creator_name TEXT DEFAULT 'Tanvi Sharma',
        safe_zone_passed BOOLEAN DEFAULT TRUE,
        exclusivity_passed BOOLEAN DEFAULT TRUE,
        contrast_ratio NUMERIC(4,2) DEFAULT 5.2,
        compliance_score INT DEFAULT 98,
        flagged_competitors TEXT[],
        safe_zone_violations TEXT[],
        certificate_token TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 11. Enterprise ESG Carbon & Logistics Ledger Table
    await sql`
      CREATE TABLE IF NOT EXISTS esg_carbon_offsets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        production_title TEXT NOT NULL,
        creator_name TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        travel_km NUMERIC(10,2) DEFAULT 0,
        studio_hours NUMERIC(10,2) DEFAULT 0,
        heavy_lights_count INT DEFAULT 0,
        crew_count INT DEFAULT 0,
        shoot_days INT DEFAULT 1,
        total_carbon_kgs NUMERIC(10,2) NOT NULL,
        offset_cost_inr NUMERIC(10,2) NOT NULL,
        certificate_id TEXT NOT NULL,
        status TEXT DEFAULT 'CERTIFIED_GREEN',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 12. Multi-Party Arbitrated Dispute Cases Table
    await sql`
      CREATE TABLE IF NOT EXISTS escrow_dispute_cases (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        deal_title TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        creator_name TEXT NOT NULL,
        milestone_title TEXT NOT NULL,
        dispute_reason TEXT NOT NULL,
        proposed_refund_ratio NUMERIC(3,2) DEFAULT 0.50,
        escrow_amount NUMERIC(12,2) NOT NULL,
        creator_settlement NUMERIC(12,2),
        brand_refund NUMERIC(12,2),
        status TEXT DEFAULT 'OPENED',
        resolution_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 13. Brand Shoot Reel Submissions (Cloudinary CDN + Admin Approval Flow)
    await sql`
      CREATE TABLE IF NOT EXISTS reel_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        creator_name TEXT NOT NULL,
        creator_handle TEXT NOT NULL,
        creator_avatar TEXT,
        creator_email TEXT,
        city TEXT NOT NULL DEFAULT 'Mumbai',
        brand_name TEXT NOT NULL,
        title TEXT NOT NULL,
        caption TEXT NOT NULL,
        payout_display TEXT DEFAULT '₹85,000 Escrow Locked',
        video_url TEXT NOT NULL,
        cloudinary_public_id TEXT,
        thumbnail_url TEXT,
        status TEXT DEFAULT 'PENDING',
        rejection_reason TEXT,
        reviewed_by TEXT,
        reviewed_at TIMESTAMPTZ,
        views_count TEXT DEFAULT '34.2K',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 14. Persistent In-App & Push Notifications Table
    await sql`
      CREATE TABLE IF NOT EXISTS user_notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        user_email TEXT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'reel_status',
        status TEXT DEFAULT 'ACTIVE',
        badge_color TEXT DEFAULT 'var(--accent-purple)',
        reel_id UUID REFERENCES reel_submissions(id) ON DELETE CASCADE,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 15. Emergency Standby Crew Queue Table (v9 Extension)
    await sql`
      CREATE TABLE IF NOT EXISTS emergency_standby_crew (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name TEXT NOT NULL,
        role TEXT NOT NULL,
        city TEXT DEFAULT 'Mumbai',
        proximity_landmark TEXT DEFAULT 'Mehboob Studio (1.2 km away)',
        day_rate NUMERIC(10,2) NOT NULL,
        rating NUMERIC(3,2) DEFAULT 4.95,
        shoots_completed INT DEFAULT 48,
        on_call_today BOOLEAN DEFAULT TRUE,
        gear_spec TEXT NOT NULL,
        avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
        phone TEXT DEFAULT '+91 98200 45890',
        status TEXT DEFAULT 'AVAILABLE',
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 16. Conversion & ROI Attribution Matrix Table (v9 Core)
    await sql`
      CREATE TABLE IF NOT EXISTS campaign_conversion_attributions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        campaign_name TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        roas NUMERIC(4,2) NOT NULL,
        impressions TEXT DEFAULT '2.4M',
        conversions INT NOT NULL,
        conversion_value_inr NUMERIC(14,2) NOT NULL,
        studio_used TEXT NOT NULL,
        camera_gear TEXT NOT NULL,
        creator_name TEXT NOT NULL,
        take_rate_pct NUMERIC(4,2) DEFAULT 15.00,
        agency_profit_inr NUMERIC(12,2) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 17. Autonomous Dispute Arbitrage Records Table (v10 Core)
    await sql`
      CREATE TABLE IF NOT EXISTS dispute_records (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        deal_title TEXT NOT NULL,
        brand_name TEXT NOT NULL,
        creator_name TEXT NOT NULL,
        milestone_title TEXT NOT NULL,
        reason_text TEXT NOT NULL,
        active_version_number INT DEFAULT 2,
        comments_snapshot JSONB DEFAULT '{"revisions_requested": 4, "contract_limit": 2, "scope_creep_detected": true}'::jsonb,
        status TEXT DEFAULT 'OPEN',
        settlement_split_creator NUMERIC(5,2) DEFAULT 75.00,
        settlement_split_brand NUMERIC(5,2) DEFAULT 25.00,
        escrow_frozen_amount NUMERIC(12,2) NOT NULL DEFAULT 65000,
        created_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 19. Creator Verifications & KYC Registry (v13 Core)
    await sql`
      CREATE TABLE IF NOT EXISTS creator_verifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
        creator_email TEXT,
        creator_name TEXT,
        instagram_username TEXT,
        followers_count INT DEFAULT 0,
        engagement_rate NUMERIC(5,2) DEFAULT 0.00,
        media_count INT DEFAULT 0,
        legal_name_on_pan TEXT,
        pan_card_number_encrypted TEXT,
        aadhaar_number_masked VARCHAR(20),
        bank_account_number TEXT,
        ifsc_code TEXT,
        upi_id TEXT,
        selfie_url TEXT,
        kyc_state TEXT DEFAULT 'UNSUBMITTED',
        status TEXT DEFAULT 'NOT_LINKED',
        admin_approved_by TEXT,
        rejection_notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    // 20. Legally Binding Digital Signature Ledgers (v13 Core)
    await sql`
      CREATE TABLE IF NOT EXISTS legal_signature_ledgers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        verification_id UUID REFERENCES creator_verifications(id) ON DELETE CASCADE,
        creator_id UUID,
        creator_email TEXT,
        ip_address TEXT DEFAULT '127.0.0.1',
        user_agent TEXT,
        signature_vector_base64 TEXT NOT NULL,
        cryptographic_audit_seal TEXT UNIQUE NOT NULL,
        agreement_type VARCHAR(50) DEFAULT '5_YEAR_GROWTH',
        agreement_terms JSONB DEFAULT '{"term": "5-Year Exclusive", "escrow_protection": "100% Guaranteed", "brand_rev_share": "85/15"}'::jsonb,
        signed_at TIMESTAMPTZ DEFAULT now()
      );
    `;

    console.log('✅ Neon Database Tables verified/created successfully!');

    // 17. Seed Initial Emergency Standby Crew Members
    const existingCrew = await sql`SELECT id FROM emergency_standby_crew LIMIT 1;`;
    if (existingCrew.length === 0) {
      console.log('🌱 Seeding verified Emergency Standby Crew in Neon DB...');
      await sql`
        INSERT INTO emergency_standby_crew (
          full_name, role, city, proximity_landmark, day_rate, rating, shoots_completed, on_call_today, gear_spec, avatar_url, phone, status
        ) VALUES
        (
          'Vikram Aditya',
          'Lead Cinematographer (4K/120fps)',
          'Mumbai',
          'Mehboob Studio (0.8 km away)',
          18000,
          4.98,
          64,
          TRUE,
          'Sony FX3 Cinema Rig + GM 24-70 II + Ninja V+',
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
          '+91 98201 11223',
          'AVAILABLE'
        ),
        (
          'Devraj Kashyap',
          'Gaffer & Lighting Master',
          'Mumbai',
          'Bandra Soundstage (1.4 km away)',
          12500,
          4.92,
          52,
          TRUE,
          'Aputure 600d Pro + Nanlite Pavotube II 30X Kit + C-Stands',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
          '+91 98202 33445',
          'AVAILABLE'
        ),
        (
          'Ananya Deshmukh',
          'Celebrity & Commercial MUA Stylist',
          'Mumbai',
          'Khar D. Studio (2.1 km away)',
          15000,
          4.96,
          41,
          TRUE,
          'HD Pro Airbrush Rig + Organic Waterproof Kit',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
          '+91 98203 55667',
          'AVAILABLE'
        ),
        (
          'Sameer Qureshi',
          'Location Sound Recordist & Boom Op',
          'Mumbai',
          'Andheri West (3.0 km away)',
          11000,
          4.90,
          37,
          TRUE,
          'Sound Devices MixPre-6 II + Sennheiser MKH 416 + Tentacle Sync',
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&q=80',
          '+91 98204 77889',
          'AVAILABLE'
        );
      `;
    }

    // 18. Seed Initial Campaign Conversion Attributions
    const existingAttr = await sql`SELECT id FROM campaign_conversion_attributions LIMIT 1;`;
    if (existingAttr.length === 0) {
      console.log('🌱 Seeding campaign conversion attribution matrix in Neon DB...');
      await sql`
        INSERT INTO campaign_conversion_attributions (
          campaign_name, brand_name, roas, impressions, conversions, conversion_value_inr, studio_used, camera_gear, creator_name, take_rate_pct, agency_profit_inr
        ) VALUES
        ('Monsoon Glow Skincare Launch', 'Nykaa Beauty', 5.4, '3.2M', 8420, 4210000, 'Mehboob Soundstage A', 'Sony FX3 + 85mm F1.2 Macro', 'Tanvi Sharma', 15.0, 631500),
        ('Kinetic Summer Athletics', 'Nike Athletics', 6.2, '4.8M', 11950, 7170000, 'BKC Track & Light Grid', 'RED Komodo 6K + Cine Primes', 'Aman Sen', 18.0, 1290600),
        ('Royal Heritage Diamond Gala', 'Tanishq Jewelers', 4.8, '1.9M', 3420, 8550000, 'Varanasi Assi Ghats', 'Sony FX6 + Zeiss Supreme Primes', 'Neha Kapoor', 15.0, 1282500),
        ('Galaxy S26 Cinematic Story', 'Samsung Mobile', 5.8, '5.1M', 14200, 9940000, 'Soundstage Floor 4 Bandra', 'Samsung Ultra Rig + Master Gimbal', 'Tanvi Sharma', 16.5, 1640100);
      `;
    }

    // 19. Seed Default Verified Accounts & Initial Reel Submissions
    const existingUsers = await sql`SELECT id, email FROM users WHERE email IN ('creator@onevoo.com', 'admin@onevoo.com');`;
    let creatorUserId = null;
    
    // Seed Creator Account
    const creatorExists = existingUsers.some(u => u.email === 'creator@onevoo.com');
    if (!creatorExists) {
      console.log('🌱 Seeding initial verified creator accounts in Neon...');
      const defaultPasswordHash = await bcrypt.hash('OnevooCreator2026!', 10);
      
      const seededUser = await sql`
        INSERT INTO users (email, password_hash, full_name, role, verification_status, city)
        VALUES ('creator@onevoo.com', ${defaultPasswordHash}, 'Tanvi Sharma', 'creator', 'approved', 'Mumbai')
        RETURNING id, email, full_name;
      `;

      if (seededUser[0]) {
        creatorUserId = seededUser[0].id;
        await sql`
          INSERT INTO profiles (id, email, full_name, handle, niche, city, verification_status)
          VALUES (${seededUser[0].id}, 'creator@onevoo.com', 'Tanvi Sharma', '@tanvi.creates', 'Fashion & Lifestyle', 'Mumbai', 'approved');
        `;
      }
      console.log('✅ Default verified account seeded: creator@onevoo.com / OnevooCreator2026!');
    } else {
      creatorUserId = existingUsers.find(u => u.email === 'creator@onevoo.com')?.id;
    }

    // Seed Admin Account
    const adminExists = existingUsers.some(u => u.email === 'admin@onevoo.com');
    if (!adminExists) {
      console.log('🌱 Seeding administrative master account in Neon...');
      const adminPasswordHash = await bcrypt.hash('OnevooAdmin2026!', 10);
      
      const seededAdmin = await sql`
        INSERT INTO users (email, password_hash, full_name, role, verification_status, city)
        VALUES ('admin@onevoo.com', ${adminPasswordHash}, 'Onevoo Admin Operations', 'admin', 'approved', 'HQ Mumbai')
        RETURNING id, email, full_name;
      `;

      if (seededAdmin[0]) {
        await sql`
          INSERT INTO profiles (id, email, full_name, handle, niche, city, verification_status)
          VALUES (${seededAdmin[0].id}, 'admin@onevoo.com', 'Onevoo Admin Operations', '@onevoo.admin', 'Platform Governance & Escrow', 'HQ Mumbai', 'approved');
        `;
      }
      console.log('✅ Default Admin account seeded: admin@onevoo.com / OnevooAdmin2026!');
    }

    // Seed Sample Reels for Moderation & Featured Stories
    const existingReels = await sql`SELECT id FROM reel_submissions LIMIT 1;`;
    if (existingReels.length === 0) {
      console.log('🌱 Seeding initial Brand Shoot Reels in Neon DB...');
      await sql`
        INSERT INTO reel_submissions (
          user_id, creator_name, creator_handle, creator_avatar, creator_email, city, brand_name, title, caption, payout_display, video_url, thumbnail_url, status, views_count, reviewed_at
        ) VALUES 
        (
          ${creatorUserId},
          'Tanvi Sharma',
          'tanvi.creates',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
          'creator@onevoo.com',
          'Mumbai, Maharashtra',
          'Nykaa Beauty Launch',
          'Bandra Shoot Day! ☕ Mumbai',
          'Booked my 4K content shoot in Bandra with a certified DP via Onevoo! Payout already escrowed 📸✨',
          '₹85,000 Escrow Locked',
          'https://assets.mixkit.co/videos/preview/mixkit-vertical-portrait-of-a-fashion-model-in-studio-41315-large.mp4',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80',
          'APPROVED',
          '34.2K',
          now()
        ),
        (
          ${creatorUserId},
          'Arjun Mehra',
          'arjun.cinematics',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
          'arjun@onevoo.com',
          'Varanasi, Uttar Pradesh',
          'Incredible India / Sony Alpha',
          'Sunrise at Assi Ghat 🌅 Varanasi',
          'Cinematic 4K 120fps Ganga Aarti shoot locked with Onevoo gear packages! Absolute spiritual magic.',
          '₹1,40,000 Escrow Locked',
          'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-leather-jacket-vertical-41313-large.mp4',
          'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=80',
          'APPROVED',
          '58.9K',
          now()
        ),
        (
          ${creatorUserId},
          'Rhea Kapoor',
          'rhea.studio',
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80',
          'rhea@onevoo.com',
          'Bengaluru, Karnataka',
          'Zara Streetwear Retainer',
          'Indiranagar Street Style ⚡ BLR',
          'Shot an entire 9:16 vertical runway drop on 85mm f/1.4 lens. Instant safe-zone QA verified!',
          '₹95,000 Escrow Locked',
          'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-a-fashion-photo-session-vertical-41316-large.mp4',
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80',
          'PENDING',
          '12.4K',
          null
        );
      `;
      console.log('✅ Initial Brand Shoot Reels seeded successfully!');
    }

    // Seed Sample Creator Verifications & Digital Signature Ledgers (v13)
    const existingVerifications = await sql`SELECT id FROM creator_verifications LIMIT 1;`;
    if (existingVerifications.length === 0) {
      console.log('🌱 Seeding verified and pending Creator Verifications in Neon DB...');
      const seededVerif = await sql`
        INSERT INTO creator_verifications (
          creator_id, creator_email, creator_name, instagram_username, followers_count, engagement_rate, media_count,
          legal_name_on_pan, pan_card_number_encrypted, aadhaar_number_masked, bank_account_number, ifsc_code, upi_id,
          kyc_state, status, created_at, updated_at
        ) VALUES
        (
          ${creatorUserId},
          'creator@onevoo.com',
          'Tanvi Sharma',
          'tanvi.creates',
          485000,
          4.85,
          142,
          'Tanvi Ramesh Sharma',
          'ABCDE1234F',
          'XXXX-XXXX-8921',
          '918273645012',
          'HDFC0001234',
          'tanvi@okaxis',
          'PENDING_MATCH',
          'PENDING_MATCH',
          now(),
          now()
        ),
        (
          null,
          'kabir.cinema@gmail.com',
          'Kabir Sengupta',
          'kabir.visuals',
          89400,
          5.12,
          98,
          'Kabir Sengupta',
          'BCDEF5678G',
          'XXXX-XXXX-4532',
          '543216789012',
          'ICIC0000987',
          'kabir@okhdfcbank',
          'PENDING_MATCH',
          'PENDING_MATCH',
          now(),
          now()
        )
        RETURNING id, creator_email;
      `;

      if (seededVerif[0]) {
        await sql`
          INSERT INTO legal_signature_ledgers (
            verification_id, creator_email, ip_address, user_agent, signature_vector_base64,
            cryptographic_audit_seal, agreement_type, agreement_terms
          ) VALUES
          (
            ${seededVerif[0].id},
            'creator@onevoo.com',
            '103.21.144.22',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMzAiPjxwYXRoIGQ9Ik0xMCAxNSBDMjAgNSAzNSAzMCA1MCAxNSBDNjUgNSA4MCAyNSA5MCAxNSIgc3Ryb2tlPSIjZGZiNjQwIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',
            '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
            '5_YEAR_EXCLUSIVE_BOND',
            '{"escrow_guaranteed": true, "term": "5-Year Content Growth", "payout_protection": "Section 194J Compliant"}'::jsonb
          );
        `;
      }
      console.log('✅ Initial Creator Verifications & Digital Signature Ledgers seeded successfully!');
    }

    return true;
  } catch (err) {
    console.error('❌ Error initializing Neon database:', err);
    throw err;
  }
}
