import React, { useState, useEffect, useCallback } from "react";
import styles from './MemberPage.module.css';
import { getTeamById, updateTeam, uploadLogo } from "../api/teamApi";
import { getJobsByTeamId, createJob } from "../api/jobApi";
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { useNavigate } from 'react-router-dom';

const TeamDetailPage = () => {
  const [team, setTeam] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const teamId = user?.teamId;
  
  const [editing, setEditing] = useState(false);
  const [updatedTeam, setUpdatedTeam] = useState({
    name: "",
    description: "",
    logo: ""
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    teamId: user?.teamId
  });

  const fetchData = useCallback(async () => {
    if (!teamId) {
      setLoading(false);
      setError("No team assigned to this user");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const [teamData, jobsData] = await Promise.all([
        getTeamById(teamId),
        getJobsByTeamId(teamId),
      ]);

      if (!teamData) {
        throw new Error("Team not found");
      }

      setTeam(teamData);
      setJobs(Array.isArray(jobsData) ? jobsData : []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadData = async () => {
      try {
        await fetchData();
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError(err.message || 'Failed to fetch data');
          setLoading(false);
        }
      }
    };

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetchData]);

  const handleEditToggle = () => {
    setEditing((prev) => !prev);
    setUpdatedTeam({
      name: team?.name || "",
      description: team?.description || "",
      logo: team?.logo || ""
    });
    setLogoFile(null);
    setLogoPreview("");
    setError(null);
  };

  const handleTeamInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTeam((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError('Only PNG/JPEG images allowed');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('File must be smaller than 2MB');
      return;
    }

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setUpdatedTeam(prev => ({ ...prev, logo: file.name }));
    setError(null);
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let logoUrl = updatedTeam.logo;

      if (logoFile) {
        const { url: relativeUrl } = await uploadLogo(logoFile, teamId);
        logoUrl = `http://localhost:3000${relativeUrl}`;
      }
  
      const updatedData = await updateTeam({
        teamId,
        name: updatedTeam.name,
        description: updatedTeam.description,
        logo: logoUrl,
      });
  
      setTeam(updatedData);
      setEditing(false);
      setLogoFile(null);
      setLogoPreview('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  const handleJobInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value,
      teamId: teamId
    }));
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
  
    try {
      setLoading(true);
      setError(null);
      
      const createdJob = await createJob({
        ...newJob,
        teamId: teamId,
        userId: user?.id
      });
  
      setJobs(prev => [createdJob, ...prev]);
      setNewJob({
        title: "",
        description: "",
        teamId: teamId
      });
      setShowJobForm(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  if(user.role === "ADMIN") 
    {
      navigate("/admin");
      return null;
    }
  if (loading) return <Loading />;
  if (error) return <Error/>;
  if (!teamId) return <p>No team assigned to this user.</p>;
  if (!team) return <p>No team found.</p>;

  return (
    <div className={styles.teamContainer}>
      {editing ? (
        <section className={styles.editTeamForm}>
          <h2>Edit Team Details</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updatedTeam.name}
              onChange={handleTeamInputChange}
              disabled={loading}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={updatedTeam.description}
              onChange={handleTeamInputChange}
              disabled={loading}
            />
          </label>
          <label>
            Logo:
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={loading}
            />
            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className={styles.logoPreview}
              />
            )}
            <input
              type="text"
              name="logo"
              value={updatedTeam.logo}
              onChange={handleTeamInputChange}
              placeholder="Or enter image URL"
              disabled={loading}
            />
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.formActions}>
            <button onClick={handleSaveChanges} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={handleEditToggle} disabled={loading}>
              Cancel
            </button>
          </div>
        </section>
      ) : (
        <section className={styles.teamInfo}>
          {team.logo && (
            <img
            src={`${team.logo}`}
            alt={`${team.name} logo`}
            className={styles.teamLogo}
          />
          )}
          <h1>{team.name}</h1>
          <p>{team.description}</p>
          
          <button onClick={handleEditToggle}>Edit Team</button>
        </section>
      )}

      {/* Job Creation Section */}
      <section className={styles.jobCreationSection}>
        <button
          className={styles.toggleJobForm}
          onClick={() => setShowJobForm(!showJobForm)}
          disabled={loading}
        >
          {showJobForm ? 'Hide Job Form' : 'Create New Job'}
        </button>

        {showJobForm && (
          <form onSubmit={handleCreateJob} className={styles.jobForm}>
            <h3>Create New Job Opening</h3>
            <label>
              Job Title:
              <input
                type="text"
                name="title"
                value={newJob.title}
                onChange={handleJobInputChange}
                required
                disabled={loading}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={newJob.description}
                onChange={handleJobInputChange}
                required
                disabled={loading}
              />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.formActions}>
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Job'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowJobForm(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Participants Section */}
      <section className={styles.participantsSection}>
        <h2>Team Members</h2>
        {team.participants?.length > 0 ? (
          <ul className={styles.participantsList}>
            {team.participants.map((participant) => (
              <li key={participant.id}>
                <strong>Email:</strong> {participant.email}
                <span className={styles.roleBadge}>{participant.role}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No team members found</p>
        )}
      </section>

      {/* Jobs Section */}
      <section className={styles.jobsSection}>
        <h2>Job Openings ({jobs.length})</h2>
        {jobs.length > 0 ? (
          <div className={styles.jobsGrid}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <div className={styles.jobMeta}>
                  <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
                  {job.user && <span>Posted by: {job.user.email}</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No job openings posted yet</p>
        )}
      </section>
    </div>
  );
};

export default TeamDetailPage;