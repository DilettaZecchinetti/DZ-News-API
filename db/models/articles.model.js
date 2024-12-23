const db = require("../connection");

const fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.body, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        COUNT(comments.article_id)::INT AS comment_count
     FROM articles
     LEFT JOIN comments 
     ON articles.article_id = comments.article_id
     WHERE articles.article_id = $1
     GROUP BY articles.article_id`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    })
    .catch((err) => {
      next(err);
    });
};

exports.fetchArticleById = fetchArticleById;

exports.fetchAllArticles = (sort_by = "created_at", order = "desc", topic) => {
  const sortByOptions = [
    "article_id",
    "author",
    "title",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const orderOptions = ["asc", "desc"];

  if (!sortByOptions.includes(sort_by) || !orderOptions.includes(order)) {
    return Promise.reject({ status: 400, msg: "Not Valid" });
  }
  const queryParams = [];
  let queryForArticle = `
SELECT 
  articles.article_id, articles.author, articles.title, articles.topic, 
  articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.article_id)::INT AS comment_count
FROM articles
LEFT JOIN comments ON comments.article_id = articles.article_id
`;

  if (topic) {
    queryForArticle += ` WHERE articles.topic = $1 `;
    queryParams.push(topic);
  }

  queryForArticle += `
GROUP BY articles.article_id
ORDER BY ${sort_by} ${order.toUpperCase()}
`;

  return db.query(queryForArticle, queryParams).then(({ rows }) => rows);
};

exports.updateArticleVotesByArticleId = (articleId, incVotes) => {
  return db
    .query(
      `UPDATE articles 
     SET votes = votes + $1 
     WHERE article_id = $2 
     RETURNING *`,
      [incVotes, articleId]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    });
};
