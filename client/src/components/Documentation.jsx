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
            you can give us through ______.
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
            <a href="https://pangea.stanford.edu/sgp-search/api/post">
              https://pangea.stanford.edu/sgp-search/api/post
            </a>
            <br />
            An SGP API request consists of three parts which are analogous to
            those found in an SGP frontend search:
            <ul>
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
            </ul>
            Using the JSON data interchange format, a user can pass their search
            option parameters within the body of the HTTP Post packet. Below is
            an example SGP API call:
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
                "height¬_meters"
              ]
            })}
            <br />
            This API call is making a samples type search for samples that
            originate from Argentina, Canada or Oman, have 2%-4% Fe and
            0.025%-0.05% Fe-Carb. In addition, the API call is asking for
            columns that show each sample’s country, Fe (wt%), Fe-Carb (wt%),
            section name and collection height in meters. Each search attribute
            (i.e. country, fe, section_name etc.) has an single word API name, a
            set of search types in which it can be searched upon and only
            accepts certain search parameter types which are listed below:
            <ul>
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
            </ul>
            With this guide and the search attribute dictionary below, users now
            have the power to sift through the SGP database in any way they
            please. We hope this documentation has been helpful, and appreciate
            any feedback you can give us through ______.
          </div>
          <div className="search-att-dic">
            <br />
            <br />
            <h3 className="title-doc"> Search Attribute Dictionary</h3>
            The table below presents all searchable attributes that currently
            exist in the SGP database. Below are descriptions for each column:
            <ul>
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
            </ul>
          </div>
        </div>
      </span>
    );
  }
}

export default About;
