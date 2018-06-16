import React from 'react'
import Page from 'components/Page'
import Text from 'components/Text'
import withData from 'lib/with-data'

const Charts = ({ }) => (
  <Page page='charts'>
    <Text dusha tag='h1' size={3}>Charts</Text>
    <Text>Coming soon</Text>
  </Page>
)

export default withData(Charts)
