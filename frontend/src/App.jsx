import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import LoginPage from "./pages/Loginpage";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import PredictionPage from "./pages/Predictionpage";
import AllGamesCard from "./pages/Games";
import MindfulExercises from "./pages/MindfulExercises";
import DailyReset from "./pages/DailyReset";
import Journal from "./pages/Journal";
import Resources from "./pages/Resources";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";


// ✅ ADD THIS HERE
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}


function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isResultPage = location.pathname === "/result";

  return (
    <>
      {!isLoginPage && !isResultPage && <Header />}
      <main style={{ minHeight: "80vh" }}>{children}</main>
      {!isLoginPage && !isResultPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/assessment" element={<Form />} />

          {/* ✅ FIXED DASHBOARD ROUTE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/result" element={<PredictionPage />} />
          <Route
            path="/games"
            element={
              <ProtectedRoute>
                <AllGamesCard />
              </ProtectedRoute>
            }
          />
          <Route path="/exercises" element={<MindfulExercises />} />
          <Route path="/reset" element={<DailyReset />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}