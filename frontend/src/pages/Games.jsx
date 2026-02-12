import React from "react";
import { motion } from "framer-motion";

// Grouped games for better UX
const gameGroups = [
  {
    title: "Mindful Games",
    games: [
      { name: "Breathing Bubble", desc: "Simple breathing exercises to help you feel calmer.", url: "https://calm.com/breathe" },
      { name: "Zen Sand Garden", desc: "Gentle sand art to help you relax and unwind.", url: "https://thisissand.com/" },
      { name: "Soft Rain Simulator", desc: "Peaceful rain sounds to help you de-stress.", url: "https://rainymood.com/" },
    ],
  },
  {
    title: "Puzzle & Focus",
    games: [
      { name: "Word Guess", desc: "Light word puzzles to give your mind a gentle workout.", url: "https://wordlegame.org/" },
      { name: "Memory Cards", desc: "Memory games to help you focus and feel more present.", url: "https://www.memozor.com/memory-games/for-adults" },
      { name: "Flow Free", desc: "Simple puzzles that help you get into a flow state.", url: "https://www.coolmathgames.com/0-flow-free" },
      { name: "Shape Matcher", desc: "Pattern matching to help you focus and relax.", url: "https://www.coolmathgames.com/0-shapes" },
    ],
  },
  {
    title: "Creative & Relaxing",
    games: [
      { name: "Color Me Calm", desc: "Gentle coloring to help you unwind and feel creative.", url: "https://thecolor.com/" },
      { name: "Scribble Doodle", desc: "Free drawing to help release tension and relax.", url: "https://skribbl.io/" },
      { name: "Calm Piano Tiles", desc: "Rhythmic tapping to help improve focus and calm.", url: "https://www.agame.com/game/magic-piano-tiles" },
      { name: "Maze Walk", desc: "Maze solving to help you focus and feel more centered.", url: "https://mazegenerator.net/" },
      { name: "Patience Tester", desc: "Simple activities to help you slow down and relax.", url: "https://theuselessweb.com/" },
      { name: "Bubble Pop", desc: "Gentle bubble popping to help reduce tension.", url: "https://www.bubbleshooter.net/" },
    ],
  },
];

export default function AllGamesCard() {
  return (
    <div style={{ 
      maxWidth: "1100px", 
      margin: "80px auto", 
      padding: "0 24px",
      minHeight: "100vh"
    }}>
      <h2 style={{
        fontSize: "2.25rem",
        textAlign: "center",
        marginBottom: "16px",
        fontWeight: 700,
        color: "var(--text-primary)"
      }}>
        <span style={{ fontSize: "1.75rem", marginRight: "8px", color: "var(--text-primary)" }}>☼</span>
        Calming Games
      </h2>
      <p style={{ 
        textAlign: "center", 
        color: "var(--text-secondary)", 
        marginBottom: "48px",
        fontSize: "1.125rem",
        lineHeight: "1.6"
      }}>
        Simple, engaging activities to help you unwind, refocus, and feel more balanced.
      </p>

      {/* Recommended Today */}
      <motion.div
        style={{
          background: "var(--bg-primary)",
          borderLeft: "4px solid var(--primary)",
          padding: "24px 28px",
          borderRadius: "12px",
          marginBottom: "48px",
          color: "var(--text-primary)",
          boxShadow: "var(--shadow-sm)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <strong style={{ fontWeight: 600 }}>Try this today:</strong> Breathing Bubble — many people feel calmer in just a few minutes.
      </motion.div>

      {/* Game Groups */}
      {gameGroups.map((group, i) => (
        <div key={i} style={{ marginBottom: "56px" }}>
          <h3 style={{
            fontSize: "1.75rem",
            marginBottom: "24px",
            color: "var(--text-primary)",
            fontWeight: 600
          }}>
            <span style={{ fontSize: "1.375rem", marginRight: "8px", color: "var(--text-primary)" }}>
              {group.title === "Mindful Games" ? "○" : group.title === "Puzzle & Focus" ? "△" : "✦"}
            </span>
            {group.title}
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
            }}
          >
            {group.games.map((game, j) => (
              <motion.div
                key={j}
                whileHover={{ scale: 1.02, y: -4 }}
                style={{
                  background: "var(--card-bg)",
                  padding: "28px",
                  borderRadius: "16px",
                  cursor: "pointer",
                  boxShadow: "var(--shadow-sm)",
                  transition: "var(--transition-fast)",
                  border: "1px solid var(--card-border)",
                }}
                onClick={() => window.open(game.url, "_blank")}
              >
                <h4 style={{ 
                  marginBottom: "10px", 
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontSize: "1.125rem"
                }}>
                  {game.name}
                </h4>
                <p style={{ 
                  color: "var(--text-secondary)", 
                  fontSize: "1rem",
                  lineHeight: "1.6"
                }}>
                  {game.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
