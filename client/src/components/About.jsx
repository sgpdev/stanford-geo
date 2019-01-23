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
              <Col xs={1} md={3}>
                <Thumbnail
                  src={require("./../images/erik_head_shot.jpg")}
                  alt="242x150"
                >
                  <h3>Erik Sperling</h3>
                  <p>Stanford University</p>
                </Thumbnail>
              </Col>
              <Col xs={1} md={3}>
                <Thumbnail
                  src={require("./../images/farrell.jpg")}
                  alt="242x150"
                >
                  <h3>Una Farrell</h3>
                  <p>Trinity College, Dublin</p>
                </Thumbnail>
              </Col>
              <Col xs={1} md={3}>
                <Thumbnail src={require("./../images/davej.jpg")} alt="242x150">
                  <h3>David Johnston</h3>
                  <p>Harvard University</p>
                </Thumbnail>
              </Col>
              <Col xs={1} md={3}>
                <Thumbnail
                  src={require("./../images/planavsky.jpg")}
                  alt="242x150"
                >
                  <h3>Noah Planavsky</h3>
                  <p>Yale University</p>
                </Thumbnail>
              </Col>
            </Row>
          </Grid>
          <br />
          <h3 className="title-doc">Developers</h3>
          <br />
          <Grid>
            <Row>
              <Col xs={6} md={6}>
                <Thumbnail
                  src={require("./../images/sufian.png")}
                  alt="242x150"
                >
                  <h3>Sufyan Lattouf</h3>
                  <p>Exeter University</p>
                </Thumbnail>
              </Col>
              <Col xs={6} md={6}>
                <Thumbnail
                  src={require("./../images/samawi.jpg")}
                  alt="242x150"
                >
                  <span clasName="thumbnail-text">
                    <h3>Rifa'at Samawi</h3>
                    <p>Yale University</p>
                  </span>
                </Thumbnail>
              </Col>
            </Row>
          </Grid>
          <br />
          <br />
          <h3 className="title-doc">Collaborative Team</h3>
          <br />
          <br />
          <div>
            The heart of SGP is the collaborative team, who help provide
            geological context data and geochemical data and participate in
            Working Groups addressing particular questions about Earth’s
            environmental evolution. A full list of collaborative team members
            can be found on the SGP website:{" "}
            <a target="_blank" href="https://sgp.stanford.edu/who-we-are">
              sgp.stanford.edu
            </a>
          </div>
        </div>
      </span>
    );
  }
}

export default About;
