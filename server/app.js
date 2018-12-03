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
//var default_config = JSON.parse(fs.readFileSync("./server/default_config.json", "utf8"));

function initialize(search_config) {
    // Deserialize the search configuration file into Attributes Joins and BaseRelations
    for (var i = 0; i < search_config.Joins.joins_list.length; i++) {
        var new_join = new Join(
            search_config.Joins.joins_list[i].join_hash,
            search_config.Joins.joins_list[i].from_table,
            search_config.Joins.joins_list[i].to_table,
            search_config.Joins.joins_list[i].from_atts_db,
            search_config.Joins.joins_list[i].to_atts_db,
            search_config.Joins.joins_list[i].join_priority
        );
        search_joins[new_join.join_hash] = new_join;
    }

    for (var i = 0; i < search_config.Attributes.search_attributes.length; i++) {
        var new_join_path = [];
        if (search_config.Attributes.search_attributes[i].join_path) {
            if (typeof search_config.Attributes.search_attributes[i].join_path === "string") {
                new_join_path.push(search_joins[search_config.Attributes.search_attributes[i].join_path]);
            } else if (Array.isArray(search_config.Attributes.search_attributes[i].join_path)) {
                search_config.Attributes.search_attributes[i].join_path.forEach((item) => {
                    new_join_path.push(search_joins[item]);
                });
            }
        }
        var new_attribute = new Attribute(
            search_config.Attributes.search_attributes[i].attribute_id,
            search_config.Attributes.search_attributes[i].attribute_db,
            search_config.Attributes.search_attributes[i].attribute_api,
            search_config.Attributes.search_attributes[i].search_bases,
            search_config.Attributes.search_attributes[i].select_priority,
            search_config.Attributes.search_attributes[i].where_priority,
            search_config.Attributes.search_attributes[i].group_priotiy,
            new_join_path
        );
        search_atts[new_attribute.attribute_api] = new_attribute;
    }

    for (var i = 0; i < search_config.BaseRelations.default_relations.length; i++) {
        var new_base_rel = new BaseRelation(
            search_config.BaseRelations.default_relations[i].defrel_type,
            search_config.BaseRelations.default_relations[i].defrel_db,
            search_config.BaseRelations.default_relations[i].defrel_api,
            search_config.BaseRelations.default_relations[i].default_show
        );
        default_rels[new_base_rel.br_api] = new_base_rel;
    }

    //console.log(default_rels, "default_rels");
    //console.log(search_atts["section_name"], "search_atts");
    //console.log(search_joins, "search_joins");
}

initialize(search_config);
// app.use("/api", routes);
app.post("/api", jsonParser, function(req, res) {

    console.log(req.body);

    // Base Relation Setup
    var req_type = "samples";
    if (default_rels[req.body.type]) {
        req_type = req.body.type;
    }
    // New Search Query object
    var search_req = new SearchQuery(default_rels[req_type]);
    console.log(search_req);
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
            if (search_atts[att] && search_atts[att].search_bases.indexOf(search_req.sq_base_rel.br_api) != -1) {
                search_req.sq_select.push(search_atts[att]);
                search_req.add_joins(search_atts[att]);
            } else {
                // @TODO Error Case
                console.log("sufsufsuf");
                res.status(400).send(`filter error: ${att} is not a valid attribute in this search type.`);
                return;
            }
        }
    }
    // Handle filter attributes
    if (req.body.filters) {
        //console.log(req.body.filters);
        for (var keys in req.body.filters) {
            if (search_atts[keys] && search_atts[keys].search_bases.indexOf(search_req.sq_base_rel.br_api) != -1) {
                // derive value type of attribute_db
                //console.log(keys, "filter");
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
                    } else if (typeof req.body.filters[keys][0] === "number" && req.body.filters[keys].length == 2) {
                        value_type = "num_arr";
                        value_api = req.body.filters[keys];
                    } else {
                        // @TODO Error Case
                        res.status(400).send(`filter error: ${req.body.filters[keys]} is not a valid filter value for ${keys}.`);
                        return;
                    }
                } else {
                    // @TODO Error Case
                    res.status(400).send(`filter error: ${req.body.filters[keys]} is not a valid filter value for ${keys}.`);
                    return;
                }
                search_req.add_joins(search_atts[keys]);
                var new_av = new AttributeValue(search_atts[keys], value_type, value_api);
                search_req.sq_where.push(new_av);
            } else {
                // @TODO Error Case
                res.status(400).send(`filter error: ${keys} is not a valid attribute in this search type.`);
                return;
            }
        }
    }

    // Evaluate the query
    search_req.to_sql(search_atts, search_joins);
    //console.log(search_req);
    // Run the query
    const sq_query = {
        text: search_req.sq_sql
    };
    db.pool.query(sq_query, (err, res) => {
        if (err) {
            console.log(err)
        } else {
            console.log(res);
        }
    });
    res.send("POST request to the homepage");
});

module.exports = app;
