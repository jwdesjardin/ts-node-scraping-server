import axios from 'axios';
import cheerio from 'cheerio';

interface Team {
	// injuries: Injury[]
  rosterStats: RosterStat[]
  skaterStats: SkaterScoringStat[]
  goalieStats: GoalieScoringStat[]
}

interface Injury {
  id: number
  player: string
  date: string
  type: string
  note: string
}

interface RosterStat {
  id: number
  number: number
  player: string
  country: string
  position: string
  age: number
  height: string
  weight: number
  shoots: string
  experience: number
  salary: number | null
  draft: {
    year: number | null
    team_id: string | null
    round: number | null
    overall: number | null
  }
}

interface  SkaterScoringStat {
  id: number
	player: string
	age: number
	team_id: string
	position: string
	games_played: number
	goals: number
	assists: number
	points: number
	plus_minus: number
	penalty_minutes: number
	ev_goals: number
	sh_goals: number
	pp_goals: number
	gw_goals: number
	shots_on_goal: number
  shooting_percentage: number
	time_on_ice: number
	average_time_on_ice: string
	blocks: number
	hits: number
	faceoff_wins: number
	faceoff_losses: number
	faceoff_percentage: number
}

interface  GoalieScoringStat {
  id: number
	name: string
	age: number
	team_id: string
	position: string
	games_played: number
	games_started: number
  wins: number
  losses: number
  ot_losses: number
	goals_against: number
	shots_against: number
	saves: number
	save_percentage: number
	goals_against_average: number
	shutouts: number
}



export const getTeamData = async (team_id: string): Promise<Team | undefined> => {
	// initialize an array of goalies to return 
	try {
		// load the goalies scoring page and access DOM with cheerio
		const { data } = await axios.get(
			`https://www.hockey-reference.com/teams/${team_id}/2021.html`
		);
		const $ = cheerio.load(data);

		// access the stats table and loop through all rows
		// const injuryTable = $('tbody', '#injuries');
		const rosterTable = $('tbody', '#roster');
		const skaterTable = $('tbody', '#skaters');
		const goalieTable = $('tbody', '#goalies');

    // let injuries: Injury[] = []
    // console.log($('tr', injuryTable))
		// $('tr', injuryTable).each((_idx, row) => {
    //   console.log(_idx)
		// 	let injury: Injury = {
		// 		id: _idx,
		// 		player: $('th[data-stat="player"]>a', row).text(),
    //     date: $('td[data-stat="date_injury"]', row).text(),
    //     type: $('td[data-stat="injury_type"]', row).text(),
    //     note: $('td[data-stat="injury_note"]', row).text(),
		// 	}
    //   console.log('posting injury', injury)
		// 	injuries.push(injury)
		// });

    let rosterStats: RosterStat[] = []
		$('tr', rosterTable).each((_idx, row) => {
      
      // parse out data for draft year
      const draftText = $('td[data-stat="draft"]', row).text().split(' ')
      let draft
      if (draftText.length === 1){
        draft = {
          year: null,
          team_id: null,
          round: null,
          overall: null
        }
      } else {
        draft =  {
          year: parseInt(draftText[0]),
          team_id: draftText[1],
          round: parseInt(draftText[2]),
          overall: parseInt(draftText[3].replace(/[\(\)]/g, ''))
        }
      }
     
      const salary = parseInt($('td[data-stat="salary"]', row).text().replace(/[$,]/g, '')) || null

			let rosterStat: RosterStat = {
				id: _idx,
        number: parseInt($('th[data-stat="number"]', row).text()),
				player: $('td[data-stat="player"]>a', row).text(),
        country: $('td[data-stat="flag"]', row).text(),
        position: $('td[data-stat="pos"]', row).text(),
        age: parseInt($('td[data-stat="age"]', row).text()),
        height: $('td[data-stat="height"]', row).text(),
        weight: parseInt($('td[data-stat="weight"]', row).text()),
        shoots: $('td[data-stat="shoots_and_catches"]', row).text(),
        experience: parseInt($('td[data-stat="years_experience"]', row).text()),
        salary,
        draft
			}
			rosterStats.push(rosterStat)
		});

    let skaterStats: SkaterScoringStat[] = []
		$('tr', skaterTable).each((_idx, row) => {

			let skaterStat: SkaterScoringStat = {
				id: _idx,
        player: $('td[data-stat="player"]', row).text(),
        age: parseInt($('td[data-stat="age"]', row).text()),
        team_id,
        position: $('td[data-stat="pos"]', row).text(),
        games_played: parseInt($('td[data-stat="games_played"]', row).text()),
        goals: parseInt($('td[data-stat="goals"]', row).text()),
        assists: parseInt($('td[data-stat="assists"]', row).text()),
        points: parseInt($('td[data-stat="points"]', row).text()),
        plus_minus: parseInt($('td[data-stat="plus_minus"]', row).text()),
        penalty_minutes: parseInt($('td[data-stat="pen_min"]', row).text()),
        ev_goals: parseInt($('td[data-stat="goals_ev"]', row).text()),
        sh_goals: parseInt($('td[data-stat="goals_sh"]', row).text()),
        pp_goals: parseInt($('td[data-stat="goals_pp"]', row).text()),
        gw_goals: parseInt($('td[data-stat="goals_gw"]', row).text()),
        shots_on_goal: parseInt($('td[data-stat="shots"]', row).text()),
        shooting_percentage: parseFloat($('td[data-stat="shot_pct"]', row).text()),
        time_on_ice: parseInt($('td[data-stat="time_on_ice"]', row).text()),
        average_time_on_ice: $('td[data-stat="time_on_ice_avg"]', row).text(),
        blocks: parseInt($('td[data-stat="blocks"]', row).text()),
        hits: parseInt($('td[data-stat="hits"]', row).text()),
        faceoff_wins: parseInt($('td[data-stat="faceoff_wins"]', row).text()),
        faceoff_losses: parseInt($('td[data-stat="faceoff_losses"]', row).text()),
        faceoff_percentage: parseFloat($('td[data-stat="faceoff_percentage"]', row).text()),
        }

        skaterStats.push(skaterStat)
		});

    let goalieStats: GoalieScoringStat[] = []
		$('tr', goalieTable).each((_idx, row) => {

			let goalieStat: GoalieScoringStat = {
				id: _idx,
        name: $('td[data-stat="player"]', row).text(),
        age: parseInt($('td[data-stat="age"]', row).text()),
        team_id,
        position: 'G',
        games_played: parseInt($('td[data-stat="games_goalie"]', row).text()),
        games_started: parseInt($('td[data-stat="starts_goalie"]', row).text()),
        wins: parseInt($('td[data-stat="wins_goalie"]', row).text()),
        losses: parseInt($('td[data-stat="losses_goalie"]', row).text()),
        ot_losses: parseInt($('td[data-stat="ties_goalie"]', row).text()),
        goals_against: parseInt($('td[data-stat="goals_against"]', row).text()),
        shots_against: parseInt($('td[data-stat="shots_against"]', row).text()),
        saves: parseInt($('td[data-stat="saves"]', row).text()),
        save_percentage: parseFloat($('td[data-stat="save_pct"]', row).text()),
        goals_against_average: parseFloat($('td[data-stat="goals_against_avg"]', row).text()),
        shutouts: parseInt($('td[data-stat="shutouts"]', row).text()),
        }

        goalieStats.push(goalieStat)
		});

		return {
       rosterStats, skaterStats, goalieStats
    };
	} catch (error) {
		console.log('error getting team data');
	}
};




