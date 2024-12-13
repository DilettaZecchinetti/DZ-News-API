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

exports.addComment = (article_id, newComment) => {
  const { username, body } = newComment;

  const query = `
    INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING comment_id, article_id, author, body, votes, created_at;
  `;

  const values = [article_id, username, body];

  return db.query(query, values).then((result) => {
    return result.rows[0];
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
