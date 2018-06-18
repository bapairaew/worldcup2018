import React from 'react'
import styled from 'styled-components'
import Page from 'components/Page'
import Text from 'components/Text'
import Match from 'components/Match'
import moment from 'moment-timezone'
import withData, { DataContext } from 'lib/with-data'
import { breakpoint } from 'styles'
import 'isomorphic-fetch'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Header = styled(Text)`
  @media (max-width: ${breakpoint}px) {
    text-align: center;
  }
`

const calendarFormat = {
  sameDay: '[Today]',
  nextDay: '[Tomorrow]',
  nextWeek: 'dddd',
  lastDay: '[Yesterday]',
  lastWeek: '[Last] dddd',
  sameElse: 'dddd DD MMMM'
}

class Matches extends React.PureComponent {
  render () {
    const { matches, teams } = this.props.data
    return (
      <Page page='matches'>
        {!matches ? (
          <React.Fragment>
            <Header tag='h2' size={1.5}>Today</Header>
            <Container>
              {[0, 1, 2, 3].map(m => (
                <Match key={m} /> 
              ))}
            </Container>
          </React.Fragment>
        ) : (
          <DataContext.Consumer>
            {({ user: { id: slackid, token: slacktoken, bets = [] } = {} }) => (
              Object.keys(matches || {}).map(d => (
                <React.Fragment key={d}>
                  <Header tag='h2' size={1.5}>{moment(matches[d][0].date).tz('Europe/Moscow').calendar(null, calendarFormat)}</Header>
                  <Container>
                    {matches[d].map(m => (
                      <Match
                        key={m.name}
                        {...m}
                        bet={bets.find(b => b.match === m.name)}
                        home_team={teams[m.home_team - 1]}
                        away_team={teams[m.away_team - 1]} /> 
                    ))}
                  </Container>
                </React.Fragment>
              ))
            )}
          </DataContext.Consumer>
        )}
      </Page>
    )
  }
}

export default withData(Matches)
