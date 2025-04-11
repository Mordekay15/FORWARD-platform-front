import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import MemberPage from "./pages/MemberPage";
import AdminPage from "./pages/AdminPage";
import TeamsPage from "./pages/TeamPage";
import { AuthProvider } from './context/AuthContext';
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
        <Header/>
      <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/member" element={<MemberPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    <Footer/>
  </AuthProvider>
    
  );
}

export default App;
