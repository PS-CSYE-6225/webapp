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
sudo mkdir -p /app/csye6225/
sudo unzip webapp.zip -d /app/csye6225/

# Update Folder Permissions
echo "Updating permissions..."
sudo chown -R cloudwebappuser:cloudwebappgroup /app/csye6225/
sudo chmod -R 755 /app/csye6225/

echo "Setup Complete!"
