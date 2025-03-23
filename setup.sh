#!/bin/bash

sudo apt-get update -y
sudo apt-get install -y unzip
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 
sudo apt install -y nodejs
sudo apt-get install -y mysql-server
sudo node -v
sudo npm -v
npm install dotenv
sudo npm install -g statsd
sudo npm install -g statsd-cloudwatch-backend
sudo apt-get install -y wget
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
rm amazon-cloudwatch-agent.deb
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s

npm install express sequelize mysql2 dotenv
sudo groupadd csye6225

#echo "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '$DB_PASSWORD'; 
#FLUSH PRIVILEGES; 
#CREATE DATABASE cloudd_App;" | sudo mysql



sudo cp /tmp/csye6225-aws.service /etc/systemd/system/
sudo cp /tmp/webapp.zip /opt/
sudo unzip /opt/webapp.zip -d /opt/webapp
sudo cp /tmp/.env /opt/webapp


cd /opt/webapp || exit


sudo useradd -g csye6225 -s /usr/sbin/nologin csye6225
echo "csye6225 ALL=(ALL:ALL) NOPASSWD: /bin/systemctl" | sudo EDITOR='tee -a' visudo
sudo chown -R csye6225:csye6225 /tmp/webapp.zip

      # Extract webapp and set up the systemd service
sudo chown -R csye6225:csye6225 /opt/webapp
sudo chmod -R 755 /opt/webapp
sudo chown csye6225:csye6225 .env
sudo npm install
sudo chown csye6225:csye6225 node_modules

sudo mkdir -p /opt/webapp/logs
sudo chown -R csye6225:csye6225 /opt/webapp/logs
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc
sudo mv /tmp/cloudwatch-config.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
sudo chown csye6225:csye6225 /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
sudo touch /tmp/myapp.log
sudo mv /tmp/myapp.log /var/log
sudo chown -R csye6225:csye6225 /var/log

echo "Setup completed"
