import React from 'react'
import styled, { keyframes } from 'styled-components'
import Page from 'components/Page'
import Text from 'components/Text'
import withData, { getBalance } from 'lib/with-data'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { space } from 'styles'
import moment from 'moment-timezone'
import { Line } from 'react-chartjs'
import { withRouter } from 'next/router'

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
  justify-content: center;
  align-items: center;
  min-height: 40vh;
`

const Soon = styled.span`
  font-size: 5em;
  animation-name: ${keyframes`
    0% {
      transform: rotate(20deg);
    }
    100% {
      transform: rotate(-20deg);
    }
  `};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
`

const Stats = ({ router, data }) => {
  const startDate = moment('2018-06-17T00:00:00+03:00')
  const dates = [...Array(moment().diff(startDate, 'days') + 1).keys()].map(i => startDate.clone().add({ days: i + 1 }))
  
  return (
    <Query query={allPlayers}>
      {({ data: { allPlayers = [] } = {}, ...props}) => {
        const series = dates.map(d => allPlayers
          .map(player => ({
            ...player,
            balance: getBalance({
              data,
              bets: player.bets,
              ignoreRemaining: true,
              ignoreMatch: m => moment(m.date).isAfter(d),
              now: d
            })
          })))
        
        const labels = dates.map(d => d.format('YYYY/MM/DD'))
        const datasets = series[0]
          .map((player, i) => ({
            label: player.name,
            fillColor: 'transparent',
            data: series.map((date, j) => series[j][i].balance)
          }))
        const options = {
          bezierCurve: false
        }
        return (
          <Page page='stats'>
            <Text tag='h1' dusha size={3} weight='bold'>Stats</Text>
            <Container>
              {router.query.lol === undefined ? (
                <React.Fragment>
                  <Soon>🤔</Soon>
                  <Soon>🤔</Soon>
                  <Soon>🤔</Soon>
                </React.Fragment>
              ) : (
                <Line data={{ labels, datasets }} options={options} width={1200} height={800} />
              )}
            </Container>
          </Page>
        )
      }}
    </Query>
  )
}
export default withRouter(withData(Stats))
