import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllTeams } from '../api/teamApi';
import Loading from '../components/Loading';
import styles from './Teams.module.css';
import defImg from '../fav/defImg.avif'; // import the default image

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data = await getAllTeams();
        setTeams(data);
        setFilteredTeams(data);
      } catch (err) {
        setError('Failed to fetch teams');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = teams.filter((team) =>
      team.name.toLowerCase().includes(value) ||
      (team.description && team.description.toLowerCase().includes(value))
    );
    setFilteredTeams(filtered);
  };

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.teamsContainer}>
      <h1>All Teams</h1>

      <input
        type="text"
        placeholder="Search teams..."
        value={searchTerm}
        onChange={handleSearch}
        className={styles.searchInput}
      />

      {filteredTeams.length === 0 ? (
        <p className={styles.emptyMessage}>No matching teams found.</p>
      ) : (
        <div className={styles.teamsGrid}>
          {filteredTeams.map(team => (
            <Link 
              to={`/teams/${team.id}`} 
              key={team.id} 
              className={styles.teamCard}
              style={{ '--team-logo': team.logo ? `url(${team.logo})` : `url(${defImg})` }} // use defImg if logo is null
            >
              <div className={styles.teamContent}>
                <h3>{team.name}</h3>
                <p className={styles.teamDescription}>{team.description}</p>
                <div className={styles.teamStats}>
                  <span>Members: {team.participants?.length || 0}</span>
                  <span>Jobs: {team.jobs?.length || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Teams;
