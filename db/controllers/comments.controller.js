const { fetchCommentsByArticleId } = require("../models/comments.model");
const { checkArticleExists } = require("../models/comments.model");
const { removeCommentById } = require("../models/comments.model");
const { addComment } = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentToArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  const parsedArticleId = parseInt(article_id, 10);
  if (isNaN(parsedArticleId)) {
    return res.status(400).send({ msg: "Invalid article id" });
  }

  if (!username || !body) {
    return res.status(400).send({ msg: "Missing required fields" });
  }

  checkArticleExists(parsedArticleId)
    .then(() => addComment(parsedArticleId, username, body))
    .then((newComment) => {
      res.status(201).send({ comment: newComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeCommentById(comment_id)
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).send({
          msg: "Not Found: No comment found with the given comment_id",
        });
      }
      res.status(204).send();
    })
    .catch((err) => {
      if (err.code === "22P02") {
        // Invalid comment_id format
        res.status(400).send({ msg: "Bad Request: Invalid comment_id format" });
      } else {
        next(err);
      }
    });
};
