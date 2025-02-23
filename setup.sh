#!/bin/bash

sudo apt-get update -y
sudo apt-get install -y unzip
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 
sudo apt install -y nodejs
sudo apt-get install -y mysql-server

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

# Create .env file
echo "Creating .env file..."
sudo bash -c 'cat > /opt/webapp/.env <<EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=CloudWebAppcsye625
DB_PORT=3306
NODE_ENV=production
EOF
'

sudo node -v
sudo npm -v

sudo groupadd csye6225

sudo mv /tmp/csye6225-aws.service /etc/systemd/system/
sudo unzip /tmp/webapp.zip -d /opt/webapp
sudo mv /tmp/.env /opt/webapp


sudo useradd -r -s /usr/sbin/nologin -m csye6225
sudo chown -R csye6225:csye6225 /tmp/webapp.zip

sudo chown -R csye6225:csye6225 /opt/webapp
sudo chown csye6225:csye6225 .env

sudo npm install

#sudo chown -R csye6225:csye6225 /opt/webapp
#sudo chown csye6225:csye6225 /opt/webapp/.env
#sudo npm install

sudo chown -R csye6225:csye6225 /opt/webapp
sudo chmod -R 755 /opt/webapp




