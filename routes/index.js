const express = require("express");

const ctrl = require("./../controllers");
const bodyParser = require("body-parser");
const app = require("../server/app");

const router = express.Router();

var jsonParser = bodyParser.json();

router.post("/api", jsonParser, ctrl.example.post);

module.exports = router;
