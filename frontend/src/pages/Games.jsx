import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Games.css";

// gradFrom/gradTo drive the per-card Launch Sequence button gradient
const MOCK_GAMES = [
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
  },
  {
    id: 7,
    game_id: 7,
    name: "Harmonic Waves",
    description: "Draw soothing ripples in the digital water.",
    color: "#e0f7fa",
    icon: "water_drop",
    gradFrom: "#00bcd4",
    gradTo: "#1d4d4f"
  }
];

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

// 7. Harmonic Waves
const HarmonicWaves = () => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 4000); // ripple duration
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6">
      <div className="text-center mb-8 bg-white/80 backdrop-blur-md px-10 py-5 rounded-full border border-white shadow-sm z-10 pointer-events-none">
        <h2 className="text-xl font-black text-[#1d4d4f] tracking-widest uppercase">Harmonic Waves</h2>
        <p className="text-xs text-[#00bcd4] mt-1 font-bold">Tap the screen to create calming ripples.</p>
      </div>
      <div 
        onClick={addRipple} 
        className="absolute inset-0 w-full h-full cursor-crosshair overflow-hidden"
      >
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 1000, height: 1000, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4, ease: "easeOut" }}
              className="absolute rounded-full border-[3px] border-[#00bcd4]"
              style={{ left: r.x, top: r.y, transform: "translate(-50%, -50%)" }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};


export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showFinishScreen, setShowFinishScreen] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const navigate = useNavigate();

  const [recentGameId, setRecentGameId] = useState(null);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/activity-logs/recent-game", {
          headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.game_id) setRecentGameId(data.game_id);
        }
      } catch (err) {
        console.error("Failed to fetch recent game:", err);
      }
    };
    fetchRecent();
  }, []);

  const activeGameData = MOCK_GAMES.find(g => g.name === activeGame);
  const heroGame = MOCK_GAMES.find(g => g.id === recentGameId) || MOCK_GAMES[0];
  const subGames = MOCK_GAMES;

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
    const data = MOCK_GAMES.find(g => g.name === gameName);
    if (data) {
      setRecentGameId(data.id);
    }
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
      case "Bubble Pop": return <BubblePop onScoreUpdate={setCurrentScore} />;
      case "Reaction Test": return <ReactionTest onScoreUpdate={setCurrentScore} />;
      case "Memory Match": return <MemoryMatch onScoreUpdate={setCurrentScore} />;
      case "Zen Sand": return <ZenSand />;
      case "Shade Finder": return <ShadeFinder onScoreUpdate={setCurrentScore} onGameOver={() => setShowFinishScreen(true)} />;
      case "Harmonic Waves": return <HarmonicWaves />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen font-['Plus_Jakarta_Sans'] pb-20 games-page relative overflow-hidden bg-[#fafcfa]">
      
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#b2e2d2] opacity-30 blur-[150px] rounded-full pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e2d1ff] opacity-40 blur-[150px] rounded-full pointer-events-none mix-blend-multiply" />

      {/* MINIMAL BACK NAVIGATION */}
      <button 
        onClick={() => navigate("/dashboard")}
        className="absolute top-8 left-8 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-white/40 border border-white/60 shadow-sm backdrop-blur-md hover:bg-white transition-all duration-300 hover:scale-105 group"
      >
        <span className="material-symbols-outlined text-[#1d4d4f] group-hover:-translate-x-1 transition-transform duration-300 font-bold">arrow_back</span>
      </button>

      {/* PAGE HEADER */}
      <motion.div initial={{opacity: 0, y: -20}} animate={{opacity: 1, y: 0}} className="text-center mb-10 px-4 pt-12 xl:pt-16 relative z-10 flex flex-col items-center">
        <span className="px-4 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em] text-[#2A9D8F] mb-6">
          Mindful Gaming
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-[#1d4d4f] tracking-tight leading-tight">
          Relax &amp; Reset
        </h2>
        <p className="text-sm md:text-base text-slate-500 max-w-md mx-auto mt-4 leading-relaxed font-medium">
          Immersive activities designed to actively reduce cognitive load and sharpen your mental clarity.
        </p>
      </motion.div>

      {/* CATALOG GRID */}
      <div className="max-w-6xl mx-auto px-6 py-4 z-10 relative">
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }} 
          initial="hidden" animate="show"
          className="w-full flex flex-col gap-10"
        >
          {/* HERO CARD (Recently Played Game) */}
          <motion.div 
            variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
            className="w-full relative group cursor-pointer"
            onClick={() => handleStartGame(heroGame.name)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A9D8F]/20 to-[#b2e2d2]/10 rounded-[2.5rem] blur-2xl group-hover:blur-3xl transition-all duration-500 opacity-60"></div>
            <div className="relative bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
              
              <div className="absolute right-[-5%] bottom-[-20%] opacity-[0.03] text-[30rem] leading-none pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-500 material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {heroGame.icon}
              </div>

              <div className="p-8 md:p-14 flex flex-col md:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-3xl flex-shrink-0 flex items-center justify-center bg-white shadow-xl shadow-[#2A9D8F]/10 border border-[#2A9D8F]/20">
                  <span className="material-symbols-outlined text-5xl text-[#2A9D8F]" style={{ fontVariationSettings: "'FILL' 1" }}>{heroGame.icon}</span>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] text-[10px] font-black uppercase tracking-widest rounded-full mb-3">Recently Played</span>
                  <h3 className="text-3xl md:text-4xl font-black text-[#1d4d4f] tracking-tight mb-3">{heroGame.name}</h3>
                  <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed max-w-lg">{heroGame.description}</p>
                </div>
                <div className="flex-shrink-0 w-full md:w-auto">
                  <button className="w-full md:w-auto px-8 py-4 bg-[#1d4d4f] hover:bg-[#2A9D8F] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-lg">
                    Begin Flow
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* SECONDARY GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {subGames.map((game) => (
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
                key={game.id}
                onClick={() => handleStartGame(game.name)}
                className="group relative cursor-pointer h-full"
              >
                {/* Glow ring */}
                <div 
                  className="absolute inset-0 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `linear-gradient(135deg, ${game.gradFrom}, ${game.gradTo})` }}
                />

                <div className="relative h-full bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:-translate-y-1">
                  
                  {/* Giant hidden background icon */}
                  <div className="absolute right-[-15%] bottom-[-10%] opacity-[0.02] text-[15rem] leading-none pointer-events-none group-hover:scale-110 transition-transform duration-700 material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {game.icon}
                  </div>

                  <div className="w-16 h-16 rounded-2xl mb-6 mx-auto flex items-center justify-center bg-white shadow-md border border-slate-50 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <span className="material-symbols-outlined text-3xl" style={{ color: game.gradFrom, fontVariationSettings: "'FILL' 1" }}>
                      {game.icon}
                    </span>
                  </div>

                  <h3 className="text-xl font-black mb-2 text-slate-800 tracking-tight relative z-10 w-full">
                    {game.name}
                  </h3>
                  
                  <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 relative z-10 flex-1 w-full">
                    {game.description}
                  </p>

                  <div className="w-full relative z-10 overflow-hidden rounded-xl h-12 flex items-center justify-center hover:bg-slate-50 transition-colors border border-slate-100 bg-white">
                    <span 
                      className="text-[10px] font-black uppercase tracking-widest transition-colors duration-300"
                      style={{ color: game.gradFrom }}
                    >
                      Play
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
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
              className="absolute top-8 right-8 lg:top-12 lg:right-12 text-[#1d4d4f] hover:text-[#2A9D8F] hover:bg-white transition-all duration-300 z-[110] bg-white/40 backdrop-blur-md border border-white/60 shadow-sm w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:scale-105"
            >
              <span className="material-symbols-outlined font-bold">close</span>
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