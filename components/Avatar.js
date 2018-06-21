import React from 'react'
import styled from 'styled-components'
import Text from 'components/Text'
import BalanceIcon from 'react-icons/lib/md/account-balance-wallet'
import { color,   shadow, font, space } from 'styles'

const formatter = new Intl.NumberFormat()

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const LogoImage = styled.img`
  width: 154px;
  height: 45px;
  margin-bottom: 40px;
`

const AvatarImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  box-shadow: 0 0 0 6px ${props => props.elite ? color.secondary : color.primary};
` 

const AvatarImagePlaceholder = AvatarImage.withComponent('div').extend`
  background: ${shadow.light};
`

const AvatarText = styled(Text)`
  text-align: center;
  margin: ${space.medium} 0 0 0 !important;
  font-weight: bold !important;
`

const BalanceText = styled(Text)`
  text-align: center;
  margin: ${space.small} 0 0 !important;
  color: ${color.secondary};
  display: grid;
  grid-template-columns: 15px auto;
  align-items: center;
`

export default class Avatar extends React.PureComponent {
  render () {
    const { elite, name, image, balance } = this.props
    return (
      <Container>
        <LogoImage alt='World Cup 2018' src='https://ucarecdn.com/827fb52e-39e6-44e3-af72-3131d139e6bb/-/crop/154x45/0,110/-/format/png/' />
        {image ? <AvatarImage elite={elite} alt={name} src={image} /> : <AvatarImagePlaceholder />}
        <AvatarText tag='h1' size={font.medium}>{name}</AvatarText>
        <BalanceText size={font.small}><BalanceIcon />{formatter.format(balance)}</BalanceText>
      </Container>
    )
  }
}