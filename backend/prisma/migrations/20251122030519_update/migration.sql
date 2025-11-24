/*
  Warnings:

  - Made the column `seasonId` on table `matches` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "application" DROP CONSTRAINT "application_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "application" DROP CONSTRAINT "application_teamId_fkey";

-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_matchId_fkey";

-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_playerId_fkey";

-- DropForeignKey
ALTER TABLE "goals" DROP CONSTRAINT "goals_teamId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_team1Id_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_team2Id_fkey";

-- DropForeignKey
ALTER TABLE "players" DROP CONSTRAINT "players_teamId_fkey";

-- DropForeignKey
ALTER TABLE "ranking" DROP CONSTRAINT "ranking_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "ranking" DROP CONSTRAINT "ranking_teamId_fkey";

-- AlterTable
ALTER TABLE "matches" ALTER COLUMN "seasonId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking" ADD CONSTRAINT "ranking_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "season"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ranking" ADD CONSTRAINT "ranking_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
