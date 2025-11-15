// Championship Management System Types

export type PlayerType = "domestic" | "foreign"

export interface Regulation {
  id: string
  name: string
  minAge: number
  maxAge: number
  minPlayers: number
  maxPlayers: number
  maxForeignPlayers: number
  goalTypes: number // Changed from string[] to number for count
  matchDuration: number // Added match duration field
  winPoints: number
  drawPoints: number
  lossPoints: number
  rankingPriority: string[] // ['points', 'goalDiff', 'goalsFor', 'awayGoals', 'headToHead']
  isDefault?: boolean // Added default flag
}

export interface Player {
  id: string
  name: string
  age?: number
  type?: PlayerType
  teamId?: string
  jerseyNumber: number
  position?: string
  goals?: number
  assists?: number
  yellowCards?: number
  redCards?: number
  avatar?: string
  bio?: string
  matchHistory?: MatchHistory[]
  number?: number // Alias for jerseyNumber
  image?: string // Alias for avatar
  birthDate?: string // Added birth date field
}

export interface MatchHistory {
  id: string
  date: string
  opponent: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
  minutesPlayed: number
}

export interface Goal {
  id: string
  matchId: string
  scorerId: string
  teamId: string
  goalType: "A" | "B" | "C"
  minute: number
}

export interface Foul {
  id: string
  matchId: string
  playerId: string
  teamId: string
  foulType: "yellow" | "red"
  minute: number
  description?: string
}

export interface Team {
  logo: any
  id: string
  name: string
  city: string
  players: Player[]
}

export interface Match {
  id: string
  seasonId?: string
  homeTeamId: string
  awayTeamId: string
  homeTeam?: string
  awayTeam?: string
  round: number
  homeScore?: number
  awayScore?: number
  goals: Goal[]
  fouls?: Foul[] // Added fouls array to track cards
  status: "scheduled" | "completed"
  date: string
  time?: string
  venue?: string
}

export interface Standing {
  teamId: string
  teamName: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

export interface Season {
  id: string
  name: string
  status: "not-started" | "ongoing" | "completed"
  startDate: string
  endDate: string
  teamCount?: number
  maxTeams?: number // Added max teams field for season capacity
  regulationId?: string // Added regulation reference
  teams?: string[]
  registrations: TeamRegistration[]
}

export interface TeamRegistration {
  id: string
  seasonId: string
  teamId: string
  teamName: string
  submittedDate: string
  status: "pending" | "approved" | "rejected"
}

export interface MatchDetail extends Match {
  venue?: string
  referee?: string
  attendance?: number
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "viewer"
  avatar?: string
  createdAt: string
  username: string
}
