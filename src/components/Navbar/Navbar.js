import React from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
  return (
    <nav className={styles.container}>
      <div className={styles.logo}>
        <h3>AIS</h3>
      </div>
      <div className={styles.navLinksContainer}>
        <ul className={styles.navLinks}>
          <li className={styles.navLink}>Home</li>
          <li className={styles.navLink}>About</li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
