const axios = require('axios');
const cheerio = require('cheerio');

const getPlayerGameLog = async slug => {
	try {
		const { data } = await axios.get(
			`https://www.hockey-reference.com/players/${slug[0]}/${slug}/gamelog/2021/`
		);

		const $ = cheerio.load(data);
		const games = $('tbody', '#gamelog');

		const gamesData = [];

		$('tr', games).each((_idx, row) => {
			const game = {};
			game._id = _idx;
			game.date = $('td[data-stat="date_game"]', row).text();
			game.teamId = $('td[data-stat="team_id"]', row).text();
			game.location = $('td[data-stat="game_location"]', row).text();
			game.opponent = $('td[data-stat="opp_id"]', row).text();
			game.opponent = $('td[data-stat="game_result"]', row).text();
			game.goals = $('td[data-stat="goals"]', row).text();
			game.assists = $('td[data-stat="assists"]', row).text();
			game.points = $('td[data-stat="points"]', row).text();
			game.plusminus = $('td[data-stat="plus_minus"]', row).text();
			game.pims = $('td[data-stat="pen_min"]', row).text();
			game.evengoals = $('td[data-stat="goals_ev"]', row).text();
			game.shortgoals = $('td[data-stat="goals_sh"]', row).text();
			game.ppgoals = $('td[data-stat="goals_pp"]', row).text();
			game.gwgoals = $('td[data-stat="goals_gw"]', row).text();
			game.shots = $('td[data-stat="shots"]', row).text();
			game.shootingPercentage = $('td[data-stat="shot_pct"]', row).text();
			game.toi = $('td[data-stat="time_on_ice"]', row).text();
			gamesData.push(game);
		});

		// console.log(gamesData);
		return gamesData;
	} catch (error) {
		console.log('error getting team game data');
	}
};

module.exports = { getPlayerGameLog };
