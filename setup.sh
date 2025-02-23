#!/bin/bash

sudo apt-get update -y
sudo apt-get install -y unzip
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - 
sudo apt install -y nodejs
sudo apt-get install -y mysql-server

sudo node -v
sudo npm -v
sudo groupadd csye6225
sudo useradd csye6225 --shell /usr/sbin/nologin -g csye6225
sudo cp /tmp/csye6225-aws.service /etc/systemd/system/
sudo cp /tmp/webapp.zip /opt/
sudo unzip /opt/webapp.zip -d /opt/webapp
sudo cp /tmp/.env /opt/webapp

cd /opt/webapp || exit


sudo chown -R csye6225:csye6225 /opt/webapp
sudo chown csye6225:csye6225 .env
sudo npm install

sudo mkdir -p /opt/webapp/logs
sudo chown -R csye6225:csye6225 /opt/webapp/logs

sudo systemctl daemon-reload
sudo systemctl enable csye6225-aws


echo "Setup completed"
