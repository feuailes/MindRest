import React from "react";
import { useNavigate } from "react-router-dom";
import "./About.css";

export default function About() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <header className="about-hero">
        <div className="about-container about-hero-grid">
          <div className="about-hero-text">
            <span className="about-label">Our Commitment</span>
            <h1 className="about-title">
              Our Mission: To <span className="text-highlight">Predict Digital Exhaustion early</span> and Improve Digital Wellbeing
            </h1>
          </div>
          <div className="about-mascot-wrapper">
            <div className="about-mascot-card">
              <img
                src="brain.png"
                alt="MindRest Sanctuary"
                className="about-mascot-img"
              />
              <div className="about-card-content">
                <div className="about-icon-circle">
                  <span className="material-symbols-outlined">groups</span>
                </div>
                <h3 className="about-card-title">Collaborative Care</h3>
                <p className="about-card-text">Building community through empathy</p>
              </div>
            </div>
            <div className="about-glow"></div>
          </div>
        </div>
      </header>
      {/* DATA & PROCESS SECTION */}
      <section className="about-story-section">
        <div className="about-container data-process-grid">

          {/* LEFT SIDE: Research & Data Cards (Replaces the Image Grid) */}
          <div className="about-stats-container">
            <div className="stat-card">
              <h3>96%</h3>
              <p>Accuracy in detecting early signs of digital exhaustion</p>
            </div>
            <div className="stat-card">
              <h3>4.2h</h3>
              <p>Average daily screen time before focus starts to drop</p>
            </div>
            <div className="stat-card">
              <h3>2x</h3>
              <p>Improvement in focus and well-being reported by users with regular use</p>
            </div>
            <div className="stat-card">
              <h3>Privacy</h3>
              <p>Analysis is based on usage patterns only, not personal content.</p>
            </div>
          </div>

          {/* RIGHT SIDE: The Process */}
          <div className="about-story-content">
            <span className="about-label">The Process</span>
            <h2 className="about-story-title">How MindRest works</h2>

            <div className="process-steps">
              <div className="step">
                <span className="step-num">01</span>
                <div>
                  <h4>Behavioral Data</h4>
                  <p> Tracks your digital habits and screen usage to detect early signs of digital exhaustion and fatigue.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-num">02</span>
                <div>
                  <h4>Prediction</h4>
                  <p> ML model generates a score estimating your current exhaustion level.</p>
                </div>
              </div>
              <div className="step">
                <span className="step-num">03</span>
                <div>
                  <h4>Action</h4>
                  <p>Offers guidance like calming exercises, journaling, or breaks before burnout develops.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      {/* CORE VALUES SECTION */}
      <section className="about-values-section">
        <div className="about-container">
          <div className="about-values-header">
            <span>Guided by Purpose</span>
            <h3>Our Core Values</h3>
          </div>
          <div className="about-values-grid">
            <div className="about-value-card">
              <div className="value-icon-box bg-emerald">
                <span className="material-symbols-outlined">favorite</span>
              </div>
              <h3 className="value-title">Empathy</h3>
              <p className="value-desc">Designing with deep understanding of the human emotional experience.</p>
            </div>
            <div className="about-value-card">
              <div className="value-icon-box bg-orange">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <h3 className="value-title">Privacy</h3>
              <p className="value-desc">Your mental health data is sacred. We treat it with absolute security.</p>
            </div>
            <div className="about-value-card">
              <div className="value-icon-box bg-purple">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <h3 className="value-title">Personalization</h3>
              <p className="value-desc">Tailored to your unique needs and journey.</p>
            </div>
            <div className="about-value-card">
              <div className="value-icon-box bg-blue">
                <span className="material-symbols-outlined">universal_currency_alt</span>
              </div>
              <h3 className="value-title">Access</h3>
              <p className="value-desc">Making digital wellness tools available to everyone, everywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA SECTION */}
      <section className="about-contact-cta" style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: '#f9f9f9' }}>
        <div className="about-container">
          <div className="contact-cta-wrapper">
            <span className="about-label" style={{ color: '#1D4D4F', fontWeight: 'bold', letterSpacing: '1px' }}>Get In Touch</span>
            <h2 className="about-title" style={{ margin: '1rem 0' }}>Have More Questions?</h2>
            <p className="about-subtitle" style={{ color: '#666', marginBottom: '2.5rem' }}>
              Have questions, feedback, or ideas? We’d love to hear from you.
            </p>

            <div className="contact-actions" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              {/* This opens your email app */}
              <button
                className="cta-btn-primary"
                style={{ backgroundColor: '#1D4D4F', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                onClick={() => handleNavigation('/contact')}
              >
                Contact Us
              </button>

              {/* This shows a quick success message */}
              <button
                className="cta-btn-secondary"
                style={{ backgroundColor: 'transparent', border: '2px solid #1D4D4F', color: '#1D4D4F', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
                onClick={() => handleNavigation('/feedback')}
              >
                Give Feedback
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}