const { Toolkit } = require('actions-toolkit')
const { WebClient } = require('@slack/web-api')
const fse = require('fs-extra')
const path = require('path')

// Run your GitHub Action!
Toolkit.run(async tools => {
  const slackToken      = process.env.SLACK_TOKEN       // Secret
  const convsersationID = proccess.env.CONVERSATION_ID  // Secret (optional)
  const filename        = process.env.MESSAGE_FILE      // Env (if specified will be used, and must be at the root of the workspace)
  const messageString   = process.env.MESSAGE_STRING    // Env (expected if filename is not provided)

  if (!slackToken) {
    tools.exit.failure('This Action needs a valid Slack Token to run. Set it as part of your Action Secrets.')
  }
  const slackWebClient =  new WebClient(slackToken)

  // This will be used to send the message to Slack
  var messageObject

  if (filename) {
    const pathToFile = path.join(tools.workspace, filename)
    messageObject = fse.readJSONSync(pathToFile, { throws: false })

    if (!messageObject) {
      tools.exit.failure('A workspace file was specified but it could not be found or contains invalid JSON.')
    }
  } else {
    if (!messageString) {
      tools.exit.failure('A workspace file or a valid message of JSON needs to be provided and neither have! 💥')
    }

    var messageObject
    try {
      messageObject = JSON.parse(messageString)
    } catch(e) {
      tools.exit.failure('The provided message is not valid JSON! 💥')
    }
  }

  // Allow for the conversation destination to already have been specified. For example, it might
  // have been set on preceeding Actions depending on what is going on). Though if supplied here
  // that will always take precedence.
  if (convsersationID) {
    messageObject.channel = '' + convsersationID
  }

  const postResult = await slackWebClient.chat.postMessage(messageObject)
  if (postResult.ok === true) {
    tools.exit.success('Slack message sent 🚀')
  } else {
    tools.exit.failure('Unable to send Slack message: ' + postResult.error)
  }
})
