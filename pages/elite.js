import React from 'react'
import styled from 'styled-components'
import Page from 'components/Page'
import Text from 'components/Text'
import Bet from 'components/Bet'
import withData, { DataContext } from 'lib/with-data'
import moment from 'moment-timezone'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { getOdd } from 'lib/god'
import { breakpoint } from 'styles'

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  @media (max-width: ${breakpoint}px) {
    justify-content: center;
  }
`

const FORMAT = 'YYYYMMDD'

class Index extends React.PureComponent {
  render () {
    const { data: { matches = [], teams = [] }, eliteBet, allOdds = [] } = this.props
    const date = moment().tz('Europe/Moscow').format(FORMAT)
    const startedDate = moment('20180622')
    return (
      <Page page='elite'>
        {matches ? (
          <DataContext.Consumer>
            {({ user: { id: slackid, token: slacktoken, eliteBets = [], elite } = {}, refetch }) => elite > 0 ? (
              <Container>
                {Object.keys(matches)
                  .reduce((all, d) => all.concat(matches[d]), [])
                  .filter(m => moment(m.date).isAfter(startedDate))
                  .map(m => (
                    <Bet
                      key={m.name}
                      {...m}
                      bets={eliteBets.filter(b => b.match === m.name)}
                      home_team={teams[m.home_team - 1]}
                      away_team={teams[m.away_team - 1]}
                      odd={getOdd(m, allOdds)}
                      onBet={async (props) => {
                        const response = await eliteBet({ slackid, slacktoken, match: m.name, team: props.team.id, amount: +props.value })
                        await refetch()
                        return response
                      }} />
                  ))}
              </Container>
            ) : <Text dusha tag='h1' size={3}>Elite only</Text>}
          </DataContext.Consumer>
        ) : (
          <Container>
            {[0, 1, 2].map(m => (
              <Bet key={m} />
            ))}
          </Container>
        )}
      </Page>
    )
  }
}

export default graphql(gql`
  mutation eliteBet (
    $slackid: String!
    $slacktoken: String!
    $match: Int!
    $team: Int!
    $amount: Int!
  ) {
    eliteBet(
      slackid: $slackid
      slacktoken: $slacktoken
      match: $match
      team: $team
      amount: $amount
    ) {
      id
      match
      amount
      team
    }
  }
`, {
  props: ({ mutate }) => ({
    eliteBet: ({ slackid, slacktoken, match, team, amount }) => mutate({ variables: { slackid, slacktoken, match, team, amount } })
  })
})(withData(Index))
