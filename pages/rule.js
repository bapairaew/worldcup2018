import React from 'react'
import styled from 'styled-components'
import Page from 'components/Page'
import Text from 'components/Text'
import withData from 'lib/with-data'
import { shadow, space } from 'styles'

const Container = styled.ol`
  padding: 0;
`

const Card = styled.li`
  display: grid;
  grid-template-columns: 50px auto;
  grid-column-gap: ${space.small};
  align-items: center;
  background: ${shadow.light};
  box-shadow: 0 3px 3px ${shadow.medium};
  padding: ${space.medium};
  margin: ${space.medium} 0;
`

const Rule = () => (
  <Page page='rule'>
    <Text tag='h1' dusha size={3} weight='bold'>Rule</Text>
    <Container>
      <Card>
        <Text>1.</Text>
        <Text>1,000 credits will be granted to you every day.</Text>
      </Card>
      <Card>
        <Text>2.</Text>
        <Text>Each match can be bet only once and there is no undo/change once the bet is placed.</Text>
      </Card>
      <Card>
        <Text>3.</Text>
        <Text>There are three options for betting - home team wins, away team wins, or draw.</Text>
      </Card>
      <Card>
        <Text>4.</Text>
        <Text>If your bet is correct, you will be given back the match's odd times of the betting amount.</Text>
      </Card>
      <Card>
        <Text>5.</Text>
        <Text>If your bet is incorrect, you will only be deducted by the betting amount.</Text>
      </Card>
    </Container>
  </Page>
)

export default withData(Rule)
