# DynamoDbDuplicateRecordsRemoval

This project will remove the duplicated record from a very large dynamodb table which contains 10 million plus records and creates a new
DynamoDb table which will only contain the unique record. It will be safe operation as well because we will have the backup of original table
and in order to make sure the unique record we don't need to lookup from the table whether it contains the record or not so it will be efficient as well
once we are done with the population of new table we can drop the existing table in order to save the storage.

New table contains the hash key as uid and range key as pid basically a composite primary key so it will make sure that we don't make duplicate entries in the future too. 

## Getting Started

Project can easily be setup in Mac OS, Windows and Ubuntu

### Prerequisites

To get up and running you need to install following dependencies on your system.

```
Node.js 8.10.x
Npm 5 or above
Typescript 2.4 or above
DynamoDB local
Serverless Framework 1.x
AWS Lambda, DynamoDB, SQS, SNS, IAM and API Gateway
```

### Installing

After installation of above prerequisites

```
Run npm install in project dir
```


##Exections of Unit Tests
```
Run npm test in project dir
```

## Authors

* **Zeeshan** - *Engineer* - [zeeshantariqcs](https://github.com/zeeshantariqcs)

