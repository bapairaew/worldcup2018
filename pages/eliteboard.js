import React from 'react'
import styled from 'styled-components'
import Page from 'components/Page'
import Text from 'components/Text'
import Player from 'components/Player'
import withData, { DataContext, getBalance } from 'lib/with-data'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { space } from 'styles'

const allPlayers = gql`
  query {
    allPlayers {
      id
      name
      image
      elite
      eliteBets {
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

const Leaderboard = ({ data, allOdds }) => (
  <Query query={allPlayers}>
    {({ data: { allPlayers = [] } = {}, ...props}) => {
      const players = allPlayers
        .filter(x => x.elite > 0)
        .map(player => ({
          ...player,
          finishedBalance: getBalance({ initial: player.elite, data, bets: player.eliteBets, allOdds, ignoreUnfinished: true })
        }))
        .slice(0)
        .sort((a, b) => b.finishedBalance - a.finishedBalance)
      return (
        <Page page='eliteboard'>
          <DataContext.Consumer>
          {({ user: { elite } = {} }) => elite > 0 ? (
            <React.Fragment>
              <Text tag='h1' dusha size={3} weight='bold'>Eliteboard</Text>
              <Container>
                {!data.matches ? (
                  [0, 1, 2, 3].map((index) => (
                    <Player key={index} finishedBalance={0} rank={index + 1} />
                  ))
                ) : players.map((player, index) => (
                  <Player key={player.id} {...player} rank={index + 1} />
                ))}
              </Container>
            </React.Fragment>
          ) : <Text tag='h1' dusha size={3} weight='bold'>Elite only</Text>}
          </DataContext.Consumer>
        </Page>
      )
    }}
  </Query>
)

export default withData(Leaderboard)
