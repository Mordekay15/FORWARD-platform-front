// pages/TeamPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTeamById } from '../api/teamApi';
import Loading from '../components/Loading';
import styles from './TeamPage.module.css';

const TeamPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const teamData = await getTeamById(teamId);
        if (!teamData) {
          throw new Error('Team not found');
        }
        setTeam(teamData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  if (loading) return <Loading />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.teamContainer}>
      <button onClick={() => navigate('/teams')} className={styles.backButton}>
        ← Back to All Teams
      </button>

      <div className={styles.teamHeader}>
        {team.logo && (
          <img 
            src={team.logo} 
            alt={`${team.name} logo`} 
            className={styles.teamLogo}
          />
        )}
        <div>
          <h1>{team.name}</h1>
          <p className={styles.teamDescription}>{team.description}</p>
        </div>
      </div>

      <div className={styles.teamSections}>
        <section>
          <h2>Members ({team.participants?.length || 0})</h2>
          {team.participants?.length > 0 ? (
            <ul className={styles.membersList}>
              {team.participants.map(member => (
                <li key={member.id}>
                  <span>{member.email}</span>
                  <span className={styles.roleBadge}>{member.role}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No team members</p>
          )}
        </section>

        <section>
          <h2>Open Positions ({team.jobs?.length || 0})</h2>
          {team.jobs?.length > 0 ? (
            <div className={styles.jobsGrid}>
              {team.jobs.map(job => (
                <div key={job.id} className={styles.jobCard}>
                  <h3>{job.title}</h3>
                  <p>{job.description}</p>
                  {job.url && (
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.jobLink}
                    >
                      View Details
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No open positions</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TeamPage;