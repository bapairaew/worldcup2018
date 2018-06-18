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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 40vh;
`

const Leaderboard = ({ data }) => (
  <Query query={allPlayers}>
    {({ data: { allPlayers = [] } = {}, ...props}) => {
      const players = allPlayers
        .map(player => ({
          ...player,
          // balance: getBalance(data, player.bets),
          finishedBalance: getBalance({ data, bets: player.bets, ignoreUnfinished: true })
        }))
        .slice(0)
        .sort((a, b) => b.finishedBalance - a.finishedBalance)
      return (
        <Page page='leaderboard'>
          <Text tag='h1' dusha size={3} weight='bold'>Leaderboard</Text>
          <Container>
            {!data.matches ? (
              [0, 1, 2, 3].map((index) => (
                <Player key={index} finishedBalance={0} rank={index + 1} />
              ))
            ) : players.map((player, index) => (
              <Player key={player.id} {...player} rank={index + 1} />
            ))}
          </Container>
        </Page>
      )
    }}
  </Query>
)

export default withData(Leaderboard)
