# Install Node.js and Yarn globally
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn

# Run the server 
node src/server/server.js 