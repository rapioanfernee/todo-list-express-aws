const express = require("express");
const dotenv = require("dotenv");
const serverless = require("serverless-http");
const cors = require("cors");
dotenv.config();
const {
  prepareTable,
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("./dynamodb.config.js");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Get All
app.get("/tasks", async (req, res) => {
  const response = await getTasks();
  res.send(response.Items);
});

// Get One
app.get("/tasks/:id", async (req, res) => {
  const response = await getTask(req.params.id);
  res.send(response.Items);
});

// Post
app.post("/tasks", async (req, res) => {
  try {
    const response = await createTask(req.body);
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send("Failed to create task");
  }
});

// Update
app.put("/tasks", async (req, res) => {
  try {
    const response = await updateTask(req.body);
    res.status(200).send(response);
  } catch (err) {
    res.status(400).send("Failed to update task");
  }
});

// Delete
app.delete("/tasks/:id", async (req, res) => {
  try {
    const response = await deleteTask(req.params.id);
    res.status(200).send(req.params.id);
  } catch (err) {
    res.status(400).send("Failed to delete task");
  }
});

if (process.env.DEVELOPMENT) {
  prepareTable();
  app.listen(port, () => {
    console.log("Server is running on port: ", port);
  });
}

const handleRequest = serverless(app);

const handler = async (event, context) => {
  return await handleRequest(event, context);
};

module.exports = {
  handler,
};
