#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Starting Coffee Kiosk API Tests..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run environment setup tests
echo -e "\nRunning environment setup tests..."
npm test tests/setup.test.js

# Run validation tests
echo -e "\nRunning validation tests..."
npm test tests/validation.test.js

# Run API integration tests
echo -e "\nRunning API integration tests..."
npm test tests/api.test.js

# Run token generation tests
echo -e "\nRunning token generation tests..."
npm test tests/generateToken.test.js

# Run callback tests
echo -e "\nRunning callback tests..."
npm test tests/callback.test.js

# Run all tests together
echo -e "\nRunning all tests together..."
npm test

echo -e "\n${GREEN}All tests completed!${NC}" 