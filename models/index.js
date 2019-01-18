const { Pool } = require("pg");

/*const pool = new Pool({
  user: "sgp_server",
  host: "localhost",
  database: "geochem_test",
  password: "sgpsgp",
  port: 5432
});*/

/*&ohXi$Vn*/
const pool = new Pool({
  user: "sgp_server",
  host: "se3pgdb.stanford.edu",
  database: "geochem1",
  password: "sgpsgp",
  port: 5432
});


module.exports = {
  pool
};
