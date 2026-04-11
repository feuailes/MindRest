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
  ),
  // --- Emoji replacements ---
  ChartUp: () => (
    <svg width="32" height="32" fill="none" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" fill="none" stroke="#2A9D8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Alert: () => (
    <svg width="14" height="14" fill="none" stroke="#F4A261" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Fire: () => (
    <svg width="28" height="28" fill="none" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 2c0 0-5 5-5 10a5 5 0 0 0 10 0c0-5-5-10-5-10z" />
      <path d="M12 12c0 0-2 2-2 4a2 2 0 0 0 4 0c0-2-2-4-2-4z" fill="#d97706" stroke="none" />
    </svg>
  ),
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/dashboard", {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      const result = await response.json();
      setData(result);
    } catch (err) { console.error("Dashboard fetch failed", err); }
    finally { setLoading(false); }
  };

  const fetchInsight = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/dashboard/insight", {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
      });
      const result = await response.json();
      setAiInsight(result.ai_insight);
    } catch (err) { console.error("Insight fetch failed", err); }
    finally { setInsightLoading(false); }
  };

  useEffect(() => {
    fetchDashboard();
    fetchInsight(); // fires in parallel — doesn't block render
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

  const healthData = data?.digital_health_score || { score: 0, label: 'No Data', color: '#94A3B8' };

  return (
    <div className="smooth-container" style={styles.pageContainer}>

      {/* ─── AI INSIGHT BANNER ─── */}
      <div style={{
        padding: '14px 24px',
        background: 'linear-gradient(135deg, #f3e8ff 0%, #ecfdf5 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(167,139,250,0.2)',
        display: 'flex', alignItems: 'center', gap: '14px',
        marginBottom: '20px',
        boxShadow: '0 8px 24px -10px rgba(139,92,246,0.12)'
      }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ color: '#8b5cf6', fontSize: '22px' }}>psychology</span>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 2px', fontSize: '8px', fontWeight: '900', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Daily AI Insight</p>
          {insightLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '4px' }}>
              <div className="shimmer" style={{ height: '10px', borderRadius: '6px', width: '80%' }} />
              <div className="shimmer" style={{ height: '10px', borderRadius: '6px', width: '60%' }} />
            </div>
          ) : (
            <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#1e293b', lineHeight: '1.5' }}>{aiInsight}</p>
          )}
        </div>
      </div>

      {/* ─── TINY BACK ARROW (above insight, inline) ─── */}
      <div style={{ marginBottom: '8px' }}>
        <button
          onClick={() => navigate('/')}
          title="Go Home"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94A3B8', padding: '4px',
            display: 'flex', alignItems: 'center',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#1e293b'}
          onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
        >
          <Icons.Back />
        </button>
      </div>

      {/* ─── DAILY GLOW ─── */}
      <div className="daily-glow" style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: `radial-gradient(circle, ${dynContent.theme}12 0%, transparent 70%)`,
        filter: 'blur(80px)', zIndex: 0, pointerEvents: 'none',
        animation: 'pulseGlow 8s infinite alternate ease-in-out'
      }} />

      {/* ─── MAIN LAYOUT: Panel + Sidebar ─── */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', position: 'relative', zIndex: 10 }}>

        {/* ════ LEFT: MAIN PANEL ════ */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* STATS BAR */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: 'Journals',  value: totalEntries,   icon: <Icons.Journal />,  color: '#475569' },
              { label: 'Exercises', value: totalExercises, icon: <Icons.Exercise />, color: '#2A9D8F' },
              { label: 'Games',     value: totalGames,     icon: <Icons.Game />,     color: '#8b5cf6' },
              { label: 'Streak',    value: `${streak}d`,   icon: <Icons.Streak />,   color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="premium-card stat-chip" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 20px' }}>
                <div style={{ color: s.color }}>{s.icon}</div>
                <div>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ margin: 0, fontSize: '8px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* DIGITAL HEALTH SCORE HERO */}
          <div className="premium-card" style={{
            padding: '32px 40px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px',
            border: `1px solid ${healthData.color}20`,
            boxShadow: `0 20px 50px -20px ${healthData.color}15`
          }}>
            <div style={{ marginBottom: '4px' }}>
              <p style={{ margin: '0 0 2px', fontSize: '9px', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Digital Health Score</p>
            </div>
            <div style={{ position: 'relative', width: '150px', height: '150px' }}>
              <svg width="150" height="150" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="75" cy="75" r="65" fill="none" stroke="#F1F5F9" strokeWidth="11" />
                <circle cx="75" cy="75" r="65" fill="none" stroke={healthData.color} strokeWidth="11"
                  strokeDasharray={408} strokeDashoffset={408 - (healthData.score * 4.08)} strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.8rem', fontWeight: '900', margin: 0, color: '#1e293b' }}>{healthData.score}</h1>
                <p style={{ fontSize: '9px', fontWeight: '800', margin: 0, color: '#94A3B8', textTransform: 'uppercase' }}>/ 100</p>
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '0 0 6px', color: healthData.color }}>{healthData.label}</h2>
              <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '480px', lineHeight: '1.7', fontWeight: '500' }}>
                Combines your <strong>mood stability</strong> (from assessments) and <strong>engagement score</strong> (journals, exercises, games).
              </p>
            </div>
            {/* Score Key Legend */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '4px' }}>
              {[['≥ 86', 'Excellent', '#2A9D8F'], ['66–85', 'Good', '#4ADE80'], ['41–65', 'Fair', '#F4A261'], ['0–40', 'At Risk', '#ef4444']].map(([range, label, color]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color }} />
                  <span style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>{range} · {label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TREND GRID: Exhaustion Chart (left) | Digital Balance (right-below) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            {/* Exhaustion Trend */}
            <div className="premium-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={styles.cardTitle}>Exhaustion Trend</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>Longitudinal view of your mental load</p>
                </div>
                <span style={{
                  padding: '5px 14px', borderRadius: '20px',
                  backgroundColor: `${dynContent.theme}15`, fontSize: '10px',
                  color: dynContent.theme, fontWeight: '900',
                  border: `1px solid ${dynContent.theme}30`
                }}>● {dynContent.loadLabel.toUpperCase()} LOAD</span>
              </div>
              <div style={{ height: '260px', minHeight: 0 }}>
                {hasData ? (
                  <DriftChart data={recentMoods} />
                ) : (
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '2px dashed #E2E8F0', borderRadius: '16px' }}>
                    <Icons.ChartUp />
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>No mood data yet</p>
                    <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', textAlign: 'center', fontWeight: '600' }}>Complete an assessment to start tracking your exhaustion trend.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Digital Balance — below chart */}
            <div className="premium-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={styles.cardTitle}>Digital Balance</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>Screen exposure vs. rest from latest assessment</p>
                </div>
              </div>
              {latestAssessment?.sleep_hours ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#E76F51', display: 'flex', alignItems: 'center', gap: '5px' }}><Icons.Phone /> Screen: {screenHrs}h</span>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#2A9D8F', display: 'flex', alignItems: 'center', gap: '5px' }}><Icons.Moon /> Rest: {sleepHrs}h</span>
                  </div>
                  <div style={{ display: 'flex', width: '100%', height: '14px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#F1F5F9' }}>
                    <div style={{ width: `${screenPercent}%`, backgroundColor: '#E76F51', transition: 'width 1s ease' }} />
                    <div style={{ width: `${sleepPercent}%`, backgroundColor: '#2A9D8F', transition: 'width 1s ease' }} />
                  </div>
                  <p style={{ marginTop: '10px', fontSize: '11px', color: '#94A3B8', textAlign: 'center', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    {sleepHrs >= screenHrs
                      ? <><Icons.Check /> Great — rest is outweighing screen time.</>
                      : <><Icons.Alert /> Ideally your rest should outweigh your screen time.</>
                    }
                  </p>
                </div>
              ) : (
                <div style={styles.emptyState}>Complete an assessment to unlock this view</div>
              )}
            </div>
          </div>

          {/* ── WELLNESS FOUNDATIONS ── */}
          <div style={{ marginTop: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Wellness Foundations</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            </div>

            <div className="premium-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={styles.cardTitle}>Mood–Sleep Correlation</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>How your rest patterns affect your daily mood — 7 day view</p>
                </div>
                <span style={{ fontSize: '9px', fontWeight: '900', color: '#94A3B8', backgroundColor: '#F8FAFF', padding: '4px 12px', borderRadius: '20px', border: '1px solid #E2E8F0' }}>7 DAY INSIGHT</span>
              </div>
              <div style={{ height: '260px' }}>
                <CorrelationChart history={data?.history} />
              </div>
            </div>
          </div>

        </div>

        {/* ════ RIGHT: TRACKING SIDEBAR ════ */}
        <div style={{ width: '260px', flexShrink: 0, position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div className="premium-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ ...styles.cardTitle, fontSize: '0.8rem' }}>Tracking History</h3>
              <Link to="/assessment" style={{ fontSize: '9px', fontWeight: '800', color: '#8b5cf6', textDecoration: 'none' }}>+ NEW</Link>
            </div>
            <p style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '600', marginBottom: '12px' }}>Your last 5 wellness assessments</p>

            {data?.assessment_history?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {data.assessment_history.slice(0, 5).map((h, i) => {
                  const riskColor = h.risk_level === 'High' ? '#ef4444' : h.risk_level === 'Moderate' ? '#F4A261' : '#2A9D8F';
                  return (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: '12px',
                      backgroundColor: `${riskColor}08`, border: `1px solid ${riskColor}20`
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: riskColor, flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>{h.risk_level}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700' }}>
                        {h.created_at ? new Date(h.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#CBD5E1', fontSize: '11px', fontWeight: '700', border: '2px dashed #E2E8F0', borderRadius: '12px' }}>
                No history yet
              </div>
            )}
          </div>

          {/* Streak mini-card */}
          <div className="premium-card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid rgba(251,191,36,0.2)' }}>
            <Icons.Fire />
            <div>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900', color: '#92400e', lineHeight: 1 }}>{streak}<span style={{ fontSize: '12px', fontWeight: '700' }}> days</span></p>
              <p style={{ margin: 0, fontSize: '9px', fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Streak</p>
            </div>
          </div>

          {/* Risk level indicator */}
          <div className="premium-card" style={{ padding: '18px 20px', background: `${dynContent.theme}10`, border: `1px solid ${dynContent.theme}25` }}>
            <p style={{ margin: '0 0 6px', fontSize: '9px', fontWeight: '900', color: dynContent.theme, textTransform: 'uppercase', letterSpacing: '1px' }}>Current Load</p>
            <p style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: '900', color: '#1e293b' }}>{dynContent.loadLabel}</p>
            <p style={{ margin: 0, fontSize: '10px', color: '#64748B', fontWeight: '600', lineHeight: '1.5' }}>{dynContent.reason}</p>
          </div>

        </div>

      </div>

      <style>{`
        .smooth-container { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseGlow { from { opacity: 0.4; transform: translate(-50%, -50%) scale(0.95); } to { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); } }

        @keyframes shimmerMove {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 600px 100%;
          animation: shimmerMove 1.4s infinite linear;
        }

        .premium-card {
          background: rgba(255,255,255,0.9);
          border-radius: 24px;
          border: 1px solid rgba(226,232,240,0.7);
          box-shadow: 0 6px 30px -8px rgba(15,23,42,0.05);
          transition: box-shadow 0.3s ease, transform 0.3s ease;
          backdrop-filter: blur(12px);
        }
        .premium-card:hover {
          box-shadow: 0 16px 40px -12px rgba(15,23,42,0.1);
          transform: translateY(-2px);
        }
        .stat-chip { border-radius: 18px !important; }

        .back-btn { background: transparent; border: none; cursor: pointer; }
        .back-btn:hover { color: #0f172a !important; transform: translateX(-3px); }

        .full-prediction-btn {
          background: #0f172a; color: #fff;
          border: none; border-radius: 14px;
          cursor: pointer; font-weight: 800;
          transition: all 0.2s ease; width: 100%; text-align: center;
        }
        .full-prediction-btn:hover { background: #1e293b; transform: translateY(-1px); }

        @media (max-width: 960px) {
          .dashboard-sidebar { display: none; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '14px', fontWeight: '700' },
  pageContainer: { backgroundColor: '#F8FAFB', minHeight: 'calc(100vh - 120px)', padding: '24px 5%', boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  backBtn: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontWeight: '800', fontSize: '11px', transition: '0.2s', padding: 0 },
  cardTitle: { fontSize: '0.9rem', fontWeight: '800', margin: 0, color: '#1e293b' },
  emptyState: { padding: '24px', textAlign: 'center', color: '#CBD5E1', fontSize: '11px', fontWeight: '700', border: '2px dashed #E2E8F0', borderRadius: '12px' },
};