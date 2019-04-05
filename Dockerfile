FROM node:slim

# Labels for GitHub
LABEL "com.github.actions.name"="Slack Bot Action"
LABEL "com.github.actions.description"="A GitHub Action that posts a message to Slack either from args or data from previous workflow Actions/steps"
LABEL "com.github.actions.icon"="share-2"
LABEL "com.github.actions.color"="purple"

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of action's code
COPY . .

# Run `node /index.js`
ENTRYPOINT ["node", "/index.js"]