import moment from 'moment'

const FORMAT = 'YYYY/MM/DD'

export const processMatches = (obj, matches, teams, filter = (m, teams) => teams[m.home_team]) => {
  Object.keys(obj).forEach(g => {
    obj[g].matches.forEach(m => {
      const format = moment(m.date).format(FORMAT)
      if (filter(m, teams)) {
        if (matches[format]) {
          matches[format].push(m)
        } else {
          matches[format] = [m]
        }
      }
    })
  })
}