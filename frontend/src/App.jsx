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
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import PredictionPage from "./pages/PredictionPage";
import AllGamesCard from "./pages/Games";
import MindfulExercises from "./pages/MindfulExercises";
import DailyReset from "./pages/DailyReset";
import Journal from "./pages/Journal";

function Layout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Header />}
      <main style={{ minHeight: "80vh" }}>{children}</main>
      {!isLoginPage && <Footer />}
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/result" element={<PredictionPage />} />
          <Route path="/games" element={<AllGamesCard />} />
          <Route path="/exercises" element={<MindfulExercises />} />
          <Route path="/reset" element={<DailyReset />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}
