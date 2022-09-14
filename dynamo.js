const AWS = require('aws-sdk');
const uuid = require('uuid');

AWS.config.update({
    region: 'local',
    endpoint: 'http://localhost:8000',
});

// const user = {
//     id: '7016333e-f756-468c-857f-bc8182121669',
//     accountType: 'service',
//     privLvl: 100,
//     description: 'SG - 1',
//     messages: [
//         {
//             body: 'Your code is: 74278',
//             from: '+448242402942',
//             time: '',
//             date: '',
//         },
//     ],
// };

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const dynamoDB = new AWS.DynamoDB();
const TABLE_NAME = 'cars';

const createTable = async () => {
    const params = {
        TableName: TABLE_NAME,
        KeySchema: [
            {
                AttributeName: 'id',
                KeyType: 'HASH',
            },
        ],
        AttributeDefinitions: [
            {
                AttributeName: 'id',
                AttributeType: 'S',
            },
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
        },
    };

    dynamoDB.createTable(params, (err, data) => {
        if (err) console.log('Failed to create table', err);
        else console.log('Successfully created table', data);
    });
};

const addCar = async (manufacturer, model) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: { S: uuid.v4() },
            manufacturer: { S: manufacturer },
            model: { S: model },
            time: { S: Date.now().toString() },
        },
    };

    return dynamoDB
        .putItem(params, (err) => {
            if (err) console.log('Failed to put car to DB', err);
            else console.log(`Added ${model} to db under manufacturer ${manufacturer}`);
        })
        .promise();
};

const getCars = async () => {
    const params = {
        TableName: TABLE_NAME,
    };

    return dynamoClient.scan(params).promise();
};

const getCar = async (id) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
    };

    return dynamoClient
        .get(params, (err, data) => {
            if (err) console.log('Unable to find car', err);
            else console.log('Found car', data.Item);
        })
        .promise();
};

const updateCar = async (id, manufacturer, model) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id,
        },
        UpdateExpression: 'set model = :newModel, manufacturer = :newManufacturer',
        ExpressionAttributeValues: {
            ':newModel': model,
            ':newManufacturer': manufacturer,
        },
    };

    return dynamoClient
        .update(params, (err, data) => {
            if (err) console.log('Failed to update car', err);
            else console.log(`Successfully updated car`, data);
        })
        .promise();
};

module.exports = {
    createTable,
    getCars,
    addCar,
    getCar,
    updateCar,
};
