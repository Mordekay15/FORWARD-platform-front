import styles from './Header.module.css';
import titleImg from '../fav/title.avif';

function Header() {
    return (
        <>
            <header>
                <nav>
                    <ul className={styles.headerList}>
                        <li>
                            <a href="/home" className={styles.logoLink}>
                                <img src={titleImg} alt="FORWARD logo" className={styles.logo} />
                            </a>
                        </li>
                        <div className={styles.rightNav}>
                            <li className={styles.navEl}><a href="/about">About</a></li>
                            <li className={styles.navEl}><a href="/FAQ">FAQ</a></li>
                        </div>
                    </ul>
                </nav>
            </header>
        </>
    );
}

export default Header;
