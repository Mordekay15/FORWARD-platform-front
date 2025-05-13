import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import styles from './LoginPage.module.css';
import { useAuth } from '../context/AuthContext';
import { userLogin } from "../api/userApi";
import defImg from '../fav/defImg.avif';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const { token, login } = useAuth();

  useEffect(() => {
    if (token) navigate('/member');
  }, [token, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, teamsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/jobs"),
          axios.get("http://localhost:3000/api/teams")
        ]);

        setJobs(Array.isArray(jobsRes?.data) ? jobsRes.data : []);
        setTeams(Array.isArray(teamsRes?.data) ? teamsRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await userLogin(email, password);
      const role = res.data.user?.role;
      const token = res.data.token;
      const user = res.data.user;
      sessionStorage.setItem('authToken', token);
      login({ token, user });

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "PARTICIPANT") {
        navigate("/member");
      } else {
        setError("Invalid role received: " + role);
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const getTeamLogo = (teamId) => {
    if (!Array.isArray(teams) || !teamId) {
      return defImg;
    }

    const team = teams.find(t => t.id === teamId);

    if (!team || !team.logo || team.logo.trim() === "") {
      return defImg;
    }

    return team.logo;
  };

  return (
    <div className={styles.adminContainer}>
      <div className={`${styles.blockSection} ${styles.loginBlock}`}>
        <h2 className={styles.adminTitle}>Forward Community Login</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.fileInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.fileInput}
          />
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>

        <p className={styles.registerPrompt}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>

      {jobs.length > 0 && (
        <div className={styles.blockSection}>
          <h3 className={styles.blockTitle}>Available Positions</h3>
          <div className={styles.listContainer}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.listItem}>
                <div className={styles.jobInfo}>
                  <div className={styles.jobHeader}>
                    <img
                      src={getTeamLogo(job.teamId)}
                      alt="Team Logo"
                      className={styles.teamLogo}
                    />
                    <h4 className={styles.jobTitle}>{job.title}</h4>
                  </div>
                  <p className={styles.jobDescription}>{job.description}</p>
                  <p className={styles.jobMeta}>
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
