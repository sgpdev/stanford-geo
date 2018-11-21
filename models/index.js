const { Pool } = require("pg");
const express = require("express");
const app = express();

const pool = new Pool({
  user: "sgp_server",
  host: "localhost",
  database: "geochem_old",
  password: "sgpsgp",
  port: 5432
});

//  pool.query("SELECT * FROM sample", (err, res) => {
//    console.log(err, res);
//    pool.end();
// });

module.exports = {
  pool
};
