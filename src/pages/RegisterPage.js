import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './RegisterPage.module.css';
import { createUser } from "../api/userApi";
import { getAllTeams } from "../api/teamApi";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamList = await getAllTeams();
        console.log(teamList);
        setTeams(Array.isArray(teamList) ? teamList : []);
      } catch (err) {
        console.error("Failed to fetch teams:", err);
        setTeams([]);
      }
    };
    fetchTeams();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await createUser(
        email,
        password,
        "PARTICIPANT",
        selectedTeam || undefined
      );

      setSuccess("Registration successful! Your account is pending admin approval.");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setSelectedTeam("");

      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={`${styles.blockSection} ${styles.loginBlock}`}>
        <h2 className={styles.adminTitle}>Create an Account</h2>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}

        <form onSubmit={handleRegister} className={styles.form}>
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
            minLength={6}
            className={styles.fileInput}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.fileInput}
          />

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className={styles.fileInput}
          >
            <option value="">No Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className={styles.registerPrompt}>
          Already have an account? <a href="/login">Login here</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
