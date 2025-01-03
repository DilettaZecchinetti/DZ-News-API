const {
  fetchCommentsByArticleId,
  checkArticleExists,
  addComment,
  checkCommentExists,
  deleteCommentById,
} = require("../models/comments.model");

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

exports.deleteComment = (req, res, next) => {
  const { comment_id: commentId } = req.params;

  const parsedCommentId = parseInt(commentId, 10);
  if (isNaN(parsedCommentId)) {
    return res.status(400).send({ msg: "Invalid comment ID" });
  }
  checkCommentExists(parsedCommentId)
    .then(() => deleteCommentById(parsedCommentId))
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
