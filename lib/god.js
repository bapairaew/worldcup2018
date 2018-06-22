export const homeWin = (m) => m.winner === m.home_team || m.home_result > m.away_result
export const awayWin = (m) => m.winner === m.away_team || m.home_result < m.away_result
export const itDraw = (m) => (m.winner === undefined || m.winner === null) && m.home_result === m.away_result

export const winner = (m) => homeWin(m) ? 'home' : awayWin(m) ? 'away' : 'draw'

export const correctBet = (b, m) =>
  (b.team === m.home_team.id && homeWin(m)) ||
  (b.team === m.away_team.id && awayWin(m)) ||
  (b.team === -1 && itDraw(m))

export const defaultOdd = { home: 2, draw: 2, away: 2 }

export const getOdd = (m, allOdds = []) => (m && allOdds.find(o => o.match === m.name)) || defaultOdd