import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topBlock}>
            <div className={styles.links}>
                <a href="/about" className={styles.link}>Forward is sponsored by</a>
            </div>

            <div className={styles.links}>
                <a href="/about" className={styles.link}>Forward is made by</a>
            </div>

            <div className={styles.links}>
                <a href="/about" className={styles.link}>Contact us</a>
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