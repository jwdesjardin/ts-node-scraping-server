import express from 'express'
const router = express();

// library functions
import { getAllGames } from '../lib/games';
import { getGameSummary } from '../lib/gameSummary';
import { getGoalieScoring } from '../lib/goalies';
import { getInjuries } from '../lib/injuries';
import { getSkatersScoring } from '../lib/skaters';
import { getTeamStandings } from '../lib/standings'
import { getTeamData } from '../lib/team';

// middleware
import { requireAPIKey } from '../middleware/requireAPIKey';


// ENDPOINTS

// returns Conference [ { title,  Team[] } ... ]
router.get('/standings', requireAPIKey, async (req, res) => {
	try {
		const standings = await getTeamStandings();
		res.json(standings);
	} catch (error) {
		console.log('error getting team standings');
	}
});


//returns Skater[]
router.get('/skaters', requireAPIKey, async (req, res) => {
	try {
		const skaters = await getSkatersScoring();
		res.json(skaters);
	} catch (error) {
		console.log('error getting skaters scoring data');
	}
});

//returns Goalie[]
router.get('/goalies', requireAPIKey, async (req, res) => {
	try {
		const goalies = await getGoalieScoring();
		res.json(goalies);
	} catch (error) {
		console.log('error getting goalie scoring data');
	}
});

//returns Game[]
router.get('/games', requireAPIKey, async (req, res) => {
	try {
		const games = await getAllGames();
		res.json(games);
	} catch (error) {
		console.log('error getting all games');
	}
});

//returns TeamData: { RosterStat[], SkaterScoringStat[], GoalieScoringStat[] }
router.get('/team/:id', requireAPIKey, async (req, res) => {
  const { id } = req.params
	try {
		const teamData = await getTeamData(id);
		res.json(teamData);
	} catch (error) {
		console.log('error getting team data for:', id);
	}
});

//returns GameSummary : { BoxScore, Period[] (x2), SkaterGameStat[] (x2), GoalieGameStat[] (x2) }
router.get('/game/:id', requireAPIKey, async (req, res) => {
  const { id } = req.params
	try {
		const gameSummary = await getGameSummary(id);
		res.json(gameSummary);
	} catch (error) {
		console.log('error getting game summary for:', id);
	}
});

//returns Injury []
router.get('/injuries', requireAPIKey, async (req, res) => {
	try {
		const injuries = await getInjuries();
		res.json(injuries);
	} catch (error) {
		console.log('error getting injuries');
	}
});


export default router

