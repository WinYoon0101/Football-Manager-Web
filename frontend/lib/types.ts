// Championship Management System Types

export interface Team {
  id: number;
  name: string;
  homeStadium?: string | null;
  playerCount?: number | null;
  image?: string | null;

  // Quan hệ (optional để tránh lỗi)
  players?: Player[];
  matchesAsTeam1?: Match[];
  matchesAsTeam2?: Match[];
  goals?: Goal[];
}

export interface PlayerType {
  id: number;
  name: string;

  players?: Player[];
}

export interface Player {
  id: number;
  teamId: number;
  name: string;
  birthDate?: string | Date | null;
  playerTypeId: number;
  notes?: string | null;
  image?: string | null;

  // Quan hệ
  team?: Team;
  playerType?: PlayerType;
  goals?: Goal[];
}

export interface Round {
  id: number;
  name: string;

  matches?: Match[];
}

export interface Match {
  id: number;
  roundId: number;
  team1Id: number;
  team2Id: number;
  seasonId?: number;
  matchTime: string | Date;
  stadium?: string | null;

  // Quan hệ
  round?: Round;
  team1?: Team;
  team2?: Team;
  goals?: Goal[];
}

export interface MatchResult {
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

export interface GoalType {
  id: number;
  name: string;

  goals?: Goal[];
}

export interface Goal {
  id: number;
  matchId: number;
  teamId: number;
  playerId: number;
  goalTypeId: number;
  minute: number;

  match?: Match;
  team?: Team;
  player?: Player;
  goalType?: GoalType;
}

export interface Parameter {
  id: number;
  minAge?: number | null;
  maxAge?: number | null;
  minPlayers?: number | null;
  maxPlayers?: number | null;
  maxForeignPlayers?: number | null;
  minGoalMinute?: number | null;
  maxGoalMinute?: number | null;
}

// Additional types for Match Results
export interface MatchResult {
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

export interface StandingTeam {
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
