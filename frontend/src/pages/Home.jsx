import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBrain, faLeaf, faUserGear, faChevronLeft, faChevronRight, faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";

const testimonials = [
  {
    quote: "How we navigate work and life in the digital environment is THE issue for us to solve moving forward. The Digital Wellness Institute is quantifying the problem with the right measurements at the right time. They have a suite of interventions that can meaningfully move the needle forward for positive change.",
    author: "Matthew Chow",
    role: "Chief Mental Health Officer at Telus Health",
    image: "https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/65532734553dc218823dbd6e_Rectangle%2067.png",
    logo: "https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/677e8e7211b8b460cb392be7_Right%20Content.svg"
  },
  {
    quote: "We highly recommend the Digital Wellness Institute! Our leaders now set better screen time boundaries and focus on wellness. Simple changes like turning off notifications and 'no meeting' days boost productivity and well-being. Their approach improves morale and mental health, helping us create a balanced work environment!",
    author: "Dr. Ram Cheruvu",
    role: "Executive Development Manager at McKesson",
    image: "https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/669ea9dfddcec546fbda133b_McKesson%20Testimonial.png",
    logo: "https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/677e8e7211b8b460cb392be7_Right%20Content.svg"
  },
  {
    quote: "Learning to manage our boundaries and harnessing the power of technology is possible when we take time to learn about ideas like digital overuse and pursue digital flourishing. The Digital Wellness Institute provides the context for greater understanding and the tools to act as a better and more healthy relationship with our technology.",
    author: "Kerilee Snatenchuk",
    role: "Director of People & Culture at ATB Financial",
    image: "https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/65532734553dc218823dbd70_Rectangle%2067-1.png",
    logo: "https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/677e8e7211b8b460cb392be7_Right%20Content.svg"
  },
  {
    quote: "After taking the Digital Wellness Institute's courses through my company, I came away with greater awareness about how I'm looking after my health and digital wellness and what I can do to increase my productivity at work and lessen the feeling of burnout. These courses also served as a great reminder to set healthy boundaries for my tech usage habits.",
    author: "Jacob Turner",
    role: "Digital Wellness Learner Employee",
    image: "https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/65532734553dc218823dbd72_Rectangle%2067-2.png",
    logo: "https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/677e8e7211b8b460cb392be7_Right%20Content.svg"
  }
];

const TestimonialSlider = () => {
  const [current, setCurrent] = useState(0);
  const itemsPerPage = 3;
  const totalItems = testimonials.length;

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1 >= totalItems ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 < 0 ? totalItems - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [current]);

  // Helper to get circular indices for the slider
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
      <button className="slider-arrow left" onClick={prevSlide}>
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="testimonial-cards-grid">
        {visibleItems.map((item, index) => (
          <div key={`${current}-${index}`} className="testimonial-card">
            <div className="quote-icon-box">
              <FontAwesomeIcon icon={faQuoteLeft} />
            </div>
            <p className="testimonial-text">{item.quote}</p>
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

      <button className="slider-arrow right" onClick={nextSlide}>
        <FontAwesomeIcon icon={faChevronRight} />
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
    </div>
  );
};

/* ---------- HOME ---------- */
export default function Home() {
  return (
    <div className="home">
      {/* HERO – White section, vertical stack */}
      <section className="home-hero">
        <div className="home-hero-content">
          <h1>
            Track your mood.
            <br />
            <span>Reconnect</span> with yourself.
          </h1>
          <p>
            MindRest helps you understand your stress patterns, screen habits,
            and how you're feeling — through simple, helpful insights.
          </p>
          <Link to="/assessment">
            <button className="home-hero-btn">Check Your Risk Level</button>
          </Link>
        </div>

        <div className="home-hero-image">
          <img src="cute image.png" alt="Meditating Brain" />
        </div>
      </section>

      {/* FEATURES SECTION - 4 Cards */}
      <section className="home-features-section">
        <h2 className="home-features-section-title text-center">Features</h2>
        <div className="home-features-grid">
          <div className="feature-card-wrapper orange-glow">
            <div className="feature-card">
              <div className="feature-icon icon-teal">
                <FontAwesomeIcon icon={faSearch} />
              </div>
              <h3>Smart Detection</h3>
            </div>
          </div>

          <div className="feature-card-wrapper orange-glow">
            <div className="feature-card">
              <div className="feature-icon icon-orange">
                <FontAwesomeIcon icon={faBrain} />
              </div>
              <h3>AI Risk Predictor</h3>
            </div>
          </div>

          <div className="feature-card-wrapper green-glow">
            <div className="feature-card">
              <div className="feature-icon icon-purple">
                <FontAwesomeIcon icon={faLeaf} />
              </div>
              <h3>Self-Care Hub</h3>
            </div>
          </div>

          <div className="feature-card-wrapper green-glow">
            <div className="feature-card">
              <div className="feature-icon icon-green">
                <FontAwesomeIcon icon={faUserGear} />
              </div>
              <h3>Know about Yourself</h3>
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
                Technology is accelerating these problems. Without intentional frameworks, overwhelm becomes the default.
                <br /><br />
                <strong>The good news: overwhelm is measurable—and what’s measurable can be changed.</strong>
              </p>
            </div>
            <div className="home-problem-video">
              <a
                href="https://www.youtube.com/watch?v=Em0z8WGIzF0"
                target="_blank"
                rel="noopener noreferrer"
                className="video-lightbox"
              >
                <img
                  src="https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/677c0b151941e627339d9bdf_Play.jpg"
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
              src="https://cdn.prod.website-files.com/65523bd14cf781be335f87cc/677d844efda28a26cfdec7f4_Image%20Section.png"
              loading="lazy"
              alt="Digital Wellness Illustration"
              className="img-100"
            />
            <div className="why-digital-container align-left bullet-text">
              <h5 className="why-digital-title">Why Digital Wellness 2.0?</h5>
              <div className="flex-20">
                <p className="_1-0-desktop-text">
                  Digital Wellness 1.0 helped us talk about screen time, Zoom fatigue, and smartphone overuse. Those concerns were real—but they were only the beginning.
                  <br /><br />
                  Digital Wellness 2.0 widens the lens. <strong>It’s about human connection in the age of AI. </strong>
                  It’s about helping young people grow up resilient, and helping older generations reimagine their work, relationships, and purpose in a digital-first world.
                  <br /><br />
                  This isn’t about managing devices. It’s about measuring and improving the very conditions of human flourishing—focus, balance, trust, and joy—at every stage of life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="home-testimonials-section">
        <div className="testimonials-header">
          <h5 className="testimonials-subtitle">What others say</h5>
          <h2 className="testimonials-main-title">Organizations like yours are seeing the impact of digital well-being</h2>
        </div>
        <TestimonialSlider />
      </section>
    </div>
  );
}
