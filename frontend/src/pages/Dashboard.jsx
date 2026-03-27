import React, { useEffect, useState } from "react";
import DriftChart from "../components/Driftchart";
import { dashboardService } from "../services/dashboardService";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getData();
        setData(res);
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div style={{ padding: "100px", textAlign: "center", color: "#64748B" }}>Loading dashboard...</div>;

  // Default Values
  const streak = data?.streak || 0;
  const recentMoods = data?.recent_moods || [];
  const recentJournals = data?.recent_journals || [];
  const riskLevel = recentMoods[0]?.risk_level || "No data";
  const recommendation = recentMoods[0]?.recommendation || "Take your first assessment to see AI tips.";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8FAFB", padding: "40px 24px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Quick Stats Row - High Impact Tracking */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {[
            { label: "Current Streak", value: `${streak} Days`, icon: "🔥" },
            { label: "Total Logs", value: recentJournals.length, icon: "📝" },
            { label: "Latest Status", value: riskLevel, icon: "📊" },
            { label: "Wellness Goal", value: "80%", icon: "🎯" }
          ].map((stat, i) => (
            <div key={i} style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #F1F5F9", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "4px" }}>{stat.icon} {stat.label}</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "700", color: "#264653" }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "40px", borderRadius: "32px", boxShadow: "0 20px 50px rgba(0,0,0,0.04)", border: "1px solid #F1F5F9", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <h3 style={{ fontWeight: 600, color: "#264653", fontSize: "1.5rem" }}>Mood & Stress History</h3>
            <span style={{ fontSize: "0.75rem", color: "#94A3B8", backgroundColor: "#F1F5F9", padding: "6px 12px", borderRadius: "100px", fontWeight: "600" }}>LAST 7 DAYS</span>
          </div>

          <div style={{ height: "320px", width: "100%" }}>
            {recentMoods.length > 0 ? (
              <DriftChart data={recentMoods} />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", border: "2px dashed #F1F5F9", borderRadius: "20px" }}>
                Take an assessment to see your progress graph.
              </div>
            )}
          </div>
        </div>

        {/* Summary Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px", marginBottom: "32px" }}>

          <div style={{ backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "28px", border: "1px solid #F1F5F9", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h4 style={{ marginBottom: "16px", fontWeight: 600, color: "#264653", fontSize: "1.1rem" }}>Recent Updates</h4>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: "1.6" }}>
              {recentJournals.length > 0
                ? `You have recorded ${recentJournals.length} entries. Keeping a regular log helps improve AI accuracy.`
                : "Your journal is empty. Write a quick note about your day to start tracking."}
            </p>
          </div>

          <div style={{ backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "28px", border: "1px solid #F1F5F9", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
            <h4 style={{ marginBottom: "16px", fontWeight: 600, color: "#264653", fontSize: "1.1rem" }}>AI Suggestion</h4>
            <div style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: "1.6" }}>
              Level: <strong style={{ color: "#1A2E35" }}>{riskLevel}</strong>
              <div style={{ marginTop: "12px", padding: "16px", backgroundColor: "#F8FAFB", borderRadius: "16px", borderLeft: "4px solid #2A9D8F", fontStyle: "italic", color: "#475569" }}>
                "{recommendation}"
              </div>
            </div>
          </div>
        </div>

        {/* Daily Tasks - Adds "sticky" value to your app */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "28px", border: "1px solid #F1F5F9" }}>
          <h4 style={{ marginBottom: "16px", fontWeight: 600, color: "#264653" }}>Daily Wellness Checklist</h4>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {["Mood Test", "Daily Journal", "Deep Breathing"].map((task, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#F8FAFB", padding: "10px 16px", borderRadius: "12px", fontSize: "0.9rem", color: "#475569" }}>
                <input type="checkbox" style={{ accentColor: "#2A9D8F" }} /> {task}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}