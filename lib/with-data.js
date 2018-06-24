import React from 'react'
import styled, { keyframes } from 'styled-components'
import queryString from 'query-string'
import { color, radius, space, shadow } from 'styles'
import { Query, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import moment from 'moment-timezone'
import { getOdd } from 'lib/god'
import 'isomorphic-fetch'

const window = global.window

const SLACK_CLIENT_ID = '3033437246.378536499075'
const SLACK_SCOPE = 'identity.basic,identity.email,identity.avatar'

const STORAGE_KEY = '__worldcup'

const getHref = (append = '') => `https://slack.com/oauth/authorize?scope=${SLACK_SCOPE}&client_id=${SLACK_CLIENT_ID}${append}`

const FORMAT = 'YYYYMMDD'

const processMatches = (matches, obj, teams, filter = (m, teams) => teams[m.home_team - 1]) => {
  Object.keys(obj || {}).forEach(g => {
    obj[g].matches.forEach(m => {
      const format = moment(m.date).tz('Europe/Moscow').format(FORMAT)
      if (filter(m, teams)) {
        if (matches[format]) {
          matches[format].push(m)
        } else {
          matches[format] = [m]
        }
      }
    })
  })
}

const getMatches = ({ groups, knockout, teams }) => {
  const matches = {}
  processMatches(matches, groups, teams)
  processMatches(matches, knockout, teams)
  Object.keys(matches || {}).forEach(m => {
    matches[m] = matches[m].sort((a, b) => a.date.localeCompare(b.date))
  })
  return matches
}

const PER_DAY = 1000
const START_DAY = moment('2018-06-13T00:00:00+08:00')

const findMatchFromGroup = (groups, _match) => {
  let match = null
  Object.keys(groups || {}).find(g => {
    const m = groups[g].matches.find(m => m.name === _match)
    if (m) match = m
    return m
  })
  return match
}

const findMatch = (data, match) => findMatchFromGroup(data.groups, match) || findMatchFromGroup(data.knockout, match)

export const getBalance = ({
  initial,
  data,
  bets = [],
  allOdds = [],
  ignoreUnfinished = false,
  ignoreMatch = x => false,
  now = moment()
}) => {
  initial = initial === undefined ? PER_DAY * now.diff(START_DAY, 'days') : initial
  const balance = bets.reduce((remaining, bet) => {
    const m = findMatch(data, bet.match)
    const odd = getOdd(m, allOdds)
    if (m && !ignoreMatch(m)) {
       if (!m.finished) {
        return remaining - (ignoreUnfinished ? 0 : bet.amount)
      } else if (m.winner === m.home_team || m.home_result > m.away_result) {
        return remaining + ((m.home_team === bet.team ? odd.home - 1 : -1) * bet.amount)
      } else if (m.winner === m.away_team || m.home_result < m.away_result) {
        return remaining + ((m.away_team === bet.team ? odd.away - 1 : -1) * bet.amount)
      } else if (m.home_result === m.away_result) {
        return remaining + ((-1 === bet.team ? odd.draw - 1 : -1) * bet.amount)
      }
    }
    return remaining
  }, initial)
  
  return balance
}

export const DataContext = React.createContext()

const getPlayer = gql`
  query ($slackid: String!) {
    Player (slackid: $slackid) {
      slackid
      slacktoken
      name
      image
      elite
      eliteBets {
        id
        match
        amount
        team
      }
      bets {
        id
        match
        amount
        team
      }
    }
  }
`

const getAllOdds = gql`
  query {
    allOdds {
      id
      away
      home
      draw
      match
    }
  }
`

const withData = (Component) => graphql(gql`
  mutation signInSignUp ($slackcode: String!) {
    signInSignUp(
      slackcode: $slackcode
    ) {
      slackid
      slacktoken
      name
      image
      bets
    }
  }
`, {
  props: ({ mutate }) => ({
    signInSignUp: (slackcode) => mutate({ variables: { slackcode } })
  })
})(class extends React.PureComponent {
  constructor () {
    super()
    const user = process.browser ? (JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null') || undefined) : undefined
    this.state = {
      data: {},
      user,
      initing: process.browser && !!queryString.parse(window.location.search).code,
      logout: () => {
        this.setState({ user: undefined })
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  async componentDidMount () {
    const data = await (await fetch('https://raw.githubusercontent.com/lsv/fifa-worldcup-2018/master/data.json')).json()
    this.setState({ data: { matches: getMatches(data), ...data } })
    console.log(getMatches(data))

    const { code } = queryString.parse(window.location.search)
    if (code) {
      window.history.pushState(null, '', window.document.location.href.split('?')[0])
      const { data: { signInSignUp: { slackid: id, slacktoken: token, name, image, bets } } } = await this.props.signInSignUp(code)
      const user = { id, token, name, image, bets }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      this.setState({ user, initing: false })
    }
  }

  render() {
    const { data, user, initing } = this.state
    const slackid = user && user.id
    return (
      <React.Fragment>
        {slackid ? (
          <Query query={getAllOdds}>
            {({ data: { allOdds = [] } = {}}) => (
              <Query query={getPlayer} variables={{ slackid }}>
                {({ data: { Player = {} } = {}, ...props}) => (
                  <DataContext.Provider value={{
                      ...this.state,
                      balance: data ? getBalance({ data, bets: Player.bets, allOdds }) : 0,
                      eliteBalance: data ? getBalance({ initial: Player.elite, data, bets: Player.eliteBets, allOdds }) : 0,
                      user: { id: Player.slackid, token: Player.slacktoken, ...Player },
                      allOdds,
                      ...props
                    }}>
                    <Component {...this.state} {...this.props} allOdds={allOdds} />
                  </DataContext.Provider>
                )}
              </Query>
            )}
          </Query>
        ) : (
          <DataContext.Provider value={this.state}>
            <Component {...this.state} {...this.props} />
          </DataContext.Provider>
        )}
        <LoginModal show={!user && !initing && process.browser} />
      </React.Fragment>
    )
  }
})

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
  z-index: 9999;
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
    const { show } = this.props
    const { href } = this.state

    return show ? (
      <Container>
        <Modal>
          <LogoContainer>
            <img alt='World Cup Logo' src='https://ucarecdn.com/d7da7842-d45c-4564-8ed7-6e59aa4ef67f/-/preview/100x100/-/format/png/' />
          </LogoContainer>
          <LoginLink href={href}>
          Sign in with <b>Slack</b>
          </LoginLink>
        </Modal>
      </Container>
    ) : null
  }
}

export default withData