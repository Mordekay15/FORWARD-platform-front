import React from 'react';
import styles from './Loading.module.css'; // Import the CSS module

function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
}

export default Loading;