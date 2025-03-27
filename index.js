const express = require("express");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Test Home");
});

app.get("/tasks", (req, res) => {
  res.send("Test Tasks");
});

app.get("/tasks/:id", (req, res) => {
  res.send(`Test Tasks ${req.params.id}`);
});

app.listen(port, () => {
  console.log("Server is running on port: ", port);
});
