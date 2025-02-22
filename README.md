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

   helloo packer
   hello 
   

