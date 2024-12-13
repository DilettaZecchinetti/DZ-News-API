const express = require("express");
const app = express();
const { getEndpoints } = require("./db/controllers/api.controller.js");

app.get("/api", getEndpoints);

module.exports = app;
