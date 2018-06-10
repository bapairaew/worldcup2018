import styled from 'styled-components'
import { space, color, shadow } from 'styles'

const Layout = styled.div`
  display: grid;
  grid-template-columns: 250px auto;
  background: ${color.primary};
  min-height: 100vh;
  color: #fff;
`

Layout.Sidebar = styled.div`
  background: ${shadow.light};
  display: grid;
  grid-template-rows: 300px auto 60px;
  box-shadow: 0 0 30px ${shadow.light} inset;
  height: 100vh;
`

Layout.Sidebar.Header = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

Layout.Sidebar.List = styled.nav`
  padding: 0;
  margin: 0;
`

Layout.Sidebar.List.Item = styled.span`
  padding: ${space.medium};
  font-weight: bold;
  display: grid;
  grid-template-columns: 25px auto;
  grid-column-gap: ${space.small};
  align-items: center;
  list-style: none;
  opacity: 0.3;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;

  &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 2em;
    margin-top: -1em;
    right: 0;
    top: 50%;
    background: currentColor;
    opacity: 0;
  }

  ${props => props.active ? `
    opacity: 1 !important;
    color: ${color.secondary};
    background: ${shadow.light};
    &::after {
      opacity: 1;
    }
  ` : ''};

  &:hover {
    opacity: 0.6;
  }
`

Layout.Main = styled.div`
  padding: ${space.large};
  height: 100vh;
  overflow: auto;
  box-sizing: border-box;
`

export default Layout