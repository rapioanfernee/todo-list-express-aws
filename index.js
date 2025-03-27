const express = require("express");
const dotenv = require("dotenv").config();
const serverless = require("serverless-http");

const { prepareTable } = require("./dynamodb.config.js");

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Test Home");
});

app.get("/tasks", (req, res) => {
  res.send("Test Tasks");
});

app.get("/tasks/:id", (req, res) => {
  res.send(`Test Tasks ${req.params.id}`);
});

if (process.env.DEVELOPMENT) {
  app.listen(port, () => {
    console.log("Server is running on port: ", port);
  });

  prepareTable();
}

module.exports.handler = serverless(app);
