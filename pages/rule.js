import React from 'react'
import Page from 'components/Page'
import Text from 'components/Text'
import withData from 'lib/with-data'

const Rule = ({ }) => (
  <Page page='rule'>
    <Text dusha tag='h1' size={3}>Rule</Text>
    <Text>Coming soon</Text>
  </Page>
)

export default withData(Rule)
