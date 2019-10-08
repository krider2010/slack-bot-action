const core = require('@actions/core')
const { WebClient } = require('@slack/web-api')

async function run () {
  try {
    // Secret
    const slackToken = process.env.SLACK_BOT_TOKEN
    // Secret (optional)
    const convsersationID = process.env.CONVERSATION_ID
    // Input (if specified will be used, and must be at the root of the workspace)
    const message = process.env[core.getInput('var-name')]
    // Input (expected if a message is not provided)
    const messageString = core.getInput('message-string')

    if (!slackToken) {
      core.setFailed('This Action needs a valid Slack Token to run. Set it as part of your Action Secrets.')
    }
    const slackWebClient = new WebClient(slackToken)

    // This will be used to send the message to Slack
    var messageObject

    if (message) {
      try {
        messageObject = JSON.parse(message)
      } catch (err) {
        core.setFailed('The provided environmental message is not valid JSON! 💥')
      }
    } else {
      if (!messageString) {
        core.setFailed('An environmental message or a hardcoded message (JSON) needs to be provided and neither have! 💥')
      }

      try {
        messageObject = JSON.parse(messageString)
      } catch (err) {
        core.setFailed('The provided message is not valid JSON! 💥')
      }
    }

    // Allow for the conversation destination to already have been specified. For example, it might
    // have been set on preceeding Actions depending on what is going on). Though if supplied here
    // that will always take precedence.
    if (convsersationID) {
      messageObject.channel = '' + convsersationID
    }

    const postResult = await slackWebClient.chat.postMessage(messageObject)
    if (postResult.ok !== true) {
      core.setFailed('Unable to send Slack message: ' + postResult.error)
    }
    console.log('Slack message sent 🚀')
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
