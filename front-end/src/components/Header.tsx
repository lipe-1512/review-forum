import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brandNav}>
          <h1 className={styles.brand}>
            Review<span className={styles.brandAccent}>Forum</span>
          </h1>
          <nav className={styles.nav}>
            <a href="#">Films</a>
            <a href="#">Lists</a>
            <a href="#">Members</a>
          </nav>
        </div>
        <div className={styles.controls}>
          <input
            type="search"
            placeholder="Search..."
            className={styles.searchInput}
          />
          <a href="#" className={styles.loginLink}>Login</a>
        </div>
      </div>
    </header>
  );
};

export default Header;
