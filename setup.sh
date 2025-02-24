#!/bin/bash

sudo apt-get update -y
sudo apt-get install -y unzip
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 
sudo apt install -y nodejs
sudo apt-get install -y mysql-server
sudo node -v
sudo npm -v
npm install express sequelize mysql2 dotenv
sudo groupadd csye6225
sudo useradd csye6225 --shell /usr/sbin/nologin -g csye6225

# Restart MySQL service
echo "Restarting MySQL service..."
sudo systemctl restart mysql


# Create MySQL Database
echo "Creating Database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS CloudWebAppcsye625;"

# Grant MySQL Access to the Private IP
echo "Granting MySQL access to private IP..."
sudo mysql -u root -p <<EOF
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root123';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
EOF

sudo mkdir -p /opt/webapp
sudo chmod 755 /opt/webapp

# Create .env file with MySQL credentials
echo "Creating .env file..."
sudo cp /tmp/.env /opt/webapp/.env <<EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=CloudWebAppcsye625
DB_PORT=3306
NODE_ENV=production
EOF

sudo chmod 644 /opt/webapp/.env
sudo chown csye6225:csye6225 /opt/webapp/.env


sudo cp /tmp/csye6225-aws.service /etc/systemd/system/
sudo cp /tmp/webapp.zip /opt/
sudo unzip /opt/webapp.zip -d /opt/webapp


cd /opt/webapp || exit

sudo chown -R csye6225:csye6225 /tmp/webapp.zip


sudo chown -R csye6225:csye6225 /opt/webapp
sudo chmod -R 755 /opt/webapp

sudo npm install
sudo chown csye6225:csye6225 node_modules

sudo mkdir -p /opt/webapp/logs
sudo chown -R csye6225:csye6225 /opt/webapp/logs


echo "Setup completed"
