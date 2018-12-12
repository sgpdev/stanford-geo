require("dotenv").config();

const express = require("express");

const app = express();
const routes = require("./../routes");
const basicAuth = require("express-basic-auth");

app.set("port", process.env.PORT || 8060);

app.use(express.static("public/"));
app.use(express.static("client/dist"));

app.use(
  "/api",
  basicAuth({
    users: {
      frontend: "Oligvie40"
    }
  })
);
app.use("/api", routes);

module.exports = app;
