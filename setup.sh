#!/bin/bash

export DEBIAN_FRONTEND=noninteractive
sudo apt-get update -y
sudo apt-get install -y mysql-server


# Upgrade system packages
echo "Upgrading system packages..."
sudo apt upgrade -y



# Configure MySQL to allow remote connections
sudo sed -i 's/^bind-address\s*=.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# Restart MySQL service
echo "Restarting MySQL service..."
sudo systemctl restart mysql

# Create MySQL Database
echo "Creating Database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS CloudWebAppcsye625;"

# Grant MySQL Access
echo "Granting MySQL access..."
sudo mysql -u root -p <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root123';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
EOF

# Create Linux Group and User
echo "Creating Linux Group..."
sudo groupadd cloudwebappgroup || echo "Group already exists."

echo "Creating Linux User..."
sudo useradd -m -g cloudwebappgroup cloudwebappuser || echo "User already exists."

# Install Dependencies
echo "Installing dependencies..."
sudo apt install -y unzip curl

# Install Node.js
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Create Application Directory
echo "Creating application directory..."
sudo mkdir -p /opt/webapp
sudo chown -R cloudwebappuser:cloudwebappgroup /opt/webapp

# Copy and Extract Web App
echo "Unzipping application..."
sudo mv /tmp/csye6225-aws.service /etc/systemd/system
sudo unzip /tmp/webapp.zip -d /opt/webapp
sudo mv /tmp/.env /opt/webapp

node -v
npm -v

   # Create and Set ownership csye6225 user with no login shell
sudo useradd -r -s /usr/sbin/nologin -m cloudwebappuser
sudo chown -R cloudwebappuser:cloudwebappgroup /tmp/webapp.zip
# Set Permissions
echo "Updating permissions..."
sudo chown -R cloudwebappuser:cloudwebappgroup /opt/webapp
sudo chmod -R 755 /opt/webapp

# Create .env file
echo "Creating .env file..."
sudo bash -c 'cat > /opt/webapp/.env <<EOF
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=root123
DB_NAME=CloudWebAppcsye625
DB_PORT=3306
NODE_ENV=production
EOF
'

sudo chmod 600 /opt/webapp/.env
sudo chown cloudwebappuser:cloudwebappgroup /opt/webapp/.env

# Install Node.js Dependencies
echo "Installing Node.js dependencies..."
cd /opt/webapp || exit 1
if [ -f "package.json" ]; then
    sudo -u cloudwebappuser npm install
else
    echo "ERROR: package.json is missing. Cannot install dependencies."
    exit 1
fi

echo "Setup Completed"
