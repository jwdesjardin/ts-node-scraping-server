import express from 'express'
import { getAllGames } from '../lib/games';
import { getGameSummary } from '../lib/gameSummary';
import { getGoalieScoring } from '../lib/goalies';
import { getSkatersScoring } from '../lib/skaters';
const router = express();

import { getTeamStandings } from '../lib/standings'
import { getTeamData } from '../lib/team';



// NEW ENDPOINTS


// returns Conference [ ..., Team[]]
router.get('/standings', async (req, res) => {
	try {
		const standings = await getTeamStandings();
		res.json(standings);
	} catch (error) {
		console.log('error getting team standings');
	}
});


//returns Skater[]
router.get('/skaters', async (req, res) => {
	try {
		const skaters = await getSkatersScoring();
		res.json(skaters);
	} catch (error) {
		console.log('error getting skaters scoring data');
	}
});

//returns Goalie[]
router.get('/goalies', async (req, res) => {
	try {
		const goalies = await getGoalieScoring();
		res.json(goalies);
	} catch (error) {
		console.log('error getting goalie scoring data');
	}
});

//returns Game[]
router.get('/games', async (req, res) => {
	try {
		const games = await getAllGames();
		res.json(games);
	} catch (error) {
		console.log('error getting all games');
	}
});

//returns TeamData: { Injury[], RosterStat[], SkaterScoringStat[], GoalieScoringStat[] }
router.get('/team/:id', async (req, res) => {
  const { id } = req.params
	try {
		const teamData = await getTeamData(id);
		res.json(teamData);
	} catch (error) {
		console.log('error getting team data for:', id);
	}
});

//returns
router.get('/game/:id', async (req, res) => {
  const { id } = req.params
	try {
		const gameSummary = await getGameSummary(id);
		res.json(gameSummary);
	} catch (error) {
		console.log('error getting game summary for:', id);
	}
});







export default router

