import React from 'react'
import styled, { keyframes } from 'styled-components'
import queryString from 'query-string'
import { color, radius, space, shadow } from 'styles'
import 'isomorphic-fetch'

const window = global.window

const SLACK_CLIENT_ID = '3033437246.378536499075'
const SLACK_SCOPE = 'identity.basic,identity.email,identity.avatar'

// TODO: move to server side
const SLACK_OAUTH_ENDPOINT = 'https://slack.com/api/oauth.access'
const SLACK_CLIENT_SECRET = 'dda7784c61ca1e5cc886506be8df269b'

const SLACK_IDENTITY_ENDPOINT = 'https://slack.com/api/users.identity'

const SLACK_STORAGE_KEY = '__slack_token'

const getHref = (append = '') => `https://slack.com/oauth/authorize?scope=${SLACK_SCOPE}&client_id=${SLACK_CLIENT_ID}${append}`

let _user = {}

export const withAuth = (Component) => class extends React.PureComponent {
  state = {
    user: _user
  }

  async componentDidMount () {
    if (!_user.name) {
      let token = window.localStorage.getItem(SLACK_STORAGE_KEY)
      if (!token) {
        const { code } = queryString.parse(window.location.search)
        if (code) {
          window.history.pushState(null, '', window.document.location.href.split('?')[0])
          const { access_token } = await (await fetch(`${SLACK_OAUTH_ENDPOINT}?client_id=${SLACK_CLIENT_ID}&client_secret=${SLACK_CLIENT_SECRET}&code=${code}`)).json()
          token = access_token
          window.localStorage.setItem(SLACK_STORAGE_KEY, token)
        }
      }

      const { user } = await (await fetch(`${SLACK_IDENTITY_ENDPOINT}?token=${token}`)).json()
      _user = user
      this.setState({ user })
    } else {
      this.setState({ user: _user })
    }
  }

  logout = () => {
    this.setState({ user: null })
    window.localStorage.removeItem(SLACK_STORAGE_KEY)
  }

  render() {
    const { user } = this.state
    return (
      <React.Fragment>
        {user && <Component {...this.state} {...this.props} logout={this.logout} />}
        {!user && <LoginModal />}
      </React.Fragment>
    )
  }
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${color.primary};
  display: flex;
  justify-content: center;
  align-items: center;
`

const Modal = styled.div`
  width: 320px;
  height: 360px;
  background: ${color.gray};
  box-shadow: 0 10px 30px ${shadow.medium};
  border-radius: ${radius.large};
  padding: ${space.medium};
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto auto;
  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    9% {
      opacity: 0;
    }
    10% {
      transform: scale(0.5, 0.1);
    }
    50% {
      opacity: 1;
      transform: scale(1, 0.1);
    }
    100% {
      transform: scale(1, 1);
    }
  `} 1s ease-in-out;
`

const elementEntrance = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const LogoContainer = styled.div`
  width: 150px;
  height: 150px;
  background: ${color.accent};
  margin: ${space.xlarge};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${elementEntrance} 2s ease-in-out;
`

const LoginLink = styled.a`
  background: ${color.primary};
  color: #fff;
  padding: ${space.medium};
  border-radius: ${radius.medium};
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  animation: ${elementEntrance} 2s ease-in-out;

  &:hover {
    opacity: 0.95;
  }
`

class LoginModal extends React.PureComponent {
  state = { href: getHref() }

  componentDidMount () {
    this.setState({ href: getHref(`&redirect=${window.document.location.href}`) })
  }

  render () {
    const { href } = this.state
    return (
      <Container>
        <Modal>
          <LogoContainer>
            <img alt='World Cup Logo' src='https://ucarecdn.com/d7da7842-d45c-4564-8ed7-6e59aa4ef67f/-/preview/100x100/-/format/webp/' />
          </LogoContainer>
          <LoginLink href={href}>
           Sign in with <b>Slack</b>
          </LoginLink>
        </Modal>
      </Container>
    )
  }
}

export default withAuth