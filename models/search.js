const TinyQueue = require("tinyqueue");
// class for a searchable attribute
class Attribute {
    constructor(
        attribute_id,
        attribute_db,
        attribute_api,
        select_priority,
        where_priority,
        group_priotiy,
        join_path
    ) {
        this.attribute_id = attribute_id;
        this.attribute_db = attribute_db;
        this.attribute_api = attribute_api;
        this.attribute_sql = "";
        this.select_priority = select_priority;
        this.where_priority = where_priority;
        this.group_priotiy = group_priotiy;
        this.join_path = join_path;
    }
}

// class for logical join
class Join {
    constructor(from_table, to_table, from_atts_db, to_atts_db, join_priority) {
        this.from_table = from_table;
        this.to_table = to_table;
        this.from_atts_db = from_atts_db;
        this.to_atts_db = to_atts_db;
        this.join_priority = join_priority;
    }

    hash() {
        let hash_str = `${this.from_table}(${this.from_atts_db})${this.to_table}(${
      this.to_atts_db
    })`;

        return hash_str;
    }
}

// class for attribute and filter value pair
class AttributeValue {
    constructor(av_attribute, av_type, av_value_api) {
        this.av_attribute = av_attribute;
        this.av_type = av_type;
        this.av_value_api = av_value_api;
        this.av_value_db = null;
    }

    to_sql() {
        switch (this.av_type) {
            case "string":
                this.av_value_db = `${this.av_attribute.attribute_sql} = '${this.av_value_api}'`;
                break;
            case "number":
                this.av_value_db = `${this.av_attribute.attribute_sql} = ${this.av_value_api}`;
                break;
            case "str_arr":
                var temp_arr = [];
                this.av_value_api.forEach((item) => {
                    temp_arr.push(`'${item}'`);
                });
                this.av_value_db = `${this.av_attribute.attribute_sql} IN (${temp_arr.toString()})`;
                break;
            case "num_arr":
                // @TODO make BETWEEN list
                break;
            default: // @TODO Error Case

        }
    }
}

// class that represents a single search request
class SearchQuery {
    constructor(sq_base_rel) {
        this.sq_base_rel = sq_base_rel;
        this.sq_join = {};
        this.sq_select = [];
        this.sq_group = [];
        this.sq_where = [];
        this.sq_sql = "";
    }

    add_joins(attribute) {
        for (var j = 0; j < attribute.join_path.length; j++) {
            var att_join = attribute.join_path[j];
            // last element in join path is containing table
            if (j == attribute.join_path.length - 1) {
                // add attribute to join attribute list
                if (this.sq_join[att_join.hash()]) {
                    this.sq_join[att_join.hash()].push(attribute.attribute_api);
                } else {
                    this.sq_join[att_join.hash()] = [attribute.attribute_api];
                }
            } else if (!this.sq_join[att_join.hash()]) {
                this.sq_join[att_join.hash()] = [];
            }
        }
    }

    to_sql(search_atts, search_joins) {
        // Setup phase
        var table_hist = {
            "base": [this.sq_base_rel.br_db]
        };
        var from_str = `FROM ${table_hist["base"]}`;
        // JOIN phase
        var join_str_list = [];
        for (var p = 0; p < 6; p++) {
            for (var key in this.sq_join) {
                // obtain join of correct join_priority
                var next_join = search_joins[key];
                if (next_join.join_priority == p) {
                    var table_name = "";
                    // determine table name by checking if table was previously visited
                    if (table_hist[next_join.from_table]) {
                        table_name = `${next_join.from_table}_${table_hist[next_join.from_table].length}`;
                        table_hist[next_join.from_table].push(table_name);
                    } else {
                        table_name = `${next_join.from_table}_0`;
                        table_hist[next_join.from_table] = [table_name]
                    }
                    // create and append join string to join string list
                    var join_str = `LEFT JOIN ${next_join.from_table} ${table_name} ON ${table_name}.${next_join.from_atts_db} = ${table_hist[next_join.to_table][0]}.${next_join.to_atts_db}`;
                    join_str_list.push(join_str);
                    // assign table name to relevant search attribute
                    for (var i = 0; i < this.sq_join[key].length; i++) {
                        var att = this.sq_join[key][i];
                        var search_att = search_atts[att];
                        search_att.attribute_sql = `${table_name}.${search_att.attribute_db}`;
                    }
                }
            }
        }
        // midway attribute_sql setup

        // WHERE phase
        var where_str_list = []
        this.sq_where.sort((a, b) => {
            return a.av_attribute.where_priority - b.av_attribute.where_priority;
        });
        this.sq_where.forEach((item) => {
            if (item.av_attribute.attribute_sql.length == 0) {
                item.av_attribute.attribute_sql = `${this.sq_base_rel.br_db}.${item.av_attribute.attribute_db}`;
            }
            item.to_sql();
            where_str_list.push(item.av_value_db)
        });
        // SELECT phase
        var select_str = "";
        var select_str_list = []
        this.sq_select.sort((a, b) => {
            return a.select_priority - b.select_priority;
        });
        this.sq_select.forEach((item) => {
            if (item.attribute_sql.length == 0) {
                item.attribute_sql = `${this.sq_base_rel.br_db}.${item.attribute_db}`;
            }
            select_str_list.push(item.attribute_sql);
        });
        select_str = `SELECT ${select_str_list.join(", ")}`;

        var join_str_sql = join_str_list.join(" ");
        var where_str_sql = `WHERE ${where_str_list.join(" AND ")}`;

        console.log(table_hist);
        console.log(select_str);
        console.log(from_str);
        console.log(join_str_sql);
        console.log(where_str_sql);

        this.sq_sql = `${select_str} ${from_str} ${join_str_sql} ${where_str_sql};`;
    }
}

// class with base and default info
class BaseRelation {
    constructor(br_type, br_db, br_api, br_show) {
        this.br_type = br_type;
        this.br_db = br_db;
        this.br_api = br_api;
        this.br_show = br_show;
    }
}

module.exports = {
    Attribute,
    Join,
    BaseRelation,
    SearchQuery,
    AttributeValue
};
