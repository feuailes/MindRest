import React from "react";
import "./Journal.css";

export default function Journal() {
    return (
        <div className="journal-page">
            <div className="journal-container">
                {/* HEADER */}
                <header className="journal-header">
                    <div className="journal-meta-badge">
                        <span className="badge-research">Research</span>
                        <span className="journal-date">8 min read • Oct 24, 2026</span>
                    </div>
                    <h1 className="journal-title">
                        The Science of Screen Time and <span className="text-accent">Mental Fatigue</span>
                    </h1>
                    <div className="journal-author-box">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_owsyjf62XGbE_xONGrwtJQjhOSKkS9qHHTht82BhT1_A2JpvOYcF41nW5tUDPUcRvVwhaxjTxjAXWean6h34Ivu1AH2IF5tufAfIQiCe2ARKHf7zN_ZvkOejGWfJiAUosLWrHuZOBf9yrgKH7Hm1MR9nINBq-PKcKQkfFgvfHlnoGocO8KxV9C_sqib9_czVAtVG6Sh2e0clgNhHccvYrkmipYYiCioe7Q5YOpbkknWb8INmF-W7_tgUpLxdhmcBsBH3vN_4-A"
                            alt="Dr. Sarah Chen"
                            className="author-img"
                        />
                        <div className="author-info">
                            <p className="author-name">Dr. Sarah Chen</p>
                            <p className="author-role">Cognitive Neuroscientist</p>
                        </div>
                    </div>
                </header>

                {/* FEATURED IMAGE */}
                <div className="journal-featured-wrapper">
                    <div className="journal-featured-image">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx0EZCYMCboHX3De7eC6IHycSfdKaVAGSyR6FeQV4fHBXv77vEUOf8mvE7GpGEG05Eh-F7IRAqa77i0vieAGlUFfDa1_pIT13vecRnYlnpPFRHi5MTsVRLctRWE_r36XvVljO_RM8lAsUhZTGtQ-hk_M8ZcSp8wOvWy9DU4WQjorVhKUr_9xMbgydGuBt9wpW6El5NhjRN_tmiFtIZmf-HAshLsIOOqAimJJzNcT3BEJcbMO4BYv3u2hi-35DqPOak1EsI-aCBgg"
                            alt="Serene natural landscape"
                        />
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="journal-main-grid">
                    <article className="journal-article">
                        <div className="journal-prose">
                            <p>In our hyper-connected world, the average adult spends upwards of seven hours a day looking at screens. While technology has revolutionized how we work and communicate, the toll it takes on our cognitive resources is becoming increasingly clear. Scientists are now uncovering the specific biological mechanisms that lead to what we commonly call "Zoom fatigue" or digital burnout.</p>

                            <h2>The Cognitive Load of High-Speed Interfaces</h2>
                            <p>Our brains evolved for physical interaction—reading subtle body language cues, perceiving depth, and maintaining a steady focus. Digital environments, however, bombard our prefrontal cortex with constant rapid-fire stimuli. Every notification, scrolling animation, and blue-light emission triggers a minor stress response.</p>

                            <ul>
                                <li>Constant eye saccades between multiple open tabs.</li>
                                <li>The "Always-on" expectation reducing the brain's default mode network activity.</li>
                                <li>Blue light suppression of melatonin production affecting restorative sleep cycles.</li>
                            </ul>

                            <div className="journal-insight-box">
                                <div className="insight-header">
                                    <span className="material-symbols-outlined">lightbulb</span>
                                    <span>Insights</span>
                                </div>
                                <p className="insight-text">
                                    "Mental fatigue isn't just about feeling tired; it's the brain's protective mechanism against cognitive over-extension. When we ignore these signals, we risk long-term neurological exhaustion."
                                </p>
                            </div>

                            <h2>Strategies for Digital Restoration</h2>
                            <p>Reclaiming your mental energy doesn't necessarily mean going completely off-grid. It requires intentional boundaries and "neural pauses" throughout the day. The MindRest methodology suggests a 50/10 rule: 50 minutes of focused digital work followed by 10 minutes of purely analog sensory input.</p>
                            <p>Walking in nature, as seen in our hero image today, has been proven to engage the 'soft fascination' network of the brain, allowing the executive functions to rest and repair.</p>
                        </div>

                        {/* ARTICLE FOOTER */}
                        <footer className="article-footer">
                            <div className="footer-actions">
                                <button className="action-btn">
                                    <span className="material-symbols-outlined">favorite</span>
                                    <span className="action-count">1.2k</span>
                                </button>
                                <button className="action-btn">
                                    <span className="material-symbols-outlined">share</span>
                                    <span className="action-count">Share</span>
                                </button>
                            </div>
                            <div className="footer-tags">
                                <span className="tag">#MentalHealth</span>
                                <span className="tag">#DigitalWellness</span>
                            </div>
                        </footer>

                        {/* DISCUSSIONS */}
                        <section className="discussion-section">
                            <h3 className="discussion-title">Discussions (12)</h3>
                            <div className="comment-list">
                                <div className="comment">
                                    <div className="comment-avatar"></div>
                                    <div className="comment-body">
                                        <div className="comment-header">
                                            <span className="comment-user">Alex Rivera</span>
                                            <span className="comment-time">2h ago</span>
                                        </div>
                                        <p className="comment-text">The 50/10 rule has been a game changer for my productivity. I noticed my afternoon headaches almost vanished after the first week.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </article>

                    {/* SIDEBAR */}
                    <aside className="journal-sidebar">
                        <div className="sidebar-newsletter">
                            <h3 className="newsletter-title">Mindful Weekly</h3>
                            <p className="newsletter-desc">Join 50,000+ readers getting science-backed tips on mental energy and digital health.</p>
                            <input type="email" placeholder="email@example.com" className="newsletter-input" />
                            <button className="newsletter-btn">Subscribe</button>
                        </div>

                        <div className="sidebar-related">
                            <h3>Related Articles</h3>
                            <a href="#" className="related-post">
                                <div className="related-thumb">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdrx1Myz11k3z6NHTjJL5q1L9S-WA_cYcqhqlPUcvOmWgtJFUlEmyIhWt8TPN6QcVA4k7TKMLYC90v8pmNcy7lme3kVonXiF0E3ZuC8eb2CcDh8SAwtpvDr8cALkjy66NtlLU1-Ln2P0ktX0duIr6kwHKiR7iT72ou-iydTwTDLNusq3W1DLHtnU0Iq7NkgXmV64qjHMDHOGc9tC2r5N-Bzav-AiTkXV7y5G7ue6DmoUuYIBCQO20DcVR4B9WvCHHNGwt8qTxOzw" alt="Article thumbnail" />
                                </div>
                                <h4 className="related-title">The Myth of Multitasking in Depth</h4>
                                <p className="related-read-time">5 min read</p>
                            </a>
                            <a href="#" className="related-post">
                                <div className="related-thumb">
                                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzz61uu1XGNi6Hd_w9H073nAnSUhWm2dXLBAQhjolnNXdewKjLZcp7be9QHC-MA3SsXhynxma26_n-SwMLgT0RNMB-_V2M3dyBqN02C9RWhAvSfKnwA33D34Wcf_IMh9jhlZyw4ajpUjhd8i-vQKQvzge4B9KL32fPAIFDQAvsBV0c6qKtDbOR80uxuaClC9Aga1keoIUDIdGgIWfhOL0lLyfDzscrBm2DzoYFjb3KJPWCTBg1aUQVGM8RBeAWjzGVvIYMJVS8rw" alt="Article thumbnail" />
                                </div>
                                <h4 className="related-title">Audio Rhythms and Focus Flow</h4>
                                <p className="related-read-time">12 min read</p>
                            </a>
                        </div>

                        <a href="#" className="sidebar-back">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back to Journal
                        </a>
                    </aside>
                </div>
            </div>
        </div>
    );
}
