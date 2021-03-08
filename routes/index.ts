import express from 'express'
const router = express();

import { getTeamStandings } from '../lib/standings'


// NEW ENDPOINTS

router.get('/standings', async (req, res) => {
	try {
		const standings = await getTeamStandings();
		res.json(standings);
	} catch (error) {
		console.log('error getting point leaders');
	}
});



export default router

