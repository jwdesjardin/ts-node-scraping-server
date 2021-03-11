export interface TeamSeasonStats {
  _id: number
  name: string
  team_id: string
  games: number
  wins: number
  losses: number
  losses_ot: number
  points: number
  points_pct: number
}

export interface Conference {
  name: string
  teams: TeamSeasonStats[]
}
