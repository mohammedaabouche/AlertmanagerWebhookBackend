# Use the official Node.js 14 image as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install -g pnpm
# Install the app dependencies
RUN pnpm install

# Copy the rest of the app source code to the working directory
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Start the app
CMD [ "pnpm", "run", "start:dev" ]


