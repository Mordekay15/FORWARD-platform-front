import React, { useState, useEffect } from 'react';
import { getAllPdfs, getPdfsByWeek, getPdfsByAdmin } from '../api/pdfApi';
import axios from 'axios';
import styles from './Source.module.css';

const Source = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [weekNumber, setWeekNumber] = useState('');
  const [adminId, setAdminId] = useState('');

  useEffect(() => {
    fetchPdfs();
  }, []);

  const fetchPdfs = async () => {
    try {
      setLoading(true);
      let data;
      
      if (filter === 'week' && weekNumber) {
        data = await getPdfsByWeek(parseInt(weekNumber));
      } else if (filter === 'admin' && adminId) {
        data = await getPdfsByAdmin(adminId);
      } else {
        data = await getAllPdfs();
      }
      
      setPdfs(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch PDFs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pdf) => {
    try {
      window.open(pdf.fileUrl, '_blank');
    } catch (err) {
      console.error('Download failed:', err);
      setError('Failed to download PDF. Please try again.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSubmitFilter = (e) => {
    e.preventDefault();
    fetchPdfs();
  };

  if (loading) {
    return <div>Loading PDFs...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

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
          
          <div>
            <label>
              <input 
                type="radio" 
                name="filter" 
                value="admin" 
                checked={filter === 'admin'} 
                onChange={handleFilterChange} 
              />
              Filter by Admin
            </label>
            {filter === 'admin' && (
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="Enter admin ID"
              />
            )}
          </div>
          
          <button type="submit">Apply Filter</button>
        </form>
      </div>
      
      <div className={styles.pdfsList}>
        {pdfs.length === 0 ? (
          <p>No PDFs found.</p>
        ) : (
          <ul>
            {pdfs.map((pdf) => (
              <li key={pdf._id} className={styles.pdfItem}>
                <div className={styles.pdfInfo}>
                  <h3>{pdf.originalName || `Document ${pdf.weekNumber}`}</h3>
                  <p>Week: {pdf.weekNumber}</p>
                  <p>{pdf.title}</p>
                  <p>Uploaded at: {new Date(pdf.createdAt).toLocaleString()}</p>
                  {console.log(pdf)}
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
