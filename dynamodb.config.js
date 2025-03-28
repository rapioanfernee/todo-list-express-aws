const {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  QueryCommand,
} = require("@aws-sdk/client-dynamodb");
const {
  ScanCommand,
  PutCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

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

const executeTableCommand = async (command) => {
  try {
    const response = await dynamoDBClient.send(command);
    return response;
  } catch (err) {
    console.log(err);
  }
};

const getTasks = async () => {
  const command = new ScanCommand({
    ExpressionAttributeNames: { "#status": "status" },
    ProjectionExpression: "id, description, #status, title",
    TableName: TABLE_NAME,
  });
  return await executeTableCommand(command);
};

const getTask = async (id) => {
  const command = new QueryCommand({
    ConsistentRead: true,
    KeyConditionExpression: "id = :id ",
    ExpressionAttributeValues: {
      ":id": { S: `${id}` },
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: TABLE_NAME,
  });
  return await executeTableCommand(command);
};

const createTask = async ({ title, description, status }) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      id: crypto.randomUUID(),
      title,
      description,
      status,
    },
  });

  return await executeTableCommand(command);
};

const updateTask = async ({ id, title, description, status }) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: {
      id,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":title": title,
      ":description": description,
      ":status": status,
    },
    UpdateExpression:
      "set title = :title, description = :description, #status = :status",
    ReturnValues: "ALL_NEW",
  });

  return await executeTableCommand(command);
};

const deleteTask = async () => {};

module.exports = {
  prepareTable,
  getTasks,
  getTask,
  createTask,
  updateTask,
};
