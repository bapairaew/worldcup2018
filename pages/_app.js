import App, { Container } from 'next/app'
import React from 'react'
import withApolloClient from 'lib/with-apollo-client'
import { ApolloProvider } from 'react-apollo'
import { ToastContainer } from 'react-toastify'
import 'react-toastify-style'

class MyApp extends App {
  render () {
    const { Component, pageProps, apolloClient, user } = this.props
    return (
      <Container>
        <ToastContainer />
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApolloClient(MyApp)