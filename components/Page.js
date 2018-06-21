import React from 'react'
import Layout from 'components/Layout'
import RuleIcon from 'react-icons/lib/md/assignment'
import BetsIcon from 'react-icons/lib/md/monetization-on'
import MatchesIcon from 'react-icons/lib/md/timelapse'
import LeaderboardIcon from 'react-icons/lib/md/reorder'
import EjectIcon from 'react-icons/lib/md/launch'
import MenuIcon from 'react-icons/lib/md/menu'
import Avatar from 'components/Avatar'
import Link from 'next/link'
import { DataContext } from 'lib/with-data'
import ReactGA from 'react-ga'
import ElitePointIcon from 'react-icons/lib/md/stars'
import EliteIcon from 'react-icons/lib/md/view-module'
import EliteboardIcon from 'react-icons/lib/md/line-weight'

const formatter = new Intl.NumberFormat()
class Page extends React.PureComponent {
  state = { menuOpened: false }

  componentDidMount () {
    ReactGA.initialize('UA-120986356-1')
    ReactGA.pageview(window.location.pathname + window.location.search)
  }

  render () {
    const { page, children } = this.props
    const { menuOpened } = this.state

    return (
      <React.Fragment>
        <Layout>
          <Layout.Sidebar>
            <Layout.Sidebar.Header>
              <DataContext.Consumer>
                {({ user = {}, balance }) => (
                  <Avatar elite={user.elite > 0} name={user.name} image={user.image} balance={balance} />
                )}
              </DataContext.Consumer>
            </Layout.Sidebar.Header>
            <Layout.Sidebar.List>
              <Layout.Sidebar.List.Hr />
              <DataContext.Consumer>
                {({ user = {}, eliteBalance }) => user.elite > 0 ? (
                  <React.Fragment>
                    <Layout.Sidebar.List.Elite>
                      <Layout.Sidebar.List.Item>
                        <ElitePointIcon size={24} /> {formatter.format(eliteBalance)}
                      </Layout.Sidebar.List.Item>
                    </Layout.Sidebar.List.Elite>
                    <Link href='/elite'>
                      <a>
                        <Layout.Sidebar.List.Item active={page === 'elite'}>
                          <EliteIcon size={24} /> Elite
                        </Layout.Sidebar.List.Item>
                      </a>
                    </Link>
                    <Link href='/eliteboard'>
                      <a>
                        <Layout.Sidebar.List.Item active={page === 'eliteboard'}>
                          <EliteboardIcon size={24} /> Eliteboard
                        </Layout.Sidebar.List.Item>
                      </a>
                    </Link>
                    <Layout.Sidebar.List.Hr />
                  </React.Fragment>
                ) : null}
              </DataContext.Consumer>
              <Link href='/rule'>
                <a>
                  <Layout.Sidebar.List.Item active={page === 'rule'}>
                    <RuleIcon size={24} /> rule
                  </Layout.Sidebar.List.Item>
                </a>
              </Link>
              <Link href='/'>
                <a>
                  <Layout.Sidebar.List.Item active={page === 'index'}>
                    <BetsIcon size={24} /> Bets
                  </Layout.Sidebar.List.Item>
                </a>
              </Link>
              <Link href='/matches'>
                <a>
                  <Layout.Sidebar.List.Item active={page === 'matches'}>
                    <MatchesIcon size={24} /> Matches
                  </Layout.Sidebar.List.Item>
                </a>
              </Link>
              <Link href='/leaderboard'>
                <a>
                  <Layout.Sidebar.List.Item active={page === 'leaderboard'}>
                    <LeaderboardIcon size={24} /> Leaderboard
                  </Layout.Sidebar.List.Item>
                </a>
              </Link>
              <Layout.Sidebar.List.Hr />
            </Layout.Sidebar.List>
            <Layout.Sidebar.List>
              <DataContext.Consumer>
                {({ logout }) => (
                  <Layout.Sidebar.List.Item role='button' onClick={logout}>
                    <EjectIcon size={24} /> Logout
                  </Layout.Sidebar.List.Item>
                )}
              </DataContext.Consumer>
            </Layout.Sidebar.List>
          </Layout.Sidebar>
          <Layout.Main menuOpened={menuOpened}>
            <Layout.Main.Content>
              {children}
            </Layout.Main.Content>
          </Layout.Main>
        </Layout>
        <Layout.Header menuOpened={menuOpened}>
          <MenuIcon size={40} role='button' onClick={() => this.setState((state) => ({ menuOpened: !state.menuOpened }))} />
        </Layout.Header>
      </React.Fragment>
    )
  }
}

export default Page
