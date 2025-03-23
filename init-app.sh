#!/bin/bash

sudo systemctl daemon-reload
sudo systemctl enable csye6225-aws
sudo systemctl start csye6225-aws
sudo systemctl restart csye6225-aws
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a start
sudo systemctl status statsd
sudo systemctl status amazon-cloudwatch-agent