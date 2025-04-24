import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/jobs';

export const getJobsByTeamId = async (teamId) => {
  const response = await axios.get(`${BASE_URL}?teamId=${teamId}`);
  return response.data;
};

export const createJob = async (jobData) => {
    const res = await axios.post('http://localhost:3000/api/jobs', jobData);
    return res.data;
  };
