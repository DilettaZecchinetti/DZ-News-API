const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const { getEndpoints } = require("./db/controllers/api.controller.js");
const { getTopics } = require("./db/controllers/topics.controller.js");
const {
  getArticleById,
  getAllArticles,
  updateArticleVotesByArticleId,
} = require("./db/controllers/articles.controller.js");

const {
  getCommentsByArticleId,
  postCommentToArticleId,
  deleteComment,
} = require("./db/controllers/comments.controller.js");

const {
  getAllUsers,
  getUserByUsername,
} = require("./db/controllers/users.controller.js");

const {
  customErrorHandler,
  postgressErrorHandler,
  invalidUrlErrorHandler,
} = require("./db/controllers/errors.controller.js");

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentToArticleId);

app.patch("/api/articles/:article_id", updateArticleVotesByArticleId);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getAllUsers);

app.get("/api/users/:username", getUserByUsername);

app.all("*", invalidUrlErrorHandler);

app.use(customErrorHandler);

app.use(postgressErrorHandler);

module.exports = app;
