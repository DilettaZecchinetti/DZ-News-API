const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
require("jest-extended");

const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

test("404: Responds with an error when the endpoint does not exist", () => {
  return request(app)
    .get("/api/non-existent-endpoint")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Endpoint not found");
    });
});

describe("GET /api/articles/:article_id", () => {
  const validArticleIds = [1, 3, 5, 6, 9];
  validArticleIds.forEach((article_id) => {
    test("200: Responds with an article object each with the correct properties", () => {
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of all articles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("404: responds with error as articles do not exist", () => {
    return request(app)
      .get("/api/kiwi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  const validArticleIds = [1, 3, 5, 6, 9];
  validArticleIds.forEach((article_id) => {
    test("200: responds with an array of the comments for specific article id", () => {
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });
  });

  test("404: Responds with an appropriate status and error message when given a valid but non-existent article_id", () => {
    const article_id = 321;
    return request(app)
      .get(`/api/articles/${article_id}/comment`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "comment",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          author: "butter_bridge",
          body: "comment",
          article_id: 1,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("404: Responds with error if the article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "non-existent id",
    };

    return request(app)
      .post("/api/articles/999999/comments")
      .send(newComment)
      .expect(500)
      .then(({ body }) => {
        expect(body.msg).toBe("Internal Server Error");
      });
  });

  test("400: Responds with error if the article_id is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Invalid ID",
    };

    return request(app)
      .post("/api/articles/bananas/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article id");
      });
  });

  test("400: respond with erro if there is no username or comment", () => {
    const newComment = { username: "butter_bridge" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:200 updates the vote count of a specified article", () => {
    const newVote = {
      inc_votes: 2,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBeGreaterThan(0);
        expect(body.article.votes).toBe(102);
      });
  });

  test("PATCH:200 updates the vote count of a specified article with a negative decrement", () => {
    const newVote = {
      inc_votes: -102,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(-2);
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Deletes the comment and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });

  test("404: Responds with an error when comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          "Not Found: No comment found with the given comment_id"
        );
      });
  });

  test("400: Responds with an error for invalid comment_id format", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request: Invalid comment_id format");
      });
  });
});

describe("GET /api/users", () => {
  test("200: REsponds with an array of the users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });

  test("404: responds with error as user do not exist", () => {
    return request(app)
      .get("/api/kiwi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Endpoint not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects, sorted by default 'created_at' in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_img_url: expect.any(String),
              author: expect.any(String),
              comment_count: expect.any(Number),
              created_at: expect.any(String),
              title: expect.any(String),
              topic: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });

        articles.forEach((article, index) => {
          if (index > 0) {
            const currentCreatedAt = new Date(article.created_at).getTime();
            const previousCreatedAt = new Date(
              articles[index - 1].created_at
            ).getTime();

            expect(currentCreatedAt).toBeLessThanOrEqual(previousCreatedAt);
          }
        });
      });
  });

  test("404: responds with an error if the endpoint is invalid", async () => {
    const { body } = await request(app)
      .get("/api/invalid_endpoint")
      .expect(404);
    expect(body.msg).toBe("Endpoint not found");
  });
});
