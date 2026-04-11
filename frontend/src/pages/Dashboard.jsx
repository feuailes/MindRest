import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DriftChart from "../components/Driftchart";
import CorrelationChart from "../components/CorrelationChart";

// Custom SVG Icons
const Icons = {
  Back: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  Journal: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  ),
  Exercise: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M4 12V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path>
      <path d="M4 22v-4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"></path>
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M2 12h20"></path>
    </svg>
  ),
  Game: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="2" y="6" width="20" height="12" rx="4" ry="4"></rect>
      <circle cx="16" cy="10" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
      <circle cx="18" cy="12" r="1"></circle>
      <circle cx="14" cy="12" r="1"></circle>
      <line x1="6" y1="12" x2="10" y2="12"></line>
      <line x1="8" y1="10" x2="8" y2="14"></line>
    </svg>
  ),
  Streak: () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c-2.28 0-3-1.5-3-3s3-5 3-5s-1 3-1 3" />
      <path d="M12 21a6 6 0 006-6c0-4-3-6-3-6s-1 2-1 2c-1.5 0-2.5-1.5-2.5-3 0 0-3 3-3 7a6 6 0 003.5 5.5z" />
    </svg>
  )
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/dashboard", {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      const result = await response.json();
      setData(result);
    } catch (err) { console.error("Failed", err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div style={styles.loader}>Initializing details...</div>;

  const recentMoods = data?.mood_trend || [];
  const hasData = recentMoods.length > 0;

  const latestAssessment = data?.latest_assessment || {};
  const riskLevelRaw = latestAssessment?.risk_level || "Low";
  const score = data?.mood_trend?.[data.mood_trend.length - 1]?.score || data?.mood_score || 0;

  // Real data parsing from backend Assessment table
  const sleepHrs = latestAssessment?.sleep_hours || 0;
  const screenHrs = latestAssessment?.screen_time || 0;
  const totalBalanceHrs = sleepHrs + screenHrs || 1; // avoid division by 0
  const sleepPercent = (sleepHrs / totalBalanceHrs) * 100;
  const screenPercent = (screenHrs / totalBalanceHrs) * 100;

  const totalEntries = data?.journal_count || 0;
  const totalExercises = data?.exercise_count || 0;
  const totalGames = data?.game_count || 0;
  const streak = data?.streak || 0;

  const getDynamicContent = (risk, scoreNum, journals, exercises, games) => {
    const riskStr = risk.toLowerCase();
    const isHighRisk = scoreNum >= 8 || riskStr.includes("high");
    const isModerate = scoreNum >= 4 || riskStr.includes("moderate");

    const lowActivity = exercises + games < 1;
    const noJournals = journals === 0;

    let reason = "Balanced routine maintained.";
    let theme = "#2A9D8F"; // Teal
    let loadLabel = "Optimal";

    // Build smart insight
    if (isHighRisk) {
      theme = "#ef4444"; // Red
      loadLabel = "High";
      if (lowActivity) {
        reason = "Stress high due to low exercise and limited rest patterns.";
      } else {
        reason = "Stress high despite activity. Deep rest is recommended.";
      }
    } else if (isModerate) {
      theme = "#E76F51"; // Orange
      loadLabel = "Elevated";
      if (lowActivity) {
        reason = "Stress rising. Lacking regular mental and physical activity.";
      } else {
        reason = "Slightly elevated stress patterns detected.";
      }
    } else {
      if (!lowActivity) {
        reason = "Improving due to regular activity and balanced routines.";
      } else if (noJournals) {
        reason = "Stress is low, but start journaling to unlock your full profile.";
      } else {
        reason = "Routines are stable. Keep up the excellent work.";
      }
    }

    return { theme, loadLabel, reason };
  };

  const dynContent = getDynamicContent(riskLevelRaw, score, totalEntries, totalExercises, totalGames);

  return (
    <div className="smooth-container" style={styles.pageContainer}>
      <div style={styles.wrapper}>

        {/* COMPACT HEADER */}
        <div style={{ ...styles.headerRow, marginBottom: '20px', position: 'relative', zIndex: 10 }}>
          <button onClick={() => navigate('/')} className="back-btn" style={styles.backBtn}>
            <Icons.Back /> Home
          </button>
        </div>

        {/* DAILY GLOW BACKGROUND (Atmospheric) */}
        <div
          className="daily-glow"
          style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '60vw', height: '60vw', borderRadius: '50%',
            background: `radial-gradient(circle, ${dynContent.theme}15 0%, transparent 70%)`,
            filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
            animation: 'pulseGlow 8s infinite alternate ease-in-out'
          }}
        />

        {/* MINIMALIST STATS BAR */}
        <div className="dashboard-grid stats-grid" style={{ ...styles.grid, gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '15px', position: 'relative', zIndex: 10 }}>
          {[
            { label: "Journals", value: totalEntries, icon: <Icons.Journal />, color: "#475569" },
            { label: "Exercises", value: totalExercises, icon: <Icons.Exercise />, color: "#2A9D8F" },
            { label: "Games", value: totalGames, icon: <Icons.Game />, color: "#8b5cf6" },
            { label: "Streak", value: `${streak}d`, icon: <Icons.Streak />, color: "#f59e0b" }
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(241, 245, 249, 0.5)' }}>
              <div style={{ color: stat.color, opacity: 0.8 }}>{stat.icon}</div>
              <div>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>{stat.value}</p>
                <p style={{ margin: 0, fontSize: '7px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 2 COLUMN GRID */}
        <div className="dashboard-grid main-grid" style={{ position: 'relative', zIndex: 10 }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: 0 }}>
            {/* EXHAUSTION TREND (EXPANDED) */}
            <div className="premium-card" style={{ ...styles.card, padding: '10px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Exhaustion Trend</h3>
                <span style={{ fontSize: '9px', color: dynContent.theme, fontWeight: '800' }}>● {dynContent.loadLabel.toUpperCase()}</span>
              </div>
              <div style={{ minHeight: '260px' }}>
                <DriftChart
                  data={hasData ? recentMoods : [
                    { created_at: "2024-01-01", score: 2 },
                    { created_at: "2024-01-02", score: 5 },
                    { created_at: "2024-01-03", score: 3 },
                    { created_at: "2024-01-04", score: 8 },
                    { created_at: "2024-01-05", score: 4 },
                    { created_at: "2024-01-06", score: 7 },
                    { created_at: "2024-01-07", score: 5 }
                  ]}
                />
              </div>
            </div>

            {/* DIGITAL BALANCE */}
            <div className="premium-card" style={{ ...styles.card, padding: '15px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', minHeight: '120px' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Digital Balance</h3>
              </div>
              {latestAssessment?.sleep_hours ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '11px', fontWeight: '800' }}>
                    <span style={{ color: '#E76F51' }}>Screen: {screenHrs}h</span>
                    <span style={{ color: '#2A9D8F' }}>Sleep: {sleepHrs}h</span>
                  </div>
                  <div style={styles.balanceBarBg}>
                    <div style={{ ...styles.balanceBarFill, width: `${screenPercent}%`, backgroundColor: '#E76F51' }} />
                    <div style={{ ...styles.balanceBarFill, width: `${sleepPercent}%`, backgroundColor: '#2A9D8F' }} />
                  </div>
                </div>
              ) : (
                <div style={styles.emptyState}>
                  Complete an assessment to see balance
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: 0 }}>
            {/* AI SUMMARY */}
            <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)' }}>
              <div style={{ ...styles.insightTop, padding: '15px', backgroundColor: dynContent.theme + 'dd' }}>
                <p style={styles.insightTag}>NEURAL AI</p>
                <h2 style={{ ...styles.insightQuote, fontSize: '1.2rem' }}>"{dynContent.reason}"</h2>
              </div>
              <div style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={styles.miniGauge}>
                  <svg width="50" height="50">
                    <circle cx="25" cy="25" r="20" fill="transparent" stroke="#F1F5F9" strokeWidth="6" />
                    <circle cx="25" cy="25" r="20" fill="transparent" stroke={dynContent.theme} strokeWidth="6"
                      strokeDasharray={125} strokeDashoffset={125 - (Math.min(score * 12.5, 125))} strokeLinecap="round"
                      transform="rotate(-90 25 25)" />
                  </svg>
                  <div style={styles.miniGaugeText}>{Math.min(score * 10, 100).toFixed(0)}%</div>
                </div>
                <button onClick={() => navigate(latestAssessment?.id ? '/result' : '/assessment')} className="full-prediction-btn" style={{ padding: '8px', fontSize: '11px' }}>
                  Open Analysis
                </button>
              </div>
            </div>

            {/* RECENT LOGS (RESTORED) */}
            <div className="premium-card" style={{ padding: '12px 15px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Recent Logs</h3>
                <Link to="/journal" style={styles.linkBtn}>ALL ➔</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {data?.recent_journals?.slice(0, 2).map((j, i) => (
                  <div key={i} style={{ ...styles.historyRow, padding: '8px 12px' }}>
                    <p style={{ margin: 0, fontSize: '11px', fontWeight: '800' }}>{j.title}</p>
                    <span style={{ fontSize: '9px', color: '#94A3B8' }}>{new Date(j.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TRACKING HISTORY */}
            <div className="premium-card" style={{ ...styles.card, padding: '15px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', minHeight: '135px' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Tracking History</h3>
                <Link to="/assessment" style={{ ...styles.linkBtn, textDecoration: 'none' }}>LATEST ➔</Link>
              </div>
              {data?.assessment_history?.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {data.assessment_history.slice(0, 3).map((h, i) => (
                    <div key={i} style={styles.historyRow}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: h.risk_level === "High" ? "#ef4444" : h.risk_level === "Moderate" ? "#E76F51" : "#2A9D8F" }} />
                        <p style={{ margin: 0, fontSize: '11px', fontWeight: '800' }}>{h.risk_level}</p>
                      </div>
                      <span style={{ fontSize: '9px', color: '#94A3B8' }}>
                        {h.created_at ? new Date(h.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.emptyState}>
                  No tracking history yet
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FULL WIDTH CORRELATION CHART */}
        <div style={{ marginTop: '20px', position: 'relative', zIndex: 10 }}>
            <div className="premium-card" style={{ ...styles.card, padding: '20px', backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', minHeight: '300px' }}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Mood-Sleep Correlation Analysis</h3>
                <span style={{ fontSize: '9px', color: '#94A3B8', fontWeight: '800' }}>14 DAY INSIGHT</span>
              </div>
              <div style={{ height: '240px' }}>
                <CorrelationChart history={data?.history} />
              </div>
              <p style={{ margin: '15px 0 0', fontSize: '10px', color: '#64748B', fontStyle: 'italic', textAlign: 'center' }}>
                Higher Sleep hours typically correlate with more stable mood patterns.
              </p>
            </div>
        </div>
      </div>

      <style>
        {`
        html, body {
           scroll-behavior: smooth;
        }
        
        .smooth-container {
           animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
           0% { opacity: 0; transform: translateY(10px); }
           100% { opacity: 1; transform: translateY(0); }
        }

        .dashboard-grid {
           display: grid;
           gap: 30px;
           margin-bottom: 30px;
        }
        .stats-grid {
           gap: 20px;
        }
        .main-grid {
           grid-template-columns: 1.2fr 1fr;
        }
        @media (max-width: 900px) {
           .main-grid {
              grid-template-columns: 1fr;
           }
        }

        .premium-card {
           background-color: #fff;
           padding: 30px;
           border-radius: 28px;
           border: 1px solid rgba(226, 232, 240, 0.6);
           box-shadow: 0 10px 40px -10px rgba(15, 23, 42, 0.04);
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card {
           padding: 22px 25px !important;
           border-radius: 24px !important;
        }
        .premium-card:hover {
           transform: translateY(-5px);
           box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.08);
           border-color: rgba(226, 232, 240, 1);
        }

        .back-btn {
           background: transparent;
           border: none;
           cursor: pointer;
        }
        .back-btn:hover {
           color: #0f172a !important;
           transform: translateX(-3px);
        }

        .full-prediction-btn:hover {
           background-color: #f1f5f9;
           outline-offset: 1px !important;
        }
        
        .empty-btn:hover {
           transform: translateY(-2px);
           box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
      `}
      </style>
    </div>
  );
}

const styles = {
  loader: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B" },
  pageContainer: { backgroundColor: "#F8FAFB", minHeight: "calc(100vh - 160px)", padding: "20px 4%", boxSizing: "border-box" },
  wrapper: { maxWidth: "1400px", margin: "0 auto", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: '15px' },
  card: { borderRadius: '24px', border: '1px solid rgba(241, 245, 249, 0.5)' },

  headerRow: { marginBottom: "5px" },
  backBtn: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontWeight: '800', fontSize: '11px', transition: '0.2s', padding: 0 },

  grid: { display: "grid", gap: "12px" },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'center' },
  cardTitle: { fontSize: '0.9rem', fontWeight: '800', margin: 0, color: '#1e293b' },

  // Stats
  statIcon: { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 },
  statValue: { fontSize: "1rem", fontWeight: "900", color: "#0f172a", margin: "0 0 1px 0", letterSpacing: '-0.5px' },
  statLabel: { fontSize: "8px", fontWeight: "800", color: "#94A3B8", margin: 0, textTransform: "uppercase", letterSpacing: '0.5px' },

  // Empty State - Glass style
  emptyState: { height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc", borderRadius: "12px", color: "#64748B", fontSize: "11px", fontWeight: "600", border: '2px dashed #cbd5e1' },
  emptyBtn: { marginTop: "10px", padding: "8px 20px", backgroundColor: "#0f172a", color: "#fff", textDecoration: "none", borderRadius: "8px", fontSize: "10px", fontWeight: "800", transition: 'all 0.2s' },

  // Digital Balance Widget
  balanceBarBg: { display: 'flex', width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' },
  balanceBarFill: { height: '100%', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' },

  // Insight UI
  insightTop: { padding: '15px 20px', color: '#fff' },
  insightTag: { fontSize: '8px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px' },
  insightQuote: { fontSize: '1.1rem', fontWeight: '300', fontStyle: 'italic', margin: 0, lineHeight: '1.2', letterSpacing: '-0.5px' },

  miniGauge: { position: 'relative', width: '45px', height: '45px', flexShrink: 0 },
  miniGaugeText: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: '900', fontSize: '11px' },

  fullPredictionBtn: { backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#1e293b', padding: '8px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', outline: '2px solid transparent', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', width: '100%', textAlign: 'center' },
  helperText: { marginTop: '8px', fontSize: '9px', color: '#94A3B8', textAlign: 'center', fontWeight: '600' },
  historyRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: 'rgba(248, 250, 252, 0.5)', borderRadius: '10px', border: '1px solid rgba(241, 245, 249, 0.5)' },
  linkBtn: { background: 'none', border: 'none', padding: 0, fontSize: '9px', color: '#64748B', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.5px' }
};