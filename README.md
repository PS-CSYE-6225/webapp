# Cloud Native Web Application

This is a simple  webApp designed to monitor health using a RESTful API and a MySQL database. The application automatically bootstraps the database schema using Sequelize ORM, making deployment seamless.

---

## Prerequisites

Before you can build and run this application locally, make sure the following are installed and configured on your system:

1. **Node.js** (v16 or higher)
   - [Download here](https://nodejs.org/)
   - Check installation:
     ```bash
     node -v
     npm -v
     npm init 
     npm install express sequelize mysql12 dot env 
     node index.js 
     ```

2. **MySQL** (v8 or higher)
   - [Download here](https://dev.mysql.com/downloads/installer/)
   - Start the MySQL service:
     - **Windows**: `net start mysql`
   - `net stop mysql` 
   - Create the database:
     ```sql
     CREATE DATABASE cloudApp;
     USE cloudApp;
     CREATE TABLE health_check (id INT AUTO_INCREMENT PRIMARY KEY,datetime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
     SELECT * FROM healthchecks;
     ```

3. **Git**
   - [Download here](https://git-scm.com/)
   - Fork the Organization Project and work on the fork file 
   - git clone git@github.com:shahparamk/webapp.git `clone FORK Project`
   - git remote add upstream git@github.com:PS-CSYE-6225/webapp.git `upstream to the Organization file`
   - git checkout -b a01 `checkout into the branch` 
   - git push --set-upstream origin a01
   - merge the Fork a01 to the main organization 
   - then it will check all the compatibility and successfull if there is no error 
   - Now sync main with the Fork file and create the pull request to update the local file
  
  4. **Github Actions**
   A GitHub repository with a Node.js web application.
   The application should use MySQL as the database.
   To securely store database credentials, set up GitHub Secrets:
   Go to your GitHub repository.
   Navigate to Settings → Secrets and Variables → Actions.
   Click "New repository secret" and add:
   This is the content of .env file to connect with mySQL
   Write the content of env properly
   DB_HOST
   DB_USER
   DB_PASSWORD
   DB_NAME
   DB_PORT

 5. **Packer**
   For AWS
  Install AWS CLI (aws configure)
  IAM user with EC2 and AMI permissions
  AWS access key and secret key

For GCP
  Install Google Cloud SDK (gcloud init)
  Service account with Compute Image User and Compute Instance Admin roles
  Authenticate using gcloud auth application-default login

3. Installing Packer
Download Packer from HashiCorp’s official website.
Install Packer based on your OS:
Windows: Run the .exe installer.

**Install packer**
packer --version
1. Setting Up Packer for AWS
Configure AWS CLI:
sh
Copy
Edit
aws configure
Provide:
AWS Access Key ID
AWS Secret Access Key
Region (e.g., us-east-1)
Create an IAM Role with:
EC2 Full Access
AMI Creation Permissions
Attach the IAM role to an EC2 instance or use environment variables.
5. Setting Up Packer for GCP
Authenticate using Google Cloud SDK:
sh
Copy
Edit
gcloud auth application-default login
Enable necessary APIs in GCP Console:
Compute Engine API
IAM API
Create a Service Account and assign roles:
Compute Image User
Compute Instance Admin
Download and store the JSON key file securely.
6. Running Packer
Initialize Packer:
sh
Copy
Edit
packer init .
Validate Packer template:
sh
Copy
Edit
packer validate template.pkr.hcl
Build the image:
sh
Copy
Edit
packer build template.pkr.hcl
Check the image in AWS/GCP Console:
AWS: Navigate to EC2 → AMIs
GCP: Navigate to Compute Engine → Images
   

