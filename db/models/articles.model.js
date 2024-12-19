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

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url,
         COUNT(comments.article_id):: INT AS comment_count FROM articles
        LEFT JOIN comments ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateArticleByArticleId = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles 
     SET votes = votes + $1 
     WHERE article_id = $2 
     RETURNING *`,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return null;
      }
      return result.rows[0];
    });
};
