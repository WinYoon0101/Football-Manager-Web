export interface Team {
  id: number;
  name: string;
  homeStadium?: string | null;
  playerCount?: number | null;
  image?: string | null;
  players?: Player[];
}

export interface PlayerType {
  id: number;
  name: string;
}

export interface Player {
  id: number;
  teamId: number;
  name: string;
  birthDate?: string | Date | null;
  playerTypeId: number;
  notes?: string | null;
  image?: string | null;
  team?: Team;
  playerType?: PlayerType;
}

export interface Season {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
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

export interface SeasonRanking {
  id: number;
  seasonId: number;
  teamId: number;
  win: number;
  lose: number;
  draw: number;
  points: number;
  goalDifference: number;
  team: {
    id: number;
    name: string;
    image: string | null;
  };
  season: {
    id: number;
    name: string;
  };
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

export interface GoalType {
  id: number;
  name: string;

  goals?: Goal[];
}