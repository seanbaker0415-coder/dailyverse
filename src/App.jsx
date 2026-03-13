import { useState, useEffect } from "react";

// Point this at your backend proxy URL
// In development: http://localhost:4000
// In production: https://your-backend.railway.app (or wherever you deploy)
const API_BASE = "https://dailyverse-backend-production.up.railway.app";

const DAILY_VERSES = [
  { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { book: "Psalm", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
  { book: "Philippians", chapter: 4, verse: 13, text: "I can do all things through Christ which strengtheneth me." },
  { book: "Romans", chapter: 8, verse: 28, text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { book: "Proverbs", chapter: 3, verse: 5, text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
  { book: "Isaiah", chapter: 40, verse: 31, text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
  { book: "Jeremiah", chapter: 29, verse: 11, text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
];

const getDayVerse = () => {
  const day = new Date().getDay();
  return DAILY_VERSES[day % DAILY_VERSES.length];
};

const INSIGHT_TABS = [
  { id: "explain", label: "Explanation", icon: "✦" },
  { id: "history", label: "History", icon: "◈" },
  { id: "commentary", label: "Commentary", icon: "◉" },
  { id: "apply", label: "Apply Today", icon: "✿" },
];

const PROMPTS = {
  explain: (v) =>
    `You are a warm, knowledgeable Bible teacher. Explain the meaning of ${v.book} ${v.chapter}:${v.verse} ("${v.text}") in 3-4 sentences. Be clear, accessible, and spiritually enriching. Prose only — no bullet points, no headers.`,
  history: (v) =>
    `You are a biblical historian. In 3-4 sentences, give the historical and cultural background of ${v.book} ${v.chapter}:${v.verse} ("${v.text}"). Who wrote it, when, and what was happening in that era? Prose only — no bullet points.`,
  commentary: (v) =>
    `You are a theological scholar familiar with the great preachers and thinkers of church history. In 4-5 sentences, share how influential Christian voices — such as Spurgeon, Augustine, Wesley, Calvin, or Luther — have interpreted or been inspired by ${v.book} ${v.chapter}:${v.verse} ("${v.text}"). Draw from their actual writings and sermons where possible. Prose only — no bullet points.`,
  apply: (v) =>
    `You are a thoughtful pastor. In 3-4 sentences, give one specific, practical way a person can apply the truth of ${v.book} ${v.chapter}:${v.verse} ("${v.text}") to their life today. Make it concrete and actionable — something they can actually do or think about before tonight. Prose only — no bullet points.`,
};

export default function BibleApp() {
  const verse = getDayVerse();
  const [activeTab, setActiveTab] = useState(null);
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState({});
  const [showPaywall, setShowPaywall] = useState(false);
  const [usageCount, setUsageCount] = useState(() => {
    try { return parseInt(localStorage.getItem("bv_usage") || "0"); } catch { return 0; }
  });
  const FREE_LIMIT = 3;
  const [isPro, setIsPro] = useState(() => {
    try { return localStorage.getItem("bv_pro") === "true"; } catch { return false; }
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Check if user just returned from successful Stripe checkout
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscribed") === "true") {
      setIsPro(true);
      try { localStorage.setItem("bv_pro", "true"); } catch {}
      setShowPaywall(false);
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe checkout page
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
    setCheckoutLoading(false);
  };

  const fetchInsight = async (tabId) => {
    if (content[tabId]) { setActiveTab(tabId); return; }

    if (!isPro) {
      const newCount = usageCount + 1;
      if (newCount > FREE_LIMIT) { setShowPaywall(true); return; }
      setUsageCount(newCount);
      try { localStorage.setItem("bv_usage", newCount); } catch {}
    }

    setActiveTab(tabId);
    setLoading(prev => ({ ...prev, [tabId]: true }));

    try {
      const res = await fetch(`${API_BASE}/api/insight`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: PROMPTS[tabId](verse) }),
      });
      const data = await res.json();
      setContent(prev => ({ ...prev, [tabId]: data.text || "Unable to load insight." }));
    } catch {
      setContent(prev => ({ ...prev, [tabId]: "Unable to load insight right now. Please try again." }));
    }
    setLoading(prev => ({ ...prev, [tabId]: false }));
  };

  const remaining = Math.max(0, FREE_LIMIT - usageCount);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0e0c09",
      fontFamily: "'Georgia', serif",
      color: "#e8dcc8",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(180,140,80,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 80% 100%, rgba(120,80,40,0.08) 0%, transparent 60%)
        `,
      }} />
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='none'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='rgba(255,255,255,0.015)'/%3E%3C/svg%3E")`,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
        
        {/* Header */}
        <header style={{ textAlign: "center", padding: "52px 0 40px" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.35em", color: "#a08840", textTransform: "uppercase", marginBottom: 14 }}>
            King James Version
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 44px)",
            fontWeight: 400,
            margin: 0,
            letterSpacing: "-0.01em",
            color: "#f0e6d0",
            lineHeight: 1.1,
          }}>
            Verse of the Day
          </h1>
          <div style={{
            width: 48, height: 1, background: "linear-gradient(90deg, transparent, #a08840, transparent)",
            margin: "20px auto 0",
          }} />
        </header>

        {/* Date */}
        <div style={{ textAlign: "center", fontSize: 13, color: "#7a6a4a", marginBottom: 36, letterSpacing: "0.08em" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>

        {/* Verse Card */}
        <div style={{
          background: "linear-gradient(145deg, rgba(40,32,20,0.9), rgba(28,22,14,0.95))",
          border: "1px solid rgba(160,136,64,0.2)",
          borderRadius: 16,
          padding: "40px 36px",
          marginBottom: 28,
          position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(160,136,64,0.15)",
        }}>
          <div style={{
            position: "absolute", top: 20, left: 28,
            fontSize: 72, lineHeight: 1, color: "rgba(160,136,64,0.12)",
            fontFamily: "Georgia, serif", pointerEvents: "none",
          }}>"</div>
          
          <p style={{
            fontSize: "clamp(17px, 3vw, 21px)",
            lineHeight: 1.75,
            color: "#f0e6d0",
            margin: "0 0 24px",
            position: "relative",
            fontStyle: "italic",
          }}>
            {verse.text}
          </p>
          
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ height: 1, flex: 1, background: "rgba(160,136,64,0.2)" }} />
            <span style={{ fontSize: 13, color: "#a08840", letterSpacing: "0.12em", fontStyle: "normal", fontFamily: "Georgia, serif" }}>
              {verse.book} {verse.chapter}:{verse.verse}
            </span>
            <div style={{ height: 1, flex: 1, background: "rgba(160,136,64,0.2)" }} />
          </div>
        </div>

        {/* Usage indicator */}
        {remaining <= FREE_LIMIT && (
          <div style={{ textAlign: "center", fontSize: 12, color: "#6a5a3a", marginBottom: 20, letterSpacing: "0.06em" }}>
            {remaining > 0 ? `${remaining} free insight${remaining !== 1 ? "s" : ""} remaining today` : "Upgrade for unlimited insights"}
          </div>
        )}

        {/* AI Insight Tabs */}
        <div style={{ marginBottom: 4 }}>
          <div style={{
            fontSize: 10, letterSpacing: "0.3em", color: "#6a5a3a", textTransform: "uppercase",
            textAlign: "center", marginBottom: 16,
          }}>
            AI Insights — tap to explore
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8,
          }}>
            {INSIGHT_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => fetchInsight(tab.id)}
                style={{
                  background: activeTab === tab.id
                    ? "linear-gradient(145deg, rgba(160,136,64,0.25), rgba(120,96,32,0.2))"
                    : "linear-gradient(145deg, rgba(30,24,14,0.8), rgba(20,16,10,0.9))",
                  border: activeTab === tab.id
                    ? "1px solid rgba(160,136,64,0.5)"
                    : "1px solid rgba(160,136,64,0.12)",
                  borderRadius: 10,
                  padding: "14px 8px",
                  cursor: "pointer",
                  color: activeTab === tab.id ? "#d4a840" : "#7a6a4a",
                  textAlign: "center",
                  transition: "all 0.2s ease",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                }}
              >
                <span style={{ fontSize: 18 }}>{tab.icon}</span>
                <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Insight Content */}
        {activeTab && (
          <div style={{
            marginTop: 16,
            background: "linear-gradient(145deg, rgba(35,28,16,0.95), rgba(25,20,10,0.98))",
            border: "1px solid rgba(160,136,64,0.18)",
            borderRadius: 14,
            padding: "32px 28px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "fadeIn 0.3s ease",
          }}>
            {loading[activeTab] ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{
                  display: "inline-flex", gap: 6, alignItems: "center",
                  color: "#a08840", fontSize: 13, letterSpacing: "0.1em",
                }}>
                  <span style={{ animation: "pulse 1.2s ease-in-out infinite" }}>✦</span>
                  <span>Generating insight...</span>
                </div>
              </div>
            ) : (
              <>
                <div style={{
                  fontSize: 10, letterSpacing: "0.3em", color: "#a08840",
                  textTransform: "uppercase", marginBottom: 16,
                }}>
                  {INSIGHT_TABS.find(t => t.id === activeTab)?.label}
                </div>
                <p style={{
                  fontSize: 15, lineHeight: 1.8, color: "#d4c8aa", margin: 0,
                }}>
                  {content[activeTab]}
                </p>
              </>
            )}
          </div>
        )}

        {/* Paywall Modal */}
        {showPaywall && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(8,6,3,0.92)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
            onClick={() => setShowPaywall(false)}
          >
            <div
              style={{
                background: "linear-gradient(145deg, #1a1508, #120f05)",
                border: "1px solid rgba(160,136,64,0.3)",
                borderRadius: 20,
                padding: "44px 36px",
                maxWidth: 400, width: "100%",
                textAlign: "center",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(160,136,64,0.2)",
              }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>✦</div>
              <h2 style={{ fontSize: 22, fontWeight: 400, margin: "0 0 12px", color: "#f0e6d0" }}>
                Unlock Unlimited Insights
              </h2>
              <p style={{ fontSize: 14, color: "#8a7a5a", lineHeight: 1.7, margin: "0 0 28px" }}>
                You've used your 3 free daily insights. Upgrade to explore every verse, every day — with no limits.
              </p>

              <div style={{
                background: "rgba(160,136,64,0.08)", border: "1px solid rgba(160,136,64,0.2)",
                borderRadius: 12, padding: "20px", marginBottom: 24,
              }}>
                <div style={{ fontSize: 28, fontWeight: 300, color: "#d4a840", marginBottom: 4 }}>$4.99</div>
                <div style={{ fontSize: 12, color: "#8a7a5a", letterSpacing: "0.1em" }}>PER MONTH · CANCEL ANYTIME</div>
                <div style={{ marginTop: 14, fontSize: 12, color: "#9a8a6a", lineHeight: 1.9 }}>
                  ✦ Unlimited AI insights daily<br />
                  ✦ All 4 insight types<br />
                  ✦ New verse every day
                </div>
              </div>

              <button style={{
                width: "100%", padding: "16px",
                background: "linear-gradient(135deg, #c4982a, #a07820)",
                border: "none", borderRadius: 10, cursor: "pointer",
                color: "#1a1205", fontSize: 15, fontWeight: 600, letterSpacing: "0.05em",
                marginBottom: 12, fontFamily: "Georgia, serif",
              }} onClick={handleCheckout}>
                {checkoutLoading ? "Redirecting..." : "Start Free 7-Day Trial"}
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                style={{
                  background: "none", border: "none", color: "#5a4a2a",
                  fontSize: 13, cursor: "pointer", letterSpacing: "0.06em",
                }}
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        * { box-sizing: border-box; }
        button:hover { opacity: 0.88; }
      `}</style>
    </div>
  );
}
