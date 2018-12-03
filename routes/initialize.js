const { Attribute, Join, BaseRelation } = require("../models/search");

var default_rels = {};
var search_atts = {};
var search_joins = {};

module.exports = {
  initialize: function(search_config) {
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

    for (
      var i = 0;
      i < search_config.Attributes.search_attributes.length;
      i++
    ) {
      var new_join_path = [];
      if (search_config.Attributes.search_attributes[i].join_path) {
        if (
          typeof search_config.Attributes.search_attributes[i].join_path ===
          "string"
        ) {
          new_join_path.push(
            search_joins[
              search_config.Attributes.search_attributes[i].join_path
            ]
          );
        } else if (
          Array.isArray(search_config.Attributes.search_attributes[i].join_path)
        ) {
          search_config.Attributes.search_attributes[i].join_path.forEach(
            item => {
              new_join_path.push(search_joins[item]);
            }
          );
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
    for (
      var i = 0;
      i < search_config.BaseRelations.default_relations.length;
      i++
    ) {
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
  },
  search_atts,
  search_joins,
  default_rels
};
