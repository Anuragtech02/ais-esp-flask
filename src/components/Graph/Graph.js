import React, { useState, useEffect } from "react";
import { CssBaseline, Container, Grid, Box, Paper } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import styles from "./Graph.module.css";

import vegaEmbed from "vega-embed";

export default function Graph(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var value = props.query.slice(-1)[0];
    setLoading(true);

    const fetchApi = () => {
      fetch(props.url + "/graph?code=" + value).then(function (response) {
        if (response.ok) {
          vegaEmbed("#view", props.url + "/graph?code=" + value)
            .then((result) => {
              result.view.width(800).height(500).run();
            })
            .then((result) => setLoading(false))
            .catch(console.error);
        }
      });
    };

    fetchApi();

    setInterval(() => {
      fetchApi();
    }, 60000);
  }, [props.query, props.url]);

  return (
    <Grid container>
      <CssBaseline />
      <Container align="center">
        <Paper
          style={{
            marginTop: "50px",
            overflow: "hidden",
            borderRadius: "10px",
          }}
          className={styles.graphContainer}
        >
          {/* <h3> {props.query.slice(-1)[0].toUpperCase()} </h3> */}

          <Box style={{ display: loading ? "block" : "none" }}>
            <Skeleton
              className={styles.skeleton}
              variant="rect"
              style={{ height: "400px" }}
            />
            <Box pt={0.5}>
              <Skeleton className={styles.skeleton} />
            </Box>
          </Box>
          <div id="view" style={{ display: loading ? "none" : "block" }}></div>
        </Paper>
      </Container>
    </Grid>
  );
}
