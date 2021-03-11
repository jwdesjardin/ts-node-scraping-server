import axios from 'axios'
import cheerio from 'cheerio'
import { Conference, TeamSeasonStats } from './types'

export const getTeamStandings = async () => {
  try {
    // get DOM tree for standings page
    const { data } = await axios.get(
      `https://www.hockey-reference.com/leagues/NHL_2021_standings.html`
    )
    const $: cheerio.Root = cheerio.load(data)

    // get standings table
    const table = $('tbody', '#standings')

    const standings: Conference[] = []

    // pre-fill standings with each conference
    $('.thead', table).each((_idx, row) => {
      let conference: Conference = {
        name: $('td', row).text(),
        teams: [],
      }
      standings.push(conference)
    })

    // fill the standings object
    let currentConference = ''
    $('tr', table).each((_idx, row) => {
      if ($(row).attr('class') === 'thead') {
        currentConference = $('td', row).text()
      }

      if ($(row).attr('class') === 'full_table') {
        let team: TeamSeasonStats = {
          _id: _idx,
          name: $('th[data-stat="team_name"]', row).text(),
          team_id: ($('th[data-stat="team_name"]', row)
            .html()
            ?.match(/teams\/[\w]{3}\/2021.html/) || [''])[0]
            .replace(/teams\//, '')
            .replace(/\/2021.html/, ''),
          games: parseInt($('td[data-stat="games"]', row).text()),
          wins: parseInt($('td[data-stat="wins"]', row).text()),
          losses: parseInt($('td[data-stat="losses"]', row).text()),
          losses_ot: parseInt($('td[data-stat="losses_ot"]', row).text()),
          points: parseInt($('td[data-stat="points"]', row).text()),
          points_pct: parseFloat($('td[data-stat="points_pct"]', row).text()),
        }
        const found_conference = standings.find(
          (conference) => conference.name === currentConference
        )
        if (found_conference) {
          found_conference.teams.push(team)
        }
      }
    })

    return standings
  } catch (error) {
    console.log('error getting player Stats')
  }
}
