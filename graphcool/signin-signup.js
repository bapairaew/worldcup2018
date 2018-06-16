const { fromEvent } = require('graphcool-lib')

const SLACK_CLIENT_ID = '3033437246.378536499075'
const SLACK_OAUTH_ENDPOINT = 'https://slack.com/api/oauth.access'
const SLACK_CLIENT_SECRET = 'dda7784c61ca1e5cc886506be8df269b'

module.exports = async (event) => {
  try {
    const { slackcode }  = event.data
    const graphcool = fromEvent(event)
    const api = graphcool.api('simple/v1')
    
    const { access_token, user } = await (await fetch(`${SLACK_OAUTH_ENDPOINT}?client_id=${SLACK_CLIENT_ID}&client_secret=${SLACK_CLIENT_SECRET}&code=${slackcode}`)).json()

    const query = `
      query {
        Player(slackid: "${user.id}") {
          id
        }
      }
    `

   const { Player } = await api.request(query)

   const mutation = Player ? `
    mutation {
      updatePlayer(
        id: "${Player.id}"
        slackid: "${user.id}"
        slacktoken: "${access_token}"
        name: "${user.name}"
        image: "${user.image_192}"
      ) {
        slackid
        slacktoken
        name
        image
        bets {
          id
          match
          team
          amount
		}
      }
    }` : `
    mutation {
      createPlayer(
        slackid: "${user.id}"
        slacktoken: "${access_token}"
        name: "${user.name}"
        image: "${user.image_192}"
      ) {
        slackid
        slacktoken
        name
        image
        bets {
          id
          match
          team
          amount
		}
      }
    }`

    const { updatePlayer, createPlayer } = await api.request(mutation)

    return {
      data: {
        slackid: user.id,
        slacktoken: access_token,
        name: user.name,
        image: user.image_192,
        bets: (updatePlayer || createPlayer).bets
      }
    }
  } catch (ex) {
    console.log(ex)
    return {
      error: ex
    }
  }
}