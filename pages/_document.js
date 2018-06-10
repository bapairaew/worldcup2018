import Document, { Head, Main, NextScript } from 'next/document'
import { injectGlobal, ServerStyleSheet } from 'styled-components'
import MobileDetect from 'mobile-detect'

const FONT_FAMILY = 'Open Sans'

injectGlobal`
  body {
    margin: 0;
    font-family: ${FONT_FAMILY}, sans-serif;
    font-size: 16px;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  @font-face {
    font-family: 'Dusha';
    src: url('/static/dusha-regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
  }
`

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage, req }) {
    const md = new MobileDetect(req.headers['user-agent'])
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags, isMoblie: md.mobile() }
  }

  render () {
    const { isMoblie } = this.props
    return (
      <html>
        <Head>
          <title>World Cup</title>
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <link rel='shortcut icon' href='https://ucarecdn.com/d7da7842-d45c-4564-8ed7-6e59aa4ef67f/-/preview/32x32/-/format/png/' />
          <link href={`https://fonts.googleapis.com/css?family=${FONT_FAMILY}`} rel='stylesheet' />
          {this.props.styleTags}
        </Head>
        <body>
          {!isMoblie ? (
            <React.Fragment>
              <Main />
              <NextScript />
            </React.Fragment>
          ) : (
            <h1>Mobile version is coming soon (probably).</h1>
          )}
        </body>
      </html>
    )
  }
}