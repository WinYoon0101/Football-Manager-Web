-- AlterTable
ALTER TABLE "matches" ADD COLUMN     "seasonId" INTEGER,
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "parameters" ALTER COLUMN "categorySort" SET DEFAULT ARRAY['điểm', 'hiệu_số', 'bàn_thắng', 'đối_kháng']::TEXT[];

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE SET NULL ON UPDATE CASCADE;
