import React from "react";
import "./About.css";

export default function About() {
  return (
    <div className="about-page">
      {/* HERO SECTION */}
      <header className="about-hero">
        <div className="about-container about-hero-grid">
          <div className="about-hero-text">
            <span className="about-label">Our Commitment</span>
            <h1 className="about-title">
              Our Mission: To <span className="text-highlight">Humanize</span> Mental Wellness in the Digital Age
            </h1>
            <p className="about-subtitle">
              We bridge the gap between high-speed technology and the natural rhythms of the human mind, creating space for rest in an always-on world.
            </p>
          </div>
          <div className="about-mascot-wrapper">
            <div className="about-mascot-card">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_owsyjf62XGbE_xONGrwtJQjhOSKkS9qHHTht82BhT1_A2JpvOYcF41nW5tUDPUcRvVwhaxjTxjAXWean6h34Ivu1AH2IF5tufAfIQiCe2ARKHf7zN_ZvkOejGWfJiAUosLWrHuZOBf9yrgKH7Hm1MR9nINBq-PKcKQkfFgvfHlnoGocO8KxV9C_sqib9_czVAtVG6Sh2e0clgNhHccvYrkmipYYiCioe7Q5YOpbkknWb8INmF-W7_tgUpLxdhmcBsBH3vN_4-A"
                alt="Brain mascot in a collaborative meeting setting"
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

      {/* OUR STORY SECTION */}
      <section className="about-story-section">
        <div className="about-container about-story-flex">
          <div className="about-image-grid">
            <div className="about-grid-content">
              <div className="image-stack-1">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzxyHdymVw7a8iPEiQ64gMW5BwLJiksvcTxorUITfDlXFV_q9a_znSnve_QRKVYS_JxyASAbZMydrrmTwzh-srRLW9pNl5s7Ext9-w_tM15NIJdmEX-ksL6OwOqjS3UMrzcLyQtJNUCz0HhcLQCgLetxKy5boUEGLsPLRbzYg1qXnELG5Y9NxxxArhM-wbH9R3YgflfATEjXJZmiSLmtFWjr6iAx7_o2o0HeDNUgViXtin6kgwb7OYPo4v01dT-VGY9HEaqCy_4w"
                  alt="Organized bookshelves"
                  className="about-img about-img-h64"
                />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOUKH57UekxMzDOOSg8Eq1Cr6Fn9m94UEfd-5_-3P5jn5j12K5Q_t9hG1InwLJOn6dCCWPCsKlhtU893cteOROWpFVqqgH051L6kQiLv97rwqJM_ikfZMJ1rDx6DM0UqTaJ-3K3_lqM_uDnq44i9Y_lKSZdYI8i3ApHuFUeMQ53yNjRl3EpQrBpXcj5f9xkmfrnqXntnhEWGgfV8dVBTrPybqPXxgirIFuCMQzvL59iKMQ49zQtSkgAHkqj5gLaG8eaF8Gm-wdCg"
                  alt="Sunlight on desk"
                  className="about-img about-img-h48"
                />
              </div>
              <div className="image-stack-2">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx0EZCYMCboHX3De7eC6IHycSfdKaVAGSyR6FeQV4fHBXv77vEUOf8mvE7GpGEG05Eh-F7IRAqa77i0vieAGlUFfDa1_pIT13vecRnYlnpPFRHi5MTsVRLctRWE_r36XvVljO_RM8lAsUhZTGtQ-hk_M8ZcSp8wOvWy9DU4WQjorVhKUr_9xMbgydGuBt9wpW6El5NhjRN_tmiFtIZmf-HAshLsIOOqAimJJzNcT3BEJcbMO4BYv3u2hi-35DqPOak1EsI-aCBgg"
                  alt="Forest landscape"
                  className="about-img about-img-h48"
                />
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzz61uu1XGNi6Hd_w9H073nAnSUhWm2dXLBAQhjolnNXdewKjLZcp7be9QHC-MA3SsXhynxma26_n-SwMLgT0RNMB-_V2M3dyBqN02C9RWhAvSfKnwA33D34Wcf_IMh9jhlZyw4ajpUjhd8i-vQKQvzge4B9KL32fPAIFDQAvsBV0c6qKtDbOR80uxuaClC9Aga1keoIUDIdGgIWfhOL0lLyfDzscrBm2DzoYFjb3KJPWCTBg1aUQVGM8RBeAWjzGVvIYMJVS8rw"
                  alt="Coastal view"
                  className="about-img about-img-h64"
                />
              </div>
            </div>
            <div className="accent-box"></div>
          </div>
          <div className="about-story-content">
            <span className="about-label">Our Story</span>
            <h2 className="about-story-title">Born from the need for stillness.</h2>
            <div className="about-prose">
              <p className="about-para">
                MindRest began as a simple research project at the intersection of psychology and digital interface design. We observed a growing trend: while our devices were getting smarter, our collective mental well-being was facing unprecedented fatigue.
              </p>
              <p className="about-para">
                We didn't want to build just another tracker. We wanted to build a sanctuary. A tool that doesn't demand more of your time, but gives it back to you.
              </p>
              <div className="about-quote-box">
                <p className="about-quote-text">
                  "The goal isn't to escape technology, but to master our relationship with it."
                </p>
              </div>
              <p className="about-para">
                Today, MindRest serves thousands of individuals seeking to reclaim their focus, understand their emotional patterns, and find a sense of equilibrium in a noisy world.
              </p>
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
                <span className="material-symbols-outlined">experiment</span>
              </div>
              <h3 className="value-title">Scientific Rigor</h3>
              <p className="value-desc">Evidence-based insights validated by clinical psychologists.</p>
            </div>
            <div className="about-value-card">
              <div className="value-icon-box bg-blue">
                <span className="material-symbols-outlined">universal_currency_alt</span>
              </div>
              <h3 className="value-title">Accessibility</h3>
              <p className="value-desc">Making mental wellness tools available to everyone, everywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VISION SECTION */}
      <section className="about-vision-section">
        <div className="about-container about-vision-flex">
          <div className="about-vision-content">
            <span className="about-label">The Vision</span>
            <h2 className="about-story-title">A world where focus is the default.</h2>
            <p className="vision-para">
              We envision a future where digital tools work for us, not against us. Where our phones help us sleep better, work deeper, and connect more meaningfully with the people around us.
            </p>
            <div className="team-avatars">
              <div className="avatar-group">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdrx1Myz11k3z6NHTjJL5q1L9S-WA_cYcqhqlPUcvOmWgtJFUlEmyIhWt8TPN6QcVA4k7TKMLYC90v8pmNcy7lme3kVonXiF0E3ZuC8eb2CcDh8SAwtpvDr8cALkjy66NtlLU1-Ln2P0ktX0duIr6kwHKiR7iT72ou-iydTwTDLNusq3W1DLHtnU0Iq7NkgXmV64qjHMDHOGc9tC2r5N-Bzav-AiTkXV7y5G7ue6DmoUuYIBCQO20DcVR4B9WvCHHNGwt8qTxOzw" alt="Team member" />
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_owsyjf62XGbE_xONGrwtJQjhOSKkS9qHHTht82BhT1_A2JpvOYcF41nW5tUDPUcRvVwhaxjTxjAXWean6h34Ivu1AH2IF5tufAfIQiCe2ARKHf7zN_ZvkOejGWfJiAUosLWrHuZOBf9yrgKH7Hm1MR9nINBq-PKcKQkfFgvfHlnoGocO8KxV9C_sqib9_czVAtVG6Sh2e0clgNhHccvYrkmipYYiCioe7Q5YOpbkknWb8INmF-W7_tgUpLxdhmcBsBH3vN_4-A" alt="Team member" />
                <div className="avatar-more">+12</div>
              </div>
              <p className="team-subtitle">Built by a passionate team of experts.</p>
            </div>
          </div>
          <div className="about-vision-image">
            <div className="vision-image-wrapper">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdrx1Myz11k3z6NHTjJL5q1L9S-WA_cYcqhqlPUcvOmWgtJFUlEmyIhWt8TPN6QcVA4k7TKMLYC90v8pmNcy7lme3kVonXiF0E3ZuC8eb2CcDh8SAwtpvDr8cALkjy66NtlLU1-Ln2P0ktX0duIr6kwHKiR7iT72ou-iydTwTDLNusq3W1DLHtnU0Iq7NkgXmV64qjHMDHOGc9tC2r5N-Bzav-AiTkXV7y5G7ue6DmoUuYIBCQO20DcVR4B9WvCHHNGwt8qTxOzw" alt="Vision" className="vision-main-img" />
              <div className="vision-accent-badge">
                <span className="material-symbols-outlined">energy_savings_leaf</span>
                <p>Sustainable Mindset</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
