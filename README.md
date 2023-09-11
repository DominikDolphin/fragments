# fragments
Cloud Computing Lab 1

# Set up
To start up the project, as for any node project, run the ```npm install``` command to download the dependencies.

Then, you can start the server up with ```npm start```

Or run it in dev mode with ```npm run dev```

Or run it in debug mode with ```npm run debug```

# Coding
This project is using ESLint to maintain code quality by enforcing coding standards including style violations and errors.
This also helps for future maintainability and readability. 
Run ESLint with the command ```npm run lint```

# Formatting JSON
We can use the command ```curl -s localhost:8080 | jq``` to have formatted JSON. How this works is that it sends an HTTP request to our server and retrieves JSON data and we use the pipe to jq to make it more human-readable.
