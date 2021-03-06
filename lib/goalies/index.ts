import axios from 'axios'
import cheerio from 'cheerio'
import { Goalie } from './types'

export const getGoalieScoring = async () => {
  // initialize an array of goalies to return
  const goalieScoring: Goalie[] = []

  try {
    // load the goalies scoring page and access DOM with cheerio
    const { data } = await axios.get(
      `https://www.hockey-reference.com/leagues/NHL_2021_goalies.html`
    )
    const $ = cheerio.load(data)

    // access the stats table and loop through all rows
    const table = $('tbody', '#stats')

    $('tr', table).each((_idx, row) => {
      if ($('td[data-stat="player"]', row).text() === '') return

      const player_id = $('td[data-stat="player"]', row).attr('data-append-csv')

      const duplicate = goalieScoring.find((goalie) => goalie.player_id === player_id)

      if (player_id && !duplicate) {
        let goalie: Goalie = {
          player_id: $('td[data-stat="player"]', row).attr('data-append-csv') || '',
          player: $('td[data-stat="player"]>a', row).text(),
          age: parseInt($('td[data-stat="age"]', row).text()),
          team_id: $('td[data-stat="team_id"]>a', row).text(),
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
        goalieScoring.push(goalie)
      } else {
        if (goalieScoring[goalieScoring.length - 1].team_id === 'TOT') {
          goalieScoring[goalieScoring.length - 1].team_id = $(
            'td[data-stat="team_id"]>a',
            row
          ).text()
        }
      }
    })

    return goalieScoring
  } catch (error) {
    console.log('error getting goalie Stats')
  }
}
