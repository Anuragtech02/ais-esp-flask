import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Weather.module.css";

const Weather = () => {
  const [tempData, setTempData] = useState({});
  const [locationData, setLocationData] = useState({});

  useEffect(() => {
    const params = {
      access_key: "1ed5003193ab8c0f6a6f6b29fbabe996",
      query: "fetch:ip",
    };
    const fetchWeather = async () => {
      axios
        .get("http://api.weatherstack.com/current", { params })
        .then((res) => {
          setTempData(res.data.current);
          setLocationData(res.data.location);
          console.log(res);
        });
    };
    fetchWeather();
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <p>Weather</p>
      </div>
      <div className={styles.tempLocation}>
        <h2>{tempData.temperature}°C</h2>
        <h2>{locationData.name}</h2>
      </div>
    </div>
  );
};

export default Weather;
