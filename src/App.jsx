import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Stars, Send } from 'lucide-react';

// Custom Generated Romantic Bear Artworks
const ASKING_BEAR_IMG = "/cute_bear_asking.png";
const CELEBRATE_BEAR_IMG = "/cute_bear_celebrating.png";
const ASKING_BEAR_GIF_FALLBACK = "https://media.tenor.com/Z8pS7gS6Jm8AAAAi/cute-bear.gif";


// Playful dodge message hints
const DODGE_MESSAGES = [
  "Please say yes? 🥺",
  "Are you sure? 🥺",
  "Really sure?? 💔",
  "Think again! 😭",
  "Don't do this to me! 🧸",
  "You're clicking the wrong button! 😜",
  "Nice try! Still NO? 🙈",
  "The YES button is right there! ✨",
  "Resistance is futile! ❤️",
  "You can't escape my love! 💖"
];

// Background Floating Hearts
const FLOATING_HEARTS_COUNT = 30;

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState(null); // { top, left } for absolute fixed positioning
  const [bearImgSrc, setBearImgSrc] = useState(ASKING_BEAR_IMG);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const cardRef = useRef(null);


  // Generate deterministic floating hearts parameters for background animation
  useEffect(() => {
    const hearts = Array.from({ length: FLOATING_HEARTS_COUNT }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: Math.random() * 24 + 14, // px
      duration: Math.random() * 8 + 8, // seconds
      delay: Math.random() * 10, // seconds
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setFloatingHearts(hearts);
  }, []);

  // Teleport NO button randomly around the screen within safe viewport bounds
  const moveNoButton = () => {
    const padding = 80;
    const maxX = window.innerWidth - 160;
    const maxY = window.innerHeight - 80;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    setNoPosition({ left: `${randomX}px`, top: `${randomY}px` });
    setNoCount((prev) => prev + 1);
  };

  // Handle YES button click
  const handleAccept = () => {
    setAccepted(true);
    setBearImgSrc(CELEBRATE_BEAR_GIF);

    // Initial big burst of confetti
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#ff0055', '#ff6699', '#ff99cc', '#ffffff', '#ffd700'],
    });

    // Continuous side-cannon bursts
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Left side cannon
      confetti({
        particleCount,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff0055', '#ff6699', '#ff99cc', '#ffd700'],
      });

      // Right side cannon
      confetti({
        particleCount,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#ff0055', '#ff6699', '#ff99cc', '#ffd700'],
      });
    }, 250);
  };

  // Calculate dynamic scale for YES button (grows as NO is dodged)
  const yesButtonScale = Math.min(1 + noCount * 0.22, 3.5);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-pink-300 via-rose-300 to-purple-400 p-4">

      {/* Animated Floating Hearts Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {floatingHearts.map((h) => (
          <div
            key={h.id}
            className="absolute bottom-0 text-pink-500/50 animate-float-up"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animationDuration: `${h.duration}s`,
              animationDelay: `${h.delay}s`,
              opacity: h.opacity,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Subtle Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-pink-400/30 rounded-full blur-3xl pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-purple-400/30 rounded-full blur-3xl pointer-events-none animate-pulse-soft" style={{ animationDelay: '1.2s' }} />

      {/* Main Glassmorphism Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
        className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-3xl p-6 sm:p-8 text-center flex flex-col items-center justify-center space-y-6"
      >
        {/* Floating Sparkles Header Badge */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 text-pink-600 text-xs sm:text-sm font-semibold shadow-sm border border-pink-200"
        >
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span>Special Question For You</span>
          <Sparkles className="w-4 h-4 text-pink-500" />
        </motion.div>

        {/* Cute Bear Picture Container - Polaroid Frame */}
        <motion.div
          key={accepted ? "accepted-img" : "asking-img"}
          initial={{ scale: 0.85, opacity: 0, rotate: -2 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          whileHover={{ scale: 1.03, rotate: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
          className="relative w-48 h-56 sm:w-56 sm:h-64 bg-white p-3 rounded-2xl shadow-xl border border-pink-100 flex flex-col items-center justify-between group cursor-pointer"
        >
          {/* Heart Sticker Top Right */}
          <div className="absolute -top-2 -right-2 bg-pink-500 text-white p-1.5 rounded-full shadow-md z-20 group-hover:scale-110 transition-transform">
            <Heart className="w-4 h-4 fill-current" />
          </div>

          <div className="w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-pink-50 flex items-center justify-center border border-pink-50">
            <img
              src={bearImgSrc}
              onError={() => {
                if (bearImgSrc === ASKING_BEAR_IMG) setBearImgSrc(ASKING_BEAR_GIF_FALLBACK);
              }}
              alt="Cute Bear Romantic Art"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <p className="text-xs font-bold text-pink-400 tracking-wide font-sans">
            {accepted ? "Me & You Forever 💖" : "For My Favorite Person ✨"}
          </p>
        </motion.div>


        {/* Dynamic Heading */}
        <div className="space-y-2">
          <motion.h1
            key={accepted ? "accepted-heading" : "asking-heading"}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl sm:text-3xl font-bold text-gray-800 leading-snug drop-shadow-sm"
          >
            {accepted ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600">
                YAY! I love you so much! 🥰❤️🎉
              </span>
            ) : (
              "sorry for everything baby ni daddy, Will you be my girlfriend again? 💖"
            )}
          </motion.h1>

          {/* Subtext / Hint message */}
          {!accepted && (
            <p className="text-sm font-medium text-pink-600 transition-all duration-300 h-6">
              {noCount > 0 ? DODGE_MESSAGES[Math.min(noCount - 1, DODGE_MESSAGES.length - 1)] : "Please say yes? 🥺"}
            </p>
          )}

          {accepted && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm font-medium text-rose-500"
            >
              You're the best thing that ever happened to me! ✨🌸
            </motion.p>
          )}
        </div>

        {/* Buttons Section */}
        <div className="relative w-full flex items-center justify-center gap-4 pt-2 min-h-[70px]">
          {/* YES Button */}
          <motion.button
            onClick={handleAccept}
            style={{ scale: yesButtonScale }}
            whileHover={{ scale: yesButtonScale * 1.06 }}
            whileTap={{ scale: yesButtonScale * 0.95 }}
            className={`px-8 py-3.5 rounded-full font-bold text-white shadow-lg transition-colors flex items-center gap-2 z-20 cursor-pointer ${accepted
                ? "bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 shadow-pink-300"
                : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200"
              }`}
          >
            <Heart className="w-5 h-5 fill-current animate-pulse" />
            <span>{accepted ? "Forever & Always 💖" : "YES"}</span>
          </motion.button>

          {/* Dodging NO Button */}
          {!accepted && (
            <motion.button
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
              style={
                noPosition
                  ? {
                    position: 'fixed',
                    top: noPosition.top,
                    left: noPosition.left,
                    zIndex: 50,
                  }
                  : {}
              }
              animate={noPosition ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.15 }}
              className="px-8 py-3.5 rounded-full font-bold text-white bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200 cursor-pointer z-10 transition-shadow select-none"
            >
              NO
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
