import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBrain, faLeaf, faUserGear, faChevronLeft, faChevronRight, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

const testimonials = [
  {
    quote: "MindRest helped me realize how much my 'quick checks' were draining my focus. The predictive alerts are a game-changer for my daily productivity.",
    author: "Arjun Mehta",
    role: "Software Engineer",
    image: "https://i.pravatar.cc/150?u=arjun"
  },
  {
    quote: "Finally, a wellness tool that doesn't feel like another chore. The minimalist design actually makes me want to log off and recharge properly.",
    author: "Sarah Jenkins",
    role: "Product Designer",
    image: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    quote: "Using this for my daily study sessions helped me manage screen fatigue. It’s intuitive, calm, and actually works for students like me.",
    author: "Rohan Das",
    role: "B.Tech Student",
    image: "https://i.pravatar.cc/150?u=rohan"
  },
  {
    quote: "The journaling feature combined with the AI insights gives me a clear picture of my mental state before I hit the point of total burnout.",
    author: "Priya Sharma",
    role: "Content Creator",
    image: "https://i.pravatar.cc/150?u=priya"
  }
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);
  const itemsPerPage = 4; // CHANGED FROM 3 TO 4
  const totalItems = testimonials.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1 >= totalItems ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 < 0 ? totalItems - 1 : prev - 1));
  };

  // Helper to get 4 circular indices
  const getVisibleTestimonials = () => {
    const result = [];
    for (let i = 0; i < itemsPerPage; i++) {
      result.push(testimonials[(current + i) % totalItems]);
    }
    return result;
  };

  const visibleItems = getVisibleTestimonials();

  return (
    <div className="testimonial-slider-container">
      <div className="testimonial-cards-grid">
        {visibleItems.map((item, index) => (
          <div key={`${current}-${index}`} className="testimonial-card">
            <div className="testimonial-content-wrapper">
              <div className="quote-icon-box">
                <FontAwesomeIcon icon={faQuoteLeft} />
              </div>
              <p className="testimonial-text">{item.quote}</p>
            </div>

            <div className="testimonial-profile">
              <img src={item.image} alt={item.author} className="profile-img" />
              <div className="profile-info">
                <span className="profile-name">{item.author}</span>
                <span className="profile-role">{item.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-controls">
        <button className="slider-arrow left" onClick={prevSlide}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="slider-dots">
          {testimonials.map((_, index) => (
            <div
              key={index}
              className={`slider-dot ${index === current ? "active" : ""}`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>
        <button className="slider-arrow right" onClick={nextSlide}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

/* ---------- HOME ---------- */
export default function Home() {
  return (
    <div className="home">
      {/* HERO – White section, vertical stack */}
      <section className="home-hero">
        <div className="container home-hero-flex">
          <div className="home-hero-content">
            <h1>
              Disconnect To
              <br />
              <span>Reconnect</span>
              <br />
              with yourself.
            </h1>
            <p>
              Predict digital exhaustion early.
              Balance your productivity and mental well-being with AI-driven insights tailored to your daily patterns.
            </p>
            <Link to="/assessment">
              <button className="home-hero-btn">Check Your Exhaustion Level</button>
            </Link>
          </div>

          <div className="home-hero-image">
            <img src="meditating-brain.png" alt="Meditating Brain" />
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - 4 Cards */}
      <section className="home-features-section">
        <h2 className="home-features-section-title text-center">Features</h2>
        <div className="home-features-grid">


          <div className="feature-card-wrapper orange-glow">
            <div className="feature-card">
              <div className="feature-icon icon-orange">
                <FontAwesomeIcon icon={faBrain} />
              </div>
              <h3>AI Risk Predictor</h3>
              <p className="feature-description">Predict your digital exhaustion risk using AI.</p>
            </div>
          </div>

          <div className="feature-card-wrapper green-glow">
            <div className="feature-card">
              <div className="feature-icon icon-purple">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <h3>MindHub</h3>
              <p className="feature-description">Access exercises, games, and journaling for daily mental care.</p>
            </div>
          </div>

          <div className="feature-card-wrapper green-glow">
            <div className="feature-card">
              <div className="feature-icon icon-green">
                <FontAwesomeIcon icon={faUserGear} />
              </div>
              <h3>Insights Dashboard</h3>
              <p className="feature-description">Track your progress and get suggestions tailored to you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION - Video Section */}
      <section className="home-problem-section">
        <div className="home-problem-container">
          <div className="home-problem-content">
            <div className="home-problem-text">
              <div className="problem-upperhead">The Problem</div>
              <h2 className="problem-title">Burnout, Distraction, Anxiety, Loneliness...</h2>
              <p className="problem-description">
                Constant digital engagement is accelerating these problems. Without intentional frameworks, overwhelm becomes the default.
                MindRest identifies early signs of digital exhaustion using measurable daily behaviour patterns.
                <br /><br />
                <strong>The good news: Digital burnout can be measured, and early insight enables timely action...</strong>
              </p>
            </div>
            <div className="home-problem-video">
              <a
                href="https://www.youtube.com/watch?v=c5sjlogQYM8"
                target="_blank"
                rel="noopener noreferrer"
                className="video-lightbox"
              >
                <img
                  src="tired-brain.png"
                  alt="The Problem Video"
                />
                <div className="play-icon-overlay">
                  <svg width="60" height="60" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 41C32.046 41 41 32.046 41 21C41 9.954 32.046 1 21 1C9.954 1 1 9.954 1 21C1 32.046 9.954 41 21 41Z" stroke="white" strokeWidth="2" />
                    <path d="M17 14.072L28.9999 21L17 27.928V14.072Z" fill="white" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* DIGITAL WELLNESS 2.0 SECTION - Philosophy */}
      <section className="why-digital-wellness">
        <div className="container-1240">
          <div className="beyond-screen-time">
            <img
              src="mascot3.png"
              loading="lazy"
              alt="Digital Wellness Illustration"
              className="img-100"
            />
            <div className="why-digital-container align-left bullet-text">
              <h5 className="why-digital-title">Why MindRest?</h5>
              <div className="flex-20">
                <p className="_1-0-desktop-text">
                  Digital wellness earlier focused on screen time and distraction control. Those ideas were important, but they addressed only surface-level issues.
                  <br /><br />
                  MindRest takes a deeper approach. <strong>It focuses on mental wellbeing in a data-driven, digital-first world.</strong>
                  It helps students and working adults recognise early signs of digital exhaustion , burnout, and emotional overload using everyday behavioural patterns.
                  <br /><br />
                  It also enables timely action through calming games, guided exercises, and a journaling section with blogs to improve focus, balance, and emotional stability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="home-testimonials-section">
        <div className="testimonials-header">
          <h5 className="testimonials-subtitle">What users say</h5>
          <h2 className="testimonials-main-title">How MindRest is helping people manage digital exhaustion</h2>
        </div>
        <TestimonialSlider />
      </section>
    </div>
  );
}
