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
  }
};
