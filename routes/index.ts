import express from 'express'
import { getAllGames } from '../lib/games';
import { getSkatersScoring } from '../lib/skaters';
const router = express();

import { getTeamStandings } from '../lib/standings'



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

//returns Game[]
router.get('/games', async (req, res) => {
	try {
		const games = await getAllGames();
		res.json(games);
	} catch (error) {
		console.log('error getting all games');
	}
});





export default router

