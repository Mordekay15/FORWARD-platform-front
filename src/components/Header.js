import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import titleImg from '../fav/title.avif';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!token && !!user);
  }, []);


  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.navbar}>
        <a href="/member" className={styles.logoLink}>
          <img src={titleImg} alt="FORWARD logo" className={styles.logo} />
        </a>
        <ul className={styles.navList}>
          <li><a href="/member">Home</a></li>
          <li><a href="/positions">Positions</a></li>
          <li><a href="/teams">Teams</a></li>
          <li><a href="/sources">Sources</a></li>
          {isAuthenticated ? (
            <li><a href="/profile">Profile</a></li>
          ) : (
            <li><a href="/login">Login</a></li>
          )}
          <li><a href="https://www.forwardbylutes.fi/">About</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
