import React, { useState, useEffect } from 'react';
import { getAllJobs } from '../api/jobApi';
import Loading from '../components/Loading';
import styles from './Positions.module.css';

const Positions = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAllJobs();
        setJobs(data);
        setFilteredJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(value) ||
      job.description.toLowerCase().includes(value)
    );
    setFilteredJobs(filtered);
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.positionsContainer}>
      <h1>Available Positions</h1>

      <input
        type="text"
        placeholder="Search positions..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={handleSearch}
      />
      
      {filteredJobs.length === 0 ? (
        <p className={styles.emptyMessage}>No matching job openings found.</p>
      ) : (
        <div className={styles.jobsList}>
          {filteredJobs.map((job) => (
            <div key={job.id} className={styles.jobRow}>
              <div className={styles.jobInfo}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <p className={styles.jobDescription}>{job.description}</p>
              </div>

              <div className={styles.jobMeta}>
                <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                {job.team && <span>Team: {job.team.name}</span>}
              </div>

              {job.url && (
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.viewButton}
                >
                  View Position
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Positions;
