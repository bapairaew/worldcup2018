import React from 'react'
import styled from 'styled-components'
import Text from 'components/Text'
import { shadow, font, space } from 'styles'

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
  box-shadow: 2px 2px 5px ${shadow.light};
` 

const AvatarImagePlaceholder = AvatarImage.withComponent('div').extend`
  background: ${shadow.light};
`

const AvatarText = styled(Text)`
  text-align: center;
  margin: ${space.medium} 0 !important;
  font-weight: bold !important;
`

export default class Avatar extends React.PureComponent {
  render () {
    const { name, image } = this.props
    return (
      <Container>
        <LogoImage alt='World Cup 2018' src='https://ucarecdn.com/827fb52e-39e6-44e3-af72-3131d139e6bb/-/crop/154x45/0,110/-/format/webp/' />
        {image ? <AvatarImage alt={name} src={image} /> : <AvatarImagePlaceholder />}
        <AvatarText tag='h1' size={font.medium}>{name}</AvatarText>
      </Container>
    )
  }
}