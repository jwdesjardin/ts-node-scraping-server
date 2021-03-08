import axios from 'axios';
import cheerio from 'cheerio';

interface Skater {
	_id: number
	rank: number
	name: string
	age: number
	team_id: string
	position: string
	games_played: number
	goals: number
	assists: number
	points: number
	plus_minus: number
	penalty_minutes: number
	point_share: number
	ev_goals: number
	sh_goals: number
	pp_goals: number
	gw_goals: number
	time_on_ice: string
	average_time_on_ice: string
}

export const getSkatersScoring = async () => {
	// initialize an array of skaters to return 
	const skatersScoring: Skater[] = [];

	try {
		// load the skaters scoring page and access DOM with cheerio
		const { data } = await axios.get(
			`https://www.hockey-reference.com/leagues/NHL_2021_skaters.html#stats::goals`
		);
		const $ = cheerio.load(data);

		// access the stats table and loop through all rows
		const table = $('tbody', '#stats');

		$('tr', table).each((_idx, row) => {
			let skater: Skater = {
				_id: _idx,
				rank: parseInt($('th[data-stat="ranker"]', row).text()),
				name: $('td[data-stat="player"]', row).text(),
				age: parseInt($('td[data-stat="age"]', row).text()),
				team_id: $('td[data-stat="team_id"]', row).text(),
				position: $('td[data-stat="pos"]', row).text(),
				games_played: parseInt($('td[data-stat="games_played"]', row).text()),
				goals: parseInt($('td[data-stat="goals"]', row).text()),
				assists: parseInt($('td[data-stat="assists"]', row).text()),
				points: parseInt($('td[data-stat="points"]', row).text()),
				plus_minus: parseInt($('td[data-stat="plus_minus"]', row).text()),
				penalty_minutes: parseInt($('td[data-stat="pen_min"]', row).text()),
				point_share: parseFloat($('td[data-stat="ps"]', row).text()),
				ev_goals: parseInt($('td[data-stat="goals_ev"]', row).text()),
				sh_goals: parseInt($('td[data-stat="goals_sh"]', row).text()),
				pp_goals: parseInt($('td[data-stat="goals_pp"]', row).text()),
				gw_goals: parseInt($('td[data-stat="goals_gw"]', row).text()),
				time_on_ice: $('td[data-stat="time_on_ice"]', row).text(),
				average_time_on_ice: $('td[data-stat="time_on_ice_avg"]', row).text()
			}
			skatersScoring.push(skater)
		});

		return skatersScoring;
	} catch (error) {
		console.log('error getting player Stats');
	}
};




