import React from 'react'
import styled from 'styled-components'
import Text from 'components/Text'
import { color, space, shadow } from 'styles'

const Container = styled.div`
  display: grid;
  grid-template-columns: 200px 200px;
  grid-column-gap: 3px;
  grid-template-rows: 250px 40px;
  grid-row-gap: 3px;
  align-items: center;
  justify-content: center;
  margin: ${space.large} ${space.large} ${space.large} 0;
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 60px;
    height: 60px;
    margin-left: -30px;
    margin-top: -50px;
    border: 2px solid ${color.primary};
    border-radius: 50%;
  }
`

const Flag = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 0 0 6px ${color.primary};
  margin: ${space.medium};
`

const Team = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  background: ${shadow.light};
`

const Bet = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${shadow.medium};
  height: 100%;
  cursor: pointer;
  box-shadow: 0 0 10px ${shadow.medium};
`

export default ({ home_team, away_team, home_result, away_result }) => (
  <Container>
    <Team>
      <Flag src={home_team.flag} alt={home_team.name} />
      <Text tag='h2' size={2}>{home_team.fifaCode}</Text>
    </Team>
    <Team>
      <Flag src={away_team.flag} alt={away_team.name} />
      <Text tag='h2' size={2}>{away_team.fifaCode}</Text>
    </Team>
    <Bet role='button'>
      <Text size={1} weight='bold'>Bet</Text>
    </Bet>
    <Bet role='button'>
      <Text size={1} weight='bold'>Bet</Text>
    </Bet>
  </Container>
)