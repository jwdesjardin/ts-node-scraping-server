export interface GameSummary {
  scoring_summary: Period[]
  penalty_summary: Period[]
  home_team_scoring: SkaterGameStat[]
  home_team_goalies: GoalieGameStat[]
  away_team_scoring: SkaterGameStat[]
  away_team_goalies: GoalieGameStat[]
  box_score: BoxScore
}

// scoring and goalies
export interface SkaterGameStat {
  player: string
  player_id: string
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
  shifts: number
  time_on_ice: number
}
export interface GoalieGameStat {
  player: string
  player_id: string
  decision: string
  goals_against: number
  shots_against: number
  saves: number
  save_percentage: number
  shutouts: number
}

// boxscore
export interface BoxScore {
  game_details: GameDetails
  home_scoring_total: TeamBoxScore
  away_scoring_total: TeamBoxScore
}
export interface GameDetails {
  date: string
  time: string
  arena: string
  attendance: number
  home_team_id: string
  away_team_id: string
}

export interface TeamBoxScore {
  goals: number
  assists: number
  points: number
  penalty_minutes: number
  ev_goals: number
  pp_goals: number
  sh_goals: number
  shots_on_goal: number
  shooting_percentage: number
}

// types for scoring and penalty summaries
export interface Period {
  title: string
  penalties?: Penalty[]
  goals?: Goal[]
  so_attempts?: SO_Attempt[]
}
export interface Goal {
  time: string
  team_id: string
  power_play: string
  scorer: string
  scorer_id: string
  count: number
  assists: {
    name: string
    player_id: string
  }[]
}
export interface SO_Attempt {
  shot_number: number
  team_id: string
  scorer: string
  scorer_id: string
  success: boolean
  goalie: string
  goalie_id: string
}
export interface Penalty {
  time: string
  team_id: string
  player: string
  player_id: string
  type: string
  duration: number
}
