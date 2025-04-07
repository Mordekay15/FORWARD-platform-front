import { useState, useEffect } from "react";

const TEAM_ID = "164a1106-05e7-4e54-9060-a1100f4deabb"; // Change this to actual team ID

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: "", description: "" });
  const [editJob, setEditJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/jobs?teamId=${TEAM_ID}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch jobs");
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.description) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newJob, teamId: TEAM_ID }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add job");

      setJobs([...jobs, data]);
      setNewJob({ title: "", description: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = async (e) => {
    e.preventDefault();
    if (!editJob?.title || !editJob?.description) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/jobs/${editJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editJob),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update job");

      setJobs(jobs.map((job) => (job.id === editJob.id ? data : job)));
      setEditJob(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Jobs for Team {TEAM_ID}</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Add Job Form */}
      <form onSubmit={handleAddJob} className="mb-4 p-4 border rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Add New Job</h2>
        <input
          type="text"
          placeholder="Job Title"
          className="w-full p-2 border rounded mb-2"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
        />
        <textarea
          placeholder="Job Description"
          className="w-full p-2 border rounded mb-2"
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Adding..." : "Add Job"}
        </button>
      </form>

      {/* Edit Job Form */}
      {editJob && (
        <form onSubmit={handleEditJob} className="mb-4 p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Edit Job</h2>
          <input
            type="text"
            placeholder="Job Title"
            className="w-full p-2 border rounded mb-2"
            value={editJob.title}
            onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
          />
          <textarea
            placeholder="Job Description"
            className="w-full p-2 border rounded mb-2"
            value={editJob.description}
            onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            {loading ? "Updating..." : "Update Job"}
          </button>
          <button
            onClick={() => setEditJob(null)}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Jobs List */}
      <h2 className="text-xl font-semibold mb-2">Jobs</h2>
      {loading && <p>Loading...</p>}
      <ul className="border rounded-lg p-4 shadow">
        {jobs.map((job) => (
          <li key={job.id} className="border-b p-2 flex justify-between">
            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-gray-600">{job.description}</p>
            </div>
            <button
              onClick={() => setEditJob(job)}
              className="bg-yellow-500 text-white px-4 py-1 rounded"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
