const db = require("../connection");

const fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Id not found" });
      }
      return rows[0];
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
