import axios from 'axios';
import cheerio from 'cheerio';
import { Conference, Team } from './types';

export const getTeamStandings = async () => {

	try {
		// get DOM tree for standings page
		const { data } = await axios.get(
			`https://www.hockey-reference.com/leagues/NHL_2021_standings.html`
		);
		const $: cheerio.Root = cheerio.load(data);

		// get standings table
		const table = $('tbody', '#standings');
		console.log('got table', table)

		const standings: Conference[] = [];

		// pre-fill standings with each conference
		$('.thead', table).each((_idx, row) => {
			let conference: Conference = {
				name: $('td', row).text(),
				teams: []
			}
			standings.push(conference);
		});

		console.log('standings', standings)

		// fill the standings object 
		let currentConference = ''
		$('tr', table).each((_idx, row) => {
			console.log($(row).attr('class'))
			

			if ($(row).attr('class') === 'thead'){
				console.log('new conference', $('td', row).text())
				currentConference = $('td', row).text();
			}

			
			if ($(row).attr('class') === 'full_table'){
				let team: Team = {
					_id: _idx,
					name: $('th[data-stat="team_name"]', row).text(),
					games: $('td[data-stat="games"]', row).text(),
					wins: $('td[data-stat="wins"]', row).text(),
					losses: $('td[data-stat="losses"]', row).text(),
					losses_ot: $('td[data-stat="losses_ot"]', row).text(),
					points: $('td[data-stat="points"]', row).text(),
					points_pct: $('td[data-stat="points_pct"]', row).text()
				}
				const found_conference = standings.find(conference => conference.name === currentConference)
				if (found_conference){
					found_conference.teams.push(team);
				}
				
			}
		});


		return standings;
	} catch (error) {
		console.log('error getting player Stats');
	}
};




