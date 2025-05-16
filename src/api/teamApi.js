import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/teams';

export const getTeamById = async (teamId) => {
  const response = await axios.get(`${BASE_URL}?teamId=${teamId}`);
  return response.data;
};

export const getAllTeams = async () => {
  const response = await axios.get("http://localhost:3000/api/teams");
  return response.data;
};

export const updateTeam = async (editingTeam) => {

  const response = await axios.put(
    BASE_URL,
    {
      teamId: editingTeam.id,
      name: editingTeam.name,
      description: editingTeam.description,
      logo: editingTeam.logo,
    },
    { headers: { 'Content-Type': 'application/json' } }
  );

  return response.data;
};

export const deleteTeam = async ({ teamId, name, description, logo }) => {
  const response = await axios.put(
    BASE_URL,
    { teamId, name, description, logo },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export const uploadLogo = async (file: File, teamId: string) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(
      `http://localhost:3000/api/logo-upload?teamId=${teamId}`,
      formData,
      {
        headers: { 
          'Content-Type': file.type,
        },
        withCredentials: true,
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Logo upload failed:', error);
    throw error;
  }
};