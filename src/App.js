import React from "react";
import styles from "./App.module.css";
import { Navbar, Home } from "./components";

const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Navbar />
      </div>
      <div className={styles.home}>
        <Home />
      </div>
    </div>
  );
};

export default App;
