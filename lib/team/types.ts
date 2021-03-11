export interface Team {
  rosterStats: RosterStat[]
  skaterStats: SkaterScoringStat[]
  goalieStats: GoalieScoringStat[]
}

export interface RosterStat {
  number: number
  player: string
  player_id: string
  country: string
  position: string
  age: number
  height: string
  weight: number
  shoots: string
  experience: number
  salary: number | null
  draft: {
    year: number | null
    team_id: string | null
    round: number | null
    overall: number | null
  }
}

export interface SkaterScoringStat {
  player: string
  player_id: string
  age: number
  team_id: string
  position: string
  games_played: number
  goals: number
  assists: number
  points: number
  plus_minus: number
  penalty_minutes: number
  ev_goals: number
  sh_goals: number
  pp_goals: number
  gw_goals: number
  shots_on_goal: number
  shooting_percentage: number
  time_on_ice: number
  average_time_on_ice: string
  blocks: number
  hits: number
  faceoff_wins: number
  faceoff_losses: number
  faceoff_percentage: number
}

export interface GoalieScoringStat {
  player: string
  player_id: string
  age: number
  team_id: string
  position: string
  games_played: number
  games_started: number
  wins: number
  losses: number
  ot_losses: number
  goals_against: number
  shots_against: number
  saves: number
  save_percentage: number
  goals_against_average: number
  shutouts: number
}
