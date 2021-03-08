import axios from 'axios';
import cheerio from 'cheerio';

interface Game {
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

export const getAllGames = async () => {
	// initialize an array of games to return 
	const allGames: Game[] = [];

	try {
		// load the games page and access DOM with cheerio
		const { data } = await axios.get(
			`https://www.hockey-reference.com/leagues/NHL_2021_games.html`
		);
		const $ = cheerio.load(data);

		// access the stats table and loop through all rows
		const table = $('tbody', '#games');

		$('tr', table).each((_idx, row) => {
			let game: Game = {
				id: _idx,
				date: new Date($('th[data-stat="date_game"]>a', row).text()),
				away_team: $('td[data-stat="visitor_team_name"]', row).text(),
				away_goals: parseInt($('td[data-stat="visitor_goals"]', row).text()),
				home_team: $('td[data-stat="home_team_name"]', row).text(),
				home_goals: parseInt($('td[data-stat="home_goals"]', row).text()),
				overtime: $('td[data-stat="overtimes"]', row).text(),
			  attendance: parseInt($('td[data-stat="pos"]', row).text()),
				length_of_game: $('td[data-stat="game_duration"]', row).text(),
			  notes: $('td[data-stat="game_remarks"]', row).text(),
			}
			allGames.push(game)
		});

		return allGames;
	} catch (error) {
		console.log('error getting all games');
	}
};