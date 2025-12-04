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



