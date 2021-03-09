import axios from 'axios';
import cheerio from 'cheerio';

interface SkaterScoringStat {
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

export const getSkatersScoring = async () => {
	// initialize an array of skaters to return 
	const skatersScoring:  SkaterScoringStat[] = [];

	try {
		// load the skaters scoring page and access DOM with cheerio
		const { data } = await axios.get(
			`https://www.hockey-reference.com/leagues/NHL_2021_skaters.html#stats::goals`
		);
		const $ = cheerio.load(data);

		// access the stats table and loop through all rows
		const table = $('tbody', '#stats');

		$('tr', table).each((_idx, row) => {
			let skater:  SkaterScoringStat = {
				_id: _idx,
				player: $('td[data-stat="player"]', row).text(),
				age: parseInt($('td[data-stat="age"]', row).text()),
				team_id: $('td[data-stat="team_id"]', row).text(),
				position: $('td[data-stat="pos"]', row).text(),
				games_played: parseInt($('td[data-stat="games_played"]', row).text()),
				goals: parseInt($('td[data-stat="goals"]', row).text()),
				assists: parseInt($('td[data-stat="assists"]', row).text()),
				points: parseInt($('td[data-stat="points"]', row).text()),
				plus_minus: parseInt($('td[data-stat="plus_minus"]', row).text()),
				penalty_minutes: parseInt($('td[data-stat="pen_min"]', row).text()),
				ev_goals: parseInt($('td[data-stat="goals_ev"]', row).text()),
				sh_goals: parseInt($('td[data-stat="goals_sh"]', row).text()),
				pp_goals: parseInt($('td[data-stat="goals_pp"]', row).text()),
				gw_goals: parseInt($('td[data-stat="goals_gw"]', row).text()),
				shots_on_goal: parseInt($('td[data-stat="shots"]', row).text()),
				shooting_percentage: parseFloat($('td[data-stat="shot_pct"]', row).text()),
				time_on_ice: parseInt($('td[data-stat="time_on_ice"]', row).text()),
				average_time_on_ice: $('td[data-stat="time_on_ice_avg"]', row).text(),
				blocks: parseInt($('td[data-stat="blocks"]', row).text()),
				hits: parseInt($('td[data-stat="hits"]', row).text()),
				faceoff_wins: parseInt($('td[data-stat="faceoff_wins"]', row).text()),
				faceoff_losses: parseInt($('td[data-stat="faceoff_losses"]', row).text()),
				faceoff_percentage: parseFloat($('td[data-stat="faceoff_percentage"]', row).text())
			}
			skatersScoring.push(skater)
		});

		return skatersScoring;
	} catch (error) {
		console.log('error getting player Stats');
	}
};




