const axios = require('axios');
const cheerio = require('cheerio');

const getTeamGameLog = async team_id => {
	try {
		const { data } = await axios.get(
			`https://www.hockey-reference.com/teams/${team_id}/2021_games.html`
		);

		const $ = cheerio.load(data);
		const games = $('tbody', '#games');

		const gamesData = [];

		$('tr', games).each((_idx, row) => {
			const game = {};
			game.gameNumber = $('th[data-stat="games"]', row).text();
			game.date = $('td[data-stat="date_game"]', row).text();
			game.time = $('td[data-stat="time_game"]', row).text();
			game.location = $('td[data-stat="game_location"]', row).text();
			game.opponent = $('td[data-stat="opp_name"]', row).text();
			game.goals = $('td[data-stat="goals"]', row).text();
			game.opp_goals = $('td[data-stat="opp_goals"]', row).text();
			game.game_outcome = $('td[data-stat="game_outcome"]', row).text();
			game.overtimes = $('td[data-stat="overtimes"]', row).text();
			game.wins = $('td[data-stat="wins"]', row).text();
			game.losses = $('td[data-stat="losses"]', row).text();
			game.ot_losses = $('td[data-stat="losses_ot"]', row).text();
			game.game_streak = $('td[data-stat="game_streak"]', row).text();
			gamesData.push(game);
		});

		// console.log(gamesData);
		return gamesData;
	} catch (error) {
		console.log('error getting team game data');
	}
};

// getting tbl team data
const getTeamRosterData = async team_id => {
	try {
		const { data } = await axios.get(`https://www.hockey-reference.com/teams/${team_id}/`);

		const $ = cheerio.load(data);
		const roster = $('tbody', '#roster');

		const playersData = [];

		$('tr', roster).each((_idx, row) => {
			const player = {};
			player.number = $('th[data-stat=number]', row).text();
			player.name = $('td[data-stat="player"]', row).text();
			player.position = $('td[data-stat="pos"]', row).text();
			player.age = $('td[data-stat="age"]', row).text();
			player.years = $('td[data-stat="years_experience"]', row).text();
			player.salary = $('td[data-stat="salary"]', row).text();
			player.drafted = $('td[data-stat="draft"]', row).text();
			player.birthdate = $('td[data-stat="birth_date"]', row).text();
			player._id = $('td[data-stat="player"]', row).attr('data-append-csv');
			playersData.push(player);
		});

		// console.log(playersData);
		return playersData;
	} catch (error) {
		console.log('error getting team scoring data');
	}
};

const getTeamScoringData = async team_id => {
	try {
		const { data } = await axios.get(`https://www.hockey-reference.com/teams/${team_id}/`);

		const $ = cheerio.load(data);
		const skaters = $('tbody', '#skaters');

		const playersData = [];

		$('tr', skaters).each((_idx, row) => {
			const player = {};
			player._id = $('td[data-stat="player"]', row).attr('data-append-csv');
			player.rank = $('th[data-stat="ranker"]', row).text();
			player.name = $('td[data-stat="player"]', row).text();
			player.position = $('td[data-stat="pos"]', row).text();
			player.age = $('td[data-stat="age"]', row).text();
			player.gamesPlayed = $('td[data-stat="games_played"]', row).text();
			player.goals = $('td[data-stat="goals"]', row).text();
			player.assists = $('td[data-stat="assists"]', row).text();
			player.points = $('td[data-stat="points"]', row).text();
			player.plusminus = $('td[data-stat="plus_minus"]', row).text();
			player.pims = $('td[data-stat="pen_min"]', row).text();
			player.evengoals = $('td[data-stat="goals_ev"]', row).text();
			player.shortgoals = $('td[data-stat="goals_sh"]', row).text();
			player.ppgoals = $('td[data-stat="goals_pp"]', row).text();
			player.gwgoals = $('td[data-stat="goals_gw"]', row).text();
			player.shots = $('td[data-stat="shots"]', row).text();
			player.shootingPercentage = $('td[data-stat="shot_pct"]', row).text();
			player.toi = $('td[data-stat="time_on_ice"]', row).text();
			player.atoi = $('td[data-stat="time_on_ice_avg"]', row).text();

			playersData.push(player);
		});

		// console.log(playersData);
		return playersData;
	} catch (error) {
		console.log('error getting team roster data');
	}
};

module.exports = { getTeamRosterData, getTeamScoringData, getTeamGameLog };
