#!/bin/bash
# Start the application service
#sudo systemctl daemon-reload
#sudo systemctl enable csye6225-aws

if [ ! -f "/etc/systemd/system/csye6225-aws.service" ]; then
echo "csye6225-aws.service not found. Copying..."
sudo cp /tmp/csye6225-aws.service /etc/systemd/system/csye6225-aws.service
sudo chmod 644 /etc/systemd/system/csye6225-aws.service
sudo systemctl daemon-reload
fi
