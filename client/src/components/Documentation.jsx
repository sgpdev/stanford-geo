import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import JumbotronUI from "./JumbotronUI";
import "./../styles/Documentation.css";

class About extends Component {
  constructor(props) {
    super(props);
  }

  // This is just personal preference.
  // I prefer to not show the the whole text area selected.

  render() {
    return (
      <span>
        <JumbotronUI />
        <div className="outer-doc">
          <h1 className="main-title-doc">Documentation</h1>
          Welcome to the Sedimentary Geochemistry and Paleoenvironments search
          website. We here at the SGP project are committed to providing global
          access to geochemical sample data. We have acquired sample data from
          volunteering labs, dived into past studies and revived old data
          sources to compile the SGP database and search service you see before
          you. The search service allows the public to query our database either
          through this website which is designed for casual users or our public
          API intended to give technologically inclined users the ability to
          perform any and all searches. This page is serves as a guide and
          documentation on how to use our search services and what search
          attributes are available.
          <div className="website">
            <br />
            <br />
            <h3 className="title-doc">The Website</h3>
            When on the search page, users will be met with a blank table and
            open sidebar containing interactive UI elements. The table is
            intended to preview resulting data based on provided search terms
            whilst the sidebar is the mechanism by which users select their
            search options. The search options are categorized into the
            following:
            <ul />
            <li>
              Type: Only contains one search option which is selecting the
              search type (more on that later)
            </li>
            <li>
              Filters: Contains search options that allow the user to pursue
              samples/analyses of interest
            </li>
            <li>
              Show: Contains search options that determine what columns will
              appear on the table and exported results
            </li>
            <br />
            The type search option is important to consider when choosing how
            resulting geochemical data ought to be organized. The search type
            must be selected before anything else, as certain search options
            only exist in certain search types. The two main search types are
            ‘samples’ and ‘analyses’, with ‘No HHXRF’ simply being a ‘samples’
            search that excludes any HHXRF data. A ‘samples’ search will list an
            individual sample on each row, with analytes taking up the columns
            and containing averaged abundance levels. Meanwhile, if users are
            looking to delve deeper into the data and understand the analyses
            and procedures that were executed to obtain each sample’s
            geochemical data, then the ‘analyses’ search type is useful as it
            lists every analysis recorded in the database in a separate row.
            Once the user has selected a search type, then they can start to
            search through the data. The filters section is used to prune
            through the database. Within the sub-categories, different search
            options exist that either accept lists of strings or numerical
            ranges. Every search option represents one search attribute, which
            equates to one type of data that exists in the SGP database and also
            a column on the preview table. The user can enter their desired
            search parameters within the filters section and will immediately
            see the table fill up or change to reflect the new search. However,
            the user will notice that the columns of the search attributes they
            are interacting with do not appear as columns on the preview table.
            To force them to appear, the user must check the search attributes
            show checkbox which can be found in the show section of the sidebar.
            With these tools, users can effectively slice and dice the SGP
            database as they please. When users have configured the search
            options to their liking and have confirmed this fact through the
            preview table, they can export the table as a csv file (for JSON use
            the public API) by clicking the export button found when the side
            pane is collapsed. Furthermore, they can hover their cursor over the
            API symbol to view the API call that was used to generate the
            current results and double click it to automatically copy the API
            call to their clipboard. Looking at the API call used for a given
            search is not only useful for more technologically sophisticated
            users, but is a great way to cite SGP data in academic papers
            because anyone reading the API call can get a copy of the data
            through the website or using the public API. We hope you will find
            the website simple and easy to use, and we appreciate any feedback
            you can give us through <a>esper@stanford.edu</a>.
          </div>
          <br />
          <br />
          <div className="public-api">
            <h3 className="title-doc">The Public API</h3>
            As can be seen be seen with the side pane’s API button, the frontend
            uses the SGP public API to query the SGP database. The frontend is
            great for users who want to get a feel for the potential of SGP
            search services but is rather limited when it comes to the number of
            available filter search options. To truly take advantage of the
            plethora of searchable attributes that exist in the SGP database,
            users are encouraged to familiarize themselves with the public API.
            When using the public API, the user must first construct a JSON API
            call using the syntax explained below and then communicate their
            requests to the SGP backend using an HTTP client (e.g. Postman API
            development environment, curl command line tool. There are also
            libraries that simplify and automate this process in different
            programming languages). Users should send their API calls to the
            following URL using an HTTP POST method:
            <br />
            <br />
            <a href="">
              http://www.sgp-search.io/api/post
            </a>
            <br />
            <br />
            An SGP API request consists of three parts which are analogous to
            those found in an SGP frontend search:
            <ul />
              <li>
                type: One search option for selecting the search type (samples,
                analyses or nhhxrf)
              </li>
              <li>
                filters: Contains a list search options which are logically
                ANDed in the results
              </li>
              <li>
                show: Contains search options that determine which columns will
                appear in the results
              </li>
              <br />
            Using the JSON data interchange format, a user can pass their search
            option parameters within the body of the HTTP Post packet. Below is
            an example SGP API call:
            <br />
            <br />
            {JSON.stringify({
              type: "samples",
              filters: {
                country: ["Argentina", "Canada", "Oman"],
                fe: [2, 4],
                fe_carb: [0.025, 0.05]
              },
              show: [
                "country",
                "fe",
                "fe_carb",
                "section_name",
                "height_meters"
              ]
            })}
            <br />
            <br />
            This API call is making a samples type search for samples that
            originate from Argentina, Canada or Oman, have 2%-4% Fe and
            0.025%-0.05% Fe-Carb. In addition, the API call is asking for
            columns that show each sample’s country, Fe (wt%), Fe-Carb (wt%),
            section name and collection height in meters. Each search attribute
            (i.e. country, fe, section_name etc.) has an single word API name, a
            set of search types in which it can be searched upon and only
            accepts certain search parameter types which are listed below:
            <ul />
              <li>
                String: tells the backend to find results matching a single
                given string (e.g. country : "Canada")
              </li>
              <li>
                String Array: requires that a sample/analysis matches at least
                one of given strings (e.g. country : ["Argentina", "Canada",
                "Oman"])
              </li>
              <li>
                Number: asks for search matches to have an exact value match
                with the given number (e.g. fe : 2.14)
              </li>
              <li>
                Number Range: will match with any samples/analysis that contain
                a value in the given range (e.g. fe : [2, 4.5])
              </li>
              <br />
            With this guide and the search attribute dictionary below, users now
            have the power to sift through the SGP database in any way they
            please. We hope this documentation has been helpful, and appreciate
            any feedback you can give us through <a>esper@stanford.edu</a>.
          </div>
          <div className="search-att-dic">
            <br />
            <br />
            <h3 className="title-doc"> Search Attribute Dictionary</h3>
            The table below presents all searchable attributes that currently
            exist in the SGP database. Here are descriptions for each column:
            <ul />
              <li>
                Attribute API: This is the single word string that is used in
                API calls to refer to the attribute.
              </li>
              <li>
                Attribute ID: This human readable string identifies the
                attribute and is used as column titles in search results.
              </li>
              <li>
                Search Types: This lists the search types within which the
                attribute can be filtered through and/or shown.
              </li>
              <li>
                Parameter Types: This lists the legal parameter types the search
                attributes accepts during filtering.
              </li>
              <li>
                Geology Description: This optional column may contain additional
                descriptions that are important from a semantic standpoint.
              </li>
            <br />
            <table border="1">
              <tr>
                <td>Attribute API</td>
                <td>Attribute ID</td>
                <td>Search Types</td>
                <td>Parameter Types</td>
                <td>Geology Description</td>
              </tr>
              <tr>
                <td>sample_id</td>
                <td>sample identifier</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>original_name</td>
                <td>sample original name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>analysis_id</td>
                <td>analysis result identifier</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>ana_code</td>
                <td>analyte code</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>abundance</td>
                <td>analyte abundance</td>
                <td>analyses</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>unit_used</td>
                <td>units used</td>
                <td>analyses</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>alternate_name</td>
                <td>alternate name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Additional sample names this sample may have been published as
                </td>
              </tr>
              <tr>
                <td>height_meters</td>
                <td>height/depth</td>
                <td>analyses, samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td>Stratigraphic height in meters or depth in drillcore</td>
              </tr>
              <tr>
                <td>section_name</td>
                <td>section name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  This could be a drillcore, stratigraphic section, or
                  spot-sampling locality. In some rare instances where complete
                  information could be not obtained, a best-guess sampling
                  locality was created (for instance, the geographic center of
                  New York state if the only geographical information was 'New
                  York State'). More information can be found under 'geological
                  context notes'.
                </td>
              </tr>
              <tr>
                <td>site_type</td>
                <td>site type</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>Outcrop, drillcore, cuttings, or modern sediments</td>
              </tr>
              <tr>
                <td>country</td>
                <td>country</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>state_province</td>
                <td>state/province</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>site_desc</td>
                <td>site description</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Any details or descriptions of the site - e.g. alternate
                  names, location information (5 miles west of X, by the creek,
                  etc.)
                </td>
              </tr>
              <tr>
                <td>coord_lat</td>
                <td>site latitude</td>
                <td>analyses, samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>coord_long</td>
                <td>site longitude</td>
                <td>analyses, samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>craton_terrane</td>
                <td>craton/terrane</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  The name of the craton or terrane e.g. Laurentia, Avalonia. As
                  entered by SGP collaborative team members
                </td>
              </tr>
              <tr>
                <td>basin_name</td>
                <td>basin name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  The name of the sedimentary basin e.g. Taconic Foreland Basin.
                  As entered by SGP collaborative team members
                </td>
              </tr>
              <tr>
                <td>basin_type</td>
                <td>basin type</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>The type of basin e.g. peripheral foreland, rift, etc.</td>
              </tr>
              <tr>
                <td>meta_bin</td>
                <td>metamorphic bin</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Sites are sorted into three low-grade metamorphic bins,
                  roughly based on metapelite zones as follows: 1) Diagenetic
                  zone. Under mature, preserved biomarkers, KI {">"} 0.42, CAI{" "}
                  {"≤"} 3, Ro {"<"} 2.0, facies: zeolite-subgreenschist facies,
                  grade: diagenesis-very low grade 2) Anchizone. Over-mature, no
                  preserved biomarkers, CAI=4, Ro 2-4, facies: sub-greenschist,
                  grade: very low grade 3) Epizone. Ro{">"}4, CAI=5, KI {"<"}{" "}
                  0.25, facies: greenschist, grade: low-grade
                </td>
              </tr>
              <tr>
                <td>earliest_date</td>
                <td>earliest collection time</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>latest_date</td>
                <td>latest collection time</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>collector_first</td>
                <td>collector first name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>collector_last</td>
                <td>collector last name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>geol_ctxt_notes</td>
                <td>geological context notes</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Any clarification or comments on site-level features. This
                  field often includes error estimates on latitudes/longitudes.
                </td>
              </tr>
              <tr>
                <td>lithostrat_desc</td>
                <td>lithostratigraphic description</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>General lithological description of the unit</td>
              </tr>
              <tr>
                <td>lithostrat_verb</td>
                <td>verbatim lithostratigraphy</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  The verbatim lithostratigraphy as described in a paper or by
                  SGP collaborative team member. This may contain additional
                  nuance or regional information compared to the formal
                  lithostratigraphy (e.g. upper middle Frankfort Shale)
                </td>
              </tr>
              <tr>
                <td>strat_name</td>
                <td>stratigraphy name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Short name of the unit, often without 'Formation' or 'Member'
                </td>
              </tr>
              <tr>
                <td>strat_name_long</td>
                <td>long stratigraphy name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>environment_bin</td>
                <td>environmental bin</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Environments are divided into five bins - inner shelf/outer
                  shelf/basinal/lacustrine/fluvial - according to the following
                  criteria (1-3 from Sperling et al. 2015). 1) Environment
                  1/Inner Shelf: Shale interbedded with abundant shallow-water
                  indicators. This includes clastic beds with wave-generated
                  sedimentary structures as well as shallow-water carbonates
                  such as stromatolites, oolites, and rip-up conglomerates.
                  Evidence of exposure—i.e. mudcracks, karsting, teepee
                  structures—are often in relatively close stratigraphic
                  proximity on the meters to 10s of meters scale. 2) Environment
                  2/Outer Shelf: Shale from sequences that generally show little
                  wave activity, but with occasional evidence for storm and/or
                  wave activity, such as hummocky cross-stratified sands encased
                  in shales. Evidence for exposure is not in close stratigraphic
                  proximity. 3) Environment 3/Basinal: Shale from successions
                  with no evidence for any storm and/or wave activity for an
                  appreciable (i.e. >50 m) stratigraphic distance. Generally
                  located considerably basin-ward of shallower-water facies. 4)
                  Lacustrine 5) Fluvial
                </td>
              </tr>
              <tr>
                <td>environment_notes</td>
                <td>environment notes</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>environment_verb</td>
                <td>verbatim environment</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  The verbatim environment as described in a paper or by SGP
                  collaborative team member. This may contain additional nuance
                  or regional information compared to the binned classification
                </td>
              </tr>
              <tr>
                <td>is_turbiditic</td>
                <td>turbiditic (t/f)</td>
                <td>analyses, samples, nhhxrf</td>
                <td>N/A</td>
                <td>
                  Whether the environment was turbiditic. This is a general
                  feature of the stratigraphic package rather than a distinction
                  between sampling Te layers versus the entire turbidite. Note
                  that many samples do not have this information filled out.
                </td>
              </tr>
              <tr>
                <td>biostrat_verb</td>
                <td>verbatim biostratigraphy</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>biozone_name</td>
                <td>biozone name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>age_verb</td>
                <td>verbatim geological age</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Verbatim age as reported in publication or by SGP
                  collaborative team member. This may often include regional age
                  schemes.
                </td>
              </tr>
              <tr>
                <td>age_ics_name</td>
                <td>ics age</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>International Commission on Stratigraphy age names</td>
              </tr>
              <tr>
                <td>lithology_name</td>
                <td>lithology name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>The primary sediment type of the sample</td>
              </tr>
              <tr>
                <td>lithology_type</td>
                <td>lithology type</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>lithology_class</td>
                <td>lithology class</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>lithology_text</td>
                <td>lithology texture</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>Textural modifiers (siltey, muddy, sandy, clayey)</td>
              </tr>
              <tr>
                <td>lithology_text_desc</td>
                <td>lithology texture description</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>lithology_comp</td>
                <td>lithology composition</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Compositional modifiers (e.g., phosphatic, calcareous,
                  dolomitic, etc.)
                </td>
              </tr>
              <tr>
                <td>lithology_comp_desc</td>
                <td>lithology composition description</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>lithology_notes</td>
                <td>lithology notes</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>color_name</td>
                <td>color name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>color_qualifier</td>
                <td>color qualifier</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>color_shade</td>
                <td>color shade</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>munsell_code</td>
                <td>munsell code</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>fossil_verb</td>
                <td>verbatim fossil</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>fossil_name</td>
                <td>fossil name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>fossil_pbdb</td>
                <td>PBDB code</td>
                <td>analyses, samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>sedstruct_name</td>
                <td>sedimentary structure name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>sedstruct_desc</td>
                <td>sedimentary structure description</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>interpreted_age</td>
                <td>interpreted age</td>
                <td>analyses, samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td>
                  A numerical estimate for the age of the sample in millions of
                  years
                </td>
              </tr>
              <tr>
                <td>interpreted_age_notes</td>
                <td>interpreted age justification</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Justification for the numerical estimate given in
                  interpretative age, as provided by SGP collaborative team
                  members. Uncertainty on the age estimate is often also
                  included
                </td>
              </tr>
              <tr>
                <td>max_age</td>
                <td>max age</td>
                <td>analyses, samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td>
                  Maximum age of the sample, as provided by SGP collaborative
                  team members
                </td>
              </tr>
              <tr>
                <td>min_age</td>
                <td>min age</td>
                <td>analyses, samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td>
                  Minimum age of the sample, as provided by SGP collaborative
                  team members
                </td>
              </tr>
              <tr>
                <td>sample_notes</td>
                <td>sample notes</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>project_name</td>
                <td>project name</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  SGP data are organized as 'Projects.' In most cases, these
                  represent the data contained in a published paper. However, in
                  some cases they may represent groupings of papers, data from a
                  particular region, or samples run by a particular person or
                  lab.
                </td>
              </tr>
              <tr>
                <td>project_type</td>
                <td>project type</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>data_source</td>
                <td>data source</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td>
                  Data in the SGP database come from three main data sources: 1)
                  information provided by the SGP collaborative team, 2) legacy
                  USGS data from the National Geochemical Database, 3) data
                  compiled by the USGS Critical Metals In Black Shales project
                  (CMIBS)
                </td>
              </tr>
              <tr>
                <td>data_source_desc</td>
                <td>data source description</td>
                <td>analyses, samples, nhhxrf</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>run_by_first</td>
                <td>run by first name</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>run_by_last</td>
                <td>run by last name</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>provider_first</td>
                <td>provided by first name</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>provider_last</td>
                <td>provided by last name</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>provider_lab</td>
                <td>lab provider name</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>batch_id</td>
                <td>batch identifier</td>
                <td>analyses</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>batch_lab_id</td>
                <td>lab batch identifier</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>geochem_method</td>
                <td>prep method</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td>
                  How the sample was prepared to a powder (e.g. tungsten carbide
                  shatterbox, agate mortar and pestle)
                </td>
              </tr>
              <tr>
                <td>experiment_method_code</td>
                <td>experimental method code</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>experiment_method</td>
                <td>experimental method translation</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>analytical_method_code</td>
                <td>analytical method code</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td>
                  Code for analytical method e.g. XRF, ICP:MS etc. Based in part
                  on the list used by EarthChem
                </td>
              </tr>
              <tr>
                <td>analytical_method</td>
                <td>analytical method translation</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td />
              </tr>
              <tr>
                <td>upper_detection</td>
                <td>upper detection limit</td>
                <td>analyses</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>lower_detection</td>
                <td>lower detection limit</td>
                <td>analyses</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>analysis_ref_long</td>
                <td>analysis reference (long)</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td>Full reference for the analysis</td>
              </tr>
              <tr>
                <td>analysis_ref_short</td>
                <td>analysis reference (short)</td>
                <td>analyses</td>
                <td>String, String Array</td>
                <td>Short-hand reference (e.g. Sperling, 2013)</td>
              </tr>
              <tr>
                <td>fe</td>
                <td>Fe (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>fe_carb</td>
                <td>Fe-carb (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>fe_ox</td>
                <td>Fe-ox (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>fe_mag</td>
                <td>Fe-mag (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>fe_py</td>
                <td>Fe-py (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>fe_hr</td>
                <td>FeHR</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>fe_hr_fe_t</td>
                <td>FeHR/FeT</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>fe_py_fe_hr</td>
                <td>Fe-py/FeHR</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>fe_t_al</td>
                <td>FeT/Al</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_56fe_t</td>
                <td>Delta56Fe-T (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_56fe_py</td>
                <td>Delta56Fe-py (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>tic</td>
                <td>TIC (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>toc</td>
                <td>TOC (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>tot_c</td>
                <td>Total Carbon (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_13c_org</td>
                <td>Delta13C-org (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_13c_carb</td>
                <td>Delta13C-carb (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>cn_ratio</td>
                <td>C:N (atomic)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>n</td>
                <td>N (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_15n</td>
                <td>Delta15N (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>su</td>
                <td>S (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_34s_py</td>
                <td>Delta34S-py (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_34s_obs</td>
                <td>Delta34S-obs (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_34s_cas</td>
                <td>Delta34S-cas (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_34s_bulk</td>
                <td>Delta34S-bulk (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_34s_gyp</td>
                <td>Delta34S-gyp (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>s_org</td>
                <td>S-org (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>s_so4</td>
                <td>S-SO4 (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>s_py</td>
                <td>S-py (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>u</td>
                <td>U (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_238u</td>
                <td>Delta238U (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>mo</td>
                <td>Mo (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>del_98mo</td>
                <td>Delta98Mo (permil)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>nd</td>
                <td>Nd (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>nd143_nd144</td>
                <td>Nd143/Nd144</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>os187_os188i</td>
                <td>Os187/Os188(I)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>se</td>
                <td>Se (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>se82_se78</td>
                <td>Se82/Se78</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>tmax</td>
                <td>Tmax (degC)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>s2</td>
                <td>S2 (mgHC/g)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>s1</td>
                <td>S1 (mgHC/g)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>s3</td>
                <td>S3 (mgCO2/g)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>cas</td>
                <td>CAS (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ag</td>
                <td>Ag (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>alu</td>
                <td>Al (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ars</td>
                <td>As (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>au</td>
                <td>Au (ppb)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ba</td>
                <td>Ba (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>be</td>
                <td>Be (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>bi</td>
                <td>Bi (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ca</td>
                <td>Ca (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>cd</td>
                <td>Cd (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ce</td>
                <td>Ce (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>co</td>
                <td>Co (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>cr</td>
                <td>Cr (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>cs</td>
                <td>Cs (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>cu</td>
                <td>Cu (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>dy</td>
                <td>Dy (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>er</td>
                <td>Er (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>eu</td>
                <td>Eu (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ga</td>
                <td>Ga (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ge</td>
                <td>Ge (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>gd</td>
                <td>Gd (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>hf</td>
                <td>Hf (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>hg</td>
                <td>Hg (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ho</td>
                <td>Ho (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ind</td>
                <td>In (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>k</td>
                <td>K (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>loi</td>
                <td>LOI (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>la</td>
                <td>La (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>li</td>
                <td>Li (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>lu</td>
                <td>Lu (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>mg</td>
                <td>Mg (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>mn</td>
                <td>Mn (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>na</td>
                <td>Na (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>nb</td>
                <td>Nb (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ni</td>
                <td>Ni (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>p</td>
                <td>P (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>pb</td>
                <td>Pb (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>pr</td>
                <td>Pr (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>rb</td>
                <td>Rb (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>re</td>
                <td>Re (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>sb</td>
                <td>Sb (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>sc</td>
                <td>Sc (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>si</td>
                <td>Si (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>sm</td>
                <td>Sm (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>sn</td>
                <td>Sn (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>sr</td>
                <td>Sr (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ta</td>
                <td>Ta (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>tb</td>
                <td>Tb (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>te</td>
                <td>Te (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>th</td>
                <td>Th (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>ti</td>
                <td>Ti (wt%)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>tl</td>
                <td>Tl (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>tm</td>
                <td>Tm (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>v</td>
                <td>V (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>w</td>
                <td>W (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>y</td>
                <td>Y (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>yb</td>
                <td>Yb (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>zn</td>
                <td>Zn (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
              <tr>
                <td>zr</td>
                <td>Zr (ppm)</td>
                <td>samples, nhhxrf</td>
                <td>Number, Number Range</td>
                <td />
              </tr>
            </table>
          </div>
        </div>
      </span>
    );
  }
}

export default About;
