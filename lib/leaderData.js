const axios = require('axios');
const cheerio = require('cheerio');

const getPlayerStats = async () => {
	try {
		const { data } = await axios.get(
			`https://www.hockey-reference.com/leagues/NHL_2021_skaters.html#stats::goals`
		);

		const $ = cheerio.load(data);
		const players = $('tbody', '#stats');

		const playerStats = [];

		$('tr', players).each((_idx, row) => {
			const player = {};
			player._id = _idx;
			player.rank = $('th[data-stat="ranker"]', row).text();
			player.name = $('td[data-stat="player"]', row).text();
			player.age = $('td[data-stat="age"]', row).text();
			player.team = $('td[data-stat="team_id"]', row).text();
			player.position = $('td[data-stat="pos"]', row).text();
			player.gamesPlayed = $('td[data-stat="games_played"]', row).text();
			player.goals = $('td[data-stat="goals"]', row).text();
			player.assists = $('td[data-stat="assists"]', row).text();
			player.points = $('td[data-stat="points"]', row).text();
			player.plusminus = $('td[data-stat="plus_minus"]', row).text();
			player.pims = $('td[data-stat="pen_min"]', row).text();
			player.pointShares = $('td[data-stat="ps"]', row).text();
			player.ev_goals = $('td[data-stat="goals_ev"]', row).text();
			player.sh_goals = $('td[data-stat="goals_sh"]', row).text();
			player.pp_goals = $('td[data-stat="goals_pp"]', row).text();
			player.gw_goals = $('td[data-stat="goals_gw"]', row).text();
			player.toi = $('td[data-stat="time_on_ice"]', row).text();
			player.atoi = $('td[data-stat="time_on_ice_avg"]', row).text();
			playerStats.push(player);
		});

		// console.log(playerStats);
		return playerStats;
	} catch (error) {
		console.log('error getting player Stats');
	}
};

// getPlayerStats();

const getGoalLeaders = arr => {
	arr.sort((a, b) => b.goals - a.goals);
	return arr.slice(0, 50);
};

const getPointLeaders = arr => {
	arr.sort((a, b) => b.points - a.points);
	return arr.slice(0, 50);
};

const getAtoiLeaders = arr => {
	arr.sort((a, b) => b.atoi - a.atoi);
	return arr.slice(0, 50);
};

module.exports = { getAtoiLeaders, getGoalLeaders, getPointLeaders, getPlayerStats };
