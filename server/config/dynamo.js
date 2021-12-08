const dynamoose = require('dynamoose');

// Getting Environment variables
require('dotenv').config()

// configure dynamoDB with app
dynamoose.aws.sdk.config.update({
    "accessKeyId": process.env.AWS_accessKeyId,
    "secretAccessKey": process.env.AWS_secretAccessKey,
    "region": process.env.AWS_region
});