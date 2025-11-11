import type { Team, Match, Standing, Regulation } from "@/lib/types"

export function generateSchedule(teams: Team[], rounds = 2): Match[] {
  const matches: Match[] = []
  let matchId = 1

  for (let round = 1; round <= rounds; round++) {
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        if (round === 1) {
          matches.push({
            id: `match-auto-${matchId++}`,
            homeTeamId: teams[i].id,
            awayTeamId: teams[j].id,
            round: 1 as const,
            homeScore: 0,
            awayScore: 0,
            goals: [],
            status: "scheduled",
          })
        } else {
          matches.push({
            id: `match-auto-${matchId++}`,
            homeTeamId: teams[j].id,
            awayTeamId: teams[i].id,
            round: 2 as const,
            homeScore: 0,
            awayScore: 0,
            goals: [],
            status: "scheduled",
          })
        }
      }
    }
  }

  return matches
}

export function calculateStandings(teams: Team[], matches: Match[], regulation: Regulation): Standing[] {
  const standings: { [key: string]: Standing } = {}

  teams.forEach((team) => {
    standings[team.id] = {
      teamId: team.id,
      teamName: team.name,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    }
  })

  matches
    .filter((m) => m.status === "completed")
    .forEach((match) => {
      const home = standings[match.homeTeamId]
      const away = standings[match.awayTeamId]

      home.played++
      away.played++
      home.goalsFor += match.homeScore
      home.goalsAgainst += match.awayScore
      away.goalsFor += match.awayScore
      away.goalsAgainst += match.homeScore

      if (match.homeScore > match.awayScore) {
        home.wins++
        home.points += regulation.winPoints
        away.losses++
        away.points += regulation.lossPoints
      } else if (match.awayScore > match.homeScore) {
        away.wins++
        away.points += regulation.winPoints
        home.losses++
        home.points += regulation.lossPoints
      } else {
        home.draws++
        away.draws++
        home.points += regulation.drawPoints
        away.points += regulation.drawPoints
      }
    })

  return Object.values(standings).sort((a, b) => {
    // Sort by ranking priority
    for (const priority of regulation.rankingPriority) {
      if (priority === "points" && a.points !== b.points) return b.points - a.points
      if (priority === "goalDiff") {
        const aDiff = a.goalsFor - a.goalsAgainst
        const bDiff = b.goalsFor - b.goalsAgainst
        if (aDiff !== bDiff) return bDiff - aDiff
      }
      if (priority === "goalsFor" && a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor
      if (priority === "awayGoals") {
        // Calculate away goals - would need match details
        if (a.goalsFor !== b.goalsFor) return b.goalsFor - a.goalsFor
      }
    }
    return 0
  })
}
