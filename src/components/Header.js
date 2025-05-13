import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import titleImg from '../fav/title.avif';

function Header() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!token && !!user;

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.headerWrapper}>
      <nav className={styles.navbar}>
        <a href="/home" className={styles.logoLink}>
          <img src={titleImg} alt="FORWARD logo" className={styles.logo} />
        </a>
        <ul className={styles.navList}>
          <li><a href="/home">Home</a></li>
          {isAuthenticated && (
            <li>
              {user?.role === "ADMIN" ? (
                <a href="/admin">Admin Page</a>
              ) : (
                <a href="/member" className={styles.navLink}>
                  My Team
                </a>
              )}
            </li>
          )}
          <li><a href="/positions">Positions</a></li>
          <li><a href="/teams">Teams</a></li>
          {isAuthenticated ? (
            <>
              <li><a href="/profile">Profile</a></li>
            </>
          ) : (
            <li><a href="/login">Login</a></li>
          )}
          <li>
            <a href="https://www.forwardbylutes.fi/" target="_blank" rel="noopener noreferrer">
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
