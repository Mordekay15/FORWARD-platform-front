import React, { useState, useEffect } from "react";
import styles from './MemberPage.module.css';
import backgroundImg from '../fav/background.avif';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

const TeamDetailPage = () => {
  const [team, setTeam] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {user} = useAuth();
  const teamId = user?.teamId;
  
  // Team editing states
  const [editing, setEditing] = useState(false);
  const [updatedTeam, setUpdatedTeam] = useState({
    name: "",
    description: "",
    logo: ""
  });

  // File upload states
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // Job creation states
  const [showJobForm, setShowJobForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    teamId: user?.teamId
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamRes, jobsRes] = await Promise.all([
          fetch(`http://localhost:3000/api/teams?teamId=${teamId}`),
          fetch(`http://localhost:3000/api/jobs?teamId=${teamId}`)
        ]);

        const teamData = await teamRes.json();
        console.log(teamData);
        const jobsData = await jobsRes.json();
        console.log(jobsData);

        setTeam(teamData);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  // Team Edit Functions
  const handleEditToggle = () => {
    setEditing((prev) => !prev);
    setUpdatedTeam({
      name: team?.name || "",
      description: team?.description || "",
      logo: team?.logo || ""
    });
    setLogoFile(null);
    setLogoPreview("");
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

    // Client-side validation
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
  };

  const handleSaveChanges = async () => {
    try {
      let logoUrl = updatedTeam.logo;

      // Upload new logo if file exists
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);

        const uploadResponse = await fetch('http://localhost:3000/api/logo-upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Logo upload failed');
        const { url } = await uploadResponse.json();
        logoUrl = url;
      }

      // Update team data
      const response = await fetch(`http://localhost:3000/api/teams`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamId,
          name: updatedTeam.name,
          description: updatedTeam.description,
          logo: logoUrl,
        }),
      });

      if (!response.ok) throw new Error(`Failed to update team: ${response.statusText}`);

      const updatedData = await response.json();
      setTeam(updatedData);
      setEditing(false);
      setLogoFile(null);
      setLogoPreview("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Job Creation Functions
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
      const response = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newJob)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const createdJob = await response.json();
      setJobs(prev => [createdJob, ...prev]);
      setNewJob({
        title: "",
        description: "",
        teamId: teamId
      });
      setShowJobForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading/>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!team) return <p>No team found.</p>;

  return (
    <div className={styles.teamContainer}>
      {/* Team Editing Section */}
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
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={updatedTeam.description}
              onChange={handleTeamInputChange}
            />
          </label>
          <label>
            Logo:
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
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
            />
          </label>
          <div className={styles.formActions}>
            <button onClick={handleSaveChanges}>Save Changes</button>
            <button onClick={handleEditToggle}>Cancel</button>
          </div>
        </section>
      ) : (
        <section className={styles.teamInfo}>
          <h1>{team.name}</h1>
          <p>{team.description}</p>
          {team.logo && (
            <img
              src={team.logo}
              alt={`${team.name} logo`}
              className={styles.teamLogo}
            />
          )}
          <button onClick={handleEditToggle}>Edit Team</button>
        </section>
      )}

      {/* Job Creation Section */}
      <section className={styles.jobCreationSection}>
        <button
          className={styles.toggleJobForm}
          onClick={() => setShowJobForm(!showJobForm)}
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
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={newJob.description}
                onChange={handleJobInputChange}
                required
              />
            </label>
            <div className={styles.formActions}>
              <button type="submit">Create Job</button>
              <button type="button" onClick={() => setShowJobForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Participants Section */}
      <section className={styles.participantsSection}>
        <h2>Team Members</h2>
        <ul className={styles.participantsList}>
          {team.participants?.map((participant) => (
            <li key={participant.id}>
              <strong>Email:</strong> {participant.email}
              <span className={styles.roleBadge}>{participant.role}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Jobs Section */}
      <section className={styles.jobsSection}>
        <h2>Job Openings ({jobs.length})</h2>
        <div className={styles.jobsGrid}>
          {jobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <div className={styles.jobMeta}>
                <span>Posted: {new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TeamDetailPage;
