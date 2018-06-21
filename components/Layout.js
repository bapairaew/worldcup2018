import styled, { injectGlobal } from 'styled-components'
import { space, color, shadow, breakpoint } from 'styles'

injectGlobal`
  body {
    background: ${color.primary};
    -webkit-overflow-scrolling: touch;
  }
`

const sidebarSize = '250px'
const headerSize = '60px'

const Layout = styled.div`
  display: grid;
  grid-template-columns: ${sidebarSize} auto;
  min-height: 100vh;
  color: #fff;

  @media (max-width: ${breakpoint}px) {
    grid-template-columns: ${sidebarSize} 100%;
    overflow: hidden;
  }
`

Layout.Sidebar = styled.div`
  background: ${shadow.light};
  display: grid;
  grid-template-rows: 300px auto 60px;
  box-shadow: 0 0 30px ${shadow.light} inset;
  height: 100vh;
  overflow-x: hidden;
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

Layout.Sidebar.List.Hr = styled.hr`
  border-color: ${shadow.light};
`

Layout.Sidebar.List.Elite = styled.div`
  color: ${color.secondary};

  > * {
    opacity: 1 !important;
    cursor: default;
  }
`

Layout.Main = styled.div`
  padding: ${space.large};
  height: 100vh;
  overflow: auto;
  box-sizing: border-box;
  background: ${color.primary};
  transition: transform 300ms ease-in-out;

  @media (max-width: ${breakpoint}px) {
    padding: ${space.medium};
    transform: ${props => props.menuOpened ? 'translate(0, 0)' : `translate(-${sidebarSize}, 0)`};
  }
`

Layout.Main.Content = styled.div`
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: ${breakpoint}px) {
    padding-top: ${headerSize};
  }
`

Layout.Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: ${headerSize};
  width: 100%;
  display: none;
  color: #fff;
  padding: 0 ${space.medium};
  background: ${color.primary};
  transition: transform 300ms ease-in-out;

  @media (max-width: ${breakpoint}px) {
    margin-left: -${space.small};
    display: grid;
    align-items: center;
    transform: ${props => !props.menuOpened ? 'translate(0, 0)' : `translate(calc(${sidebarSize} + 8px), 0)`};
  }
`

export default Layout