import { useState, useEffect } from "react";
import axios from "axios";
import styles from './AdminPage.module.css'; // Import CSS module

const AdminPage = () => {
  const [pdfs, setPdfs] = useState([]);
  const [file, setFile] = useState(null);
  const [weekNumber, setWeekNumber] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pdf", { withCredentials: true });
      setPdfs(res.data);
    } catch (err) {
      console.error("Failed to load PDFs:", err);
      setError("Failed to fetch PDFs. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weekNumber", weekNumber);
    formData.append("adminId", "613aeb7b-fd22-4e49-ae79-7399e883b363");

    try {
      await axios.post("http://localhost:3000/api/upload", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("File uploaded successfully!");
      setFile(null);
      fetchPdfs();
    } catch (err) {
      console.error("Upload error:", err.response?.data || err.message);
      setError("Failed to upload file. Please try again.");
    }
  };

  const handleLogout = async () => {
    setLogoutError("");
    try {
      await axios.post("http://localhost:3000/api/logout", {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
      setLogoutError("Failed to log out. Please try again.");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.adminTitle}>Welcome, Admin!</h2>

      {/* PDF Upload Form */}
      <div className={styles.uploadForm}>
        <form onSubmit={handleUpload} className={styles.form}>
          <label htmlFor="pdfUpload" className={styles.formLabel}>
            Select PDF:
          </label>
          <input
            type="file"
            id="pdfUpload"
            accept="application/pdf"
            onChange={handleFileChange}
            required
            className={styles.fileInput}
          />
          <label htmlFor="weekSelect" className={styles.formLabel}>
            Select Week:
          </label>
          <select
            id="weekSelect"
            value={weekNumber}
            onChange={(e) => setWeekNumber(Number(e.target.value))}
            className={styles.selectInput}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Week {i + 1}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.submitButton}>
            Upload PDF
          </button>
        </form>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {success && <p className={styles.successMessage}>{success}</p>}

      {/* Logout Button */}
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
      {logoutError && <p className={styles.errorMessage}>{logoutError}</p>}

      {/* Display PDFs */}
      <div className={styles.pdfSection}>
        <h3 className={styles.pdfTitle}>Uploaded PDFs</h3>
        {pdfs.length === 0 ? (
          <p>No PDFs available.</p>
        ) : (
          [...Array(10)].map((_, week) => {
            const weekPdfs = pdfs.filter((pdf) => pdf.weekNumber === week + 1);
            return (
              weekPdfs.length > 0 && (
                <div key={week} className={styles.weekSection}>
                  <h4 className={styles.weekTitle}>Week {week + 1}</h4>
                  <ul className={styles.pdfList}>
                    {weekPdfs.map((pdf) => (
                      <li key={pdf.id} className={styles.pdfListItem}>
                        <a
                          href={`http://localhost:3000${pdf.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.pdfLink}
                        >
                          {pdf.title || `PDF ${pdf.id}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminPage;
