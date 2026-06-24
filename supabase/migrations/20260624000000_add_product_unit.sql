-- Add 'unit' column to the products table to support unit management (pcs, kg, liters, etc.)
ALTER TABLE "public"."products"
ADD COLUMN "unit" text DEFAULT 'pcs';
