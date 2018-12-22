const { Pool } = require("pg");

const pool = new Pool({
  user: "sgpserver",
  host: "se3pgdb.stanford.edu",
  database: "geochem1",
  password: "sgpsgp",
  port: 5432
});
