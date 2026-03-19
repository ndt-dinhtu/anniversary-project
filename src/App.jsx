import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Heart,
  Calendar,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  Quote,
} from "lucide-react";
import { TIMELINE_DATA, QUIZ_QUESTIONS } from "./constants/data";
import "./App.scss";

const createPetals = () => {
  const petals = [];
  for (let i = 0; i < 80; i++) {
    const style = {
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 10 + 5}px`,
      height: `${Math.random() * 10 + 5}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 7 + 5}s`,
    };
    petals.push(<div key={i} className="petal" style={style}></div>);
  }
  return petals;
};

// --- 1. Love Quotes Chạy Ngang (Marquee) ---  
const LoveMarquee = () => {
  const quotes = [
    "Yêu không phải là nhìn nhau, mà là cùng nhìn về một hướng.",
    "Em là mảnh ghép hoàn hảo nhất của đời anh.",
    "Cảm ơn em đã xuất hiện và làm rực rỡ thế giới của anh.",
    "Hành trình 4 năm - Vạn dặm yêu thương.",
  ];
  return (
    <div className="overflow-hidden bg-white/20 backdrop-blur-sm py-4 border-y border-pink-200 my-10">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        className="flex whitespace-nowrap gap-20 text-pink-600 font-bold italic"
      >
        {[...quotes, ...quotes].map((q, i) => (
          <span key={i} className="text-lg">
            {q}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

// --- 2. Hero (Đồng hồ Glassmorphism) ---
const Hero = () => {
  const startDate = new Date(2022, 2, 15);
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date() - startDate;
      setTimeLeft({
        y: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
        mo: Math.floor((diff / (1000 * 60 * 60 * 24 * 30.44)) % 12),
        d: Math.floor((diff / (1000 * 60 * 60 * 24)) % 30),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-4 relative z-10">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Heart className="text-pink-500 w-16 h-16 mx-auto mb-6 fill-current animate-bounce" />
        <h2 className="text-pink-600 font-black uppercase tracking-[0.3em] text-sm mb-10">
          Kỷ niệm tình yêu của chúng mình
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 max-w-5xl">
          {Object.entries(timeLeft).map(([label, val], i) => (
            <div
              key={i}
              className="glass-card p-4 rounded-3xl border border-white/50 shadow-xl"
            >
              <span className="text-4xl md:text-6xl font-black text-gray-800 block">
                {val || 0}
              </span>
              <span className="text-[10px] md:text-xs font-bold text-pink-500 uppercase">
                {label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- 3. TimelineItem (Parallax & 3D) ---
const TimelineItem = ({ item, index }) => {
  const isEven = index % 2 === 0;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-20, 20]); // Hiệu ứng Parallax nhẹ cho ảnh

  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-center w-full mb-24 relative ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center justify-center z-10">
        <div className="w-12 h-12 rounded-full bg-pink-500 border-4 border-white shadow-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: isEven ? -100 : 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="w-full md:w-[45%] glass-card p-5 rounded-[2rem] shadow-2xl border border-white/40"
      >
        <div className="overflow-hidden rounded-2xl mb-4 h-56">
          <motion.img
            style={{ y: imageY }}
            src={item.image}
            className="w-full h-full object-cover scale-110"
          />
        </div>
        <div className="flex items-center gap-2 text-pink-500 font-bold text-xs mb-2">
          <Calendar size={14} /> {item.date}
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">{item.title}</h3>
        <p className="text-gray-600 leading-relaxed text-sm">{item.content}</p>
      </motion.div>
    </div>
  );
};

// --- Component 4: Quiz (Phần còn thiếu đây nè!) ---
const Quiz = () => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx) => {
    if (idx === QUIZ_QUESTIONS[step].correctAnswer) setScore(score + 1);
    if (step < QUIZ_QUESTIONS.length - 1) setStep(step + 1);
    else setShowResult(true);
  };

  return (
    <div className="max-w-md mx-auto bg-white/60 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-pink-100 relative z-10">
      {!showResult ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
              {QUIZ_QUESTIONS[step].question}
            </h3>
            <div className="space-y-3">
              {QUIZ_QUESTIONS[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="w-full p-4 text-left rounded-xl border-2 border-pink-50 hover:bg-pink-500 hover:text-white transition-all font-medium bg-white/50"
                >
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="text-center py-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-pink-600 mb-2">Tuyệt vời!</h3>
          <p className="text-gray-600 mb-6 font-medium">
            Em đạt được {score}/{QUIZ_QUESTIONS.length} điểm kỷ niệm.
          </p>
          <button
            onClick={() => {
              setStep(0);
              setScore(0);
              setShowResult(false);
            }}
            className="text-pink-500 underline text-sm font-bold"
          >
            Chơi lại
          </button>
        </div>
      )}
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [clickHearts, setClickHearts] = useState([]);
  const audioRef = useRef(null);

  // Hiệu ứng click bắn tim
  const handleGlobalClick = (e) => {
    const id = Date.now();
    setClickHearts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(
      () => setClickHearts((prev) => prev.filter((h) => h.id !== id)),
      1000,
    );
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden font-sans"
      onClick={handleGlobalClick}
    >
      <div className="cherry-blossom-container">{createPetals()}</div>
      {/* Click Hearts */}
      {clickHearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: 0, opacity: 1, scale: 1 }}
          animate={{ y: -150, opacity: 0, scale: 2 }}
          className="fixed pointer-events-none z-[999]"
          style={{ left: h.x, top: h.y }}
        >
          ❤️
        </motion.div>
      ))}

      <audio ref={audioRef} src="/assets/music/1.mp3" loop />

      <AnimatePresence>
        {!isStarted ? (
          <motion.div
            key="welcome"
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-pink-50 flex flex-col justify-center items-center p-6"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heart className="text-pink-500 w-24 h-24 fill-current" />
            </motion.div>
            <h1 className="text-4xl font-black mt-6 mb-2">Our Sweet Memory</h1>
            <button
              onClick={() => {
                setIsStarted(true);
                audioRef.current.play();
              }}
              className="mt-10 px-10 py-4 bg-pink-500 text-white rounded-full font-bold shadow-xl hover:scale-110 transition-transform"
            >
              Khám phá ngay ✨
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10"
          >
            <Hero />
            <LoveMarquee />

            <div className="max-w-6xl mx-auto px-6 py-20 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 via-pink-500 to-pink-300 -translate-x-1/2 hidden md:block" />
              {TIMELINE_DATA.map((item, idx) => (
                <TimelineItem key={idx} item={item} index={idx} />
              ))}
            </div>

            <div className="py-20 flex justify-center">
              <div className="w-full max-w-md">
                <Quiz />
              </div>
            </div>

            <div className="py-40 text-center">
              <h2 className="text-3xl font-black mb-10">
                Gửi người anh yêu nhất
              </h2>
              <div
                className={`envelope-wrapper mx-auto ${isLetterOpen ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLetterOpen(!isLetterOpen);
                }}
              >
                <div className="flap"></div>
                <div className="letter">
                  <p>
                    "1.460 ngày qua là món quà vô giá nhất mà định mệnh đã dành
                    tặng anh. Cảm ơn em đã dùng sự bao dung để xoa dịu những
                    thiếu sót, và dùng yêu thương để định nghĩa lại thế giới của
                    anh. Hành trình 4 năm không chỉ là một cột mốc, mà là lời
                    cam kết rằng anh sẽ luôn ở đây, trân trọng và bảo vệ em mỗi
                    ngày. Yêu em hơn mọi lời nói ❤️"
                  </p>
                </div>
              </div>
            </div>

            <footer className="py-10 text-center opacity-50 text-xs font-bold uppercase tracking-widest">
              Designed with ❤️ for You
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
