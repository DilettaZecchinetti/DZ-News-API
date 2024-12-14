const express = require("express");
const app = express();
app.use(express.json());
const { getEndpoints } = require("./db/controllers/api.controller.js");
const { getTopics } = require("./db/controllers/topics.controller.js");
const {
  getArticleById,
  getAllArticles,
  patchArticleByArticleId,
  getSortedArticles,
} = require("./db/controllers/articles.controller.js");

const {
  getCommentsByArticleId,
  postCommentToArticleId,
  deleteCommentById,
} = require("./db/controllers/comments.controller.js");

const { getAllUsers } = require("./db/controllers/users.controller.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles", getSortedArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToArticleId);

app.patch("/api/articles/:article_id", patchArticleByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.get("/api/users", getAllUsers);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  if (!res.headersSent) {
    console.error(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
