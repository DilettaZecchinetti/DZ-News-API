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

exports.fetchCommentsByArticleId = fetchCommentsByArticleId;
