import axios from 'axios';
import cheerio from 'cheerio';
interface GameSummary {
	scoring_summary: Period[]
  penalty_summary: Period[]
  home_team_scoring: SkaterGameStat[]
  home_team_goalies: GoalieGameStat[]
  away_team_scoring: SkaterGameStat[]
  away_team_goalies: GoalieGameStat[]
  box_score: BoxScore
}

// scoring and goalies 
interface SkaterGameStat {
  id: number
	player: string
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
  shifts: number
	time_on_ice: number
}
interface GoalieGameStat {
  id: number
	name: string
  decision: string
	goals_against: number
	shots_against: number
	saves: number
	save_percentage: number
	shutouts: number
}

// boxscore
interface BoxScore {
  game_details: GameDetails
  home_scoring_total: TeamBoxScore
  away_scoring_total: TeamBoxScore
}
interface GameDetails {
	date: Date
	time: string
  arena: string
  attendance: number
}
interface TeamBoxScore {
  goals: number
  assists: number
  points: number
  penalty_minutes: number
  ev_goals: number
  pp_goals: number
  shots_on_goal: number
  shooting_percentage: number
}


// types for scoring and penalty summaries
interface Period {
  title: string
	penalties?: Penalty[]
	goals?: Goal[]
	so_attempts?: SO_Attempt[]
}
interface Goal {
  time: string
  team_id: string
  power_play: string
  scorer: string
  count: number
  assists: string[]
}
interface SO_Attempt {
  shot_number: number
  team_id: string
  scorer: string
  success: boolean
  goalie: string
}
interface Penalty {
  time: string
  team_id: string
  player: string
  type: string
  duration: number
}

export const getGameSummary = async (gameID: string) => {

	

	try {
		// load the goalies scoring page and access DOM with cheerio
		const { data } = await axios.get(
			`https://www.hockey-reference.com/boxscores/${gameID}.html`
		);
		const $ = cheerio.load(data);

		// access the stats table and loop through all rows
		const home_scoring_table = $('tbody', '#ARI_skaters');
		const home_scoring_totals = $('tfoot', '#ARI_skaters');
		const home_goalie_table = $('tbody', '#ARI_goalies');
		const away_scoring_table = $('tbody', '#SJS_skaters');
		const away_scoring_totals = $('tfoot', '#SJS_skaters');
		const away_goalie_table = $('tbody', '#SJS_goalies');
		const penalty_summary_table = $('tbody', '#penalty');
		const scoring_summary_table = $('tbody', '#scoring');
		const game_details_div = $('.scorebox_meta', '.scorebox');


		// parse the game details div to get date, time, attendance and location
		const game_details_string = game_details_div.text()
		const parsed_date = (game_details_string.match(/[\w]+\s[\d]+,\s2021/) || [''])[0]
		const parsed_time = (game_details_string.match(/\d\d?:\d\d\s[AP]M/) || [''])[0]
		const attendance = parseInt((game_details_string.match(/Attendance:\s[\d,]+/) || ['Attendance: 0'])[0].split(':')[1].replace(/[,]/g, ''))
		const arena = (game_details_string.match(/Arena:\s[\w\s]+Game\sDuration/) || ['Arena: N/AGame Duration'])[0].split(':')[1].split('Game Duration')[0]
			
		// get game details
		let game_details: GameDetails = {
			date: new Date(parsed_date),
			time: parsed_time,
			arena,
			attendance
		}

		// table 1a - home team scoring
		let home_team_scoring : SkaterGameStat[] = []
		$('tr', home_scoring_table).each((_idx, row) => {
			let skaterGameStat : SkaterGameStat = {
				id: _idx,
				player: $('td[data-stat="player"]', row).text(),
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
				shifts:  parseInt($('td[data-stat="shifts"]', row).text()),
				time_on_ice: parseInt($('td[data-stat="time_on_ice"]', row).text()),
			} 
			home_team_scoring.push(skaterGameStat)
		});

		// table 1b - home team goalies
		let home_team_goalies : GoalieGameStat[] = []
		$('tr', home_goalie_table).each((_idx, row) => {
			let goalieGameStat : GoalieGameStat = {
				id: _idx,
				name: $('td[data-stat="player"]>a', row).text(),
				decision: $('td[data-stat="decision"]', row).text(),
        goals_against: parseInt($('td[data-stat="goals_against"]', row).text()),
        shots_against: parseInt($('td[data-stat="shots_against"]', row).text()),
				saves: parseInt($('td[data-stat="saves"]', row).text()),
				save_percentage: parseFloat($('td[data-stat="save_pct"]', row).text()),
				
				shutouts: parseInt($('td[data-stat="shutouts"]', row).text())
			} 
			home_team_goalies.push(goalieGameStat)
		});

		// row 1c - home team totals 
		let home_scoring_total : TeamBoxScore = {
				goals: parseInt($('td[data-stat="goals"]', home_scoring_totals).text()),
				assists: parseInt($('td[data-stat="assists"]', home_scoring_totals).text()),
				points: parseInt($('td[data-stat="points"]', home_scoring_totals).text()),
				penalty_minutes: parseInt($('td[data-stat="pen_min"]', home_scoring_totals).text()),
				ev_goals: parseInt($('td[data-stat="goals_ev"]', home_scoring_totals).text()),
				pp_goals: parseInt($('td[data-stat="goals_pp"]', home_scoring_totals).text()),
				shots_on_goal: parseInt($('td[data-stat="shots"]', home_scoring_totals).text()),
				shooting_percentage: parseFloat($('td[data-stat="shot_pct"]', home_scoring_totals).text()),
		} 
			
		// table 2a - home team scoring
		let away_team_scoring : SkaterGameStat[] = []
		$('tr', away_scoring_table).each((_idx, row) => {
			let skaterGameStat : SkaterGameStat = {
				id: _idx,
				player: $('td[data-stat="player"]', row).text(),
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
				shifts:  parseInt($('td[data-stat="shifts"]', row).text()),
				time_on_ice: parseInt($('td[data-stat="time_on_ice"]', row).text()),
			} 
			away_team_scoring.push(skaterGameStat)
		});

		// table 2b - away team goalies
		let away_team_goalies : GoalieGameStat[] = []
		$('tr', away_goalie_table).each((_idx, row) => {
			let goalieGameStat : GoalieGameStat = {
				id: _idx,
				name: $('td[data-stat="player"]>a', row).text(),
				decision: $('td[data-stat="decision"]', row).text(),
        goals_against: parseInt($('td[data-stat="goals_against"]', row).text()),
        shots_against: parseInt($('td[data-stat="shots_against"]', row).text()),
				saves: parseInt($('td[data-stat="saves"]', row).text()),
				save_percentage: parseFloat($('td[data-stat="save_pct"]', row).text()),
				
				shutouts: parseInt($('td[data-stat="shutouts"]', row).text())
			} 
			away_team_goalies.push(goalieGameStat)
		});

		// row 2c - away team totals 
		let away_scoring_total : TeamBoxScore = {
				goals: parseInt($('td[data-stat="goals"]', away_scoring_totals).text()),
				assists: parseInt($('td[data-stat="assists"]', away_scoring_totals).text()),
				points: parseInt($('td[data-stat="points"]', away_scoring_totals).text()),
				penalty_minutes: parseInt($('td[data-stat="pen_min"]', away_scoring_totals).text()),
				ev_goals: parseInt($('td[data-stat="goals_ev"]', away_scoring_totals).text()),
				pp_goals: parseInt($('td[data-stat="goals_pp"]', away_scoring_totals).text()),
				shots_on_goal: parseInt($('td[data-stat="shots"]', away_scoring_totals).text()),
				shooting_percentage: parseFloat($('td[data-stat="shot_pct"]', away_scoring_totals).text()),
		} 
			

		// penalty summary
		let penalty_summary : Period[] = []
		
		$('tr', penalty_summary_table).each((_idx, row) => {

			const penalties_string = $(row).text()

			// i have either an array of the period with title at index 0 or null
			const match_results = penalties_string.match(/\d[\w\s]+Period/)
		
			// i have either an array of the penalty or an array with one empty string
			const penalty_results = (penalties_string.match(/(\d\d:\d\d[\w\-\s]+)/) || [''])[0].split('\n') 
			const trimmed_results = penalty_results.map(penalty => penalty.replace(/\\t/g, '').trim())

			if (match_results !== null){
				// add period to summary
				const period : Period = {
					title: match_results[0],
					penalties: []
				}
				penalty_summary.push(period)
			} else {
				// not a period should be a penalty but we will check anyways
				if (trimmed_results.length > 1){
					// add penalty to latest period in summary
					const penalty: Penalty = {
						time: trimmed_results[0],
						team_id: trimmed_results[1],
						player: trimmed_results[2],
						type: trimmed_results[3],
						duration: parseInt(trimmed_results[4])
					}
					penalty_summary[penalty_summary.length - 1].penalties?.push(penalty)
				}
			}
			
		});


		// scoring summary
		let scoring_summary : Period[] = []
		
		$('tr', scoring_summary_table).each((_idx, row) => {

			const scoring_string = $(row).text()

			// i have either an array of the period with title at index 0 or null
			const period_results = scoring_string.match(/\d[\w\s]+Period/)

			// i have either an array  with 'Shootout' at index 0 or null
			const shootout_results = scoring_string.match(/Shootout/)
		
			// i have either an array of the scoring or an array with one empty string
			const scoring_results = (scoring_string.match(/(\d\d:\d\d[\w\-\s\(\),]+)/) || [''])[0].split('\n') 
			const trimmed_results = scoring_results.map(score => score.replace(/\\t/g, '').trim())

			// i have either an array of the shootout attempt or an array with one empty string
			const shootout_attempt_match = (scoring_string.match(/\d+[\w\-\s]+(un)?successful\sattempt\sversus[\w\-\s]+/) || [''])[0].split('\n')
			const shootout_trimmed_results = shootout_attempt_match.map(score => score.replace(/\\t/g, '').trim())
			
			if (period_results !== null){
				// add period to summary
				const period : Period = {
					title: period_results[0],
					goals: []
				}
				scoring_summary.push(period)
			} else if (shootout_results !== null){
				// add shootout to summary
				const shootout : Period = {
					title: shootout_results[0],
					so_attempts: []
				}
				scoring_summary.push(shootout)
			} else {
				
				// not a period or shootout should check if its a goal
				if (trimmed_results.length > 1){
					// add scoring to latest period in summary
					const goal: Goal = {
						time: trimmed_results[0],
						team_id: trimmed_results[1],
						power_play: trimmed_results[3],
						scorer: trimmed_results[7].replace(/\s\(\d+\)/, ''),
						count: parseInt((trimmed_results[7].match(/\(\d+\)/) || [''])[0].replace(/[\(\)]/g, '')),
						assists: trimmed_results[10].split(', ')
					}
					scoring_summary[scoring_summary.length - 1].goals?.push(goal)
				} else {
					// not a period or shootout or goal should be a SO attempt but lets check 
					if (shootout_trimmed_results.length > 0){
						// add scoring to latest period in summary
						const attempt_string = shootout_trimmed_results[2].split(' ')

						const so_attempt: SO_Attempt = {
							shot_number: parseInt(shootout_trimmed_results[0]),
							team_id: shootout_trimmed_results[1],
							scorer: attempt_string.slice(0,2).join(' '),
							success: shootout_trimmed_results[2].search(/unsuccessful/) === - 1 ? true : false,
							goalie: attempt_string.slice(-2).join(' ')
						}
						scoring_summary[scoring_summary.length - 1].so_attempts?.push(so_attempt)
				}
			}
			
		}}
		);
		
		const gameSummary: GameSummary = {
			scoring_summary,
			penalty_summary,
			home_team_scoring,
			home_team_goalies,
			away_team_scoring,
			away_team_goalies,
			box_score: {
				game_details,
				home_scoring_total,
				away_scoring_total
			}
		}

		return gameSummary
		
	} catch (error) {
		console.log('error getting game summary');
	}
};