import React, { Component } from "react";
import "./Checkbox.css";

const arr = [
  "sampleid",
  "original_name",
  "analysisid",
  "ana_cde",
  "abundace",
  "unit_ued",
  "alternate_nme",
  "height_metrs",
  "section_nme",
  "site_tpe",
  "counry",
  "state_provice",
  "site_dsc",
  "coord_at",
  "coord_lng",
  "craton_terrne",
  "basin_nme",
  "basin_tpe",
  "meta_in",
  "earliest_dte",
  "latest_dte",
  "collector_fist",
  "collector_lst",
  "geol_ctxt_noes",
  "lithostrat_dsc",
  "lithostrat_vrb",
  "strat_nme",
  "strat_name_lng",
  "dep_env_in",
  "environment_noes",
  "environment_vrb",
  "is_turbidiic",
  "biostrat_vrb",
  "biozone_nme",
  "age_vrb",
  "age_ics_nme",
  "lithology_nme",
  "lithology_tpe",
  "lithology_clss",
  "lithology_txt",
  "lithology_text_dsc",
  "lithology_cmp",
  "lithology_comp_dsc",
  "lithology_noes",
  "color_nme",
  "color_qualifer",
  "color_shde",
  "munsell_cde",
  "fossil_vrb",
  "fossil_nme",
  "fossil_pdb",
  "sedstruct_nme",
  "sedstruct_dsc",
  "interpreted_ge",
  "interpreted_age_noes",
  "max_ge",
  "min_ge",
  "sample_noes",
  "project_nme",
  "project_tpe",
  "data_souce",
  "run_by_fist",
  "run_by_lst",
  "provider_fist",
  "provider_lst",
  "provider_ab",
  "batchid",
  "batch_labid",
  "geochem_metod",
  "experiment_method_cde",
  "experiment_metod",
  "analytical_method_cde",
  "analytical_method",
  "upper_detection",
  "lower_detection",
  "fe_carb",
  "fe_ox",
  "fe_mag",
  "fe_py",
  "fe_hr",
  "fe_hr_et",
  "fe_py_hr",
  "fe_et_al",
  "toc",
  "tot_c",
  "del_13c",
  "del_34s",
  "del_238u",
  "del_98mo",
  "del_15n",
  "cn_ratio",
  "alu"
];
export default class Checkbox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div onChange={event => this.props.changeType(event.target.value)}>
        {arr.map(item => (
          <label className="options">
            {item}:
            <input type="checkbox" value={item} />
          </label>
        ))}
      </div>
    );
  }
}
