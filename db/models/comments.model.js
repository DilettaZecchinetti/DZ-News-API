const db = require("../connection");

const fetchCommentsByArticleId = (article_id) => {
  const queryStr = `SELECT comment_id, body, article_id, author, votes, created_at 
       FROM comments 
       WHERE article_id= $1 
       ORDER by created_at DESC`;

  return db.query(queryStr, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.checkArticleExists = (article_id) => {
  const query = `
    SELECT * FROM articles WHERE article_id = $1;
  `;
  return db.query(query, [article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      // If no articles are found, throw a 404 error
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return rows[0];
  });
};

exports.addComment = (article_id, username, body) => {
  const query = `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [article_id, username, body];

  return db
    .query(query, values)
    .then((result) => result.rows[0])
    .catch((err) => {
      if (err.code === "23503") {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return Promise.reject(err);
    });
};

exports.fetchCommentsByArticleId = fetchCommentsByArticleId;

exports.removeCommentById = (comment_id) => {
  const query = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
  `;

  return db.query(query, [comment_id]).then((result) => {
    return result.rowCount > 0; // Returns true if a row was deleted, false otherwise
  });
};
