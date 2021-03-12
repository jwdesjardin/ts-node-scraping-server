import axios from 'axios'
import cheerio from 'cheerio'
import { Injury } from './types'

export const getInjuries = async (): Promise<Injury[] | undefined> => {
  // initialize an array of goalies to return
  try {
    // load the goalies scoring page and access DOM with cheerio
    const { data } = await axios.get(`https://www.hockey-reference.com/friv/injuries.cgi`)
    const $ = cheerio.load(data)

    const injuryTable = $('tbody', '#injuries')

    let injuries: Injury[] = []
    $('tr', injuryTable).each((_idx, row) => {
      let injury: Injury = {
        id: _idx,
        player: $('th[data-stat="player"]>a', row).text(),
        player_id: $('th[data-stat="player"]', row).attr('data-append-csv') || '',
        team: $('td[data-stat="team_name"]', row).text(),
        team_id: ($('td[data-stat="team_name"]', row)
          .html()
          ?.match(/teams\/[\w]{3}\//) || [''])[0]
          .replace(/teams\//, '')
          .replace(/\//, ''),
        date: $('td[data-stat="date_injury"]', row)
          .text()
          .replace(/[\w]{3},\s/, ''),
        type: $('td[data-stat="injury_type"]', row).text(),
        note: $('td[data-stat="injury_note"]', row).text(),
      }

      injuries.push(injury)
    })

    console.log(injuries)

    return injuries
  } catch (error) {
    console.log('error getting injuries')
  }
}
