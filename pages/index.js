import React from 'react'
import styled from 'styled-components'
import Page from 'components/Page'
import Text from 'components/Text'
import Bet from 'components/Bet'
import withData, { DataContext } from 'lib/with-data'
import moment from 'moment-timezone'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
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
    const { data: { matches = [], teams = [] }, bet } = this.props
    const date = moment().tz('Europe/Moscow').format(FORMAT)
    return (
      <Page page='index'>
        {matches ? (
          matches[date] ? (
            <DataContext.Consumer>
              {({ user: { id: slackid, token: slacktoken, bets = [] } = {}, refetch }) => (
                <Container>
                  {matches[date].map(m => (
                    <Bet
                      key={m.name}
                      {...m}
                      bet={bets.find(b => b.match === m.name)}
                      home_team={teams[m.home_team - 1]}
                      away_team={teams[m.away_team - 1]}
                      onBet={async (props) => {
                        const response = await bet({ slackid, slacktoken, match: m.name, team: props.team.id, amount: +props.value })
                        await refetch()
                        return response
                      }} />
                  ))}
                </Container>
              )}
            </DataContext.Consumer>
          ) : (
            <Text dusha tag='h1' size={3}>{process.browser && 'No Match'}</Text>
          )
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
  mutation bet (
    $slackid: String!
    $slacktoken: String!
    $match: Int!
    $team: Int!
    $amount: Int!
  ) {
    bet(
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
    bet: ({ slackid, slacktoken, match, team, amount }) =>  mutate({ variables: { slackid, slacktoken, match, team, amount } })
  })
})(withData(Index))
