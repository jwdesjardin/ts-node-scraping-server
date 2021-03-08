const express = require('express');
const router = express();
const { getPlayerStats, getGoalLeaders, getPointLeaders } = require('../lib/leaderData');
const { getPlayerGameLog } = require('../lib/playerData');
const { getTeamGameLog, getTeamScoringData, getTeamRosterData } = require('../lib/teamData');
const { getTeamStandings } = require('../lib/standings')

router.get('/team/skaters/:id', async (req, res) => {
	try {
		const team_id = req.params.id;
		const skaters = await getTeamScoringData(team_id);
		res.json(skaters);
	} catch (error) {
		console.log('error getting team scoring data');
	}
});

router.get('/team/roster/:id', async (req, res) => {
	try {
		const team_id = req.params.id;
		const roster = await getTeamRosterData(team_id);
		res.json(roster);
	} catch (error) {
		console.log('error getting team roster data');
	}
});

router.get('/team/games/:id', async (req, res) => {
	try {
		const team_id = req.params.id;
		const gamelog = await getTeamGameLog(team_id);
		res.json(gamelog);
	} catch (error) {
		console.log('error getting team gamelist');
	}
});

router.get('/player/games/:slug', async (req, res) => {
	try {
		const slug = req.params.slug;
		const gamelog = await getPlayerGameLog(slug);
		res.json(gamelog);
	} catch (error) {
		console.log('errpr getting player gamelog');
	}
});

router.get('/players/stats', async (req, res) => {
	try {
		const stats = await getPlayerStats();

		res.json(stats);
	} catch (error) {
		console.log('error getting player stats');
	}
});
router.get('/leaders/goals', async (req, res) => {
	try {
		const stats = await getPlayerStats();
		const leaders = await getGoalLeaders(stats);
		res.json(leaders);
	} catch (error) {
		console.log('error getting goal leaders');
	}
});

router.get('/leaders/points', async (req, res) => {
	try {
		const stats = await getPlayerStats();
		const leaders = await getPointLeaders(stats);
		res.json(leaders);
	} catch (error) {
		console.log('error getting point leaders');
	}
});


// NEW ENDPOINTS

router.get('/standings', async (req, res) => {
	try {
		const standings = await getTeamStandings();
		res.json(standings);
	} catch (error) {
		console.log('error getting point leaders');
	}
});



module.exports = router;
