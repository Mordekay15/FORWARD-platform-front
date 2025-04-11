import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from './LoginPage.module.css';
import { useAuth } from '../context/AuthContext';

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

        // Ensure data is always an array
        setJobs(Array.isArray(jobsRes?.data) ? jobsRes.data : []);
        setTeams(Array.isArray(teamsRes?.data) ? teamsRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      }
    };

    fetchData();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const role = res.data.user?.role;
      const token = res.data.token;
      sessionStorage.setItem('authToken', token);
      login(token)
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
    if (!Array.isArray(teams)) {
      return "https://via.placeholder.com/50.png?text=Team+Logo";
    }

    const team = teams.find(t => t.id === teamId);
    return team?.logo || "https://via.placeholder.com/50.png?text=Team+Logo";
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Forward Community Login</h2>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.inputField}
          />
          <button type="submit" className={styles.submitButton}>
            Login
          </button>
        </form>

        {jobs.length > 0 && (
          <div className={styles.jobsSection}>
            <h3 className={styles.jobsTitle}>Job Openings</h3>
            <ul className={styles.jobsList}>
              {jobs.map((job) => (
                <li key={job.id} className={styles.jobCard}>
                  <div className={styles.jobHeader}>
                    <img
                      src={getTeamLogo(job.teamId)}
                      alt="Team Logo"
                      className={styles.teamLogo}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/50.png?text=Team+Logo";
                      }}
                    />
                    <h4 className={styles.jobTitle}>{job.title}</h4>
                  </div>
                  <p className={styles.jobDescription}>{job.description}</p>
                  <p className={styles.jobMeta}>
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
