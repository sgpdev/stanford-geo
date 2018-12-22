const db = require("./../models");

module.exports = {
  post: (query, req, res) => {
    db.pool.query(query, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send(response.rows);
      }
    });
  },

  get: (query, req, res) => {
    db.pool.query(query, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send(response.rows);
      }
    });
  },

  samples: (req, res) => {
    db.pool.query("SELECT COUNT(*) FROM samples_base", (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send(response.rows);
      }
    });
  },
  results: (req, res) => {
    db.pool.query("SELECT COUNT(*) FROM analyses_base", (err, response) => {
      if (err) {
        console.log(err);
      } else {
        res.send(response.rows);
      }
    });
  },

  countries: (req, res) => {
    db.pool.query(
      "SELECT COUNT(*) FROM country__distinctmv",
      (err, response) => {
        if (err) {
          console.log(err);
        } else {
          res.send(response.rows);
        }
      }
    );
  }
};
