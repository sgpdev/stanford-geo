const { Pool } = require("pg");

/*const pool = new Pool({
  user: "sgp_server",
  host: "localhost",
  database: "geochem_test",
  password: "sgpsgp",
  port: 5432
});*/

<<<<<<< HEAD
/*&ohXi$Vn*/
=======
>>>>>>> 444e97da2a847c29811a9d5dd640ce927f826359
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
