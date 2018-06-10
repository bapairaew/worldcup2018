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
    processMatches(groups, matches, teams)
    processMatches(knockout, matches, teams)
    this.setState({ teams, matches })
  }

  render () {
    const { matches, teams } = this.state
    return (
      <Page page='matches'>
        <Text dusha tag='h1' size={3}>{process.browser && 'Matches'}</Text>
        {Object.keys(matches).sort((a, b) => a.localeCompare(b)).map(d => (
          <React.Fragment key={d}>
            <Text dusha tag='h2' size={1.5}>{moment(matches[d][0].date).fromNow()}</Text>
            <Container>
              {matches[d].map(m => <Match key={m.name} {...m} home_team={teams[m.home_team - 1]}  away_team={teams[m.away_team - 1]} />)}
            </Container>
          </React.Fragment>
        ))}
      </Page>
    )
  }
}
