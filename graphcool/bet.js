const moment = require('moment-timezone')
const { fromEvent } = require('graphcool-lib')

const PER_DAY = 1000
const START_DAY = moment('2018-06-13T00:00:00+08:00')

const findMatchFromGroup = (groups, _match) => {
  let match = null
  Object.keys(groups || {}).find(g => {
    const m = groups[g].matches.find(m => m.name === _match)
    if (m) match = m
    return m
  })
  return match
}

const findMatch = (data, match) => findMatchFromGroup(data.groups, match) || findMatchFromGroup(data.knockout, match)

module.exports = async (event) => {
  try {
    const { slackid, slacktoken, match, team, amount } = event.data
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')
    
    const data = await (await fetch('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json')).json()
    
    const { Player } = await api.request(`
      query {
        Player(slackid: "${slackid}") {
          id
          slacktoken
          bets {
            id
            amount
            team
            match
          }
        }
      }
    `)
    
    if (!Player || (Player.slacktoken !== slacktoken)) {
      return {
        error: 'Unauthorized'
      }
    }
  
    const matchData = findMatch(data, match)
    if (moment(matchData.date).isBefore(moment())) {
      return {
        error: 'The match is already started/finished'
      }
    }

    const { allOdds } = await api.request(`
      query {
        allOdds {
          id
          away
          home
          draw
          match
        }
      }
    `)
    
    const defaultOdd = { home: 2, draw: 2, away: 2 }
    const getOdd = (m, allOdds) => (m && allOdds.find(o => o.match === m.name)) || defaultOdd

    const initial = PER_DAY * moment().diff(START_DAY, 'days')
    const balance = Player.bets.reduce((remaining, bet) => {
      const m = findMatch(data, bet.match)
      const odd = getOdd(m, allOdds)

      if (m) {
        if (!m.finished) {
          return remaining - bet.amount
        } else if (m.winner === m.home_team || m.home_result > m.away_result) {
          return remaining + ((m.home_team === bet.team ? odd.home - 1 : -1) * bet.amount)
        } else if (m.winner === m.away_team || m.home_result < m.away_result) {
          return remaining + ((m.away_team === bet.team ? odd.away - 1 : -1) * bet.amount)
        } else if (m.home_result === m.away_result) {
          return remaining + ((-1 === bet.team ? odd.draw - 1 : -1) * bet.amount)
        }
      }

      return remaining
    }, initial)

    if (balance >= amount) {
      const { createBet } = await api.request(`
        mutation {
          createBet (
            userId: "${Player.id}"
            amount: ${amount}
            match: ${match}
            team: ${team}
          ) {
            id
          }
        }
      `)

      if (createBet && createBet.id) {
        return {
          data: {
            id: createBet.id,
            amount,
            match,
            team
          }
        }
      }

      return {
        error: 'Unexpected error'
      }
    } else {
      return {
        error: 'Not enough coins to bet'
      }
    }
  } catch (ex) {
    return {
      error: ex
    }
  }
}