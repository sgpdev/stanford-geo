const { Pool } = require("pg");

const pool = new Pool({
  user: "sgpserver",
  host: "localhost",
  database: "data_freeze1",
  password: "sgpsgp",
  port: 5432
});

module.exports = {
  pool
};
