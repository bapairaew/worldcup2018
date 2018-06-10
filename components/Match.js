import React from 'react'
import styled from 'styled-components'
import Text from 'components/Text'
import { color, space, shadow } from 'styles'

const Container = styled.div`
  display: grid;
  grid-template-columns: 80px 80px 30px 60px 30px 80px 80px;
  align-items: center;
  margin: ${space.large} ${space.large} ${space.large} 0;
`

const FlagContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
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
  font-size: 2em;
  font-weight: bold;
`

const Separator = styled.div`
  height: 100%;
  width: 60px;
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

export default ({ home_team, away_team, home_result, away_result }) => (
  <Container>
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
)