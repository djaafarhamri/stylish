-- Add a new temporary column
ALTER TABLE "ProductVariant" ADD COLUMN "size_new" TEXT;

-- Copy data from old enum column to the new column
UPDATE "ProductVariant" SET "size_new" = size::TEXT;

-- Drop the old enum column
ALTER TABLE "ProductVariant" DROP COLUMN "size";

-- Rename the new column to the original name
ALTER TABLE "ProductVariant" RENAME COLUMN "size_new" TO "size";
