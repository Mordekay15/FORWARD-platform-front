import styles from './Header.module.css';
import titleImg from '../fav/title.avif';

function Header() {
    return (
        <>
            <header>
                <nav>
                    <ul className={styles.headerList}>
                        <li>
                            <a href="/member" className={styles.logoLink}>
                                <img src={titleImg} alt="FORWARD logo" className={styles.logo} />
                            </a>
                        </li>
                        <div className={styles.rightNav}>
                            <li className={styles.navEl}><a href="/member">Member</a></li>
                            <li className={styles.navEl}><a href="/sources">Sources</a></li>
                            <li className={styles.navElLogout}>
                                <a href="#"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    localStorage.removeItem('authToken');
                                    localStorage.removeItem('user');
                                    window.location.href = '/logout';
                                    }}
                                >
                                    Logout
                                </a>
                            </li>
                            <li className={styles.navEl}><a href="https://www.forwardbylutes.fi/">About</a></li>
                            <li className={styles.navEl}><a href="https://www.forwardbylutes.fi/">FAQ</a></li>
                        </div>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Header;
