import React, { useState, useEffect } from 'react';
import { getAllPdfs } from '../api/pdfApi';
import styles from './Source.module.css';
import Loading from '../components/Loading';

const Source = () => {
  const [allPdfs, setAllPdfs] = useState([]);
  const [displayedPdfs, setDisplayedPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [weekNumber, setWeekNumber] = useState('');

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        setLoading(true);
        const data = await getAllPdfs();
        setAllPdfs(data);
        setDisplayedPdfs(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch PDFs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPdfs();
  }, []);

  const handleDownload = (pdf) => {
    try {
      window.open(pdf.fileUrl, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download PDF. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    if (value === 'all') {
      setDisplayedPdfs(allPdfs);
      setWeekNumber('');
    }
  };

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    if (filter === 'week' && weekNumber) {
      const filtered = allPdfs.filter(
        (pdf) => parseInt(pdf.weekNumber) === parseInt(weekNumber)
      );
      setDisplayedPdfs(filtered);
    } else {
      setDisplayedPdfs(allPdfs);
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.sourceContainer}>
      <h1>PDF Documents</h1>

      <div className={styles.filterSection}>
        <form onSubmit={handleSubmitFilter}>
          <div>
            <label>
              <input
                type="radio"
                name="filter"
                value="all"
                checked={filter === 'all'}
                onChange={handleFilterChange}
              />
              All PDFs
            </label>
          </div>

          <div>
            <label>
              <input
                type="radio"
                name="filter"
                value="week"
                checked={filter === 'week'}
                onChange={handleFilterChange}
              />
              Filter by Week
            </label>
            {filter === 'week' && (
              <input
                type="number"
                value={weekNumber}
                onChange={(e) => setWeekNumber(e.target.value)}
                placeholder="Enter week number"
                min="1"
              />
            )}
          </div>

          <button type="submit">Apply Filter</button>
        </form>
      </div>

      <div className={styles.pdfsList}>
        {displayedPdfs.length === 0 ? (
          <p>No PDFs found.</p>
        ) : (
          <ul>
            {displayedPdfs.map((pdf) => (
              <li key={pdf._id} className={styles.pdfItem}>
                <div className={styles.pdfInfo}>
                  <h3>{pdf.title || `Document ${pdf.weekNumber}`}</h3>
                  <p>Week: {pdf.weekNumber}</p>
                  <p>Uploaded at: {new Date(pdf.uploadedAt).toLocaleString()}</p>
                </div>
                <div className={styles.pdfActions}>
                  <button
                    onClick={() => handleDownload(pdf)}
                    className={styles.downloadBtn}
                  >
                    Open File
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Source;
