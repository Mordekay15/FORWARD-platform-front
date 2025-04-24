import React from 'react';
import styles from './Error.module.css';

const Error = ({ message = 'Something went wrong.' }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <p className={styles.errorMessage}>{message}</p>
    </div>
  );
};

export default Error;
