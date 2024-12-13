const express = require("express");
const app = express();
const { getEndpoints } = require("./db/controllers/api.controller.js");
const { getTopics } = require("./db/controllers/topics.controller.js");
const { getArticleById } = require("./db/controllers/articles.controller.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

module.exports = app;
