import AWS from 'aws-sdk';
export let dynamo = new AWS.DynamoDB({ endpoint: process.env.DB_URL });
export let dynamodb = new AWS.DynamoDB.DocumentClient({ service: dynamo, convertEmptyValues: true });
