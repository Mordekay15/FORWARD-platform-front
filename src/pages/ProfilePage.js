import React, { useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const { logout } = useAuth();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setError('User not found');
    }
  }, []);

  const handleLogout = (e) => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // Здесь будет ваша логика для смены пароля
    setSuccessMessage('Password updated successfully!');
  };

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.profileContainer}>
      <section className={styles.profileHeader}>
        <h1>Profile Details</h1>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </section>

      {/* Password Change Section */}
      <section className={styles.passwordForm}>
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <label>
            Current Password:
            <input type="password" required />
          </label>
          <label>
            New Password:
            <input type="password" required />
          </label>
          <label>
            Confirm New Password:
            <input type="password" required />
          </label>
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formActions}>
            <button type="submit">Change Password</button>
          </div>
        </form>
      </section>

      {/* Logout Section */}
      <section>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </section>
    </div>
  );
};

export default ProfilePage;
