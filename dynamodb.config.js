const {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
} = require("@aws-sdk/client-dynamodb");

const REGION = "ap-southeast-1";
const TABLE_NAME = "tasks";

const dynamoDbConfig = (() => {
  if (process.env.DEVELOPMENT) {
    return {
      region: REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
      },
    };
  }
  return {
    region: REGION,
  };
})();

const dynamoDBClient = new DynamoDBClient(dynamoDbConfig);

const createTableParams = {
  TableName: TABLE_NAME,
  KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
  AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
};

const prepareTable = () => {
  try {
    dynamoDBClient.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    console.log(`Table ${TABLE_NAME} exists`);
  } catch (err) {
    dynamoDBClient.send(new CreateTableCommand(createTableParams));
    console.log(`Table ${TABLE_NAME} created`);
  }
};

module.exports = {
  prepareTable,
};
