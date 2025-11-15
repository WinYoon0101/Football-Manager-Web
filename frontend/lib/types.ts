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
  matchTime: string | Date;
  stadium?: string | null;

  // Quan hệ
  round?: Round;
  team1?: Team;
  team2?: Team;
  goals?: Goal[];
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

