import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Games.css";

const MOCK_GAMES = [
  { id: 1, name: "Breathing Circle", description: "Guided breathing for instant calm.", color: "#b2e2d2", icon: "adjust" },
  { id: 2, name: "Bubble Pop", description: "Pop bubbles to release tension.", color: "#d1e9ff", icon: "bubble_chart" },
  { id: 3, name: "Reaction Test", description: "Test focus with rapid color changes.", color: "#ffd8d1", icon: "timer" },
  { id: 4, name: "Memory Match", description: "Find pairs of hidden symbols.", color: "#e2d1ff", icon: "grid_view" },
  { id: 5, name: "Zen Sand", description: "Draw patterns in digital sand.", color: "#f5f5dc", icon: "gesture" },
  { id: 6, name: "Focus Flow", description: "Align shapes for concentration.", color: "#d1ffd6", icon: "filter_center_focus" }
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
const BubblePop = () => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);

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
const ReactionTest = () => {
  const [stage, setStage] = useState('idle'); // idle, waiting, go, too-early, result
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
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
const MemoryMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

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

// 6. Focus Flow
const FocusFlow = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  // Randomly move the target
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTargetPos({ x: Math.random() * 60 + 20, y: Math.random() * 60 + 20 });
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Handle Score via drag interactions
  const handleDrag = () => {
    if (isPlaying && score < 100) {
      setScore(s => Math.min(s + 2, 100));
    }
  };

  // Passive score decay if not tracking
  useEffect(() => {
    if (!isPlaying || score >= 100) return;
    const interval = setInterval(() => {
      setScore(s => Math.max(s - 1, 0));
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying, score]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-transparent" ref={containerRef}>
      <div className="absolute top-12 text-center z-20 bg-white/80 backdrop-blur-md p-6 rounded-[2rem] border border-white shadow-xl min-w-[300px]">
        <h2 className="text-2xl font-black text-[#1d4d4f] tracking-tight">Focus Flow</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6 font-bold uppercase tracking-widest">Keep the orb steady to charge.</p>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
          <motion.div className="bg-gradient-to-r from-[#e76f51] to-[#f4a261] h-full" animate={{ width: `${score}%` }} />
        </div>
      </div>

      {!isPlaying ? (
        <button onClick={() => setIsPlaying(true)} className="px-12 py-5 bg-[#1d4d4f] text-white rounded-2xl font-black shadow-2xl hover:bg-[#133233] transition-colors z-20 uppercase tracking-widest text-sm">
          Initialize Flow
        </button>
      ) : (
        <>
          <motion.div
            animate={{ left: `${targetPos.x}%`, top: `${targetPos.y}%` }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute w-40 h-40 rounded-full border-2 border-dashed border-[#1d4d4f]/30 flex items-center justify-center pointer-events-none"
          />
          <motion.div
            drag
            dragConstraints={containerRef}
            dragElastic={0.1}
            dragMomentum={false}
            onDrag={handleDrag}
            whileDrag={{ scale: 0.9, boxShadow: "0 0 40px rgba(42,157,143,0.8)" }}
            className="w-20 h-20 bg-gradient-to-br from-[#1d4d4f] to-[#2A9D8F] rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing z-20 border-4 border-white/20"
          >
            <span className="material-symbols-outlined text-white/50 text-xl font-bold">open_with</span>
          </motion.div>
          {score >= 100 && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute z-30 bg-white p-12 rounded-[3rem] shadow-[0_20px_60px_rgba(231,111,81,0.3)] text-center border border-slate-50">
              <h2 className="text-5xl font-black text-[#e76f51] mb-2 tracking-tighter">Flow Achieved</h2>
              <p className="text-[#1d4d4f] font-bold uppercase tracking-widest text-xs">Your mind is centered.</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

/* ========================================================= */
/* MAIN GAMES COMPONENT */
/* ========================================================= */

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showFinishScreen, setShowFinishScreen] = useState(false);

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

  const handleStartGame = (gameName) => {
    setActiveGame(gameName);
    setTimeLeft(180);
    setIsTimerActive(true);
    setShowFinishScreen(false);
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
      case "Bubble Pop": return <BubblePop />;
      case "Reaction Test": return <ReactionTest />;
      case "Memory Match": return <MemoryMatch />;
      case "Zen Sand": return <ZenSand />;
      case "Focus Flow": return <FocusFlow />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen font-['Plus_Jakarta_Sans'] pb-20 games-page">

      {/* CATALOG GRID */}
      <div className="max-w-7xl mx-auto px-6 py-10 z-30 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {MOCK_GAMES.map((game) => (
            <div
              key={game.id}
              className="game-card bg-white rounded-[2.5rem] p-10 border border-gray-50 flex flex-col items-start shadow-sm h-full group hover:shadow-2xl transition-all duration-500"
            >
              <div
                className="w-16 h-16 rounded-[1.25rem] mb-8 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${game.color}40`, border: `1px solid ${game.color}60` }}
              >
                <span className="material-symbols-outlined text-3xl font-bold" style={{ color: '#1d4d4f' }}>{game.icon}</span>
              </div>
              <h3 className="text-2xl font-black mb-3 text-[#1d4d4f] tracking-tight">{game.name}</h3>
              <p className="text-slate-400 text-sm mb-10 font-medium leading-relaxed">"{game.description}"</p>
              <button
                onClick={() => handleStartGame(game.name)}
                className="mt-auto w-full py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] bg-slate-50 text-[#1d4d4f] hover:bg-[#1d4d4f] hover:text-white transition-all shadow-sm border border-slate-100 border-b-2"
              >
                Launch Sequence
              </button>
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
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-12">Session Complete</p>

                  <div className="flex flex-col sm:flex-row gap-6 w-full">
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