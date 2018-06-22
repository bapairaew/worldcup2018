import React from 'react'
import styled from 'styled-components'
import Text from 'components/Text'
import { color, space, shadow, font, radius, breakpoint } from 'styles'
import { correctBet, getOdd } from 'lib/god'

const formatter = new Intl.NumberFormat()
const getColor = props => props.correct ? color.secondary : props.wrong ? color.red : shadow.light

const Container = styled.div`
  display: grid;
  grid-template-rows: 60px auto;
  grid-template-columns: 60px 60px 30px 40px 30px 60px 60px;
  align-items: center;
  margin: ${space.large} ${space.large} ${space.large} 0;
  border-radius: 35px;
  border: 3px solid ${props=> getColor(props)};
  @media (max-width: ${breakpoint}px) {
    margin: ${space.large} 0;
  }
`

const FlagContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 50%;
    background: ${shadow.medium};
    ${props => props.left ? 'left: 50%;' : 'right: 50%;'}
  }
`

const Flag = styled.img`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  object-fit: cover;
`

const Placeholder = Flag.withComponent('div').extend`
  background: ${color.primary};
`

const SubContainer = styled.div`
  height: 100%;
  background: ${shadow.medium};
  display: grid;
  justify-content: center;
  align-items: center;
`

const StyledText = styled(Text)`
  color: ${props => props.score ? '#fff' : color.primary};
  font-size: 1.5em;
  font-weight: bold;
`

const Separator = styled.div`
  height: 100%;
  width: 40px;
  background: ${shadow.medium};
  position: relative;
  &::before {
    content: '';
    position: absolute;
    height: 100%;
    left: 50%;
    width: 2px;
    margin-left: -1px;
    background: ${color.primary};
  }
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 30px;
    height: 30px;
    margin-left: -17px;
    margin-top: -15px;
    border: 2px solid ${color.primary};
    border-radius: 50%;
  }
`

const Wrapper = styled.div`
  position: relative;
  @media (max-width: ${breakpoint}px) {
    margin: 0 auto;
  }
`

const Amount = styled.div`
  position: absolute;
  top: 14px;
  ${props => props.position === 'left' ? `
    left: 0;
    margin-left: 30px;
  ` : props.position === 'right' ? `
    right: 0;
    margin-right: 65px;
    @media (max-width: ${breakpoint}px) {
      margin-right: 30px;
    }
  ` : `
    left: 50%;
    margin-left: -55px;
    @media (max-width: ${breakpoint}px) {
      margin-left: -40px;
    }
  `};
  width: 80px;
  background: ${props=> getColor(props)};
  display: grid;
  align-items: center;
  justify-content: center;
  font-size: ${font.small}em;
  border-radius: ${radius.medium} ${radius.medium} 0 0;
`

const getResults = (_, team, match, finished, odds, type) => {
  const bets = _.filter(b => b.team === team.id)
  const bet = bets[0] || {}
  const correct = finished && correctBet(bet, match)
  const wrong = bet.id && finished && !correct
  const odd = getOdd(match, odds)[type]
  const amount = bets.reduce((sum, b) => sum + b.amount, 0)
  return {
    correct,
    wrong,
    amount,
    adjustedAmount: correct ? odd * amount : amount
  }
}

export default ({ bets = [], allOdds, finished, name, home_team = {}, away_team = {}, home_result = null, away_result = null, winner = null }) => {
  const match = { name, home_team, away_team, home_result, away_result, winner }
  const home = getResults(bets, home_team, match, finished, allOdds, 'home')
  const draw = getResults(bets, { id: -1 }, match, finished, allOdds, 'draw')
  const away = getResults(bets, away_team, match, finished, allOdds, 'away')
  const winning = [home, draw, away].reduce((sum, g) => (g.correct ? g.adjustedAmount : 0) + sum, 0)
  const losing = [home, draw, away].reduce((sum, g) => (!g.correct ? g.adjustedAmount : 0) + sum, 0)
  return (
    <Wrapper>
      {home.amount ? <Amount position='left' {...home}>{!finished ? home.amount : formatter.format(home.adjustedAmount)}</Amount> : null}
      {draw.amount ? <Amount position='center' {...draw}>{!finished ? draw.amount : formatter.format(draw.adjustedAmount)}</Amount> : null}
      {away.amount ? <Amount position='right' {...away}>{!finished ? away.amount : formatter.format(away.adjustedAmount)}</Amount> : null}
      <Container correct={finished && winning > losing} wrong={finished && winning < losing}>
        <FlagContainer left>
          {home_team.flag ? <Flag src={home_team.flag} alt={home_team.name} /> : <Placeholder />}
        </FlagContainer>
        <SubContainer>
          <StyledText dusha>{home_team.fifaCode}</StyledText>
        </SubContainer>
        <SubContainer>
          <StyledText score>{home_result === null ? ' ' : home_result}</StyledText>
        </SubContainer>
        <Separator />
        <SubContainer>
          <StyledText score>{away_result === null ? ' ' : away_result}</StyledText>
        </SubContainer>
        <SubContainer>
          <StyledText dusha>{away_team.fifaCode}</StyledText>
        </SubContainer>
        <FlagContainer>
          {away_team.flag ? <Flag src={away_team.flag} alt={away_team.name} /> : <Placeholder />}
        </FlagContainer>
      </Container>
    </Wrapper>
  )
}