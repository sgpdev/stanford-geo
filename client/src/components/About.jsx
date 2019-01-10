import React, { Component } from "react";
import { Col, Grid, Row, Image, Thumbnail } from "react-bootstrap";
import JumbotronUI from "./JumbotronUI";
import "./../styles/About.css";

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
        <div className="about">
          <div className="mission">
            <h1 className="mission-title">Team</h1>
            <p>
              The SGP started as a collaborative project between researchers at
              Stanford University, Trinity College Dublin, Yale University, and
              Harvard University, but now includes many members from diverse
              institutions and countries.
            </p>
          </div>
          <br />
          <br />

          <h3 className="title-doc">Geology Team</h3>
          <br />
          <Grid>
            <Row>
              <Col xs={6} md={4}>
                <Thumbnail
                  src={require("./../images/download.jpg")}
                  alt="242x150"
                >
                  <h3>Thumbnail label</h3>
                  <p>Description</p>
                </Thumbnail>
              </Col>
              <Col xs={6} md={4}>
                <Thumbnail
                  src={require("./../images/download.jpg")}
                  alt="242x150"
                >
                  <h3>Thumbnail label</h3>
                  <p>Description</p>
                </Thumbnail>
              </Col>
              <Col xs={6} md={4}>
                <Thumbnail
                  src={require("./../images/download.jpg")}
                  alt="242x150"
                >
                  <h3>Thumbnail label</h3>
                  <p>Description</p>
                </Thumbnail>
              </Col>
            </Row>
          </Grid>
          <br />
          <h3 className="title-doc">Developers</h3>
          <br />
          <Grid>
            <Row>
              <Col xs={6} md={4}>
                <Thumbnail
                  src={require("./../images/download.jpg")}
                  alt="242x150"
                >
                  <h3>Thumbnail label</h3>
                  <p>Description</p>
                </Thumbnail>
              </Col>
              <Col xs={6} md={4}>
                <Thumbnail
                  src={require("./../images/download.jpg")}
                  alt="242x150"
                >
                  <h3>Thumbnail label</h3>
                  <p>Description</p>
                </Thumbnail>
              </Col>
              <Col xs={6} md={4}>
                <Thumbnail
                  src={require("./../images/download.jpg")}
                  alt="242x150"
                >
                  <h3>Thumbnail label</h3>
                  <p>Description</p>
                </Thumbnail>
              </Col>
            </Row>
          </Grid>
          <h3 className="title-doc">Collaborative Team</h3>
          <br />
          <br />
          <ul>
            <li> Aivo Lepland, Norwegian Geological Survey</li>
            <li>Alan Rooney, Yale University</li>
            <li>Alf Lenz, University of Western Ontario</li>
            <li>Anais Pages, CSIRO</li>
            <li>Andy Knoll, Harvard University</li>
            <li>Anne-Sofie Ahm, University of Copenhagen</li>
            <li>Austin Miller, Stanford University</li>
            <li>Ben Gill, Virginia Tech</li>
            <li>Brennan O'Connell, Yale University</li>
            <li>Carol Dehler, Utah State University</li>
            <li>Charles Henderson, University of Calgary</li>
            <li>Chao Li, China University of Geosciences</li>
            <li>Chengsheng Jin, China University of Geosciences</li>
            <li>Clint Scott, USGS</li>
            <li>Danielle Thomson, Shell</li>
            <li>David Loydell, University of Portsmouth</li>
            <li>Devon Cole, Yale University</li>
            <li>Don Canfield, Southern Denmark University</li>
            <li>Emma Hammarlund, Southern Denmark University</li>
            <li>Emmy Smith, Johns Hopkins University</li>
            <li>Florian Kurzweil, University of Tubingen</li>
            <li>Francis Macdonald, Harvard University</li>
            <li>Gabriel Uhlein, Universidade Federal de Minas Gerais</li>
            <li>Galen Halverson, McGill University</li>
            <li>Geoff Gilleaudeau, Arizona State University</li>
            <li>Heda Agic, University of California, Santa Barbara</li>
            <li>Huajian Wang, Key Laboratory of Petroleum Geochemistry</li>
            <li>Inessa Yurchenko, Stanford University</li>
            <li>Jianghai Yang, China University of Geosciences, Wuhan</li>
            <li>Joe Shaffer, Wayfair</li>
            <li>Jon Husson, University of Victoria</li>
            <li>Keith Dewing, Geological Survey of Canada</li>
            <li>Julie Dumoulin, USGS</li>
            <li>Julien Kimmig, University of Kansas</li>
            <li>Justin Strauss, Dartmouth College</li>
            <li>Karin Goldberg, Kansas State University</li>
            <li>Lawrence Och, Dr. von Moos AG</li>
            <li>Lei Xiang, Nanjing Institute of Geology and Paleontology</li>
            <li>Liam Bhajan, Stanford University</li>
            <li>Malcolm Hodgskiss, Stanford University</li>
            <li>Marcus Kunzmann, CSIRO</li>
            <li>Matthew Clarkson, University of Otago</li>
            <li>Meng Cheng, China University of Geosciences</li>
            <li>Mike Melchin, St. Francis Xavier University</li>
            <li>Patrick Sack, Yukon Geological Survey</li>
            <li>
              Paulo Linarde Dantas Mascena, Federal University of Rio Grande do
              Norte
            </li>
            <li>Pavel Kabanov, Geological Survey of Canada</li>
            <li>Phil Wilby, British Geological Survey</li>
            <li>Rachel Wood, University of Edinburgh</li>
            <li>Robert Gaines, Pomona College</li>
            <li>Romain Guilbaud, University of Lancaster</li>
            <li>Richard Stockey, Stanford University</li>
            <li>Rifaat Samawi, Stanford University</li>
            <li>Sabrina Tecklenburg, Stanford University</li>
            <li>Sam Spinks, CSIRO</li>
            <li>Samantha VanSickle, Stanford University</li>
            <li>Shanan Peters, University of Wisconsin</li>
            <li>Shane Schoepfer, University of Calgary</li>
            <li>Simon Poulton, University of Leeds</li>
            <li>
              Stephanie Plaza-Torres, The University of Puerto Rico at Mayaguez
            </li>
            <li>Sylvain Richoz, University of Graz</li>
            <li>Tais Dahl, University of Copenhagen</li>
            <li>Tiffani Fraser, Yukon Geological Survey</li>
            <li>Tim Gibson, Dartmouth College</li>
            <li>Tina Woltz, University of California, Santa Barbara</li>
            <li>Tom Boag, Stanford University</li>
            <li>Una Farrell, Stanford University</li>
            <li>Will Thompson-Butler, Stanford University</li>
            <li>Wing Chan, University of Calgary</li>
            <li>Xinze Lu, University of Waterloo</li>
            <li>Yu Liu, China University of Geosciences</li>
          </ul>
        </div>
      </span>
    );
  }
}

export default About;
