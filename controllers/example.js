const db = require("./../models");

module.exports = {
  post: (req, res) => {
    console.log(req.body);
    res.send("POST request to the homepage");
  }
  // const query = {
  //   text: "SELECT * from sample "
  // };
  // console.log(req.body);
  // console.log(db);
  // db.query(query, (err, res) => {
  //   console.log("running");
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log(res);
  //     // let room = res.rows;
  //     // resp.send(rooms);
  //   }
  // });
};
