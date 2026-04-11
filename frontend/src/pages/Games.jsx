import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Games.css";

// gradFrom/gradTo drive the per-card Launch Sequence button gradient
const MOCK_GAMES = [
  { id: 1, game_id: 1, name: "Breathing Circle", description: "Guided breathing for instant calm.", color: "#b2e2d2", icon: "adjust", gradFrom: "#2A9D8F", gradTo: "#1d4d4f" },
  { id: 2, game_id: 2, name: "Bubble Pop", description: "Pop bubbles to release tension.", color: "#d1e9ff", icon: "bubble_chart", gradFrom: "#5ba4e0", gradTo: "#1d4d4f" },
  { id: 3, game_id: 3, name: "Reaction Test", description: "Test focus with rapid color changes.", color: "#ffd8d1", icon: "timer", gradFrom: "#e76f51", gradTo: "#b54b35" },
  { id: 4, game_id: 4, name: "Memory Match", description: "Find pairs of hidden symbols.", color: "#e2d1ff", icon: "grid_view", gradFrom: "#7c5cbf", gradTo: "#1d4d4f" },
  { id: 5, game_id: 5, name: "Zen Sand", description: "Draw patterns in digital sand.", color: "#f5f5dc", icon: "gesture", gradFrom: "#c8b97a", gradTo: "#1d4d4f" },
  {
    id: 6,
    game_id: 6,
    name: "Shade Finder",
    description: "Spot the odd color to test visual focus.",
    color: "#d1ffd6",
    icon: "palette",
    gradFrom: "#4cad60",
    gradTo: "#1d4d4f"
  }
];

// 1. Breathing Circle
const BreathingCircle = () => {
  const [phase, setPhase] = useState("Inhale");

  useEffect(() => {
    let isMounted = true;
    const animateBreath = () => {
      if (!isMounted) return;
      setPhase("Inhale");
      setTimeout(() => isMounted && setPhase("Hold"), 4000);
      setTimeout(() => isMounted && setPhase("Exhale"), 8000);
    };
    animateBreath();
    const interval = setInterval(animateBreath, 12000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h2 className="text-5xl font-black text-[#1d4d4f] mb-20 italic-font">{phase}</h2>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute w-72 h-72 rounded-full border border-[#b2e2d2] opacity-50"></div>
        <div className="absolute w-80 h-80 rounded-full border border-[#b2e2d2] opacity-20"></div>
        {/* Animated breathing circle */}
        <motion.div
          animate={{ scale: phase === "Inhale" ? 1.6 : phase === "Exhale" ? 1 : phase === "Hold" && 1.6 }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-40 h-40 bg-gradient-to-tr from-[#1d4d4f] to-[#2A9D8F] rounded-full shadow-[0_0_60px_rgba(42,157,143,0.4)] flex items-center justify-center"
        >
        </motion.div>
      </div>
    </div>
  );
};

// 2. Bubble Pop
const BubblePop = ({ onScoreUpdate }) => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) => {
        if (prev.length > 20) return prev; // max bubbles to avoid clutter
        return [...prev, {
          id: Date.now() + Math.random(),
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          size: Math.random() * 50 + 40
        }];
      });
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const popBubble = (id, e) => {
    e.stopPropagation();
    setBubbles((prev) => prev.filter(b => b.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute top-12 text-center z-10 bg-white/50 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/60 shadow-lg">
        <h2 className="text-sm font-black text-[#1d4d4f] uppercase tracking-widest">Tension Released</h2>
        <p className="text-6xl font-black text-[#e76f51] mt-2 leading-none">{score}</p>
      </div>
      <AnimatePresence>
        {bubbles.map(b => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1, y: [0, -30, 0] }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
            onClick={(e) => popBubble(b.id, e)}
            className="bubble"
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// 3. Reaction Test
const ReactionTest = ({ onScoreUpdate }) => {
  const [stage, setStage] = useState('idle'); // idle, waiting, go, too-early, result
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);

  useEffect(() => {
    if (reactionTime) onScoreUpdate(reactionTime);
  }, [reactionTime, onScoreUpdate]);
  const timeoutRef = useRef(null);

  const startTest = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setStage('waiting');
    setReactionTime(null);
    const delay = Math.random() * 2500 + 1500;
    timeoutRef.current = setTimeout(() => {
      setStage('go');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (stage === 'idle' || stage === 'result' || stage === 'too-early') {
      startTest();
    } else if (stage === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStage('too-early');
    } else if (stage === 'go') {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setStage('result');
    }
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const getBgColor = () => {
    if (stage === 'waiting') return 'bg-[#e76f51]';
    if (stage === 'go') return 'bg-[#10B981]';
    return 'bg-transparent';
  };

  return (
    <div onClick={handleClick} className={`w-full h-full flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${getBgColor()}`}>
      <div className="bg-white/95 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl text-center max-w-md pointer-events-none border border-white/50">
        {stage === 'idle' && (
          <>
            <div className="w-16 h-16 bg-slate-100 rounded-2xl mx-auto mb-6 flex items-center justify-center text-[#1d4d4f]"><span className="material-symbols-outlined text-3xl">timer</span></div>
            <h2 className="text-3xl font-black mb-4 text-[#1d4d4f] tracking-tight">Reaction Test</h2>
            <p className="text-slate-500 mb-8 font-medium">Click anywhere when the screen turns drastically green to test your cognitive speed.</p>
            <div className="px-10 py-4 bg-[#1d4d4f] text-white rounded-xl font-bold uppercase tracking-widest text-xs inline-block shadow-lg">Start Test</div>
          </>
        )}
        {stage === 'waiting' && <h2 className="text-4xl font-black text-[#1d4d4f]">Wait for Green...</h2>}
        {stage === 'go' && <h2 className="text-6xl font-black text-[#10B981]">CLICK!</h2>}
        {stage === 'too-early' && (
          <>
            <h2 className="text-4xl font-black text-[#e76f51] mb-4">Too Early!</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Click anywhere to try again.</p>
          </>
        )}
        {stage === 'result' && (
          <>
            <p className="text-slate-400 uppercase text-[10px] font-black tracking-widest mb-3">Reaction Time</p>
            <h2 className="text-7xl font-black text-[#1d4d4f] mb-8 tracking-tighter">{reactionTime}<span className="text-3xl text-slate-300">ms</span></h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Click anywhere to try again.</p>
          </>
        )}
      </div>
    </div>
  );
};

// 4. Memory Match
const CARD_PAIRS = ['✨', '🍃', '🌊', '☁️', '🌙', '⭐', '☀️', '💧'];
const MemoryMatch = ({ onScoreUpdate }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    onScoreUpdate(moves);
  }, [moves, onScoreUpdate]);

  useEffect(() => {
    const shuffled = [...CARD_PAIRS, ...CARD_PAIRS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, i) => ({ id: i, symbol }));
    setCards(shuffled);
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setMatched(m => [...m, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="text-center mb-10 bg-white/60 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white">
        <h2 className="text-3xl font-black text-[#1d4d4f] tracking-tight">Memory Match</h2>
        <p className="text-xs text-[#e76f51] mt-2 tracking-[0.2em] uppercase font-bold">Moves Taken: {moves}</p>
      </div>
      <div className="memory-grid">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <div key={card.id} className={`memory-card ${matched.includes(i) ? 'matched' : isFlipped ? 'flipped' : ''}`} onClick={() => handleCardClick(i)}>
              <div className="memory-card-inner">
                <div className="memory-card-face memory-card-front shadow-sm"></div>
                <div className="memory-card-face memory-card-back shadow-lg bg-gradient-to-br from-[#1d4d4f] to-[#133233]">{card.symbol}</div>
              </div>
            </div>
          );
        })}
      </div>
      {matched.length === cards.length && cards.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 text-3xl font-black text-[#e76f51] bg-white px-8 py-4 rounded-full shadow-xl">
          Sanctuary Restored!
        </motion.div>
      )}
    </div>
  );
};

// 5. Zen Sand
const ZenSand = () => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scale for high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 15;
    ctxRef.current = ctx;

    // Smooth fading effect
    let animationFrameId;
    const fadeCanvas = () => {
      ctx.fillStyle = "rgba(253, 250, 246, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(fadeCanvas);
    };
    fadeCanvas();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    isDrawing.current = true;
  };

  const draw = (e) => {
    if (!isDrawing.current) return;
    const { offsetX, offsetY } = getCoordinates(e);
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing.current) return;
    ctxRef.current.closePath();
    isDrawing.current = false;
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (e.touches && e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      return {
        offsetX: e.touches[0].clientX - rect.left,
        offsetY: e.touches[0].clientY - rect.top
      };
    }
    return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8 bg-white/80 backdrop-blur-md px-10 py-5 rounded-full border border-white shadow-sm">
        <h2 className="text-xl font-black text-[#1d4d4f] tracking-widest uppercase">Zen Sand</h2>
        <p className="text-xs text-slate-400 mt-1 font-bold">Draw to release tension. Let it fade away.</p>
      </div>
      <canvas
        ref={canvasRef}
        className="canvas-container w-full max-w-5xl h-[60vh] lg:h-[70vh] shadow-2xl"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
    </div>
  );
};

// 6. Shade Finder (Colorblind Game)
const ShadeFinder = ({ onScoreUpdate, onGameOver }) => {
  const [gridSize, setGridSize] = useState(2);
  const [targetIndex, setTargetIndex] = useState(0);
  const [colors, setColors] = useState({ base: "", odd: "" });
  const [score, setScore] = useState(0);

  useEffect(() => {
    onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  const generateLevel = useCallback(() => {
    // Generate a random base color
    const r = Math.floor(Math.random() * 200) + 20;
    const g = Math.floor(Math.random() * 200) + 20;
    const b = Math.floor(Math.random() * 200) + 20;

    // Difficulty logic: 'diff' gets smaller as score increases
    const diff = Math.max(3, 40 - Math.floor(score / 2));

    // Create the "odd" color by slightly lightening/darkening
    const isLighter = Math.random() > 0.5;
    const adjust = isLighter ? diff : -diff;

    setColors({
      base: `rgb(${r}, ${g}, ${b})`,
      odd: `rgb(${r + adjust}, ${g + adjust}, ${b + adjust})`
    });
    setTargetIndex(Math.floor(Math.random() * (gridSize * gridSize)));
  }, [gridSize, score]);

  useEffect(() => {
    generateLevel();
  }, [gridSize, generateLevel]);

  const handleSquareClick = (index) => {
    if (index === targetIndex) {
      setScore(s => s + 1);
      // Increase grid size at specific intervals
      if (score === 2) setGridSize(3);
      if (score === 8) setGridSize(4);
      if (score === 15) setGridSize(5);
      if (score === 25) setGridSize(6);
      generateLevel();
    } else {
      // Wrong click ends game
      onGameOver();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="absolute top-12 text-center z-10 bg-white/50 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/60 shadow-lg">
        <h2 className="text-sm font-black text-[#1d4d4f] uppercase tracking-widest">Score</h2>
        <p className="text-6xl font-black text-[#4cad60] mt-2 leading-none">{score}</p>
      </div>

      <div
        className="grid gap-3 w-full max-w-[500px] aspect-square"
        style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
      >
        {[...Array(gridSize * gridSize)].map((_, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSquareClick(i)}
            style={{
              backgroundColor: i === targetIndex ? colors.odd : colors.base,
              borderRadius: "1rem",
              cursor: "pointer",
            }}
            className="shadow-lg transition-transform"
          />
        ))}
      </div>
      <p className="mt-8 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Find the slightly different shade</p>
    </div>
  );
};


export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showFinishScreen, setShowFinishScreen] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const activeGameData = MOCK_GAMES.find(g => g.name === activeGame);

  // Timer logic
  useEffect(() => {
    let timer;
    if (activeGame && isTimerActive && timeLeft > 0 && !showFinishScreen) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowFinishScreen(true);
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [activeGame, isTimerActive, timeLeft, showFinishScreen]);

  const recordScore = async () => {
    if (!activeGameData) return;
    try {
      const token = localStorage.getItem("token");
      await fetch("http://127.0.0.1:8000/api/activity-logs", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          activity_type: "game",
          duration_minutes: 3,
          game_id: activeGameData.game_id,
          score: currentScore
        })
      });
    } catch (err) {
      console.error("Failed to record game score:", err);
    }
  };

  useEffect(() => {
    if (showFinishScreen) {
      recordScore();
    }
  }, [showFinishScreen]);

  const handleStartGame = (gameName) => {
    setActiveGame(gameName);
    setTimeLeft(180);
    setIsTimerActive(true);
    setShowFinishScreen(false);
    setCurrentScore(0);
  };

  const handleResetGame = () => {
    setTimeLeft(180);
    setIsTimerActive(true);
    setShowFinishScreen(false);
  };

  const handleFinishSession = () => {
    setActiveGame(null);
    setIsTimerActive(false);
    setShowFinishScreen(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderGame = () => {
    switch (activeGame) {
      case "Breathing Circle": return <BreathingCircle />;
      case "Bubble Pop": return <BubblePop onScoreUpdate={setCurrentScore} />;
      case "Reaction Test": return <ReactionTest onScoreUpdate={setCurrentScore} />;
      case "Memory Match": return <MemoryMatch onScoreUpdate={setCurrentScore} />;
      case "Zen Sand": return <ZenSand />;
      case "Shade Finder": return <ShadeFinder onScoreUpdate={setCurrentScore} onGameOver={() => setShowFinishScreen(true)} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen font-['Plus_Jakarta_Sans'] pb-20 games-page">

      {/* PAGE HEADER — stronger visual hierarchy */}
      <div className="text-center mb-10 px-4 pt-8 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#2A9D8F] mb-3">
          Mindful Gaming
        </p>
        <h2 className="text-3xl md:text-4xl font-black text-[#1d4d4f] tracking-tight leading-tight">
          Relax &amp; Reset
        </h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto mt-3 leading-relaxed font-medium">
          Short activities to reduce stress and sharpen focus — tuned to your current state.
        </p>
      </div>

      {/* CATALOG GRID — Larger gap to fill the space visually */}
      <div className="max-w-7xl mx-auto px-6 py-4 z-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 mb-16">
          {MOCK_GAMES.map((game) => (
            <div
              key={game.id}
              className="game-card rounded-[1.75rem] flex flex-col items-start h-full group"
            >
              {/* All card content sit above the ::before shimmer — justify-center for vertical centering */}
              <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">

                {/* Icon badge with soft glow ring matching game color — balanced margins */}
                <div
                  className="w-12 h-12 rounded-[0.9rem] mb-6 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                  style={{
                    background: `linear-gradient(135deg, ${game.color}60, ${game.color}20)`,
                    border: `1.5px solid ${game.color}90`,
                    boxShadow: `0 0 0 6px ${game.color}22`
                  }}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ color: game.gradFrom, fontVariationSettings: "'FILL' 1" }}
                  >
                    {game.icon}
                  </span>
                </div>

                {/* Bold title — primary visual hierarchy at the center block */}
                <h3 className="text-xl font-black mb-1.5 text-[#1d4d4f] tracking-tight leading-tight w-full">
                  {game.name}
                </h3>

                {/* Subdued description — symmetrical spacing */}
                <p className="text-slate-400 text-xs mb-10 font-medium leading-relaxed w-full max-w-[200px]">
                  {game.description}
                </p>

                {/* Launch button — graduation tuned to this game's icon accent */}
                <button
                  onClick={() => handleStartGame(game.name)}
                  className="w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${game.gradFrom} 0%, ${game.gradTo} 100%)`,
                    boxShadow: `0 6px 16px -4px ${game.gradFrom}55`
                  }}
                >
                  Launch Sequence
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* GAME OVERLAY ENGINE */}
      <AnimatePresence>
        {activeGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1100] flex flex-col items-center justify-center bg-[#fdfaf6] bg-opacity-90 backdrop-blur-3xl"
          >
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/60 to-[#e2e8f0]/40 pointer-events-none" />

            <button
              onClick={() => setActiveGame(null)}
              className="absolute top-12 right-8 lg:top-16 lg:right-12 text-slate-400 hover:text-[#e76f51] hover:scale-110 transition-all z-[110] bg-white p-3 rounded-full shadow-lg border border-slate-100 flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl font-black">close</span>
            </button>

            <div className="relative z-10 w-full h-full flex items-center justify-center max-w-[1600px] mx-auto">
              {!showFinishScreen ? (
                <>
                  {/* Floating Glassmorphism Timer */}
                  <div className="fixed top-8 left-8 lg:top-12 lg:left-12 z-[110] bg-white/20 backdrop-blur-xl border border-white/30 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
                    <span className="material-symbols-outlined text-[#1d4d4f] text-xl animate-pulse">timer</span>
                    <span className="text-2xl font-mono font-black text-[#1d4d4f]">{formatTime(timeLeft)}</span>
                  </div>

                  {renderGame()}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/95 backdrop-blur-2xl p-12 lg:p-20 rounded-[4rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-white text-center flex flex-col items-center max-w-2xl mx-auto"
                >
                  <motion.img
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    src="/gaming-brain.png"
                    alt="Brain Mascot"
                    className="w-64 h-64 mb-10 object-contain"
                  />
                  <h2 className="text-6xl font-black text-[#1d4d4f] mb-4 italic-serif">Well Rested</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">Session Complete</p>
                  
                  {activeGame !== "Breathing Circle" && activeGame !== "Zen Sand" && (
                    <div className="mb-8">
                       <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-1">Final Score</p>
                       <p className="text-5xl font-black text-[#2A9D8F]">{currentScore}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-6 w-full mt-8">
                    <button
                      onClick={handleResetGame}
                      className="flex-1 py-5 bg-[#1d4d4f] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:shadow-2xl transition-all"
                    >
                      Reset Game
                    </button>
                    <button
                      onClick={handleFinishSession}
                      className="flex-1 py-5 bg-white text-[#1d4d4f] border-2 border-slate-100 rounded-2xl font-black uppercase tracking-widest text-xs shadow-sm hover:bg-slate-50 transition-all"
                    >
                      Finish Session
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}