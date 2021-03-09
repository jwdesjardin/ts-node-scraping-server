export interface Game {
  id: number
	date: Date
  home_team: string
  home_goals: number
  away_team: string
  away_goals: number
  overtime: string
  attendance: number
  length_of_game: string
  notes: string
}