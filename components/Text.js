import React from 'react'
import styled from 'styled-components'
import { space, shadow } from 'styles'

// https://github.com/styled-components/styled-components/issues/1616
export const withDynamicTag = Component => {
  const bucket = Object.create(null)

  const DynamicTag = props => {
    const { tag } = props

    if (typeof tag !== 'string' || !styled.hasOwnProperty(tag)) {
      return React.createElement(Component, props)
    }

    if (bucket[tag] === undefined) {
      bucket[tag] = Component.withComponent(tag)
    }

    return React.createElement(bucket[tag], props)
  }

  const name = Component.displayName || Component.constructor.name

  if (name) {
    DynamicTag.displayName = `DynamicTag(${name})`
  }

  return DynamicTag
}


const Placeholder = styled.div`
  height: ${props => `${props.size || 1}em`};
  width: 100px;
  box-sizing: border-box;
  margin: ${space.small} 0;
  background: ${shadow.medium};
`

const Text = withDynamicTag(styled.span`
  font-size: ${props => `${props.size || 1}em`};
  font-weight: ${props => `${props.weight || 'normal'}`};
  margin: ${space.small} 0;
  ${props => props.dusha ? 'font-family: Dusha;' : ''}
`)

export default ({ children, ...props }) => (children !== undefined && children !== null) ? <Text {...props}>{children}</Text> : <Placeholder {...props} />