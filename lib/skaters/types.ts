export interface SkaterScoringStat {
	_id: number
	player: string
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