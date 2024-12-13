const express = require("express");
const app = express();
const { getEndpoints } = require("./db/controllers/api.controller.js");
const { getTopics } = require("./db/controllers/topics.controller.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

module.exports = app;
