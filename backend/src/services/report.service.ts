import prisma from "../config/prisma";

interface TeamStats {
  team: {
    id: number;
    name: string;
    homeStadium: string | null;
    playerCount: number | null;
    image: string | null;
  };
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  totalPlayers: number;
  domesticPlayers: number;
  foreignPlayers: number;
}

interface PlayerStats {
  player: {
    id: number;
    name: string;
    image: string | null;
  };
  team: {
    id: number;
    name: string;
    image: string | null;
  };
  goals: number;
  matches: number;
}

class ReportService {
  private async getSeasonTeamIds(seasonId?: number): Promise<number[] | undefined> {
    if (!seasonId) return undefined;

    const rankingEntries = await prisma.ranking.findMany({
      where: { seasonId },
      select: { teamId: true },
    });

    return rankingEntries.map((entry) => entry.teamId);
  }

  // Lấy thống kê đội bóng
  async getTeamStats(seasonId?: number): Promise<TeamStats[]> {
    const seasonTeamIds = await this.getSeasonTeamIds(seasonId);

    if (seasonId && (!seasonTeamIds || seasonTeamIds.length === 0)) {
      return [];
    }

    const teams = await prisma.team.findMany({
      where:
        seasonTeamIds && seasonTeamIds.length > 0
          ? {
              id: {
                in: seasonTeamIds,
              },
            }
          : undefined,
      include: {
        players: {
          include: {
            playerType: true,
          },
        },
        matchesAsTeam1: {
          where:
            seasonTeamIds && seasonTeamIds.length > 0
              ? {
                  team2Id: {
                    in: seasonTeamIds,
                  },
                }
              : undefined,
          include: {
            goals: true,
            round: true,
          },
        },
        matchesAsTeam2: {
          where:
            seasonTeamIds && seasonTeamIds.length > 0
              ? {
                  team1Id: {
                    in: seasonTeamIds,
                  },
                }
              : undefined,
          include: {
            goals: true,
            round: true,
          },
        },
      },
    });

    return teams.map((team) => {
      // Tính toán các trận đấu
      const allMatches = [
        ...team.matchesAsTeam1.map((m) => ({
          ...m,
          isTeam1: true,
        })),
        ...team.matchesAsTeam2.map((m) => ({
          ...m,
          isTeam1: false,
        })),
      ];

      // Tính toán kết quả
      let wins = 0;
      let draws = 0;
      let losses = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      allMatches.forEach((match) => {
        const team1Goals = match.goals.filter((g) => g.teamId === match.team1Id)
          .length;
        const team2Goals = match.goals.filter((g) => g.teamId === match.team2Id)
          .length;

        if (match.isTeam1) {
          goalsFor += team1Goals;
          goalsAgainst += team2Goals;

          if (team1Goals > team2Goals) wins++;
          else if (team1Goals === team2Goals) draws++;
          else losses++;
        } else {
          goalsFor += team2Goals;
          goalsAgainst += team1Goals;

          if (team2Goals > team1Goals) wins++;
          else if (team2Goals === team1Goals) draws++;
          else losses++;
        }
      });

      // Tính số cầu thủ
      const totalPlayers = team.players.length;
      const domesticPlayers = team.players.filter(
        (p) => p.playerType.name === "domestic"
      ).length;
      const foreignPlayers = team.players.filter(
        (p) => p.playerType.name === "foreign"
      ).length;

      return {
        team: {
          id: team.id,
          name: team.name,
          homeStadium: team.homeStadium,
          playerCount: team.playerCount,
          image: team.image,
        },
        totalMatches: allMatches.length,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        totalPlayers,
        domesticPlayers,
        foreignPlayers,
      };
    });
  }

  // Lấy thống kê cầu thủ (top scorers)
  async getPlayerStats(seasonId?: number): Promise<PlayerStats[]> {
    const seasonTeamIds = await this.getSeasonTeamIds(seasonId);

    if (seasonId && (!seasonTeamIds || seasonTeamIds.length === 0)) {
      return [];
    }

    const players = await prisma.player.findMany({
      where:
        seasonTeamIds && seasonTeamIds.length > 0
          ? {
              teamId: {
                in: seasonTeamIds,
              },
            }
          : undefined,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        goals: {
          where:
            seasonTeamIds && seasonTeamIds.length > 0
              ? {
                  match: {
                    OR: [
                      {
                        team1Id: {
                          in: seasonTeamIds,
                        },
                      },
                      {
                        team2Id: {
                          in: seasonTeamIds,
                        },
                      },
                    ],
                  },
                }
              : undefined,
          include: {
            match: {
              include: {
                round: true,
              },
            },
          },
        },
      },
    });

    // Tính số bàn thắng và số trận đấu cho mỗi cầu thủ
    const playerStatsMap = new Map<
      number,
      {
        player: {
          id: number;
          name: string;
          image: string | null;
        };
        team: {
          id: number;
          name: string;
          image: string | null;
        };
        goals: number;
        matchIds: Set<number>;
      }
    >();

    players.forEach((player) => {
      const goals = player.goals.length;
      const matchIds = new Set(player.goals.map((g) => g.matchId));

      playerStatsMap.set(player.id, {
        player: {
          id: player.id,
          name: player.name,
          image: player.image,
        },
        team: {
          id: player.team.id,
          name: player.team.name,
          image: player.team.image,
        },
        goals,
        matchIds,
      });
    });

    // Chuyển đổi map thành array và tính số trận đấu
    return Array.from(playerStatsMap.values())
      .map((stat) => ({
        player: stat.player,
        team: stat.team,
        goals: stat.goals,
        matches: stat.matchIds.size,
      }))
      .filter((stat) => stat.goals > 0) // Chỉ lấy cầu thủ có ghi bàn
      .sort((a, b) => b.goals - a.goals); // Sắp xếp theo số bàn thắng giảm dần
  }
}

export default new ReportService();

