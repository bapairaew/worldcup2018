import React from 'react'
import Layout from 'components/Layout'
import RuleIcon from 'react-icons/lib/md/assignment'
import BetsIcon from 'react-icons/lib/md/monetization-on'
import MatchesIcon from 'react-icons/lib/md/timelapse'
import ChartsIcon from 'react-icons/lib/md/show-chart'
import LeaderboardIcon from 'react-icons/lib/md/reorder'
import EjectIcon from 'react-icons/lib/md/launch'
import MenuIcon from 'react-icons/lib/md/menu'
import Avatar from 'components/Avatar'
import Link from 'next/link'
import { DataContext } from 'lib/with-data'

class Page extends React.PureComponent {
  state = { menuOpened: false }

  render () {
    const { page, children } = this.props
    const { menuOpened } = this.state

    return (
      <Layout>
        <Layout.Sidebar>
          <Layout.Sidebar.Header>
            <DataContext.Consumer>
              {({ user, balance }) => (
                <Avatar name={user && user.name} image={user && user.image} balance={balance} />
              )}
            </DataContext.Consumer>
          </Layout.Sidebar.Header>
          <Layout.Sidebar.List>
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
            <Link href='/charts'>
              <a>
                <Layout.Sidebar.List.Item active={page === 'charts'}>
                  <ChartsIcon size={24} /> Charts
                </Layout.Sidebar.List.Item>
              </a>
            </Link>
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
          <Layout.Main.Header>
            <MenuIcon size={40} role='button' onClick={() => this.setState((state) => ({ menuOpened: !state.menuOpened }))} />
          </Layout.Main.Header>
          <Layout.Main.Content>
            {children}
          </Layout.Main.Content>
        </Layout.Main>
      </Layout>
    )
  }
}

export default Page
