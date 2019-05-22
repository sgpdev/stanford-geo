require("dotenv").config();

const express = require("express");

const app = express();
const routes = require("./../routes");
const basicAuth = require("express-basic-auth");

//app.listen(8080, '0.0.0.0');
app.set("port", process.env.PORT || 8080);

app.use(express.static("public/"));
app.use(express.static("client/dist"));

app.use(
  "/api",
  basicAuth({
    users: {
      frontend: "Ogilvie1"
    }
  }),
  routes
);

app.use("/", routes);

module.exports = app;
