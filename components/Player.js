import React from 'react'
import styled from 'styled-components'
import { font, shadow, space, breakpoint, emptyImage } from 'styles'

const formatter = new Intl.NumberFormat()

const Container = styled.div`
  display: grid;
  grid-template-columns: 120px 100px auto 200px;
  @media (max-width: ${breakpoint}px) {
    grid-template-columns: 20px 50px auto 80px;
  }
  grid-column-gap: ${space.small};
  align-items: center;
  background: ${shadow.light};
  box-shadow: 0 3px 3px ${shadow.medium};
  padding: ${space.medium};
  margin: ${space.medium} 0;
  width: 100%;
`

const Rank = styled.div`
  margin: 0 auto;
  font-size: ${font.xxlarge}em;
  font-weight: bold;
  text-align: center;
  @media (max-width: ${breakpoint}px) {
    font-size: ${font.medium}em;
  }
`

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 10px solid ${shadow.light};
  margin: 0 auto;
  @media (max-width: ${breakpoint}px) {
    width: 40px;
    height: 40px;
    border: 5px solid ${shadow.light};
  }
`

const Name = styled.div`
  font-size: 1.5em;
  margin: 0 ${space.medium};
  font-weight: bold;
  @media (max-width: ${breakpoint}px) {
    font-size: 1em;
    margin: 0 ${space.small};
  }
`

const BalanceContainer = styled.div`
  text-align: right;
  margin: 0 ${space.medium};
  @media (max-width: ${breakpoint}px) {
    margin: 0 ${space.small};
  }
`

const FinishedBalance = styled.div`
  font-size: ${font.xlarge}em;
  font-weight: bold;
  letter-spacing: 4px;
  @media (max-width: ${breakpoint}px) {
    font-size: ${font.medium}em;
    letter-spacing: 0;
  }
`

const Balance = styled.div`
  font-size: ${font.medium}em;
  @media (max-width: ${breakpoint}px) {
    font-size: ${font.small}em;
  }
`

const Ordinal = styled.span`
  @media (max-width: ${breakpoint}px) {
    font-size: 0.6em;
    display: block;
  }
`

// https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
const getGetOrdinal = (n) => ['st', 'nd', 'rd'][((n + 90) % 100 - 10) % 10 - 1] || 'th'

export default ({ rank, image, name, finishedBalance }) => (
  <Container>
    <Rank>
      <span>{rank}</span>
      <Ordinal>{getGetOrdinal(rank)}</Ordinal>
    </Rank>
    <Avatar src={image || emptyImage} alt={name} />
    <Name>{name}</Name>
    <BalanceContainer>
      <FinishedBalance>{formatter.format(finishedBalance)}</FinishedBalance>
      {/* <Balance>{formatter.format(balance)}</Balance> */}
    </BalanceContainer>
  </Container>
)