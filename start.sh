#!/bin/bash

# Navigate to the server folder and start backend in the background
cd server || { echo "Server directory not found"; exit 1; }
node server.js &

# Navigate back and go to the client folder
cd ../client || { echo "Client directory not found"; exit 1; }

# Start React frontend
npm start
