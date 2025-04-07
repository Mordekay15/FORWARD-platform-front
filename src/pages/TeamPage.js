import { useState, useEffect } from "react";
import axios from "axios";

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("/api/team");
      setTeams(res.data);
    } catch (error) {
      console.error("Error fetching teams", error);
    }
  };

  const fetchJobs = async (teamId) => {
    try {
      const res = await axios.get(`/api/jobs?teamId=${teamId}`);
      setJobs(res.data);
    } catch (error) {
      console.error("Error fetching jobs", error);
    }
  };

  const createTeam = async () => {
    try {
      const res = await axios.post("/api/team", { name: teamName, description: teamDescription });
      setTeams([...teams, res.data]);
      setTeamName("");
      setTeamDescription("");
    } catch (error) {
      console.error("Error creating team", error);
    }
  };

  const postJob = async () => {
    if (!selectedTeam) return alert("Select a team first");
    try {
      const res = await axios.post("/api/jobs", { title: jobTitle, description: jobDescription, teamId: selectedTeam });
      setJobs([...jobs, res.data]);
      setJobTitle("");
      setJobDescription("");
    } catch (error) {
      console.error("Error posting job", error);
    }
  };

  return (
    <div>
      <h2>Create a Team</h2>
      <input type="text" placeholder="Team Name" value={teamName} onChange={(e) => setTeamName(e.target.value)} />
      <input type="text" placeholder="Description" value={teamDescription} onChange={(e) => setTeamDescription(e.target.value)} />
      <button onClick={createTeam}>Create Team</button>

      <h2>Post a Job</h2>
      <select onChange={(e) => { setSelectedTeam(e.target.value); fetchJobs(e.target.value); }}>
        <option value="">Select a Team</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>{team.name}</option>
        ))}
      </select>
      <input type="text" placeholder="Job Title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
      <input type="text" placeholder="Job Description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
      <button onClick={postJob}>Post Job</button>

      <h2>Jobs</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>{job.title}: {job.description}</li>
        ))}
      </ul>
    </div>
  );
};

export default TeamPage;
