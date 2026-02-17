"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import "styles/themes.css";
import "styles/auth.css"
import "styles/globals.css"

type Mode = "login" | "signup" | "forgot";

export default function AuthPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const legalContentRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup extras
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [agree, setAgree] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // theme
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", savedTheme);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  const scrollToLegalSection = useCallback((sectionId: string) => {
    if (legalContentRef.current) {
      const section = legalContentRef.current.querySelector(`#${sectionId}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) {
      return;
    }

    const sectionMap: Record<string, string> = {
      privacy: "privacy-policy",
      cookies: "cookies-policy",
      terms: "terms",
    };

    const targetId = sectionMap[tab];
    if (targetId) {
      requestAnimationFrame(() => scrollToLegalSection(targetId));
    }
  }, [searchParams, scrollToLegalSection]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/profile");
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!agree) {
      setError("You must accept all legal policies to continue.");
      scrollToLegalSection("privacy-policy");
      return;
    }

    setLoading(true);

    // 1. Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
          date_of_birth: dob,
        },
      },
    });

    if (error || !data.user) {
      setLoading(false);
      const rawMessage = error?.message || "Signup failed";
      const normalizedMessage = rawMessage.toLowerCase();
      const isEmailInUse = normalizedMessage.includes("already registered")
        || normalizedMessage.includes("already in use")
        || normalizedMessage.includes("email already")
        || normalizedMessage.includes("user already")
        || normalizedMessage.includes("duplicate");
      setError(isEmailInUse ? "Email is already used." : rawMessage);
      return;
    }

    setLoading(false);

    if (data.session) {
      router.replace("/profile");
      return;
    }

    setInfo("🎉 Account created! Please verify your email before logging in.");
    setMode("login");
    
    // Clear form
    setFullName("");
    setUsername("");
    setDob("");
    setEmail("");
    setPassword("");
    setAgree(false);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setInfo("Password reset email sent! Check your inbox and spam folder.");
    }
  }

  return (
    <div className="auth-container">
      {/* Theme Toggle */}
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        <span className="theme-icon">
          {theme === "light" ? "🌙" : "☀️"}
        </span>
      </button>

      <div className="auth-grid">
        {/* Left Auth Card - Fixed */}
        <div className="auth-card-wrapper">
          <div className="auth-card">
            <div className="brand-header">
              <Image src="/brand/logo.png" alt="Investt Logo" width={329/3} height={274/3} className="brand-logo" />
              <h1 className="brand-title">
                <span className="brand-gradient">Investt</span>
              </h1>
              <p className="brand-subtitle">
                Master finance through intelligent simulation
              </p>
            </div>

            {/* Mode Tabs */}
            <div className="mode-tabs">
              <button 
                className={`mode-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button 
                className={`mode-tab ${mode === "signup" ? "active" : ""}`}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
              <button 
                className={`mode-tab ${mode === "forgot" ? "active" : ""}`}
                onClick={() => setMode("forgot")}
              >
                Forgot
              </button>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="status-message error">
                <span className="status-icon">⚠️</span>
                {error}
              </div>
            )}
            {info && (
              <div className="status-message success">
                <span className="status-icon">✅</span>
                {info}
              </div>
            )}

            {/* Forms */}
            <div className="form-container">
              {mode === "login" && (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`submit-btn ${loading ? "loading" : ""}`}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Authenticating...
                      </>
                    ) : (
                      "Sign In →"
                    )}
                  </button>
                </form>
              )}

              {mode === "signup" && (
                <form onSubmit={handleSignup} className="auth-form">
                  <div className="form-grid">
                    <div className="input-group">
                      <label htmlFor="fullName">Full Name</label>
                      <input
                        id="fullName"
                        type="text"
                        placeholder="Priyanshi"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input-field"
                      />
                    </div><br />
                    <div className="input-group">
                      <label htmlFor="username">Username</label>
                      <input
                        id="username"
                        type="text"
                        placeholder="rasha_phos"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="input-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="signupEmail">Email Address</label>
                    <input
                      id="signupEmail"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="signupPassword">Password</label>
                    <input
                      id="signupPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                    />
                    <small className="password-hint">
                      Minimum 6 characters with uppercase, lowercase, and number
                    </small>
                  </div>
                  
                  <div className="legal-agreement">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      <span className="checkbox-text">
                        I agree to all{" "}
                        <button 
                          type="button" 
                          className="legal-link"
                          onClick={() => scrollToLegalSection("terms")}
                        >
                          Terms of Service
                        </button>
                        ,{" "}
                        <button 
                          type="button" 
                          className="legal-link"
                          onClick={() => scrollToLegalSection("privacy-policy")}
                        >
                          Privacy Policy
                        </button>
                        , and{" "}
                        <button 
                          type="button" 
                          className="legal-link"
                          onClick={() => scrollToLegalSection("cookies-policy")}
                        >
                          Cookies Policy
                        </button>
                      </span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading || !agree}
                    className={`submit-btn ${loading ? "loading" : ""} ${!agree ? "disabled" : ""}`}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              )}

              {mode === "forgot" && (
                <form onSubmit={handleForgot} className="auth-form">
                  <div className="input-group">
                    <label htmlFor="forgotEmail">Email Address</label>
                    <input
                      id="forgotEmail"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                    />
                    <small className="form-hint">
                      We&apos;ll send a reset link to your email
                    </small>
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`submit-btn ${loading ? "loading" : ""}`}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              )}
            </div>

            {/* Footer Links */}
            <div className="auth-footer">
              {mode === "login" ? (
                <>
                  <button 
                    onClick={() => setMode("signup")}
                    className="footer-link"
                  >
                    Don&apos;t have an account? <strong>Sign up</strong>
                  </button>
                  <button 
                    onClick={() => setMode("forgot")}
                    className="footer-link"
                  >
                    Forgot your password?
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setMode("login")}
                  className="footer-link"
                >
                  Already have an account? <strong>Sign in</strong>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Legal Content - Scrollable */}
        <div className="legal-container" ref={legalContentRef}>
          <div className="legal-content">
            <LegalContent />
          </div>
        </div>
      </div>
    </div>
  );
}

function LegalContent() {
  return (
    <>
      <section id="privacy-policy" className="legal-section">
        <h2>Privacy Policy</h2>
        <p><strong>Last Updated:</strong> January 1, 2026</p>
        
        <h3>1. Information We Collect</h3>
        <p>
          <strong>Personal Information:</strong> When you register for Investt, we collect your full name, 
          username, email address, date of birth, and password. This information is essential for creating 
          and securing your account, personalizing your learning experience, and complying with age-based 
          regulations.
        </p>
        <p>
          <strong>Usage Data:</strong> We automatically collect information about your interactions with the 
          platform, including simulation activities, learning progress, time spent on modules, quiz results, 
          and feature usage patterns. This data is aggregated and anonymized for platform improvement.
        </p>
        <p>
          <strong>Technical Information:</strong> We collect browser type, operating system, device 
          information, IP address (anonymized), and cookies necessary for platform functionality.
        </p>

        <h3>2. How We Use Your Information</h3>
        <p>
          • To provide, maintain, and improve the Investt educational platform<br/>
          • To personalize your learning journey and recommend relevant content<br/>
          • To authenticate users and secure accounts against unauthorized access<br/>
          • To communicate important updates, security alerts, and support messages<br/>
          • To analyze platform usage for research and development purposes<br/>
          • To comply with legal obligations and enforce our Terms of Service
        </p>

        <h3>3. Data Security</h3>
        <p>
          We implement enterprise-grade security measures including end-to-end encryption, regular security 
          audits, intrusion detection systems, and strict access controls. All data is encrypted at rest 
          using AES-256 encryption and in transit using TLS 1.3. We undergo annual third-party security 
          audits and maintain SOC 2 Type II compliance.
        </p>

        <h3>4. Data Retention</h3>
        <p>
          We retain your personal information only for as long as necessary to provide our services and 
          fulfill the purposes outlined in this policy. Account data is retained for 7 years after account 
          deactivation for legal and compliance reasons. You may request data deletion at any time by 
          contacting our Data Protection Officer at privacy@investt.com.
        </p>

        <h3>5. Your Rights</h3>
        <p>
          You have the right to access, correct, delete, or restrict processing of your personal data. 
          You may also object to processing, request data portability, and withdraw consent at any time. 
          To exercise these rights, contact us at privacy@investt.com.
        </p>
      </section>

      <section id="cookies-policy" className="legal-section">
        <h2>Cookies Policy</h2>
        
        <h3>Essential Cookies</h3>
        <p>
          <strong>Session Cookies:</strong> Required for maintaining your login state and session security. 
          These cookies are deleted when you close your browser.
        </p>
        <p>
          <strong>Authentication Cookies:</strong> Used to verify your identity and protect against 
          unauthorized access. These include CSRF tokens and authentication tokens.
        </p>
        <p>
          <strong>Preference Cookies:</strong> Store your theme preferences, language settings, and 
          accessibility options to enhance your user experience.
        </p>

        <h3>Analytics Cookies</h3>
        <p>
          We use first-party analytics cookies to understand how users interact with our platform. These 
          cookies collect aggregated data that cannot be used to identify individual users. We track metrics 
          such as feature usage, navigation patterns, and learning progression to improve platform 
          performance and educational effectiveness.
        </p>

        <h3>Cookie Management</h3>
        <p>
          You can control cookie settings through your browser preferences. However, disabling essential 
          cookies may prevent certain platform features from functioning correctly. Most browsers allow 
          you to block or delete cookies. For detailed instructions, visit your browser&apos;s help section.
        </p>

        <h3>No Third-Party Tracking</h3>
        <p>
          Investt does not use third-party advertising cookies, tracking pixels, or behavioral profiling 
          technologies. We do not participate in ad networks or share data with advertising platforms.
        </p>
      </section>

      <section id="terms" className="legal-section">
        <h2>Terms of Service</h2>
        
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using the Investt platform, you agree to be bound by these Terms of Service. 
          If you disagree with any part of these terms, you may not access the service. These terms 
          constitute a legally binding agreement between you and Investt.
        </p>

        <h3>2. Educational Purpose</h3>
        <p>
          Investt is exclusively an educational platform designed to teach financial concepts through 
          simulation. All market scenarios, investment outcomes, and financial data are simulated and 
          hypothetical. No real money is involved in any platform activities.
        </p>

        <h3>3. User Responsibilities</h3>
        <p>
          • Maintain the confidentiality of your account credentials<br/>
          • Provide accurate and complete registration information<br/>
          • Notify us immediately of any unauthorized account access<br/>
          • Use the platform in compliance with all applicable laws<br/>
          • Refrain from attempting to reverse engineer or hack the platform<br/>
          • Not engage in activities that disrupt platform performance
        </p>

        <h3>4. Prohibited Activities</h3>
        <p>
          • Creating multiple accounts for fraudulent purposes<br/>
          • Using automated scripts or bots to interact with the platform<br/>
          • Attempting to access other users&apos; accounts or data<br/>
          • Distributing malware or engaging in cyberattacks<br/>
          • Scraping, mining, or extracting platform data without authorization<br/>
          • Misrepresenting simulated outcomes as real financial results
        </p>

        <h3>5. Termination</h3>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms. Termination 
          may result in forfeiture of all platform data and progress. Users may appeal termination 
          decisions by contacting legal@investt.com.
        </p>
      </section>

      <section className="legal-section">
        <h2>⚠️ Financial Disclaimer</h2>
        <p>
          <strong>INVESTT DOES NOT PROVIDE FINANCIAL ADVICE.</strong> All content, simulations, and 
          educational materials are for informational and educational purposes only. Nothing on this 
          platform should be construed as investment advice, financial planning, or trading 
          recommendations.
        </p>
        <p>
          <strong>Simulated Results Are Not Indicative of Real Outcomes:</strong> Past simulated 
          performance does not guarantee future results. The financial markets involve substantial risk, 
          and actual investments may experience significant losses. Always consult with a qualified 
          financial advisor before making investment decisions.
        </p>
        <p>
          <strong>No Real Money Involved:</strong> Investt operates exclusively with virtual currency in 
          simulated environments. No real financial transactions occur through our platform.
        </p>
      </section>

      <section className="legal-section">
        <h2>Child Safety & Age Policy</h2>
        <p>
          Investt complies with the Children&apos;s Online Privacy Protection Act (COPPA) and similar 
          international regulations. Users under 13 years of age are not permitted to create accounts 
          without verifiable parental consent.
        </p>
        <p>
          <strong>Age Verification:</strong> We collect date of birth during registration to enforce 
          age restrictions. Users aged 13-17 may require parental consent depending on jurisdiction.
        </p>
        <p>
          <strong>Parental Controls:</strong> Parents may request access to, correction of, or deletion 
          of their child&apos;s information by contacting safety@investt.com with appropriate verification.
        </p>
        <p>
          <strong>Educational Focus:</strong> All content is age-appropriate and focused on educational 
          development. We do not collect unnecessary personal information from minor users.
        </p>
      </section>

      <section className="legal-section">
        <h2>© Intellectual Property</h2>
        <p>
          <strong>Ownership:</strong> All platform code, algorithms, simulations, user interfaces, 
          design elements, written content, video materials, and educational frameworks are the 
          exclusive intellectual property of Investt or its licensors.
        </p>
        <p>
          <strong>License:</strong> Users are granted a limited, non-exclusive, non-transferable license 
          to access and use the platform for personal educational purposes. This license does not permit 
          commercial use, redistribution, or modification of platform content.
        </p>
        <p>
          <strong>Prohibited Uses:</strong> You may not copy, reproduce, distribute, modify, create 
          derivative works of, publicly display, or exploit any platform content without express written 
          permission.
        </p>
        <p>
          <strong>Trademarks:</strong> &quot;Investt&quot; and the Investt logo are registered trademarks. Use of 
          these marks without permission is strictly prohibited.
        </p>
      </section>

      <section className="legal-section">
        <h2>🌐 International Compliance</h2>
        <p>
          Investt complies with the General Data Protection Regulation (GDPR) for users in the European 
          Union, the California Consumer Privacy Act (CCPA) for California residents, and other 
          applicable international data protection laws.
        </p>
        <p>
          <strong>Data Transfers:</strong> Data may be transferred to and processed in countries outside 
          your residence. We ensure adequate protection through Standard Contractual Clauses and other 
          legal mechanisms.
        </p>
        <p>
          <strong>Contact Information:</strong> For privacy concerns, contact our Data Protection Officer 
          at rudra.investt@gmail.com. For legal inquiries, contact rudra070311@gmail.com.
        </p>
      </section>
    </>
  );
}