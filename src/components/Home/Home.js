import React, { useEffect, useState } from "react";
import { Paper, Grid, Switch, Button } from "@material-ui/core";
import styles from "./Home.module.css";
import plant from "../../Assets/plant.png";
import { Graph } from "../../components";
import classNames from "classnames";
import { Type } from "vega-lite/build/src/type";

const Home = () => {
  const [automatic, setAutomatic] = useState(true);
  const [manual, setManual] = useState(false);
  const [motor, setMotor] = useState(false);
  const [moisture, setMoisture] = useState(0);
  const [waterCount, setWaterCount] = useState(0);
  const [motorBtn, setMotorBtn] = useState("Turn ON Motor");
  const [date, setDate] = useState();

  const sendData = (mode) => {
    if (mode === "auto") {
      fetch("http://127.0.0.1:5000/auto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          espcode: "esp1",
        }),
      });
    } else {
      let data = {
        espcode: "esp1",
        data: "OFF",
      };
      fetch("http://127.0.0.1:5000/manual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }
  };

  const toggleMotor = (state) => {
    let data = {
      espcode: "esp1",
      data: state,
    };
    fetch("http://127.0.0.1:5000/manual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    setMotorBtn(state === "ON" ? "Turn OFF Motor" : "Turn ON Motor");
  };

  const handleMotor = (state) => {
    setMotor(!motor);
    toggleMotor(state);
  };

  useEffect(() => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy;
    setDate(today);

    const fetchData = () => {
      fetch("http://127.0.0.1:5000/home?code=esp1")
        .then((res) => res.json())
        .then((data) => {
          setMoisture(data.moisture);
          setWaterCount(data.count);
          if (data.mode === "AUTO") {
            setAutomatic(true);
            setManual(false);
          } else {
            setAutomatic(false);
            setManual(true);
          }
        })
        .catch((err) => alert(err));
    };
    fetchData();
    setInterval(() => {
      fetchData();
    }, 60000);
  }, []);

  return (
    <div className={styles.container}>
      <Grid container spacing={4}>
        <Grid item lg={3} md={3} xs={12}>
          <Paper className={classNames(styles.card, styles.moisture)}>
            <div className={styles.mValue}>
              <p>Moisture</p>
              <h1>{moisture}%</h1>
              <h4>Watered {waterCount} times today</h4>
              <h4 className={styles.date}>{date}</h4>
            </div>
            <div>
              <img src={plant} alt="plant" />
            </div>
          </Paper>
          <Paper className={classNames(styles.card, styles.mode)}>
            <div className={styles.mValue}>
              <p>Mode</p>
            </div>
            <div className={styles.automatic}>
              <h4>Automatic</h4>
              <Switch
                checked={automatic}
                onChange={(e) => {
                  setAutomatic(e.target.checked);
                  setManual(!e.target.checked);
                  sendData("auto");
                }}
                color="secondary"
              />
            </div>
            <div className={styles.manual}>
              <h4>Manual</h4>
              <Switch
                checked={manual}
                onChange={(e) => {
                  setManual(e.target.checked);
                  setAutomatic(!e.target.checked);
                  sendData("manual");
                }}
                color="secondary"
              />
            </div>
            <Button
              disabled={!manual}
              className={manual ? styles.motorBtn : styles.motorBtnDisabled}
              onClick={() => handleMotor(motor ? "ON" : "OFF")}
              variant="contained"
            >
              {motorBtn}
            </Button>
          </Paper>
        </Grid>
        <Grid item lg={9} md={9} xs={12}>
          <Paper className={classNames(styles.card, styles.moisture)}>
            <div className={styles.mValue}>
              <div className={styles.values}>
                <p>Moisture vs Time</p>
              </div>
              <div className={styles.graphContainer}>
                <Graph
                  className={styles.graph}
                  url="http://127.0.0.1:5000"
                  query="esp1"
                />
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
