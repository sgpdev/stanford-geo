const { Pool } = require("pg");
// const express = require("express");
// const app = express();
//Check if they are needed or not

const pool = new Pool({
  user: "sgpserver",
  host: "se3pgdb.stanford.edu",
  database: "geochem1",
  password: "sgpsgp",
  port: 5432
});

module.exports = {
  pool
};
