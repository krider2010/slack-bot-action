FROM node:slim

# Labels for GitHub
LABEL "com.github.actions.name"="Slack Bot Action"
LABEL "com.github.actions.description"="A GitHub Action that posts a message to Slack either from hardcoded strings or data from previous workflow Actions/steps"
LABEL "com.github.actions.icon"="hash"
LABEL "com.github.actions.color"="purple"

LABEL "repository"="http://github.com/krider2010/slack-bot-action"
LABEL "maintainer"="Claire Knight <krider2010@gmail.com>"
LABEL "version"="1.0.0"

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of action's code
COPY . .

# Run `node /index.js`
ENTRYPOINT ["node", "/index.js"]
