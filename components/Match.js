import React from 'react'
import styled from 'styled-components'
import Text from 'components/Text'
import { color, space, shadow, font, radius } from 'styles'

const getColor = props => props.correct ? color.secondary : props.wrong ? color.red : props.draw ? shadow.dark : shadow.light

const Container = styled.div`
  display: grid;
  grid-template-rows: 60px auto;
  grid-template-columns: 60px 60px 30px 40px 30px 60px 60px;
  align-items: center;
  margin: ${space.large} ${space.large} ${space.large} 0;
  border-radius: 35px;
  border: 3px solid ${props=> getColor(props)};
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
  background: ${shadow.light};
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
`

const Amount = styled.div`
  position: absolute;
  top: 14px;
  left: 50%;
  width: 50px;
  margin-left: -40px;
  background: ${props=> getColor(props)};
  display: grid;
  align-items: center;
  justify-content: center;
  font-size: ${font.small}em;
  border-radius: ${radius.medium} ${radius.medium} 0 0;
`

export default ({ bet = {}, date, finished, home_team, away_team, home_result, away_result }) => {
  const correct = (bet.team === home_team.id && home_result > away_result) || (bet.team === away_team.id && home_result < away_result)
  const draw = home_result !== null && home_result === away_result
  const wrong = bet.id && !draw && finished && !correct
  return (
    <Wrapper>
      {bet.id && <Amount draw={draw} correct={correct} wrong={wrong}>{bet.amount}</Amount>}
      <Container draw={draw} correct={correct} wrong={wrong}>
        <FlagContainer left>
          {home_team.flag ? <Flag src={home_team.flag} alt={home_team.name} /> : <Placeholder />}
        </FlagContainer>
        <SubContainer>
          <StyledText>{home_team.fifaCode}</StyledText>
        </SubContainer>
        <SubContainer>
          <StyledText score>{home_result === null ? ' ' : home_result}</StyledText>
        </SubContainer>
        <Separator />
        <SubContainer>
          <StyledText score>{away_result === null ? ' ' : away_result}</StyledText>
        </SubContainer>
        <SubContainer>
          <StyledText>{away_team.fifaCode}</StyledText>
        </SubContainer>
        <FlagContainer>
          {away_team.flag ? <Flag src={away_team.flag} alt={away_team.name} /> : <Placeholder />}
        </FlagContainer>
      </Container>
    </Wrapper>
  )
}