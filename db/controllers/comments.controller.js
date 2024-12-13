const { fetchCommentsByArticleId } = require("../models/comments.model");
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
  const newComment = req.body;

  if (isNaN(Number(article_id))) {
    return res.status(400).send({ msg: "Invalid article_id" });
  }

  if (!newComment.username || !newComment.body) {
    return res.status(400).send({ msg: "Missing required fields" });
  }

  addComment(article_id, newComment)
    .then((postedComment) => {
      res.status(201).send({ comment: postedComment });
    })
    .catch((err) => {
      if (err.code === "23503") {
        res
          .status(404)
          .send({ msg: "Not Found: Invalid article_id or username" });
      } else if (err.code === "22P02") {
        res.status(400).send({ msg: "Invalid article_id" });
      } else {
        next(err);
      }
    });
};
