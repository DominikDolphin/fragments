# Created Oct 9th, 2023
# Last modified November 13th, 2023

# Stage 1: Build stage
FROM node:18-alpine3.17@sha256:8cdc5ff72de424adca7217dfc9a6c4ab3f244673789243d0559a6204e0439a24 AS build

LABEL maintainer="Dominik Thibaudeau <dthibaudeau@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Set environment variables for the build stage
ENV PORT=8080
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

# Set the working directory
WORKDIR /app

# Copy only the package files required for npm ci
COPY --chown=node:node package*.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --production

# Copy the source code
COPY --chown=node:node ./src ./src

# Stage 2: Runtime stage
FROM node:18-alpine3.17@sha256:8cdc5ff72de424adca7217dfc9a6c4ab3f244673789243d0559a6204e0439a24 AS runtime

# Set environment variables for the runtime stage
ENV PORT=8080
ENV NODE_ENV=production

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --chown=node:node --from=build /app .

# Copy our HTPASSWD file
COPY --chown=node:node ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
USER node
CMD ["node", "src/index.js"]

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD [ "curl", "-f", "http://localhost:${PORT}/v1/fragments" ] || exit 1;

