const {
  fetchArticleById,
  fetchAllArticles,
  updateArticleVotesByArticleId,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleVotesByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const parsedArticleId = parseInt(article_id, 10);
  if (isNaN(parsedArticleId)) {
    return res.status(400).send({ msg: "Invalid article_id" });
  }

  updateArticleVotesByArticleId(parsedArticleId, inc_votes)
    .then((updatedArticle) => {
      if (!updatedArticle) {
        return res.status(404).send({ msg: "Article not found" });
      }
      res.status(200).send({ article: updatedArticle });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchSortedArticles = (sortBy = "created_at", order = "desc") => {
  const validSortByColumns = [
    "created_at",
    "title",
    "author",
    "votes",
    "topic",
  ];
  const validOrders = ["asc", "desc"];

  const sanitizedSortBy = validSortByColumns.includes(sortBy)
    ? sortBy
    : "created_at";
  const sanitizedOrder = validOrders.includes(order?.toLowerCase())
    ? order
    : "desc";

  const queryStr = `
    SELECT article_id, title, topic, author, created_at, votes
    FROM articles
    ORDER BY ${sanitizedSortBy} ${sanitizedOrder};
  `;

  return db.query(queryStr).then(({ rows }) => rows);
};
