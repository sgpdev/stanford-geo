const { Pool } = require("pg");
// const express = require("express");
// const app = express();
//Check if they are needed or not

const pool = new Pool({
  user: "sgp_server",
  host: "localhost",
  database: "geochem_test",
  password: "sgpsgp",
  port: 5432
});

module.exports = {
  pool
};
