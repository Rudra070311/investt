"use client";

import Image from "next/image";
import "styles/themes.css"
import "styles/landing.css";
import "styles/globals.css";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import "styles/landing.css";

export default function LandingPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  // ---------- THEME ----------
  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" || 
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  // ---------- CAROUSEL ----------
  const slides = [
    {
      title: "Learn Finance",
      description: "From zero to hero – master stocks, crypto, and macroeconomics.",
      icon: "📈",
      color: "var(--color-primary-500)",
    },
    {
      title: "Simulate Markets",
      description: "Trade with $100k virtual cash. No risk, real skills.",
      icon: "💹",
      color: "var(--color-accent-500)",
    },
    {
      title: "Think Critically",
      description: "AI‑powered scenarios that train your investment intuition.",
      icon: "🧩",
      color: "var(--color-success-500)",
    },
    {
      title: "Earn Certificates",
      description: "Prove your expertise with blockchain‑verified credentials.",
      icon: "🎓",
      color: "var(--color-warning-500)",
    },
  ];

  useEffect(() => {
    carouselInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(carouselInterval.current);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    clearInterval(carouselInterval.current);
    carouselInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
  };

  // ---------- SCROLL REVEAL ----------
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      {/* ----- CRAZY BACKGROUND ----- */}
      <div className="noise"></div>
      <div className="gradient-sphere"></div>

      {/* ----- THEME TOGGLE (same as auth) ----- */}
      <button className="landing-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        <span className="theme-icon">{theme === "light" ? "🌙" : "☀️"}</span>
      </button>

      {/* ----- HERO ----- */}
      <header className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            <Image src="/brand/image (6).png" alt="Investt Logo" width={522/2} height={532/2} className="hero-logo" /><br />
            <span className="glitch" data-text="Investt">Investt</span>
          </h1>
          <p className="hero-subtitle">
            The <span className="gradient-text">crazzy</span> way to master finance.<br />
            Account Creation <span className="gradient-text">OPEN</span>
          </p>
          <Link href="/auth" className="get-started-btn">
            Get Started
            <span className="btn-glow"></span>
          </Link>
        </div>
      </header>

      {/* ----- CAROUSEL SECTION ----- */}
      <section className="carousel-section">
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="carousel-slide">
                <div className="slide-icon" style={{ backgroundColor: slide.color }}>
                  <span>{slide.icon}</span>
                </div>
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            ))}
          </div>

          {/* Carousel controls */}
          <div className="carousel-dots">
            {slides.map((_, i) => (
              <button
                key={i}
                className={`dot ${currentSlide === i ? "active" : ""}`}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ----- HOW IT WORKS (reveal) ----- */}
      <section className="how-it-works reveal">
        <div className="section-header">
          <span className="section-number">01</span>
          <h2>How it <span className="gradient-text">works</span></h2>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-icon">1️⃣</div>
            <h3>Sign up</h3>
            <p>Create your account – it takes 30 seconds.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">2️⃣</div>
            <h3>Get $100k virtual</h3>
            <p>We credit your portfolio instantly.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">3️⃣</div>
            <h3>Learn & trade</h3>
            <p>Take courses, analyze markets, place orders.</p>
          </div>
          <div className="step-card">
            <div className="step-icon">4️⃣</div>
            <h3>Earn & level up</h3>
            <p>Certificates, leaderboards, and creator status.</p>
          </div>
        </div>
      </section>

      {/* ----- OUR AIM (reveal) ----- */}
      <section className="our-aim reveal">
        <div className="section-header">
          <span className="section-number">02</span>
          <h2>Our <span className="gradient-text">mission</span></h2>
        </div>
        <div className="aim-content">
          <div className="aim-text">
            <p className="aim-quote">
              &apos;We believe financial education should be <strong>free, fun, and fearless</strong>.&apos;
            </p>
            <p>
              Investt exists to break the barrier between complex finance and everyday people.
              No fancy jargon. No upsell. Just pure, simulated learning.
            </p>
            <div className="stats">
              <div className="stat">
                <span className="stat-number">0$</span>
                <span className="stat-label">Real money involved</span>
              </div>
              <div className="stat">
                <span className="stat-number">∞</span>
                <span className="stat-label">Learning opportunities</span>
              </div>
            </div>
          </div>
          <div className="aim-visual">
            <div className="floating-shapes">
              <div className="shape"></div>
              <div className="shape"></div>
              <div className="shape"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ----- WHAT WE DO (reveal) ----- */}
      <section className="what-we-do reveal">
        <div className="section-header">
          <span className="section-number">03</span>
          <h2>What we <span className="gradient-text">do</span></h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>Interactive courses</h3>
            <p>From compound interest to options trading – gamified and practical.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real‑time simulation</h3>
            <p>Live market data, order books, and portfolio analytics.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI tutor</h3>
            <p>Ask anything. Our AI explains concepts like you&apos;re 5.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏅</div>
            <h3>Verified certificates</h3>
            <p>Shareable credentials – verifiable on blockchain.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Discuss strategies, follow creators, learn together.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Privacy first</h3>
            <p>No data selling. No ads. Ever.</p>
          </div>
        </div>
      </section>

      {/* ----- LEGAL & COMPLIANCE (reveal) ----- */}
      <section className="legal-summary reveal">
        <div className="section-header">
          <span className="section-number">04</span>
          <h2>Trust & <span className="gradient-text">legals</span></h2>
        </div>
        <div className="legal-grid">
          <div className="legal-card">
            <h3>🔒 Privacy</h3>
            <p>We collect only what&apos;s necessary. No tracking, no third‑party sharing.</p>
            <Link href="/auth?tab=privacy" className="legal-link">Read more →</Link>
          </div>
          <div className="legal-card">
            <h3>🍪 Cookies</h3>
            <p>Essential cookies only – for login, theme, and security.<br /><br /></p>
            <Link href="/auth?tab=cookies" className="legal-link">Read more →</Link>
          </div>
          <div className="legal-card">
            <h3>📜 Terms</h3>
            <p>Simulated environment. No real financial advice.<br /><br /></p>
            <Link href="/auth?tab=terms" className="legal-link">Read more →</Link>
          </div>
          <div className="legal-card">
            <h3>⚠️ Disclaimer</h3>
            <p>Past simulated performance ≠ future results.<br /><br /></p>
            <Link href="/auth?tab=disclaimer" className="legal-link">Read more →</Link>
          </div>
        </div>
        <p className="legal-footnote">
          By using Investt, you agree to our full <Link href="/auth?tab=terms">Terms</Link> and <Link href="/auth?tab=privacy">Privacy Policy</Link>.
        </p>
      </section>

      {/* ----- FINAL CTA ----- */}
      <section className="final-cta">
        <h2>Ready to go <span className="gradient-text">crazzzzzzzzy</span>?</h2>
        <Link href="auth" className="get-started-btn">
          Start your journey
        </Link>
      </section>

      {/* ----- FOOTER ----- */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} Investt. All rights reserved.</p>
        <p>Made with ☕️ and crazzy ambition.</p>
      </footer>
      <div className="cursor-glow"></div>
    </div>
  );
}