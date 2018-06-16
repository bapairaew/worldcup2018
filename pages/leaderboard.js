import React from 'react'
import Page from 'components/Page'
import Text from 'components/Text'
import withData from 'lib/with-data'

const Leaderboard = ({ }) => (
  <Page page='leaderboard'>
    <Text dusha tag='h1' size={3}>Leaderboard</Text>
    <Text>Coming soon</Text>
  </Page>
)

export default withData(Leaderboard)
