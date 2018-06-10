import React from 'react'
import styled from 'styled-components'
import Page from 'components/Page'
import Text from 'components/Text'
import Match from 'components/Match'
import moment from 'moment'
import { processMatches } from 'lib/matches'
import 'isomorphic-fetch'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export default class extends React.PureComponent {
  state = {
    matches: {},
    teams: {}
  }

  async componentDidMount () {
    const { teams, groups, knockout } = await (await fetch('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json')).json()
    const matches = {}
    const now = moment()
    const filter = (m, teams) => teams[m.home_team] && moment(m.date).isAfter(now)
    processMatches(groups, matches, teams, filter)
    processMatches(knockout, matches, teams, filter)
    this.setState({ teams, matches })
  }

  render () {
    const { matches, teams } = this.state
    const d = Object.keys(matches)[0]
    return (
      <Page page='index'>
        {d ? (
          <React.Fragment>
            <Text dusha tag='h1' size={3}>{moment(matches[d][0].date).calendar()}</Text>
            <Container>
              {matches[d].map(m => <Match key={m.name} {...m} home_team={teams[m.home_team - 1]}  away_team={teams[m.away_team - 1]} />)}
            </Container>
          </React.Fragment>
        ) : (
          <Text dusha tag='h1' size={3}>{process.browser && 'No Match'}</Text>
        )}
      </Page>
    )
  }
}
