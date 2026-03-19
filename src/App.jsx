import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // Cần thiết để đưa Lightbox lên trên cùng
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Heart,
  Calendar,
  Trophy,
  Sparkles,
  Clock,
  X,
  ZoomIn,
} from "lucide-react";
import { TIMELINE_DATA, QUIZ_QUESTIONS, MOMENTS_DATA } from "./constants/data";
import "./App.scss";

// --- 1. Hoa Đào Rơi ---
const createPetals = () => {
  const petals = [];
  for (let i = 0; i < 50; i++) {
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

// --- 2. Love Marquee ---
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
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
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

// --- 3. Hero ---
const Hero = () => {
  const startDate = new Date(2022, 2, 7);
  const [timeLeft, setTimeLeft] = useState({});
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date() - startDate;
      setTimeLeft({
        Năm: Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)),
        Tháng: Math.floor((diff / (1000 * 60 * 60 * 24 * 30.44)) % 12),
        Ngày: Math.floor((diff / (1000 * 60 * 60 * 24)) % 30),
        Giờ: Math.floor((diff / (1000 * 60 * 60)) % 24),
        Phút: Math.floor((diff / (1000 * 60)) % 60),
        Giây: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-4 relative z-10">
      <Heart className="text-pink-500 w-16 h-16 mb-6 fill-current animate-bounce" />
      <h2 className="text-pink-600 font-black uppercase tracking-[0.3em] text-sm mb-10">
        Kỷ niệm tình yêu của chúng mình
      </h2>{" "}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(timeLeft).map(([label, val], i) => (
          <div key={i} className="glass-card p-4 rounded-3xl w-24 md:w-32">
            <span className="text-3xl md:text-5xl font-black text-gray-800 block">
              {val || 0}
            </span>
            <span className="text-[10px] font-bold text-pink-500 uppercase">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 4. TimelineItem ---
const TimelineItem = ({ item, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  return (
    <div
      ref={ref}
      className={`flex flex-col md:flex-row items-center w-full mb-32 ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full md:w-[45%] glass-card p-4 rounded-[2.5rem]"
      >
        <div className="overflow-hidden rounded-3xl h-64 mb-4">
          <motion.img
            style={{ y: imageY }}
            src={item.image}
            className="w-full h-full object-cover scale-125"
          />
        </div>
        <h3 className="text-2xl font-black text-gray-800 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{item.content}</p>
      </motion.div>
    </div>
  );
};

// --- 5. Lightbox Portal (Component riêng biệt để cưỡi lên trên mọi thứ) ---
const Lightbox = ({ selectedImg, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden"; // KHÓA CUỘN CHUỘT
    return () => {
      document.body.style.overflow = "unset";
    }; // MỞ LẠI KHI ĐÓNG
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl touch-none"
      onClick={onClose}
    >
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-6 right-6 text-white/70 hover:text-white"
      >
        <X size={40} />
      </motion.button>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-5xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={selectedImg.image}
          className="max-h-[80vh] w-auto rounded-2xl shadow-2xl border border-white/10"
          alt="moment"
        />
        <p className="text-white text-center mt-6 text-xl font-bold italic">
          {selectedImg.caption}
        </p>
      </motion.div>
    </div>,
    document.body, // Dán trực tiếp vào body
  );
};

// --- 6. MomentGallery ---
const MomentGallery = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [loaded, setLoaded] = useState({});

  return (
    <div className="py-20 relative z-10">
      <div className="text-center mb-10 px-4">
        <h2 className="text-3xl font-black text-gray-800 mb-2">
          Khoảnh khắc rạng rỡ
        </h2>
        <p className="text-pink-500 font-medium">Vuốt để xem thêm kỷ niệm ❤️</p>
      </div>

      <div className="horizontal-slider px-10">
        {MOMENTS_DATA.map((moment) => (
          <div key={moment.id} className="slider-item">
            <motion.div
              onClick={() => setSelectedImg(moment)}
              className="glass-card p-3 rounded-4xl cursor-pointer group"
            >
              <div
                className={`relative h-80 rounded-2xl overflow-hidden ${!loaded[moment.id] ? "skeleton" : ""}`}
              >
                <img
                  src={moment.image}
                  loading="lazy"
                  onLoad={() =>
                    setLoaded((prev) => ({ ...prev, [moment.id]: true }))
                  }
                  className={`w-full h-full object-cover transition-opacity duration-500 ${loaded[moment.id] ? "opacity-100" : "opacity-0"}`}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ZoomIn className="text-white w-10 h-10" />
                </div>
              </div>
              <p className="mt-4 text-center text-sm font-bold text-gray-700 italic px-2">
                {moment.caption}
              </p>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImg && (
          <Lightbox
            selectedImg={selectedImg}
            onClose={() => setSelectedImg(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 7. Quiz ---
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
    <div className="max-w-md mx-auto glass-card p-8 rounded-3xl text-center relative z-20">
      {!showResult ? (
        <div>
          <h3 className="text-xl font-bold mb-6 text-gray-800">
            {QUIZ_QUESTIONS[step].question}
          </h3>
          <div className="space-y-3">
            {QUIZ_QUESTIONS[step].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className="w-full p-4 rounded-2xl border-2 border-pink-100 hover:bg-pink-500 hover:text-white transition-all font-bold bg-white/40"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-6">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-pink-600 mb-2">
            Thành tích: {score}/{QUIZ_QUESTIONS.length}
          </h3>
          <button
            onClick={() => {
              setStep(0);
              setScore(0);
              setShowResult(false);
            }}
            className="text-pink-500 font-bold underline"
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
      className="min-h-screen relative font-sans"
      onClick={handleGlobalClick}
    >
      <div className="cherry-blossom-container">{createPetals()}</div>
      {clickHearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: 0, opacity: 1 }}
          animate={{ y: -120, opacity: 0, scale: 2 }}
          className="fixed pointer-events-none z-999 text-2xl"
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
            className="fixed inset-0 z-100 bg-pink-50 flex flex-col justify-center items-center"
          >
            <Heart className="text-pink-500 w-20 h-20 fill-current animate-pulse" />
            <h1 className="text-4xl font-black mt-8">Our Sweet Memory</h1>
            <button
              onClick={() => {
                setIsStarted(true);
                audioRef.current.play();
              }}
              className="mt-12 px-12 py-4 bg-pink-500 text-white rounded-full font-bold shadow-2xl hover:scale-110 transition-transform"
            >
              Bắt đầu ✨
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Hero />
            <LoveMarquee />

            <div className="max-w-6xl mx-auto px-6 py-20 relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-pink-200 -translate-x-1/2 hidden md:block" />
              {TIMELINE_DATA.map((item, idx) => (
                <TimelineItem key={idx} item={item} index={idx} />
              ))}
            </div>

            <MomentGallery />

            <div className="py-20 flex justify-center">
              <Quiz />
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
                    {" "}
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
              Kỉ niệm 4 năm 2022-2026
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
