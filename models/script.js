"use strict";

const db = require("./index");
var bodyParser = require("body-parser");
var {
  initialize,
  default_rels,
  search_atts,
  search_joins
} = require("./../routes/initialize.js");
const { AttributeValue, SearchQuery } = require("./../models/search");
var jsonParser = bodyParser.json({
  type: "application/json"
});
const fs = require("fs");
let search_config = JSON.parse(
  fs.readFileSync("./routes/search_config.json", "utf8")
);
initialize(search_config);

function createMaterializedViews() {
  var mv_sql_list = [];
  // Add 3 main materialized views for search bases
  mv_sql_list.push(`BEGIN; DROP MATERIALIZED VIEW IF EXISTS public.analyses_base CASCADE;
CREATE MATERIALIZED VIEW public.analyses_base
 AS
/*Standard query for duplicates
Includes details of methods, who ran the analysis, and where the analyses were run
*/

/* Default Show Attributes */
(SELECT ad.sample_id,
    s.original_num,
	ad.analyte_det_id,
    adl.analyte_code,
    ad.abundance,
    ad.determination_unit,

/* Default Non-Show Attributes */
    s.height_depth_m,
    s.lith_notes,
    s.sample_notes,
    adl.detection_upper_limit,
    adl.detection_lower_limit,

/* Connector Attributes */
    a.run_by,
    a.provided_by,
    a.batch_id,
    a.prep_id,
    a.exp_method_id,
    a.ana_method_id,

    s.coll_event_id,
    s.geol_context_id,
    s.lith_id,
    s.lith_texture_id,
    s.lith_composition_id,
    s.color_id,
    ad.reference_id

    FROM analyte_determination ad
    LEFT JOIN sample s on s.sample_id = ad.sample_id
    LEFT JOIN analyte_determination_limits adl on adl.limit_id = ad.limit_id
    LEFT JOIN analysis a on a.analysis_id = adl.analysis_id
  ORDER BY ad.sample_id)
 WITH DATA; GRANT SELECT ON TABLE public.analyses_base TO PUBLIC; COMMIT;`);
  mv_sql_list.push(`BEGIN; DROP MATERIALIZED VIEW IF EXISTS public.samples_base CASCADE;
CREATE MATERIALIZED VIEW public.samples_base
 AS
/*Standard query (ALL) for projects.
Calculates iron speciation components and ratios (CTE at the top). Where components are not available, published proxies are selected
Includes height_in_section, interpreted_age, lithostratigraphy, verbatim lithostratigraphy, geological age, section name
Includes iron, carbon, isotopic and elemental data - replicates averaged, units standardized, oxides converted
Project_id can be found in the WHERE clause near the end
*/

(WITH iron_components AS (
	SELECT
	s.sample_id,
	round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe-carb'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 3) AS fe_carb,
   	round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe-ox'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 3) AS fe_ox,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe-mag'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 3) AS fe_mag,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe-py'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 3) AS fe_py,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Fe'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 10000::numeric
            WHEN adl.analyte_code::text = 'Fe2O3'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.699433
            ELSE NULL::numeric
        END), 2) AS fe_t,
      round(avg(
                CASE
                    WHEN adl.analyte_code::text = 'Al'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
                    WHEN adl.analyte_code::text = 'Al'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 10000::numeric
                    WHEN adl.analyte_code::text = 'Al2O3'::text THEN ad.abundance * 0.529251
                    ELSE NULL::numeric
                END), 2) AS al
                   FROM sample s
    LEFT JOIN analyte_determination ad on ad.sample_id = s.sample_id
    LEFT JOIN analyte_determination_limits adl on ad.limit_id = adl.limit_id
	GROUP BY s.sample_id),
highly_reactive AS (
	SELECT
	iron_components.sample_id,
	round(sum(iron_components.fe_carb + iron_components.fe_ox + iron_components.fe_mag + iron_components.fe_py), 2) AS hr
	FROM iron_components
	GROUP BY iron_components.sample_id),
iron_ratios AS (
	SELECT
	iron_components.sample_id,
	max(CASE
   			 WHEN iron_components.fe_t > 0::numeric THEN round(highly_reactive.hr/iron_components.fe_t, 2)
             ELSE NULL::numeric
  		END) AS hrt,
	max(CASE
   			WHEN highly_reactive.hr > 0::numeric THEN round(iron_components.fe_py/highly_reactive.hr, 2)
			ELSE NULL::numeric
		END) AS pyhr,
	max(CASE
            WHEN iron_components.fe_t > 0::numeric AND iron_components.al > 0::numeric THEN round(iron_components.fe_t/iron_components.al, 2)
            ELSE NULL::numeric
        END) AS tal
	FROM iron_components
	JOIN highly_reactive on highly_reactive.sample_id = iron_components.sample_id
	GROUP BY iron_components.sample_id),
iron_published AS (
	SELECT
	sample_id,
	max(CASE
      	 	WHEN proxy_id = 6 THEN proxy_pub_value
      	 	ELSE NULL::numeric
    	END) AS hr_pub,
	max(CASE
      		 WHEN proxy_id = 1 THEN proxy_pub_value
        	 ELSE NULL::numeric
        END) AS hrt_pub,
	max(CASE
    		 WHEN proxy_id = 4 THEN proxy_pub_value
        	 ELSE NULL::numeric
        END) AS pyhr_pub,
	max(CASE
        	 WHEN proxy_id = 5 THEN proxy_pub_value
       		 ELSE NULL::numeric
        END) AS tal_pub
	FROM proxy_published pp
	GROUP BY pp.sample_id)




/* Default Show Attributes */
SELECT
s.sample_id,
s.original_num,

/* Default Non-Show Attributes */
s.height_depth_m,
s.lith_notes,
s.sample_notes,

/* Connector Attributes */
s.coll_event_id,
s.geol_context_id,
s.lith_id,
s.lith_texture_id,
s.lith_composition_id,
s.color_id,
ad.reference_id,

/* Analyte Attributes */
iron_components.fe_carb,
iron_components.fe_ox,
iron_components.fe_mag,
iron_components.fe_py,
CASE
   WHEN highly_reactive.hr IS NOT NULL THEN highly_reactive.hr
   WHEN highly_reactive.hr IS NULL AND iron_published.hr_pub IS NOT NULL THEN iron_published.hr_pub
   ELSE NULL::numeric
END AS fe_hr,
CASE
	WHEN iron_ratios.hrt IS NOT NULL THEN iron_ratios.hrt
    WHEN iron_ratios.hrt IS NULL AND iron_published.hrt_pub IS NOT NULL THEN iron_published.hrt_pub
    ELSE NULL::numeric
END AS fe_hr_et,
CASE
    WHEN iron_ratios.pyhr IS NOT NULL THEN iron_ratios.pyhr
    WHEN iron_ratios.pyhr IS NULL AND iron_published.pyhr_pub IS NOT NULL THEN iron_published.pyhr_pub
    ELSE NULL::numeric
END AS fe_py_hr,
CASE
    WHEN iron_ratios.tal IS NOT NULL THEN iron_ratios.tal
    WHEN iron_ratios.tal IS NULL AND iron_published.tal_pub IS NOT NULL THEN iron_published.tal_pub
    ELSE NULL::numeric
END AS fe_et_al,
   round(avg(
        CASE
            WHEN adl.analyte_code::text = 'TOC'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS toc,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'TC'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 4) AS tot_c,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_C13_ORG'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_13c,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_PY'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_U238'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_238u,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_Mo98'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_98mo,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_N15'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_15n,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'C:N'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS cn_ratio,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ag'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ag'::text AND ad.determination_unit::text = 'ppb'::text THEN ad.abundance / 1000::numeric
            WHEN adl.analyte_code::text = 'Ag'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ag,
iron_components.al AS alu,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'As'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'As'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) ars,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Au'::text AND ad.determination_unit::text = 'ppb'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Au'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance * 1000::numeric
            WHEN adl.analyte_code::text = 'Au'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000000::numeric
            ELSE NULL::numeric
        END), 4) AS au,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ba'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ba'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ba,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Be'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Be'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS be,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Bi'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Bi'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS bi,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ca'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ca'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 1000::numeric
            WHEN adl.analyte_code::text = 'CaO'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.714701
            ELSE NULL::numeric
        END), 4) AS ca,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Cd'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Cd'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS cd,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ce'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ce'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ce,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Co'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Co'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS co,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Cr'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Cr'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            WHEN adl.analyte_code::text = 'Cr2O3'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.684202 * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS cr,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Cs'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Cs'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS cs,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Cu'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Cu'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 2) AS cu,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Dy'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Dy'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS dy,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Er'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Er'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS er,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Eu'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Eu'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 2) AS eu,
    iron_components.fe_t AS fe_t,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ga'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ga'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ga,
   round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ge'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ge'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ge,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Gd'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Gd'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS gd,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Hf'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Hf'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS hf,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Hg'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Hg'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 2) AS hg,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ho'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ho'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ho,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'In'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'In'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ind,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'K'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'K2O'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.830147
            ELSE NULL::numeric
        END), 4) AS k,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'LOI'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 4) AS loi,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'La'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'La'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS la,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Li'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Li'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS li,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Lu'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Lu'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS lu,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Mg'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'MgO'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.603036
            ELSE NULL::numeric
        END), 4) AS mg,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Mn'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Mn'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            WHEN adl.analyte_code::text = 'MnO'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.774457 * 10000::numeric
            WHEN adl.analyte_code::text = 'MnO2'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.63193 * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS mn,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Mo'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Mo'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS mo,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'N'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'N'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance /10000
            ELSE NULL::numeric
        END), 4) AS n,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Na'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Na'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance /10000
            WHEN adl.analyte_code::text = 'Na2O'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.741857
            ELSE NULL::numeric
        END), 4) AS na,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Nb'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Nb'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS nb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Nd'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Nd'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS nd,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ni'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ni'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ni,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'P'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'P'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            WHEN adl.analyte_code::text = 'P2O5'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.436421 * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS p,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Pb'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Pb'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS pb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Pr'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Pr'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS pr,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Rb'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Rb'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS rb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Re'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Re'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS re,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'S'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 4) AS su,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sb'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sb'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sc'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sc'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sc,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Se'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Se'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS se,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Si'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'SiO2'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.467439
            ELSE NULL::numeric
        END), 2) AS si,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sm'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sm'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sm,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sn'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sn'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sn,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sr'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sr'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sr,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ta'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ta'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ta,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Tb'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Tb'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS tb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Te'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Te'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS te,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Th'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Th'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS th,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ti'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'TiO2'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.599508
            ELSE NULL::numeric
        END), 4) AS ti,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Tl'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Tl'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS tl,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Tm'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Tm'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS tm,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'U'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'U'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS u,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'V'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'V'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            WHEN adl.analyte_code::text = 'V2O5'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.560166 * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS v,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'W'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'W'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS w,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Y'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Y'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS y,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Yb'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Yb'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS yb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Zn'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Zn'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS zn,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Zr'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Zr'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS zr,

/* NEW ANALYTES HERE */

 round(avg(
        CASE
            WHEN adl.analyte_code::text = 'TIC'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'TIC'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 1000::numeric
           ELSE NULL::numeric
        END), 4) AS tic,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'S_PY'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'S_PY'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 1000::numeric
           ELSE NULL::numeric
        END), 4) AS s_py,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'CAS'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'CAS'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance*1000::numeric
           ELSE NULL::numeric
        END), 4) AS cas,

round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_OBS'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s_obs,

round(avg(
        CASE
            WHEN adl.analyte_code::text = ' DELTA_C13_CARB'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_13c_carb,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_CAS'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s_cas,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_BULK'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s_bulk,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_GYP'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s_gyp,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'S_ORG'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'S_ORG'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance/1000::numeric
           ELSE NULL::numeric
        END), 4) AS s_org,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'S_SO4'::text AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'S_SO4'::text AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance/1000::numeric
           ELSE NULL::numeric
        END), 4) AS s_so4,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Nd143_Nd144'::text AND ad.determination_unit::text = NULL::text THEN ad.abundance
           ELSE NULL::numeric
        END), 4) AS nd143_nd144,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Os187_Os188(I)'::text AND ad.determination_unit::text = NULL::text THEN ad.abundance
           ELSE NULL::numeric
        END), 4) AS os187_os188i,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Se82_Se78'::text AND ad.determination_unit::text = NULL::text THEN ad.abundance
           ELSE NULL::numeric
        END), 4) AS se82_se78,
round(avg(
       CASE
            WHEN adl.analyte_code::text = 'DELTA_Fe56_T'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_56fe_t,
round(avg(
       CASE
            WHEN adl.analyte_code::text = 'DELTA_Fe56_PY'::text AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_56fe_py,
round(avg(
CASE
            WHEN adl.analyte_code::text = 'Tmax'::text AND ad.determination_unit::text = 'degC'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS tmax,
round(avg(
CASE
            WHEN adl.analyte_code::text = 'S2'::text AND ad.determination_unit::text = ' mgHC/g'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS s2,
round(avg(
CASE
            WHEN adl.analyte_code::text = 'S1'::text AND ad.determination_unit::text = ' mgHC/g'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS s1,
round(avg(
CASE
            WHEN adl.analyte_code::text = 'S3'::text AND ad.determination_unit::text = ' mgCO2/g'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS s3

FROM sample s
     LEFT JOIN analyte_determination ad ON s.sample_id = ad.sample_id
     LEFT JOIN analyte_determination_limits adl ON adl.limit_id = ad.limit_id
	 LEFT JOIN iron_components on iron_components.sample_id = s.sample_id
	 LEFT JOIN highly_reactive on highly_reactive.sample_id = s.sample_id
	 LEFT JOIN iron_ratios on iron_ratios.sample_id = s.sample_id
	 LEFT JOIN iron_published on iron_published.sample_id = s.sample_id

GROUP BY s.sample_id,
s.original_num,
ad.reference_id,
iron_components.fe_carb,
iron_components.fe_ox,
iron_components.fe_mag,
iron_components.fe_py,
iron_components.fe_t,
iron_components.al,
highly_reactive.hr,
iron_published.hr_pub,
iron_published.hrt_pub,
iron_published.pyhr_pub,
iron_published.tal_pub,
iron_ratios.hrt,
iron_ratios.pyhr,
iron_ratios.tal
ORDER BY s.sample_id, s.original_num)

 WITH DATA; GRANT SELECT ON TABLE public.samples_base TO PUBLIC; COMMIT;`);
  mv_sql_list.push(`BEGIN; DROP MATERIALIZED VIEW IF EXISTS public.nhhxrf_base CASCADE;
CREATE MATERIALIZED VIEW public.nhhxrf_base
 AS
/*Standard query (NO HHXRF) for projects.
Calculates iron speciation components and ratios (CTE at the top). Where components are not available, published proxies are selected
Includes height_in_section, interpreted_age, lithostratigraphy, verbatim lithostratigraphy, geological age, section name
Includes iron, carbon, isotopic and elemental data - replicates averaged, units standardized, oxides converted
Project_id can be found in the WHERE clause near the end
*/

(WITH iron_components AS (
	SELECT
	s.sample_id,
	round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe-carb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 3) AS fe_carb,
   	round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe-ox'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 3) AS fe_ox,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe-mag'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 3) AS fe_mag,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe-py'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 3) AS fe_py,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Fe'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Fe'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 10000::numeric
            WHEN adl.analyte_code::text = 'Fe2O3'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.699433
            ELSE NULL::numeric
        END), 2) AS fe_t,
      round(avg(
                CASE
                    WHEN adl.analyte_code::text = 'Al'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
                    WHEN adl.analyte_code::text = 'Al'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 10000::numeric
                    WHEN adl.analyte_code::text = 'Al2O3'::text THEN ad.abundance * 0.529251
                    ELSE NULL::numeric
                END), 2) AS al
                   FROM sample s
    LEFT JOIN analyte_determination ad on ad.sample_id = s.sample_id
    LEFT JOIN analyte_determination_limits adl on ad.limit_id = adl.limit_id
    LEFT JOIN analysis a ON a.analysis_id = adl.analysis_id
	GROUP BY s.sample_id),
highly_reactive AS (
	SELECT
	iron_components.sample_id,
	round(sum(iron_components.fe_carb + iron_components.fe_ox + iron_components.fe_mag + iron_components.fe_py), 2) AS hr
	FROM iron_components
	GROUP BY iron_components.sample_id),
iron_ratios AS (
	SELECT
	iron_components.sample_id,
	max(CASE
   			 WHEN iron_components.fe_t > 0::numeric THEN round(highly_reactive.hr/iron_components.fe_t, 2)
             ELSE NULL::numeric
  		END) AS hrt,
	max(CASE
   			WHEN highly_reactive.hr > 0::numeric THEN round(iron_components.fe_py/highly_reactive.hr, 2)
			ELSE NULL::numeric
		END) AS pyhr,
	max(CASE
            WHEN iron_components.fe_t > 0::numeric AND iron_components.al > 0::numeric THEN round(iron_components.fe_t/iron_components.al, 2)
            ELSE NULL::numeric
        END) AS tal
	FROM iron_components
	JOIN highly_reactive on highly_reactive.sample_id = iron_components.sample_id
	GROUP BY iron_components.sample_id),
iron_published AS (
	SELECT
	sample_id,
	max(CASE
      	 	WHEN proxy_id = 6 THEN proxy_pub_value
      	 	ELSE NULL::numeric
    	END) AS hr_pub,
	max(CASE
      		 WHEN proxy_id = 1 THEN proxy_pub_value
        	 ELSE NULL::numeric
        END) AS hrt_pub,
	max(CASE
    		 WHEN proxy_id = 4 THEN proxy_pub_value
        	 ELSE NULL::numeric
        END) AS pyhr_pub,
	max(CASE
        	 WHEN proxy_id = 5 THEN proxy_pub_value
       		 ELSE NULL::numeric
        END) AS tal_pub
	FROM proxy_published pp
	GROUP BY pp.sample_id)




/* Default Show Attributes */
SELECT
s.sample_id,
s.original_num,

/* Default Non-Show Attributes */
s.height_depth_m,
s.lith_notes,
s.sample_notes,

/* Connector Attributes */
s.coll_event_id,
s.geol_context_id,
s.lith_id,
s.lith_texture_id,
s.lith_composition_id,
s.color_id,
ad.reference_id,

/* Analyte Attributes */
iron_components.fe_carb,
iron_components.fe_ox,
iron_components.fe_mag,
iron_components.fe_py,
CASE
   WHEN highly_reactive.hr IS NOT NULL THEN highly_reactive.hr
   WHEN highly_reactive.hr IS NULL AND iron_published.hr_pub IS NOT NULL THEN iron_published.hr_pub
   ELSE NULL::numeric
END AS fe_hr,
CASE
	WHEN iron_ratios.hrt IS NOT NULL THEN iron_ratios.hrt
    WHEN iron_ratios.hrt IS NULL AND iron_published.hrt_pub IS NOT NULL THEN iron_published.hrt_pub
    ELSE NULL::numeric
END AS fe_hr_et,
CASE
    WHEN iron_ratios.pyhr IS NOT NULL THEN iron_ratios.pyhr
    WHEN iron_ratios.pyhr IS NULL AND iron_published.pyhr_pub IS NOT NULL THEN iron_published.pyhr_pub
    ELSE NULL::numeric
END AS fe_py_hr,
CASE
    WHEN iron_ratios.tal IS NOT NULL THEN iron_ratios.tal
    WHEN iron_ratios.tal IS NULL AND iron_published.tal_pub IS NOT NULL THEN iron_published.tal_pub
    ELSE NULL::numeric
END AS fe_et_al,
   round(avg(
        CASE
            WHEN adl.analyte_code::text = 'TOC'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS toc,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'TC'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 4) AS tot_c,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_C13_ORG'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_13c,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_PY'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_U238'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_238u,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_Mo98'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_98mo,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_N15'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_15n,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'C:N'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS cn_ratio,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ag'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ag'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppb'::text THEN ad.abundance / 1000::numeric
            WHEN adl.analyte_code::text = 'Ag'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ag,
iron_components.al AS alu,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'As'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'As'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) ars,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Au'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppb'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Au'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance * 1000::numeric
            WHEN adl.analyte_code::text = 'Au'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000000::numeric
            ELSE NULL::numeric
        END), 4) AS au,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ba'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ba'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ba,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Be'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Be'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS be,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Bi'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Bi'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS bi,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ca'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ca'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 1000::numeric
            WHEN adl.analyte_code::text = 'CaO'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.714701
            ELSE NULL::numeric
        END), 4) AS ca,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Cd'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Cd'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS cd,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ce'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ce'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ce,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Co'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Co'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS co,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Cr'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Cr'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            WHEN adl.analyte_code::text = 'Cr2O3'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.684202 * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS cr,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Cs'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Cs'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS cs,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Cu'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Cu'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 2) AS cu,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Dy'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Dy'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS dy,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Er'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Er'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS er,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Eu'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Eu'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 2) AS eu,
        iron_components.fe_t AS fe_t,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ga'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ga'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ga,
   round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ge'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ge'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ge,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Gd'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Gd'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS gd,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Hf'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Hf'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS hf,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Hg'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Hg'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 2) AS hg,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ho'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ho'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ho,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'In'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'In'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ind,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'K'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'K2O'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.830147
            ELSE NULL::numeric
        END), 4) AS k,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'LOI'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 4) AS loi,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'La'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'La'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS la,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Li'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Li'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS li,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Lu'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Lu'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS lu,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Mg'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'MgO'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.603036
            ELSE NULL::numeric
        END), 4) AS mg,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Mn'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Mn'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            WHEN adl.analyte_code::text = 'MnO'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.774457 * 10000::numeric
            WHEN adl.analyte_code::text = 'MnO2'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.63193 * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS mn,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Mo'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Mo'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS mo,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'N'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'N'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance /10000
            ELSE NULL::numeric
        END), 4) AS n,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Na'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Na'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance /10000
            WHEN adl.analyte_code::text = 'Na2O'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.741857
            ELSE NULL::numeric
        END), 4) AS na,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Nb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Nb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS nb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Nd'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Nd'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS nd,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ni'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ni'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ni,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'P'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'P'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            WHEN adl.analyte_code::text = 'P2O5'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.436421 * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS p,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Pb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Pb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS pb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Pr'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Pr'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS pr,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Rb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Rb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS rb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Re'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Re'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS re,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'S'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 4) AS su,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sc'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sc'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sc,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Se'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Se'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS se,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Si'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'SiO2'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.467439
            ELSE NULL::numeric
        END), 2) AS si,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sm'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sm'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sm,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sn'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sn'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sn,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Sr'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Sr'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS sr,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ta'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Ta'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS ta,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Tb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Tb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS tb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Te'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Te'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS te,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Th'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Th'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS th,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Ti'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'TiO2'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.599508
            ELSE NULL::numeric
        END), 4) AS ti,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Tl'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Tl'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS tl,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Tm'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Tm'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS tm,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'U'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'U'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS u,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'V'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'V'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            WHEN adl.analyte_code::text = 'V2O5'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 0.560166 * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS v,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'W'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'W'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS w,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Y'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Y'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS y,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Yb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Yb'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS yb,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Zn'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Zn'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS zn,
    round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Zr'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
            WHEN adl.analyte_code::text = 'Zr'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance * 10000::numeric
            ELSE NULL::numeric
        END), 4) AS zr,

        /* NEW ANALYTES HERE */


 round(avg(
        CASE
            WHEN adl.analyte_code::text = 'TIC'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'TIC'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 1000::numeric
           ELSE NULL::numeric
        END), 4) AS tic,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'S_PY'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'S_PY'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance / 1000::numeric
           ELSE NULL::numeric
        END), 4) AS s_py,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'CAS'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'CAS'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance*1000::numeric
           ELSE NULL::numeric
        END), 4) AS cas,

round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_OBS'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s_obs,

round(avg(
        CASE
            WHEN adl.analyte_code::text = ' DELTA_C13_CARB'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_13c_carb,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_CAS'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s_cas,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_BULK'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s_bulk,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'DELTA_S34_GYP'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_34s_gyp,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'S_ORG'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'S_ORG'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance/1000::numeric
           ELSE NULL::numeric
        END), 4) AS s_org,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'S_SO4'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'wt%'::text THEN ad.abundance
WHEN adl.analyte_code::text = 'S_SO4'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'ppm'::text THEN ad.abundance/1000::numeric
           ELSE NULL::numeric
        END), 4) AS s_so4,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Nd143_Nd144'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = NULL::text THEN ad.abundance
           ELSE NULL::numeric
        END), 4) AS nd143_nd144,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Os187_Os188(I)'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = NULL::text THEN ad.abundance
           ELSE NULL::numeric
        END), 4) AS os187_os188i,
round(avg(
        CASE
            WHEN adl.analyte_code::text = 'Se82_Se78'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = NULL::text THEN ad.abundance
           ELSE NULL::numeric
        END), 4) AS se82_se78,
round(avg(
       CASE
            WHEN adl.analyte_code::text = 'DELTA_Fe56_T'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_56fe_t,
round(avg(
       CASE
            WHEN adl.analyte_code::text = 'DELTA_Fe56_PY'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'permil'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS del_56fe_py,
round(avg(
CASE
            WHEN adl.analyte_code::text = 'Tmax'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = 'degC'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS tmax,
round(avg(
CASE
            WHEN adl.analyte_code::text = 'S2'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = ' mgHC/g'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS s2,
round(avg(
CASE
            WHEN adl.analyte_code::text = 'S1'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = ' mgHC/g'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS s1,
round(avg(
CASE
            WHEN adl.analyte_code::text = 'S3'::text AND a.ana_method_id <> 28 AND ad.determination_unit::text = ' mgCO2/g'::text THEN ad.abundance
            ELSE NULL::numeric
        END), 2) AS s3

FROM sample s
     LEFT JOIN analyte_determination ad ON s.sample_id = ad.sample_id
     LEFT JOIN analyte_determination_limits adl ON adl.limit_id = ad.limit_id
     LEFT JOIN analysis a ON a.analysis_id = adl.analysis_id
	 LEFT JOIN iron_components on iron_components.sample_id = s.sample_id
	 LEFT JOIN highly_reactive on highly_reactive.sample_id = s.sample_id
	 LEFT JOIN iron_ratios on iron_ratios.sample_id = s.sample_id
	 LEFT JOIN iron_published on iron_published.sample_id = s.sample_id

GROUP BY s.sample_id,
s.original_num,
ad.reference_id,
iron_components.fe_carb,
iron_components.fe_ox,
iron_components.fe_mag,
iron_components.fe_py,
iron_components.fe_t,
iron_components.al,
highly_reactive.hr,
iron_published.hr_pub,
iron_published.hrt_pub,
iron_published.pyhr_pub,
iron_published.tal_pub,
iron_ratios.hrt,
iron_ratios.pyhr,
iron_ratios.tal
ORDER BY s.sample_id, s.original_num)
 WITH DATA; GRANT SELECT ON TABLE public.nhhxrf_base TO PUBLIC; COMMIT;`);
  // Add the other materialized views for attributes

  var attributes = [
    "country",
    "ana_code",
    "environment_bin",
    "original_name",
    "section_name",
    "site_type",
    "state_province",
    "craton_terrane",
    "basin_name",
    "basin_type",
    "meta_bin",
    "collector_first",
    "collector_last",
    "strat_name_long",
    "age_ics_name",
    "lithology_name",
    "lithology_type",
    "lithology_class",
    "lithology_text",
    "lithology_comp",
    "project_name",
    "data_source",
    "run_by_last",
    "provider_lab"
  ];
  var cur_limit = 10000000000;
  var cur_search = "";
  for (var i = 0; i < attributes.length; i++) {
    if (search_atts[attributes[i]]) {
      var cur_att = search_atts[attributes[i]];
      var search_req = new SearchQuery(
        Array.isArray(cur_att.search_bases)
          ? default_rels[cur_att.search_bases[0]]
          : default_rels[cur_att.search_bases]
      );
      search_req.sq_select.push(cur_att);
      search_req.add_joins(cur_att);

      var join_str_list = search_req.compute_join_list(
        search_atts,
        search_joins,
        true
      );
      if (cur_att.attribute_sql.length == 0) {
        cur_att.attribute_sql = `${search_req.sq_base_rel.br_db}.${
          cur_att.attribute_db
        }`;
      }
      var select_str = `SELECT DISTINCT ${cur_att.attribute_sql} AS ${
        cur_att.attribute_api
      }`;
      if (cur_att.attribute_db == cur_att.attribute_api) {
        select_str = `SELECT DISTINCT ${cur_att.attribute_sql}`;
      }
      var from_str = `FROM ${search_req.sq_base_rel.br_db}`;
      var join_str_sql = join_str_list.join(" ");
      var where_order_str_sql = `WHERE ${
        cur_att.attribute_sql
      } IS NOT NULL ORDER BY ${cur_att.attribute_sql}`;

      search_req.sq_sql = `BEGIN; DROP MATERIALIZED VIEW IF EXISTS public.${
        cur_att.attribute_api
      }__distinctmv CASCADE; CREATE MATERIALIZED VIEW public.${
        cur_att.attribute_api
      }__distinctmv AS (${select_str} ${from_str} ${join_str_sql} ${where_order_str_sql}) WITH DATA; GRANT SELECT ON TABLE public.${
        cur_att.attribute_api
      }__distinctmv TO PUBLIC; COMMIT;`;

      mv_sql_list.push(search_req.sq_sql);
    }
  }

  mv_sql_list.forEach(query => {
    // console.log(query);
    db.pool.query(query, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(response, "response");
      }
    });
  });
}

createMaterializedViews();

// // Generate MSCB Materialized Views Part 1
// Use: have code run once to generate all materialized views. [add attributes to list for inclusion]
// var attributes = ['country', 'original_name', 'section_name', 'site_type', 'state_province', 'craton_terrane', 'basin_name', 'basin_type', 'meta_bin', 'collector_first', 'collector_last', 'strat_name_long', 'age_ics_name', 'lithology_name', 'lithology_type', 'lithology_class', 'lithology_text', 'lithology_comp', 'project_name', 'data_source', 'run_by_last', 'provider_lab'];
// var cur_limit = 10000000000;
// var cur_search = "";
// for (var i = 0; i < attributes.length; i++) {
//     if (search_atts[attributes[i]]) {
//         var cur_att = search_atts[attributes[i]];
//         var search_req = new SearchQuery(default_rels[cur_att.search_bases[0]]);
//         search_req.sq_select.push(cur_att);
//         search_req.add_joins(cur_att);
//         search_req.to_sql_pri_api(search_atts, search_joins, cur_search, cur_limit);
//
//         search_req.sq_sql = `BEGIN; CREATE MATERIALIZED VIEW public.${cur_att.attribute_api}__distinctmv AS ${search_req.sq_sql} WITH DATA; GRANT ALL ON TABLE public.${cur_att.attribute_api}__distinctmv TO PUBLIC; COMMIT;`
//
//         console.log(search_req.sq_sql);
//
//         const sq_query = {
//             text: search_req.sq_sql
//         };
//         ctrl.example.get(sq_query, req, res);
//     }
// }

// // Generate MSCB Materialized Views Part 2
// Use: uncomment out to_sql_pri_api and comment what is there then run with part 1
// var join_str_list = this.compute_join_list(search_atts, search_joins, false);
// var select_str_list = this.compute_select_list(search_atts, search_joins, true);
// var select_str = `SELECT ${select_str_list.join(", ")}`;
// var from_str = `FROM ${this.sq_base_rel.br_db}`;
// var join_str_sql = join_str_list.join(" ");
// var where_limit_str_sql = `WHERE ${this.sq_select[0].attribute_sql} IS NOT NULL ORDER BY ${this.sq_select[0].attribute_sql}`;
// this.sq_sql = `(${select_str} ${from_str} ${join_str_sql} ${where_limit_str_sql})`
