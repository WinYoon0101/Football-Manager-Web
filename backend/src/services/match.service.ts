import prisma from "../config/prisma";

// Types for match results
interface MatchResult {
  matchId: number;
  match: {
    id: number;
    matchTime: Date | string;
    stadium: string | null;
    round: {
      id: number;
      name: string;
    };
    team1: {
      id: number;
      name: string;
      image: string | null;
    };
    team2: {
      id: number;
      name: string;
      image: string | null;
    };
  };
  team1Goals: number;
  team2Goals: number;
  winner: "team1" | "team2" | "draw";
  goals: Array<{
    id: number;
    minute: number;
    team: {
      id: number;
      name: string;
    };
    player: {
      id: number;
      name: string;
      image: string | null;
    };
    goalType: {
      id: number;
      name: string;
    };
  }>;
}

interface StandingTeam {
  team: {
    id: number;
    name: string;
    image: string | null;
  };
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

class MatchService {
  private buildSeasonFilter(seasonName?: string) {
    if (!seasonName) return undefined;

    return {
      round: {
        name: {
          contains: seasonName,
          mode: "insensitive" as const,
        },
      },
    };
  }

  private async getSeasonTeamIds(
    seasonId?: number
  ): Promise<number[] | undefined> {
    if (!seasonId) return undefined;

    const rankings = await prisma.ranking.findMany({
      where: { seasonId },
      select: { teamId: true },
    });

    if (rankings.length === 0) {
      return [];
    }

    const uniqueIds = Array.from(new Set(rankings.map((entry) => entry.teamId)));
    return uniqueIds;
  }

  // Lấy tất cả matches
  async getAll() {
    return prisma.match.findMany({
      include: {
        round: true,
        team1: true,
        team2: true,
        goals: {
          include: {
            player: true,
            goalType: true,
          },
        },
      },
      orderBy: {
        matchTime: "desc",
      },
    });
  }

  async getResultsBySeason(seasonId: number) {
  const matches = await prisma.match.findMany({
    where: { seasonId },
    include: {
      round: true,
      team1: true,
      team2: true,
      goals: {
        include: {
          team: true,
          player: {
            select: { id: true, name: true, image: true },
          },
          goalType: true,
        },
        orderBy: { minute: "asc" },
      },
    },
    orderBy: { matchTime: "asc" },
  });

  return matches.map((m) => this.calculateMatchResult(m));
}



// Lấy trận đấu theo mùa
async getBySeason(seasonId: number) {
  return prisma.match.findMany({
    where: { seasonId },
    include: {
      round: true,
      team1: true,
      team2: true,
      goals: {
        include: {
          player: true,
          goalType: true,
          team: true,
        },
      },
    },
    orderBy: { matchTime: "asc" },
  });
}






  // Lấy 1 match theo id
  async getById(id: number) {
    return prisma.match.findUnique({
      where: { id },
      include: {
        round: true,
        team1: true,
        team2: true,
        goals: {
          include: {
            player: true,
            goalType: true,
          },
        },
      },
    });
  }


 // Tạo match mới (CÓ season)
async create(data: {
  roundId: number;
  team1Id: number;
  team2Id: number;
  matchTime: Date;
  stadium?: string | null;
  seasonId: number;
}) {
  return prisma.match.create({
    data: {
      roundId: data.roundId,
      team1Id: data.team1Id,
      team2Id: data.team2Id,
      matchTime: data.matchTime,
      stadium: data.stadium ?? null,
      seasonId: data.seasonId, 
    },
    include: {
      round: true,
      team1: true,
      team2: true,
      goals: {
        include: {
          player: true,
          goalType: true,
        },
      },
    },
  });
}


  // Cập nhật match
  async update(id: number, data: any) {
    return prisma.match.update({
      where: { id },
      data,
      include: {
        round: true,
        team1: true,
        team2: true,
        goals: {
          include: {
            player: true,
            goalType: true,
          },
        },
      },
    });
  }

  // Xóa match
  async delete(id: number) {
    return prisma.match.delete({
      where: { id },
    });
  }

  // Lấy tất cả rounds
  async getRounds() {
    return prisma.round.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }

  // ===== RESULT METHODS =====

  // Lấy kết quả tất cả trận đấu
  async getAllResults(options: {
    seasonName?: string;
    seasonId?: number;
  } = {}) {
    const { seasonName, seasonId } = options;

    const seasonFilter = this.buildSeasonFilter(seasonName);
    const seasonTeamIds = await this.getSeasonTeamIds(seasonId);

    if (seasonId && (!seasonTeamIds || seasonTeamIds.length === 0)) {
      return [];
    }

    const matches = await prisma.match.findMany({
      where:
        seasonTeamIds && seasonTeamIds.length > 0
          ? {
              team1Id: { in: seasonTeamIds },
              team2Id: { in: seasonTeamIds },
            }
          : seasonFilter,
      include: {
        round: true,
        team1: true,
        team2: true,
        goals: {
          include: {
            team: true,
            player: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            goalType: true,
          },
          orderBy: {
            minute: "asc",
          },
        },
      },
      orderBy: {
        matchTime: "desc",
      },
    });

    return matches.map((match) => this.calculateMatchResult(match));
  }

  // Lấy kết quả 1 trận đấu theo id
  async getResultById(matchId: number) {
    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        round: true,
        team1: true,
        team2: true,
        goals: {
          include: {
            team: true,
            player: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            goalType: true,
          },
          orderBy: {
            minute: "asc",
          },
        },
      },
    });

    if (!match) {
      return null;
    }

    return this.calculateMatchResult(match);
  }

  // Lấy kết quả theo vòng đấu
  async getResultsByRound(roundId: number) {
    const matches = await prisma.match.findMany({
      where: { roundId },
      include: {
        round: true,
        team1: true,
        team2: true,
        goals: {
          include: {
            team: true,
            player: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            goalType: true,
          },
          orderBy: {
            minute: "asc",
          },
        },
      },
      orderBy: {
        matchTime: "asc",
      },
    });

    return matches.map((match) => this.calculateMatchResult(match));
  }

  // Lấy kết quả theo đội
  async getResultsByTeam(teamId: number) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ team1Id: teamId }, { team2Id: teamId }],
      },
      include: {
        round: true,
        team1: true,
        team2: true,
        goals: {
          include: {
            team: true,
            player: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            goalType: true,
          },
          orderBy: {
            minute: "asc",
          },
        },
      },
      orderBy: {
        matchTime: "desc",
      },
    });

    return matches.map((match) => this.calculateMatchResult(match));
  }

  // Lấy bảng xếp hạng
  async getStandings(options: {
    seasonName?: string;
    seasonId?: number;
  } = {}): Promise<StandingTeam[]> {
    const { seasonName, seasonId } = options;
    const seasonFilter = this.buildSeasonFilter(seasonName);
    const seasonTeamIds = await this.getSeasonTeamIds(seasonId);

    if (seasonId && (!seasonTeamIds || seasonTeamIds.length === 0)) {
      return [];
    }

    const matchesAsTeam1Where =
      seasonTeamIds && seasonTeamIds.length > 0
        ? {
            team2Id: { in: seasonTeamIds },
          }
        : seasonFilter;

    const matchesAsTeam2Where =
      seasonTeamIds && seasonTeamIds.length > 0
        ? {
            team1Id: { in: seasonTeamIds },
          }
        : seasonFilter;

    const teams = await prisma.team.findMany({
      where:
        seasonTeamIds && seasonTeamIds.length > 0
          ? {
              id: { in: seasonTeamIds },
            }
          : undefined,
      include: {
        matchesAsTeam1: {
          where: matchesAsTeam1Where,
          include: {
            goals: true,
            round: true,
          },
        },
        matchesAsTeam2: {
          where: matchesAsTeam2Where,
          include: {
            goals: true,
            round: true,
          },
        },
      },
    });

    const standings = teams.map((team) => {
      let played = 0;
      let won = 0;
      let drawn = 0;
      let lost = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      // Tính toán từ trận đấu làm team1
      team.matchesAsTeam1.forEach((match) => {
        played++;
        const team1Goals = match.goals.filter(
          (g) => g.teamId === team.id
        ).length;
        const team2Goals = match.goals.filter(
          (g) => g.teamId !== team.id
        ).length;

        goalsFor += team1Goals;
        goalsAgainst += team2Goals;

        if (team1Goals > team2Goals) won++;
        else if (team1Goals === team2Goals) drawn++;
        else lost++;
      });

      // Tính toán từ trận đấu làm team2
      team.matchesAsTeam2.forEach((match) => {
        played++;
        const team2Goals = match.goals.filter(
          (g) => g.teamId === team.id
        ).length;
        const team1Goals = match.goals.filter(
          (g) => g.teamId !== team.id
        ).length;

        goalsFor += team2Goals;
        goalsAgainst += team1Goals;

        if (team2Goals > team1Goals) won++;
        else if (team2Goals === team1Goals) drawn++;
        else lost++;
      });

      const goalDifference = goalsFor - goalsAgainst;
      const points = won * 3 + drawn * 1;

      return {
        team: {
          id: team.id,
          name: team.name,
          image: team.image,
        },
        played,
        won,
        drawn,
        lost,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
      };
    });

    // Sắp xếp theo điểm số, hiệu số, bàn thắng
    return standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference)
        return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });
  }

  // Tính toán kết quả trận đấu
  private calculateMatchResult(match: any): MatchResult {
    const team1Goals = match.goals.filter(
      (goal: any) => goal.teamId === match.team1Id
    ).length;
    const team2Goals = match.goals.filter(
      (goal: any) => goal.teamId === match.team2Id
    ).length;

    let winner: "team1" | "team2" | "draw";
    if (team1Goals > team2Goals) winner = "team1";
    else if (team2Goals > team1Goals) winner = "team2";
    else winner = "draw";

    return {
      matchId: match.id,
      match: {
        id: match.id,
        matchTime: match.matchTime,
        stadium: match.stadium,
        round: match.round,
        team1: {
          id: match.team1.id,
          name: match.team1.name,
          image: match.team1.image,
        },
        team2: {
          id: match.team2.id,
          name: match.team2.name,
          image: match.team2.image,
        },
      },
      team1Goals,
      team2Goals,
      winner,
      goals: match.goals.map((goal: any) => ({
        id: goal.id,
        minute: goal.minute,
        team: {
          id: goal.team.id,
          name: goal.team.name,
        },
        player: {
          id: goal.player.id,
          name: goal.player.name,
          image: goal.player.image,
        },
        goalType: {
          id: goal.goalType.id,
          name: goal.goalType.name,
        },
      })),
    };
  }
}

export default new MatchService();
