import React from 'react'
import styled from 'styled-components'
import Page from 'components/Page'
import Text from 'components/Text'
import Player from 'components/Player'
import withData, { getBalance } from 'lib/with-data'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { space } from 'styles'

const allPlayers = gql`
  query {
    allPlayers {
      id
      name
      image
      bets {
        id
        match
        team
        amount
      }
    }
  }
`

const Container = styled.div`
  padding: ${space.medium} 0;
`

const Leaderboard = ({ data }) => (
  <Query query={allPlayers}>
    {({ data: { allPlayers = [] } = {}, ...props}) => {
      const players = allPlayers
        .map(player => ({
          ...player,
          finishedBalance: getBalance(data, player.bets, true),
          balance: getBalance(data, player.bets)
        }))
        .slice(0)
        .sort((a, b) => b.finishedBalance - a.finishedBalance)
      return (
        <Page page='leaderboard'>
          <Text tag='h1' dusha size={3} weight='bold'>Leaderboard</Text>
          <Container>
            {players.map((player, index) => (
              <Player key={player.id} {...player} rank={index + 1} />
            ))}
          </Container>
        </Page>
      )
    }}
  </Query>
)

export default withData(Leaderboard)
