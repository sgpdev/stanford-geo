const { Pool } = require("pg");

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
