const { Pool } = require("pg");
// const express = require("express");
// const app = express();
//Check if they are needed or not

const pool = new Pool({
  user: "sufyan",
  host: "localhost",
  database: "geochem_test",
  password: "",
  port: 5432
});

module.exports = {
  pool
};
