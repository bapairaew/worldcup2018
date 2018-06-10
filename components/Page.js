import React from 'react'
import withAuth from 'lib/with-auth'
import Layout from 'components/Layout'
import CalendarIcon from 'react-icons/lib/ti/calendar'
import ChartIcon from 'react-icons/lib/ti/chart-line-outline'
import ClipboardIcon from 'react-icons/lib/ti/clipboard'
import EjectIcon from 'react-icons/lib/ti/eject'
import BookIcon from 'react-icons/lib/ti/book'
import TimeIcon from 'react-icons/lib/ti/time'
import Avatar from 'components/Avatar'
import Link from 'next/link'

const Page = ({ page, children, user = {}, logout = x => x }) => (
  <Layout>
    <Layout.Sidebar>
      <Layout.Sidebar.Header>
        <Avatar name={user.name} image={user.image_192} />
      </Layout.Sidebar.Header>
      <Layout.Sidebar.List>
        <Link href='/rule'>
          <a>
            <Layout.Sidebar.List.Item active={page === 'rule'}>
              <BookIcon size={24} /> rule
            </Layout.Sidebar.List.Item>
          </a>
        </Link>
        <Link href='/'>
          <a>
            <Layout.Sidebar.List.Item active={page === 'index'}>
              <CalendarIcon size={24} /> Bets
            </Layout.Sidebar.List.Item>
          </a>
        </Link>
        <Link href='/matches'>
          <a>
            <Layout.Sidebar.List.Item active={page === 'matches'}>
              <TimeIcon size={24} /> Matches
            </Layout.Sidebar.List.Item>
          </a>
        </Link>
        <Link href='/leaderboard'>
          <a>
            <Layout.Sidebar.List.Item active={page === 'leaderboard'}>
              <ClipboardIcon size={24} /> Leaderboard
            </Layout.Sidebar.List.Item>
          </a>
        </Link>
        <Link href='/charts'>
          <a>
            <Layout.Sidebar.List.Item active={page === 'charts'}>
              <ChartIcon size={24} /> Charts
            </Layout.Sidebar.List.Item>
          </a>
        </Link>
      </Layout.Sidebar.List>
      <Layout.Sidebar.List>
        <Layout.Sidebar.List.Item role='button' onClick={logout}>
          <EjectIcon size={24} /> Logout
        </Layout.Sidebar.List.Item>
      </Layout.Sidebar.List>
    </Layout.Sidebar>
    <Layout.Main>
      {children}
    </Layout.Main>
  </Layout>
)

export default withAuth(Page)
