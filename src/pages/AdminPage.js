import { useState, useEffect } from "react";
import styles from './AdminPage.module.css';
import { getAllUsers, createUser, deleteUser, updateUser, approveUser, rejectUser } from "../api/userApi";
import { getAllTeams, updateTeam, uploadLogo, deleteTeam, getTeamById } from "../api/teamApi";
import { uploadPdf } from "../api/pdfApi";
import axios from "axios";
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  // State declarations
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [filteredPendingUsers, setFilteredPendingUsers] = useState([]);
  const [filteredApprovedUsers, setFilteredApprovedUsers] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [weekNumber, setWeekNumber] = useState(1);
  const [logoFile, setLogoFile] = useState(null);
  const [pendingUserSearch, setPendingUserSearch] = useState("");
  const [approvedUserSearch, setApprovedUserSearch] = useState("");
  const navigate = useNavigate();
  const [teamSearch, setTeamSearch] = useState("");

  const [newUser, setNewUser] = useState({ 
    email: "", 
    password: "", 
    role: "PARTICIPANT", 
    teamId: "" 
  });

  const [newTeam, setNewTeam] = useState({ 
    name: "", 
    description: "",
    logo: ""
  });

  const [editingTeam, setEditingTeam] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showEditTeamModal, setShowEditTeamModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter users and teams when search changes
  useEffect(() => {
    const filteredPending = pendingUsers.map(user => {
      const team = teams.find(t => t.id === user.teamId);
      return {
        ...user,
        teamName: team ? team.name : "No team"
      };
    }).filter(user => 
      user.email.toLowerCase().includes(pendingUserSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(pendingUserSearch.toLowerCase()) ||
      (user.teamName && user.teamName.toLowerCase().includes(pendingUserSearch.toLowerCase()))
    );
    setFilteredPendingUsers(filteredPending);

    const filteredApproved = approvedUsers.map(user => {
      const team = teams.find(t => t.id === user.teamId);
      return {
        ...user,
        teamName: team ? team.name : "No team"
      };
    }).filter(user => 
      user.email.toLowerCase().includes(approvedUserSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(approvedUserSearch.toLowerCase()) ||
      (user.teamName && user.teamName.toLowerCase().includes(approvedUserSearch.toLowerCase()))
    );
    setFilteredApprovedUsers(filteredApproved);

    const filteredTeams = teams.filter(team => 
      team.name.toLowerCase().includes(teamSearch.toLowerCase()) ||
      (team.description && team.description.toLowerCase().includes(teamSearch.toLowerCase()))
    );
    setFilteredTeams(filteredTeams);
  }, [pendingUserSearch, approvedUserSearch, teamSearch, pendingUsers, approvedUsers, teams]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, teamsData] = await Promise.all([
        getAllUsers(),
        getAllTeams()
      ]);
      
      const pending = usersData.filter(user => user.approvalStatus === "PENDING");
      const approved = usersData.filter(user => user.approvalStatus === "APPROVE");
      
      setUsers(usersData);
      setPendingUsers(pending);
      setApprovedUsers(approved);
      setTeams(teamsData);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleLogoChange = (e) => setLogoFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
  
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
  
    const user = JSON.parse(localStorage.getItem('user'));
    const adminId = user?.id;
  
    if (!adminId) {
      setError("User not found. Please log in again.");
      return;
    }
  
    try {
      await uploadPdf(file, adminId, weekNumber);
      setSuccess("File uploaded successfully!");
      setFile(null);
      fetchData();
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file. Please try again.");
    }
  };
  

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createUser(newUser.email, newUser.password, newUser.role, newUser.teamId);
      setSuccess("User created successfully!");
      setNewUser({ email: "", password: "", role: "PARTICIPANT", teamId: "" });
      setShowUserModal(false);
      fetchData();
    } catch (err) {
      console.error("Create user error:", err);
      setError(err.response?.data?.message || "Failed to create user.");
    }
  };

  const handleApproveUser = async (userId) => {
    setError("");
    setSuccess("");

    try {
      await approveUser(userId);
      setSuccess("User approved successfully!");
      fetchData();
    } catch (err) {
      console.error("Approve user error:", err);
      setError("Failed to approve user. Please try again.");
    }
  };

  const handleRejectUser = async (userId) => {
    setError("");
    setSuccess("");

    try {
      await rejectUser(userId);
      setSuccess("User rejected successfully!");
      fetchData();
    } catch (err) {
      console.error("Reject user error:", err);
      setError("Failed to reject user. Please try again.");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateUser(editingUser.id, 
        editingUser.email,
        editingUser.password,
        editingUser.role,
        editingUser.teamId
      );
      setSuccess("User updated successfully!");
      setEditingUser(null);
      setShowEditUserModal(false);
      fetchData();
    } catch (err) {
      console.error("Update user error:", err);
      setError("Failed to update user. Please try again.");
    }
  };

  const handleDeleteUser = async (id) => {
    setError("");
    setSuccess("");

    try {
      await deleteUser(id);
      setSuccess("User deleted successfully!");
      fetchData();
    } catch (err) {
      console.error("Delete user error:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/teams", newTeam);
      let logoUrl;
      if (logoFile) {
        const { url: relativeUrl } = await uploadLogo(logoFile, response.data.id);
        logoUrl = `http://localhost:3000${relativeUrl}`;

        await updateTeam({
                id: editingTeam.id,
                name: editingTeam.name,
                description: editingTeam.description,
                logo: logoUrl,
              });
      }
      setSuccess("Team created successfully!");
      setNewTeam({ name: "", description: "", logo: "" });
      setLogoFile(null);
      setShowTeamModal(false);
      fetchData();
    } catch (err) {
      console.error("Create team error:", err);
      setError("Failed to create team. Please try again.");
    }
  };

  const handleEditTeam = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log(editingTeam)
      await updateTeam(editingTeam);
      let logoUrl;
      if (logoFile) {
        const { url: relativeUrl } = await uploadLogo(logoFile, editingTeam.id);
        logoUrl = `http://localhost:3000${relativeUrl}`;

        await updateTeam({
                id: editingTeam.id,
                name: editingTeam.name,
                description: editingTeam.description,
                logo: logoUrl,
              });
      }
      setSuccess("Team updated successfully!");
      setEditingTeam(null);
      setLogoFile(null);
      setShowEditTeamModal(false);
      fetchData();
    } catch (err) {
      console.error("Update team error:", err);
      setError("Failed to update team. Please try again.");
    }
  };

  const handleDeleteTeam = async (teamId, title) => {
    setError("");
    setSuccess("");

    try {
      await deleteTeam(teamId, title);
      setSuccess("Team deleted successfully!");
      fetchData();
    } catch (err) {
      console.error("Delete team error:", err);
      setError("Failed to delete team. Please try again.");
    }
  };

  const handleLogout = (e) => {
    logout();
    navigate('/login');
  };

  const handlePendingUserSearch = (e) => {
    setPendingUserSearch(e.target.value);
  };

  const handleApprovedUserSearch = (e) => {
    setApprovedUserSearch(e.target.value);
  };

  const handleTeamSearch = (e) => {
    setTeamSearch(e.target.value);
  };

  const openEditTeamModal = (team) => {
    setEditingTeam(team);
    setShowEditTeamModal(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setShowEditUserModal(true);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h2 className={styles.adminTitle}>Admin Panel</h2>

      {/* Error and Success Messages */}
      {error && <div className={styles.errorMessage}>{error}</div>}
      {success && <div className={styles.successMessage}>{success}</div>}
      {logoutError && <div className={styles.errorMessage}>{logoutError}</div>}

      {/* Upload Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Upload PDF</h3>
        <form onSubmit={handleUpload} className={styles.form}>
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
            className={styles.fileInput} 
          />
          <select 
            value={weekNumber} 
            onChange={(e) => setWeekNumber(Number(e.target.value))} 
            className={styles.selectInput}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>Week {i + 1}</option>
            ))}
          </select>
          <button type="submit" className={styles.submitButton}>
            Upload PDF
          </button>
        </form>
      </div>

      {/* Pending Users Section */}
      <div className={styles.usersSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Pending User Approvals</h3>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search pending users..."
              value={pendingUserSearch}
              onChange={handlePendingUserSearch}
              className={styles.searchInput}
            />
            <button 
              onClick={() => setShowUserModal(true)} 
              className={styles.createButton}
            >
              Create User
            </button>
          </div>
        </div>
        
        <div className={styles.usersTable}>
          {filteredPendingUsers.length === 0 ? (
            <p className={styles.noItems}>No pending users found</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPendingUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.teamName}</td>
                    <td>{user.approvalStatus}</td>
                    <td className={styles.actionsCell}>
                      <button 
                        onClick={() => handleApproveUser(user.id)} 
                        className={styles.approveButton}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectUser(user.id)} 
                        className={styles.rejectButton}
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => openEditUserModal(user)} 
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)} 
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Approved Users Section */}
      <div className={styles.usersSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Approved Users</h3>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search approved users..."
              value={approvedUserSearch}
              onChange={handleApprovedUserSearch}
              className={styles.searchInput}
            />
          </div>
        </div>
        
        <div className={styles.usersTable}>
          {filteredApprovedUsers.length === 0 ? (
            <p className={styles.noItems}>No approved users found</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Team</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApprovedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.teamName}</td>
                    <td>{user.approvalStatus}</td>
                    <td className={styles.actionsCell}>
                      <button 
                        onClick={() => openEditUserModal(user)} 
                        className={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)} 
                        className={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Teams Section */}
      <div className={styles.teamsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Teams Management</h3>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search teams..."
              value={teamSearch}
              onChange={handleTeamSearch}
              className={styles.searchInput}
            />
            <button 
              onClick={() => setShowTeamModal(true)} 
              className={styles.createButton}
            >
              Create Team
            </button>
          </div>
        </div>
        
        <div className={styles.teamsGrid}>
          {filteredTeams.length === 0 ? (
            <p className={styles.noItems}>No teams found</p>
          ) : (
            filteredTeams.map((team) => (
              <div 
                key={team.id} 
                className={styles.teamCard}
                style={{ 
                  backgroundImage: team.logo 
                    ? `url(${team.logo})` 
                    : 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className={styles.teamCardContent}>
                  <div className={styles.teamInfo}>
                    <h4>{team.name}</h4>
                    <p>{team.description || "No description"}</p>
                  </div>
                  <div className={styles.teamActions}>
                    <button 
                      onClick={() => openEditTeamModal(team)} 
                      className={styles.editButton}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Creation Modal */}
      {showUserModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Create New User</h3>
            <form onSubmit={handleCreateUser} className={styles.form}>
              <input 
                type="email" 
                placeholder="Email" 
                value={newUser.email} 
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={newUser.password} 
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} 
                required 
              />
              <select 
                value={newUser.role} 
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className={styles.selectInput}
              >
                <option value="ADMIN">Admin</option>
                <option value="PARTICIPANT">Participant</option>
              </select>
              <select 
                value={newUser.teamId} 
                onChange={(e) => setNewUser({ ...newUser, teamId: e.target.value })}
                className={styles.selectInput}
              >
                <option value="">No Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Create User
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowUserModal(false)} 
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Edit Modal */}
      {showEditUserModal && editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser} className={styles.form}>
              <input 
                type="email" 
                placeholder="Email" 
                value={editingUser.email} 
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} 
                required 
                className={styles.input}
              />
              <select 
                value={editingUser.role} 
                onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                className={styles.selectInput}
              >
                <option value="ADMIN">Admin</option>
                <option value="PARTICIPANT">Participant</option>
              </select>
              <select 
                value={editingUser.teamId || ""} 
                onChange={(e) => setEditingUser({ ...editingUser, teamId: e.target.value })}
                className={styles.selectInput}
              >
                <option value="">No Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Update User
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditUserModal(false)} 
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Creation Modal */}
      {showTeamModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Create New Team</h3>
            <form onSubmit={handleCreateTeam} className={styles.form}>
              <input 
                type="text" 
                placeholder="Team Name" 
                value={newTeam.name} 
                onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} 
                required 
                className={styles.input}
              />
              <input 
                type="text" 
                placeholder="Description" 
                value={newTeam.description} 
                onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })} 
                className={styles.input}
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange} 
                className={styles.fileInput} 
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Create Team
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowTeamModal(false)} 
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Edit Modal */}
      {showEditTeamModal && editingTeam && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Edit Team</h3>
            <form onSubmit={handleEditTeam} className={styles.form}>
              <input 
                type="text" 
                placeholder="Team ID" 
                value={editingTeam.id} 
                readOnly 
                className={styles.input}
              />
              <input 
                type="text" 
                placeholder="Team Name" 
                value={editingTeam.name} 
                onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })} 
                required 
                className={styles.input}
              />
              <input 
                type="text" 
                placeholder="Description" 
                value={editingTeam.description} 
                onChange={(e) => setEditingTeam({ ...editingTeam, description: e.target.value })} 
                className={styles.input}
              />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleLogoChange} 
                className={styles.fileInput} 
              />
              {editingTeam.logo && (
                <img 
                  src={editingTeam.logo} 
                  alt={`${editingTeam.name} logo`} 
                  className={styles.teamLogoPreview} 
                />
              )}
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Update Team
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowEditTeamModal(false)} 
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

export default AdminPage;