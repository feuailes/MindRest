import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DriftChart from "../components/Driftchart";
import ScreenExhaustionChart from "../components/ScreenExhaustionChart";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend, 
  Filler
);

// Standardized SVG Icons
const Icons = {
  Home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Overview: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
  ),
  History: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 0-10 10"/></svg>
  ),
  Analytics: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
  ),
  Logout: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
  ),
  Streak: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3s1-5 1-5-3 3-3 3"/><path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-3-6s-1 2-1 2-1.5-1.5-1.5-3c0 0-3 3-3 7a6 6 0 0 0 3.5 5.5z"/></svg>
  ),
  Activity: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  Mood: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
  )
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    navigate("/");
  };

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
    fetchInsight();
  }, []);

  if (loading) return (
    <div className="loader-container">
      <div className="loader-pulse"></div>
      <p>Initializing Neural Flow...</p>
      <style>{`
        .loader-container { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; color: #64748b; font-weight: 700; gap: 20px; }
        .loader-pulse { width: 50px; height: 50px; background: #264653; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0.8; } 100% { transform: scale(0.8); opacity: 0.5; } }
      `}</style>
    </div>
  );

  const latestAssessment = data?.latest_assessment || {};
  const score = data?.mood_trend?.[data.mood_trend.length - 1]?.score || data?.mood_score || 0;
  const streak = data?.streak || 0;
  const healthData = data?.digital_health_score || { score: 0, label: 'No Data', color: '#94A3B8' };
  const userName = data?.user?.name || localStorage.getItem("userName") || "User";

  const getDynamicContent = (risk, scoreNum) => {
    const riskStr = (risk || "Low").toLowerCase();
    const isHighRisk = scoreNum >= 8 || riskStr.includes("high");
    const isModerate = scoreNum >= 4 || riskStr.includes("moderate");
    let theme = "#2A9D8F"; let loadLabel = "Optimal"; let reason = "Balanced routine.";
    if (isHighRisk) { theme = "#ef4444"; loadLabel = "High"; reason = "Deep rest needed."; }
    else if (isModerate) { theme = "#E76F51"; loadLabel = "Elevated"; reason = "Slight stress."; }
    return { theme, loadLabel, reason };
  };

  const dynContent = getDynamicContent(latestAssessment?.risk_level, score);

  // GAUGE DATA (Full Circle)
  const gaugeData = {
    datasets: [{
      data: [healthData.score, 100 - healthData.score],
      backgroundColor: [healthData.color, '#F1F5F9'],
      borderWidth: 0,
      cutout: '82%',
      borderRadius: 10,
    }]
  };

  // EXHAUSTION TREND DATA
  const trendData = {
    labels: data?.mood_trend?.map(m => new Date(m.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })) || [],
    datasets: [{
      label: 'Mental Load',
      data: data?.mood_trend?.map(m => m.score) || [],
      fill: true,
      borderColor: '#264653',
      backgroundColor: 'rgba(38, 70, 83, 0.05)',
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#264653',
    }]
  };

  const renderSidebar = () => (
    <div className="dashboard-sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="brand-primary">Mind</span><span className="brand-accent">Rest</span>
        </div>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">{userName.charAt(0)}</div>
        <div className="profile-info">
          <p className="profile-name">{userName}</p>
          <p className="profile-status">Premium Tier</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {[
          { id: 'overview', label: 'Overview', icon: <Icons.Overview /> },
          { id: 'history', label: 'History', icon: <Icons.History /> },
          { id: 'analytics', label: 'Analytics', icon: <Icons.Analytics /> },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <Link to="/" className="nav-item home-nav-link">
          <Icons.Home />
          <span>Home</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="nav-item logout-btn">
          <Icons.Logout />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="tab-content animate-fade-in">
      <div className="content-header">
        <h1>Welcome back, {userName.split(" ")[0]}</h1>
        <p className="subtitle">Visualizing your neural wellness foundations.</p>
      </div>

      {/* STATS STRIP */}
      <div className="stats-row">
        {[
          { label: 'Streak', value: `${streak} days`, icon: <Icons.Streak />, color: '#d97706' },
          { label: 'Exhaustion', value: dynContent.loadLabel, icon: <Icons.Mood />, color: dynContent.theme },
          { label: 'Activity', value: `${(data?.journal_count || 0) + (data?.exercise_count || 0) + (data?.game_count || 0)} Logs`, icon: <Icons.Activity />, color: '#264653' },
          { label: 'Mood Score', value: score.toFixed(1), icon: <Icons.Mood />, color: '#8b5cf6' },
        ].map((stat, i) => (
          <div key={i} className="mini-stat-card">
            <div className="stat-icon-box" style={{ color: stat.color, background: `${stat.color}10` }}>{stat.icon}</div>
            <div className="stat-text-box">
              <span className="stat-val">{stat.value}</span>
              <span className="stat-lab">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* TREND CHART */}
      <div className="trend-container card">
        <div className="card-header">
          <h3 className="card-title">7-Day Exhaustion Trend</h3>
          <span className="trend-badge">Analysis Live</span>
        </div>
        <div className="chart-box" style={{ height: '220px' }}>
          <Line data={trendData} options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 10, display: false }, x: { grid: { display: false } } },
            plugins: { legend: { display: false } }
          }} />
        </div>
      </div>

      <div className="bento-grid">
        {/* FULL CIRCLE GAUGE */}
        <div className="card bento-card gauge-bento">
          <h3 className="card-title">Digital Health</h3>
          <div className="gauge-full-box">
             <Doughnut data={gaugeData} options={{ cutout: '82%', plugins: { tooltip: { enabled: false }, legend: { display: false } } }} />
             <div className="gauge-full-info">
                <span className="g-score">{healthData.score}</span>
                <span className="g-label">{healthData.label}</span>
             </div>
          </div>
          <p className="card-note">Composite wellness score based on mood stability and daily neural engagement.</p>
        </div>

        {/* AI INSIGHT */}
        <div className="card bento-card ai-bento">
           <h3 className="card-title">Neural Insights</h3>
           <div className="ai-content">
              <div className="ai-pulp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M12 7v5l2 2"/></svg>
              </div>
              <div className="ai-text-box">
                 {insightLoading ? <div className="shimmer-text">Refining insights...</div> : <p>"{aiInsight}"</p>}
              </div>
           </div>
           <div className="quick-nav-box">
              <Link to="/assessment" className="primary-action">New Assessment</Link>
              <div className="secondary-row">
                 <Link to="/games" className="nav-btn-sec">Mind Games</Link>
                 <Link to="/exercises" className="nav-btn-sec">Exercises</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="tab-content animate-fade-in">
      <div className="content-header">
        <h1>Tracking History</h1>
        <p className="subtitle">Historical log of your mental load and activities.</p>
      </div>

      {/* WEEKLY REVIEW CARD */}
      {data?.weekly_review && (
        <div className="card weekly-review-card animate-fade-in shadow-premium">
          <div className="weekly-header">
             <div className="weekly-title-group">
                <span className="weekly-badge">Weekly Review</span>
                <h2 className="weekly-main-title">Focus & Resilience Summary</h2>
             </div>
             <div className="improvement-badge" style={{ background: data.weekly_review.improvement_pct >= 0 ? '#ecfdf5' : '#fef2f2', color: data.weekly_review.improvement_pct >= 0 ? '#059669' : '#ef4444' }}>
                {data.weekly_review.improvement_pct >= 0 ? '↑' : '↓'} {Math.abs(data.weekly_review.improvement_pct)}% vs Last Week
             </div>
          </div>
          
          <div className="weekly-stats-grid">
             <div className="weekly-stat">
                <span className="w-label">Avg Wellness</span>
                <span className="w-val">{data.weekly_review.avg_score}/10</span>
             </div>
             <div className="weekly-stat">
                <span className="w-label">Total Focus</span>
                <span className="w-val">{data.weekly_review.total_focus_minutes}m</span>
             </div>
             <div className="weekly-stat">
                <span className="w-label">Top Mood</span>
                <span className="w-val">{data.weekly_review.top_mood}</span>
             </div>
          </div>
        </div>
      )}

      <div className="card history-card shadow-soft">
        <div className="history-header">
           <span className="h-date">Date</span>
           <span className="h-pred">Result</span>
           <span className="h-act">Daily Activity</span>
           <span className="h-edit"></span>
        </div>
        <div className="history-body">
          {data?.assessment_history?.map((h, i) => {
            const dateStr = h.created_at || h.date;
            let formattedDate = 'Unknown';
            try {
              if (dateStr) {
                const cleanDate = typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr;
                formattedDate = new Date(cleanDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
              }
            } catch (e) { console.error(e); }

            return (
              <div key={i} className="history-row-expanded">
                <div className="history-row-main">
                  <span className="h-date">{formattedDate}</span>
                  <span className="h-pred">
                    <span className="p-badge" style={{ color: h.risk_level === 'High' ? '#ef4444' : h.risk_level === 'Moderate' ? '#f59e0b' : '#10b981' }}>
                      {h.risk_level || 'At Risk'}
                    </span>
                    <span className="h-score-mini">{h.mood_rating}/10</span>
                  </span>
                  <span className="h-act">
                    {h.activities?.map((act, id) => (
                      <span key={id} className="act-pill-premium" title={`${act.duration} minutes`}>
                        {act.type === 'game' ? '🎯' : '🧘'} {act.name} <small>{act.duration}m</small>
                      </span>
                    ))}
                    {h.journals_count > 0 && <span className="act-pill-premium vibey">📝 {h.mood_tag || 'Logged'}</span>}
                    {(!h.activities?.length && !h.journals_count) && <span className="no-act">Assessment Only</span>}
                  </span>
                  <div className="h-edit">
                    <Link to="/result" state={{ passedRisk: h.risk_level }} className="h-link">Details</Link>
                  </div>
                </div>
              </div>
            );
          })}
          {!data?.assessment_history?.length && <div className="empty-state">No wellness records found yet.</div>}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => {
    // Calculate load distribution
    const history = data?.assessment_history || [];
    const high = history.filter(h => h.risk_level === 'High').length;
    const moderate = history.filter(h => h.risk_level === 'Moderate').length;
    const optimal = history.length - high - moderate;

    const distributionData = {
      labels: ['High', 'Moderate', 'Optimal'],
      datasets: [{
        data: [high, moderate, Math.max(0, optimal)],
        backgroundColor: ['#ef4444', '#E76F51', '#2A9D8F'],
        borderWidth: 0,
        hoverOffset: 4
      }]
    };

    return (
      <div className="tab-content animate-fade-in">
        <div className="content-header">
          <h1>Analytics</h1>
          <p className="subtitle">Analysis of your wellness data.</p>
        </div>
        <div className="analytics-grid">
           <div className="card bento-card chart-card">
              <h3 className="card-title">Exhaustion Distribution</h3>
              <div className="chart-wrapper pie-container">
                <Doughnut data={distributionData} options={{ maintainAspectRatio: false }} />
              </div>
              <p className="chart-note">Frequency of your mental load states.</p>
           </div>
           
           <div className="card bento-card chart-card">
              <h3 className="card-title">Emotional Drift</h3>
              <div className="chart-wrapper"><DriftChart data={data?.mood_trend || []} /></div>
           </div>
           
           <div className="card bento-card chart-card full-width-chart shadow-soft">
              <h3 className="card-title">Neural Load Correlation</h3>
              <p className="chart-subtitle">Screen Time vs Exhaustion Level</p>
              <div className="chart-wrapper">
                 <ScreenExhaustionChart 
                    history={data?.assessment_history} 
                    currentPoint={data?.assessment_history?.[0] ? { x: data.assessment_history[0].screen_time, y: data.assessment_history[0].mood_rating } : null}
                 />
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-layout">
      {renderSidebar()}
      <main className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'history' && renderHistory()}
        {activeTab === 'analytics' && renderAnalytics()}
      </main>

      <style>{`
        .dashboard-layout { display: flex; min-height: 100vh; background: #fdfdfd; font-family: 'Plus Jakarta Sans', sans-serif; }
        .dashboard-sidebar { width: 280px; background: white; border-right: 1px solid #f1f5f9; display: flex; flex-direction: column; padding: 40px 24px; position: sticky; top: 0; height: 100vh; }
        .dashboard-content { flex: 1; padding: 60px 80px; max-width: 1400px; margin: 0 auto; width: 100%; }

        .sidebar-brand { font-size: 1.5rem; font-weight: 850; text-decoration: none; margin-bottom: 40px; display: block; }
        .brand-primary { color: #264653; }
        .brand-accent { color: #E76F51; }

        .sidebar-profile { display: flex; align-items: center; gap: 15px; padding: 20px; background: #f8fafc; border-radius: 20px; margin-bottom: 40px; }
        .profile-avatar { width: 44px; height: 44px; background: #264653; color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-weight: 900; }
        .profile-name { margin: 0; font-size: 14px; font-weight: 800; color: #1e293b; }
        .profile-status { margin: 0; font-size: 11px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

        .sidebar-nav { display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .nav-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border: none; background: none; border-radius: 16px; font-size: 14px; font-weight: 700; color: #64748b; cursor: pointer; transition: all 0.2s; text-decoration: none; text-align: left; }
        .nav-item:hover { color: #264653; background: #f8fafc; }
        .nav-item.active { background: #264653; color: white; box-shadow: 0 10px 30px -5px rgba(38, 70, 83, 0.2); }
        .home-nav-link { border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 10px; }

        .content-header h1 { font-size: 2.2rem; font-weight: 900; color: #1e293b; margin: 0; letter-spacing: -0.02em; }
        .subtitle { color: #94a3b8; font-size: 1rem; margin: 5px 0 40px; }

        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .mini-stat-card { background: white; padding: 20px; border-radius: 24px; border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 15px; }
        .stat-icon-box { width: 48px; height: 48px; border-radius: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .stat-val { display: block; font-size: 1.1rem; font-weight: 900; color: #1e293b; }
        .stat-lab { font-size: 11px; font-weight: 750; color: #94a3b8; text-transform: uppercase; }

        .card { background: white; border-radius: 32px; border: 1px solid #f1f5f9; padding: 32px; margin-bottom: 30px; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .card-title { margin: 0; font-size: 1.1rem; font-weight: 850; color: #1e293b; }
        .trend-badge { font-size: 10px; font-weight: 900; background: #ecfdf5; color: #059669; padding: 5px 12px; border-radius: 100px; text-transform: uppercase; }

        .bento-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 30px; }
        .analytics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .full-width-chart { grid-column: span 2; }
        .pie-container { display: flex; align-items: center; justify-content: center; }

        .bento-card { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .gauge-full-box { position: relative; width: 200px; height: 200px; margin: 20px 0; }
        .gauge-full-info { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .g-score { font-size: 2.5rem; font-weight: 950; color: #1e293b; line-height: 1; }
        .g-label { font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-top: 5px; }
        .card-note { font-size: 12px; color: #94a3b8; margin-top: 20px; line-height: 1.5; }

        .ai-bento { align-items: stretch; text-align: left; background: #264653; color: white; border: none; }
        .ai-bento .card-title { color: white; opacity: 0.6; }
        .ai-content { display: flex; gap: 20px; margin: 25px 0; background: rgba(255,255,255,0.05); padding: 20px; border-radius: 20px; }
        .ai-pulp { flex-shrink: 0; width: 44px; height: 44px; background: rgba(255,255,255,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .ai-text-box { color: rgba(255,255,255,0.9); font-style: italic; font-size: 15px; margin: 0; line-height: 1.6; }
        
        .quick-nav-box { display: flex; flex-direction: column; gap: 15px; align-items: center; }
        .primary-action { background: #E76F51; color: white; padding: 18px 40px; border-radius: 18px; text-decoration: none; font-weight: 850; font-size: 14px; text-align: center; width: fit-content; }
        .secondary-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 100%; }
        .nav-btn-sec { background: rgba(255,255,255,0.1); color: white; padding: 14px; border-radius: 16px; text-decoration: none; font-size: 12px; font-weight: 750; text-align: center; transition: background 0.2s; }
        .nav-btn-sec:hover { background: rgba(255,255,255,0.2); }

        .history-header { display: flex; padding-bottom: 20px; border-bottom: 2px solid #f8fafc; color: #94a3b8; font-size: 11px; font-weight: 900; text-transform: uppercase; }
        .h-date { flex: 1.5; } .h-pred { flex: 1.5; } .h-act { flex: 3; } .h-edit { flex: 1; }
        .history-row { display: flex; align-items: center; padding: 25px 0; border-bottom: 1px solid #f8fafc; transition: all 0.2s; }
        .history-row:hover { transform: translateX(5px); }
        .p-badge { font-weight: 900; text-transform: uppercase; font-size: 12px; }
        .h-act { display: flex; gap: 10px; flex-wrap: wrap; }
        .act-pill { background: #f8fafc; padding: 4px 10px; border-radius: 100px; font-size: 12px; color: #64748b; font-weight: 750; border: 1px solid #f1f5f9; }
        .h-link { color: #264653; font-weight: 900; text-decoration: none; font-size: 12px; background: #26465310; padding: 8px 16px; border-radius: 12px; transition: 0.2s; }
        .h-link:hover { background: #264653; color: white; }
        .h-edit { text-align: right; }

        .weekly-review-card { background: #264653; color: white; padding: 40px; margin-bottom: 30px; border: none; }
        .weekly-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
        .weekly-main-title { font-size: 1.5rem; font-weight: 900; margin: 10px 0 0; }
        .weekly-badge { font-size: 10px; font-weight: 950; text-transform: uppercase; background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 100px; opacity: 0.8; }
        .improvement-badge { font-size: 11px; font-weight: 900; padding: 6px 14px; border-radius: 100px; display: flex; align-items: center; gap: 5px; }
        .weekly-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 30px; }
        .weekly-stat { display: flex; flex-direction: column; gap: 5px; }
        .w-label { font-size: 11px; font-weight: 750; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        .w-val { font-size: 1.2rem; font-weight: 900; }

        .act-pill-premium { background: #f8fafc; padding: 6px 12px; border-radius: 12px; font-size: 11px; color: #475569; font-weight: 800; border: 1px solid #f1f5f9; display: flex; align-items: center; gap: 6px; }
        .act-pill-premium small { opacity: 0.5; font-size: 9px; }
        .act-pill-premium.vibey { background: #f5f3ff; border-color: #ddd6fe; color: #7c3aed; }
        .h-score-mini { display: block; font-size: 10px; font-weight: 750; color: #94a3b8; margin-top: 4px; }
        .h-row-expanded { border-bottom: 1px solid #f8fafc; }
        .history-row-main { display: flex; align-items: center; padding: 25px 0; }
        .shadow-premium { box-shadow: 0 25px 50px -12px rgba(38, 70, 83, 0.25); }
        .shadow-soft { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); }
        .chart-subtitle { font-size: 11px; color: #94a3b8; margin-bottom: 20px; font-weight: 800; text-transform: uppercase; }

        .chart-wrapper { height: 250px; position: relative; }
        .chart-note { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 15px; font-weight: 600; }
        .empty-state { padding: 60px; text-align: center; color: #94a3b8; font-weight: 700; font-style: italic; opacity: 0.7; }

        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 1200px) { .stats-row { grid-template-columns: 1fr 1fr; } .bento-grid, .analytics-grid { grid-template-columns: 1fr; } .full-width-chart { grid-column: auto; } }
      `}</style>
    </div>
  );
}

const styles = {
  loader: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '14px', fontWeight: '700' },
};