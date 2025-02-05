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

#echo "Configuring MySQL to allow remote connections..."
sudo sed -i 's/^bind-address\s*=.*/bind-address = 0.0.0.0/' /etc/mysql/mysql.conf.d/mysqld.cnf

# Restart MySQL service
echo "Restarting MySQL service..."
sudo systemctl restart mysql


# Create MySQL Database
echo "Creating Database..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS CloudWebAppcsye625;"

# Grant MySQL Access to the Private IP
echo "Granting MySQL access to private IP..."
sudo mysql -u root -p <<EOF
CREATE USER IF NOT EXISTS 'root'@'10.116.0.3' IDENTIFIED WITH mysql_native_password BY 'root123';
ALTER USER 'root'@'10.116.0.3' IDENTIFIED WITH mysql_native_password BY 'root123';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'10.116.0.3' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
EOF

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
sudo bash -c 'cat > /opt/csye6225/webapp/.env <<EOF
DB_HOST=10.116.0.3
DB_USER=root
DB_PASSWORD=root123
DB_NAME=CloudWebAppcsye625
DB_PORT=3306
NODE_ENV=production
EOF
'

sudo chmod 600 /opt/csye6225/webapp/.env

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
echo "To run test suits....npm test"
echo ".................To Grant Permission.............................."
echo "sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf"
echo "sudo systemctl restart mysql"
echo "sudo mysql -u root -p"
echo "CREATE USER 'root'@'10.116.0.3' IDENTIFIED BY 'password';"
echo "GRANT ALL PRIVILEGES ON *.* TO 'root'@'10.116.0.3' WITH GRANT OPTION;"
echo "FLUSH PRIVILEGES;"
echo "EXIT;"
echo "------------------------------------------"

echo "Setup Completed"
