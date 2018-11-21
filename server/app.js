require("dotenv").config();

const express = require("express");
// const elasticsearch = require("elasticsearch");
const fs = require("fs");
const app = express();
var bodyParser = require("body-parser");
const routes = require("./../routes");
const db = require("../models/index");
const {
    Attribute,
    AttributeValue,
    Join,
    SearchQuery,
    BaseRelation
} = require("../models/search");

var jsonParser = bodyParser.json();

app.set("port", process.env.PORT || 8060);

app.use(express.static("public/"));
app.use(express.static("client/dist"));

var default_rels = {};
var search_atts = {};
var search_joins = {};

var search_config = JSON.parse(fs.readFileSync("./server/search_config.json", "utf8"));
var default_config = JSON.parse(fs.readFileSync("./server/default_config.json", "utf8"));

function initialize(search_config, default_config) {
    // Deserialize the search and default configuration files
    for (var i = 0; i < search_config.search_attributes.length; i++) {
        var new_join_path = [];
        for (var j = 0; j < search_config.search_attributes[i].join_path.length; j++) {
            var new_join = new Join(
                search_config.search_attributes[i].join_path[j].from_table,
                search_config.search_attributes[i].join_path[j].to_table,
                search_config.search_attributes[i].join_path[j].from_atts_db,
                search_config.search_attributes[i].join_path[j].to_atts_db,
                search_config.search_attributes[i].join_path[j].join_priority
            );
            new_join_path[j] = new_join;
            search_joins[new_join.hash()] = new_join;
        }
        var new_attribute = new Attribute(
            search_config.search_attributes[i].attribute_id,
            search_config.search_attributes[i].attribute_db,
            search_config.search_attributes[i].attribute_api,
            search_config.search_attributes[i].select_priority,
            search_config.search_attributes[i].where_priority,
            search_config.search_attributes[i].group_priority,
            new_join_path
        );
        search_atts[new_attribute.attribute_api] = new_attribute;
    }
    for (var i = 0; i < default_config.default_relations.length; i++) {
        var new_base_rel = new BaseRelation(
            default_config.default_relations[i].defrel_type,
            default_config.default_relations[i].defrel_db,
            default_config.default_relations[i].defrel_api,
            default_config.default_relations[i].default_show
        );
        default_rels[new_base_rel.br_api] = new_base_rel;
    }
    //console.log(default_rels, "default_rels");
    // console.log(search_atts, "search_atts");
    // console.log(search_joins, "search_joins");
}

initialize(search_config, default_config);
// app.use("/api", routes);
app.post("/api", jsonParser, function(req, res) {

    // Base Relation Setup
    var req_type = "all";
    if (default_rels[req.body.type]) {
        req_type = req.body.type;
    }
    // New Search Query object
    var search_req = new SearchQuery(default_rels[req_type]);
    // Handle show attribute
    // handle default show attributes first
    search_req.sq_base_rel.br_show.forEach((item) => {
        if (search_atts[item]) {
            search_req.sq_select.push(search_atts[item]);
            search_req.add_joins(search_atts[item]);
        }
    });
    // handle custom show attributes next
    if (req.body.show) {
        // populate SearchQuery select and join lists
        for (var i = 0; i < req.body.show.length; i++) {
            var att = req.body.show[i];
            if (search_atts[att]) {
                search_req.sq_select.push(search_atts[att]);
                search_req.add_joins(search_atts[att]);
            }
        }
    }
    // Handle filter attributes
    if (req.body.filters) {
        console.log(req.body.filters);
        for (var keys in req.body.filters) {
            console.log(keys, "pre_filter");
            if (search_atts[keys]) {
                // derive value type of attribute_db
                console.log(keys, "filter");
                var value_type = "";
                var value_api = null;
                if (typeof req.body.filters[keys] === "string") {
                    value_type = "string";
                    value_api = req.body.filters[keys];
                } else if (typeof req.body.filters[keys] === "number") {
                    value_type = "number";
                    value_api = req.body.filters[keys];
                } else if (Array.isArray(req.body.filters[keys])) {
                    if (typeof req.body.filters[keys][0] === "string") {
                        value_type = "str_arr";
                        value_api = req.body.filters[keys];
                    } else if (typeof req.body.filters[keys][0] === "number") {
                        value_type = "num_arr";
                        value_api = req.body.filters[keys];
                    } else {
                        // @TODO Error Case
                    }
                } else {
                    // @TODO Error Case
                }
                search_req.add_joins(search_atts[keys]);
                var new_av = new AttributeValue(search_atts[keys], value_type, value_api);
                search_req.sq_where.push(new_av);
                //console.log(keys, "true");
            }
        }
    }

    // Evaluate the query
    search_req.to_sql(search_atts, search_joins);
    console.log(search_req);
    // Run the query
    const sq_query = {
        text: search_req.sq_sql
    };
    console.log(req.body);
    db.pool.query(sq_query, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            //console.log(res);
        }
    });
    res.send("POST request to the homepage");
});

module.exports = app;
