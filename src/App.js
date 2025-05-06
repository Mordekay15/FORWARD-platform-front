import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MemberPage from "./pages/MemberPage";
import AdminPage from "./pages/AdminPage";
import TeamsPage from "./pages/TeamPage";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from "./components/Header";
import Footer from "./components/Footer";
import Source from "./pages/Source";
import Teams from './pages/Teams';
import TeamPage from './pages/TeamPage';
import Positions from './pages/Positions';
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <Header />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sources" element={<Source />} />
          
          <Route path="/about" element={<AdminPage />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/:teamId" element={<TeamPage />} />
          <Route path="/positions" element={<Positions />} />

          <Route path="/" element={<Navigate to="/member" replace />} />

          <Route
            path="/member"
            element={
              <ProtectedRoute>
                <MemberPage />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
          } />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Footer />
    </AuthProvider>
  );
}

export default App;
