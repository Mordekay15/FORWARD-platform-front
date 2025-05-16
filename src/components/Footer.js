import styles from './Footer.module.css';

// Static imports
import ykImage from '../fav/YSImage.avif';
import lapImage from '../fav/LAP.avif';
import teleImg from '../fav/teleImage.avif';
import instaImg from '../fav/instaImg.avif';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topBlock}>
          <div className={styles.links}>
            <p className={styles.link}>Forward is sponsored by</p>
            <div className={styles.sponsorImages}>
              <div className={styles.imageBox}>
                <a href="http://www.yksityisyrittajainsaatio.fi/" target="_blank" rel="noopener noreferrer">
                  <img src={ykImage} alt="YK Sponsor" className={styles.SponsoredBy} />
                </a>
              </div>
              <div className={styles.imageBox}>
                <a href="https://lappeenranta.fi/fi" target="_blank" rel="noopener noreferrer">
                  <img src={lapImage} alt="Lap Sponsor" className={styles.SponsoredBy} />
                </a>
              </div>
            </div>
          </div>

          <div className={styles.links}>
            <a href="/about" className={styles.link}>Forward is made by</a>
          </div>

          <div className={styles.links}>
            <p className={styles.link}>Contact us</p>
            <div className={styles.contactImages}>
              <div className={styles.emailData}>
                <a href="mailto:ekaterina@lutes.fi">ekaterina@lutes.fi</a>
                <br />
                <a href="mailto:kasperi@lutes.fi">kasperi@lutes.fi</a>
              </div>
              <div className={styles.socialIcons}>
                <a href="https://t.me/+9PxFdodFkzcxNzk0" target="_blank" rel="noopener noreferrer">
                  <img src={teleImg} alt="Telegram" className={styles.ContactUs} />
                </a>
                <a href="https://www.instagram.com/forwardbylutes/" target="_blank" rel="noopener noreferrer">
                  <img src={instaImg} alt="Instagram" className={styles.ContactUs} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contact}>
          <p>Pictures by Paulus Halonen</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
