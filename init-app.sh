#!/bin/bash
# Start the application service
sudo systemctl daemon-reload
sudo systemctl enable csye6225-aws.service
sudo systemctl start csye6225-aws.service

