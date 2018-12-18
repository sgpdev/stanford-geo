// class for a searchable attribute
class Attribute {
  constructor(
    attribute_id,
    attribute_db,
    attribute_api,
    search_bases,
    select_priority,
    where_priority,
    group_priotiy,
    join_path
  ) {
    this.attribute_id = attribute_id;
    this.attribute_db = attribute_db;
    this.attribute_api = attribute_api;
    this.attribute_sql = "";
    this.search_bases = search_bases;
    this.select_priority = select_priority;
    this.where_priority = where_priority;
    this.group_priotiy = group_priotiy;
    this.join_path = join_path;
  }
}

// class for logical join
class Join {
  constructor(
    join_hash,
    from_table,
    to_table,
    from_atts_db,
    to_atts_db,
    join_priority
  ) {
    this.join_hash = join_hash;
    this.from_table = from_table;
    this.to_table = to_table;
    this.from_atts_db = from_atts_db;
    this.to_atts_db = to_atts_db;
    this.join_priority = join_priority;
  }

  hash() {
    return this.join_hash;
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
        this.av_value_db = `LOWER(${
          this.av_attribute.attribute_sql
        }) = LOWER('${this.av_value_api}')`;
        break;
      case "number":
        this.av_value_db = `${this.av_attribute.attribute_sql} = ${
          this.av_value_api
        }`;
        break;
      case "str_arr":
        var temp_arr = [];
        this.av_value_api.forEach(item => {
          temp_arr.push(`LOWER('${item}')`);
        });
        this.av_value_db = `LOWER(${
          this.av_attribute.attribute_sql
        }) IN (${temp_arr.toString()})`;
        break;
      case "num_arr":
        this.av_value_db = `${this.av_attribute.attribute_sql} BETWEEN ${
          this.av_value_api[0]
        } AND ${this.av_value_api[1]} AND ${this.av_attribute.attribute_sql} IS NOT NULL`;
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

  compute_join_list(search_atts, search_joins, use_inner) {
    // Setup phase
    var table_hist = {
      base: [this.sq_base_rel.br_db]
    };
    var join_cmd = use_inner ? "INNER JOIN" : "LEFT JOIN";
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
            table_name = `${next_join.from_table}_${
              table_hist[next_join.from_table].length
            }`;
            table_hist[next_join.from_table].push(table_name);
          } else {
            table_name = `${next_join.from_table}_0`;
            table_hist[next_join.from_table] = [table_name];
          }
          // create and append join string to join string list
          var join_str = `${join_cmd} ${
            next_join.from_table
          } ${table_name} ON ${table_name}.${next_join.from_atts_db} = ${
            table_hist[next_join.to_table][0]
          }.${next_join.to_atts_db}`;

          join_str_list.push(join_str);
          // assign table name to relevant search attribute
          for (var i = 0; i < this.sq_join[key].length; i++) {
            var att = this.sq_join[key][i];
            var search_att = search_atts[att];
            search_att.attribute_sql = `${table_name}.${
              search_att.attribute_db
            }`;
          }
        }
      }
    }
    return join_str_list;
  }

  compute_where_list(search_atts, search_joins) {
    // WHERE phase
    var where_str_list = [];
    this.sq_where.sort((a, b) => {
      return a.av_attribute.where_priority - b.av_attribute.where_priority;
    });
    this.sq_where.forEach(item => {
      if (item.av_attribute.attribute_sql.length == 0) {
        item.av_attribute.attribute_sql = `${this.sq_base_rel.br_db}.${
          item.av_attribute.attribute_db
        }`;
      }
      item.to_sql();
      where_str_list.push(item.av_value_db);
    });
    return where_str_list;
  }

  compute_select_list(search_atts, search_joins) {
    // SELECT phase
    var select_str_list = [];
    this.sq_select.sort((a, b) => {
      return a.select_priority - b.select_priority;
    });
    this.sq_select.forEach(item => {
      if (item.attribute_sql.length == 0) {
        item.attribute_sql = `${this.sq_base_rel.br_db}.${item.attribute_db}`;
      }
      select_str_list.push(`${item.attribute_sql} AS "${item.attribute_id}"`);
    });
    return select_str_list;
  }

  to_sql_pub_api(search_atts, search_joins) {
    var join_str_list = this.compute_join_list(
      search_atts,
      search_joins,
      false
    );
    var where_str_list = this.compute_where_list(search_atts, search_joins);
    var select_str_list = this.compute_select_list(search_atts, search_joins);
    var select_str = `SELECT ${select_str_list.join(", ")}`;
    var from_str = `FROM ${this.sq_base_rel.br_db}`;
    var join_str_sql = join_str_list.join(" ");
    var where_str_sql =
      where_str_list.length == 0 ? "" : `WHERE ${where_str_list.join(" AND ")}`;
    this.sq_sql = `${select_str} ${from_str} ${join_str_sql} ${where_str_sql};`;
  }

  to_sql_pri_api(search_atts, search_joins, cur_att, cur_search, cur_limit) {
    var select_str = `SELECT DISTINCT ${cur_att.attribute_api}`;
    var from_str = `FROM ${cur_att.attribute_api}__distinctmv`;
    var where_limit_str_sql = `WHERE ${
      cur_att.attribute_api
    } IS NOT NULL AND LOWER(${
      cur_att.attribute_api
    }) LIKE LOWER('${cur_search}%') ORDER BY ${
      cur_att.attribute_api
    } LIMIT ${cur_limit}`;
    this.sq_sql = `${select_str} ${from_str} ${where_limit_str_sql};`;
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
