export interface Team {
	_id: number,
	name: string,
	games: string,
	wins: string,
	losses: string,
	losses_ot: string,
	points: string,
	points_pct: string
}

export interface Conference {
	name: string
	teams: Team[]
}