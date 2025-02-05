#!/bin/bash

# Update package lists
echo "Updating package lists..."
sudo apt update -y

# Upgrade system packages
echo "Upgrading system packages..."
sudo apt upgrade -y

# Install MySQL Server
echo "Installing MySQL..."
sudo apt install mysql-server -y

# Create MySQL Database
echo "Creating Database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS CloudWebAppcsye625;"

# Create Linux Group for Application
echo "Creating Linux Group..."
sudo groupadd cloudwebappgroup || echo "Group already exists."

# Create Linux User for Application
echo "Creating Linux User..."
sudo useradd -m -g cloudwebappgroup cloudwebappuser || echo "User already exists."

# Unzip Application

echo "Unzipping application..."
sudo apt install unzip -y
sudo mkdir -p /opt/csye6225/
sudo unzip webapp.zip -d /opt/csye6225/

# Update Folder Permissions
echo "Updating permissions..."
sudo chown -R cloudwebappuser:cloudwebappgroup /opt/csye6225/
sudo chmod -R 755 /opt/csye6225/

# Install Node.js (LTS version)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Create .env file with MySQL credentials
echo "Creating .env file..."
cat <<EOF | sudo tee /opt/csye6225/webapp/.env
DB_HOST=10.116.0.2
DB_USER=root
DB_PASSWORD=root123
DB_NAME=CloudWebAppcsye625
DB_PORT=3306
NODE_ENV=production
EOF

# Install Node.js Dependencies
echo "Installing Node.js dependencies..."
cd /opt/csye6225/webapp || exit 1
if [ -f "package.json" ]; then
    sudo -u cloudwebappuser npm install
sudo -u cloudwebappuser npm install express sequelize mysql dotenv
else
    echo " ERROR: package.json is missing. Cannot install dependencies."
    exit 1
fi

# Final Instructions to Run App Manually
echo "------------------------------------------"
echo "To manually run the application, execute the following commands:"
echo ""
echo "cd /opt/csye6225/webapp"
echo "node index.js"
echo "------------------------------------------"

echo "Setup Completed"
