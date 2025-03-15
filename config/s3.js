const AWS = require("aws-sdk");
require("dotenv").config();

AWS.config.update({ region: process.env.AWS_REGION });

const s3 = new AWS.S3();

module.exports = s3;
