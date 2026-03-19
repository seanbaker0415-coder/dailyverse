import { useState, useEffect } from "react";

const API_BASE = "https://dailyverse-backend-production.up.railway.app";
const APP_URL = "https://dailyverse-eight.vercel.app";

const DAILY_VERSES = [
  { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { book: "Psalm", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
  { book: "Philippians", chapter: 4, verse: 13, text: "I can do all things through Christ which strengtheneth me." },
  { book: "Romans", chapter: 8, verse: 28, text: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { book: "Proverbs", chapter: 3, verse: 5, text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
  { book: "Isaiah", chapter: 40, verse: 31, text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
  { book: "Jeremiah", chapter: 29, verse: 11, text: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
];

const getDayVerse = () => DAILY_VERSES[new Date().getDay() % DAILY_VERSES.length];

const INSIGHT_TABS = [
  { id: "explain", label: "What It Means", icon: "✦", proOnly: false },
  { id: "history", label: "The Background", icon: "◈", proOnly: true },
  { id: "story", label: "A Story", icon: "◉", proOnly: true },
  { id: "apply", label: "Your Challenge Today", icon: "✿", proOnly: true },
  { id: "prayer", label: "Pray With This", icon: "🙏", proOnly: true },
];

const PROMPTS = {
  explain: (v) =>
    `Write 3-4 sentences explaining what ${v.book} ${v.chapter}:${v.verse} ("${v.text}") means. Write in third person — do not use "I" or "we". Use plain, everyday language that any adult can understand. Be warm and clear, not preachy. No bullet points, no headers, no hashtags, no markdown formatting of any kind.`,
  history: (v) =>
    `Write 3-4 sentences describing the historical background of ${v.book} ${v.chapter}:${v.verse} ("${v.text}"). Who wrote it, when, and what was happening at that time? Write in third person — do not use "I" or "we". Keep it simple and vivid. No bullet points, no headers, no hashtags, no markdown formatting of any kind.`,
  story: (v) =>
    `Write a short real-world story (3-4 sentences) that illustrates the truth of ${v.book} ${v.chapter}:${v.verse} ("${v.text}"). Make it about an ordinary person in an everyday situation — not a missionary or celebrity. Write in third person — do not use "I" or "we". Keep it grounded and genuine, not sentimental or over-dramatic. No bullet points, no headers, no hashtags, no markdown formatting of any kind.`,
  apply: (v) =>
    `Write 3-4 sentences giving one specific, practical thing a person can do today based on ${v.book} ${v.chapter}:${v.verse} ("${v.text}"). Speak directly to the reader using "you". Make it concrete and doable — something simple they can actually do today. Keep it warm but direct. No bullet points, no headers, no hashtags, no markdown formatting of any kind.`,
  prayer: (v) =>
    `Write a short, sincere prayer (4-5 sentences) inspired by ${v.book} ${v.chapter}:${v.verse} ("${v.text}"). Write in first person — the reader is speaking directly to God. Keep it conversational, humble, and genuine. It should feel like something a real person would actually pray out loud, not formal or overly religious. No bullet points, no headers, no hashtags, no markdown formatting of any kind.`,
};

// Streak helpers
const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getStreak = () => {
  try {
    const last = localStorage.getItem("bv_streak_date");
    const count = parseInt(localStorage.getItem("bv_streak_count") || "0");
    const today = getTodayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (last === today) return count;
    if (last === yesterday) return count; // still alive, will increment on visit
    return 0; // streak broken
  } catch { return 0; }
};

const updateStreak = () => {
  try {
    const last = localStorage.getItem("bv_streak_date");
    const count = parseInt(localStorage.getItem("bv_streak_count") || "0");
    const today = getTodayKey();
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (last === today) return count; // already updated today
    const newCount = last === yesterday ? count + 1 : 1;
    localStorage.setItem("bv_streak_date", today);
    localStorage.setItem("bv_streak_count", newCount);
    return newCount;
  } catch { return 1; }
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
  const FREE_LIMIT = 1;
  const [isPro, setIsPro] = useState(() => {
    try { return localStorage.getItem("bv_pro") === "true"; } catch { return false; }
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [shareMsg, setShareMsg] = useState("");

  useEffect(() => {
    // Update streak on load
    const s = updateStreak();
    setStreak(s);

    // Check for successful Stripe return
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscribed") === "true") {
      setIsPro(true);
      try { localStorage.setItem("bv_pro", "true"); } catch {}
      setShowPaywall(false);
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
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setCheckoutLoading(false);
  };

  const handleShare = async () => {
    const shareText = `"${verse.text}"\n— ${verse.book} ${verse.chapter}:${verse.verse}\n\nGet your daily devotional at DailyVerse 👇\n${APP_URL}`;
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareMsg("Copied to clipboard!");
        setTimeout(() => setShareMsg(""), 2500);
      }
    } catch {}
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
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(180,140,80,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 80% 100%, rgba(120,80,40,0.08) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 520, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Header */}
        <header style={{ textAlign: "center", padding: "40px 0 24px" }}>
          {/* Streak */}
          {streak > 0 && (
            <div style={{ fontSize: 13, color: "#a08840", marginBottom: 12, letterSpacing: "0.06em" }}>
              🔥 {streak} day{streak !== 1 ? "s" : ""} in a row
            </div>
          )}
          <div style={{ fontSize: 11, letterSpacing: "0.35em", color: "#6a5a3a", textTransform: "uppercase", marginBottom: 12 }}>
            KJV · Daily Devotional
          </div>
          <h1 style={{
            fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 400, margin: 0,
            letterSpacing: "-0.01em", color: "#f0e6d0", lineHeight: 1.15,
          }}>
            Church in Your Pocket
          </h1>
          <div style={{ width: 48, height: 1, background: "linear-gradient(90deg, transparent, #a08840, transparent)", margin: "16px auto 0" }} />
        </header>

        {/* Date */}
        <div style={{ textAlign: "center", fontSize: 13, color: "#7a6a4a", marginBottom: 28, letterSpacing: "0.08em" }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </div>

        {/* Verse Card */}
        <div style={{
          background: "linear-gradient(145deg, rgba(40,32,20,0.9), rgba(28,22,14,0.95))",
          border: "1px solid rgba(160,136,64,0.2)", borderRadius: 16,
          padding: "36px 28px", marginBottom: 16, position: "relative",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(160,136,64,0.15)",
        }}>
          <div style={{
            position: "absolute", top: 16, left: 24, fontSize: 64,
            lineHeight: 1, color: "rgba(160,136,64,0.1)", pointerEvents: "none",
          }}>"</div>
          <p style={{
            fontSize: "clamp(16px, 3vw, 20px)", lineHeight: 1.8, color: "#f0e6d0",
            margin: "0 0 20px", position: "relative", fontStyle: "italic",
          }}>
            {verse.text}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ height: 1, flex: 1, background: "rgba(160,136,64,0.2)" }} />
            <span style={{ fontSize: 13, color: "#a08840", letterSpacing: "0.12em" }}>
              {verse.book} {verse.chapter}:{verse.verse}
            </span>
            <div style={{ height: 1, flex: 1, background: "rgba(160,136,64,0.2)" }} />
          </div>
        </div>

        {/* Share Button */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <button
            onClick={handleShare}
            style={{
              background: "none", border: "1px solid rgba(160,136,64,0.2)",
              borderRadius: 20, padding: "8px 20px", cursor: "pointer",
              color: "#8a7a5a", fontSize: 12, letterSpacing: "0.1em",
              textTransform: "uppercase", fontFamily: "Georgia, serif",
              transition: "all 0.2s ease",
            }}
          >
            {shareMsg || "✦ Share Today's Verse"}
          </button>
        </div>

        {/* Usage indicator */}
        {!isPro && (
          <div style={{ textAlign: "center", fontSize: 12, color: "#6a5a3a", marginBottom: 16, letterSpacing: "0.06em" }}>
            {remaining > 0 ? "Tap to begin today's devotional — first insight is free" : "Subscribe to continue today's devotional"}
          </div>
        )}

        {/* Insight Tabs — 2x3 grid with prayer at bottom spanning full width */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 10 }}>
            {INSIGHT_TABS.filter(t => t.id !== "prayer").map(tab => (
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
                  borderRadius: 12, padding: "18px 12px", cursor: "pointer",
                  color: activeTab === tab.id ? "#d4a840" : "#7a6a4a",
                  textAlign: "center", transition: "all 0.2s ease",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  position: "relative",
                }}
              >
                {tab.proOnly && !isPro && (
                  <div style={{
                    position: "absolute", top: 6, right: 8,
                    fontSize: 9, color: "#a08840", letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}>Pro</div>
                )}
                <span style={{ fontSize: 18 }}>{tab.icon}</span>
                <span style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.3 }}>{tab.label}</span>
              </button>
            ))}
          </div>
          {/* Prayer — full width at bottom */}
          <button
            onClick={() => fetchInsight("prayer")}
            style={{
              width: "100%",
              background: activeTab === "prayer"
                ? "linear-gradient(145deg, rgba(160,136,64,0.25), rgba(120,96,32,0.2))"
                : "linear-gradient(145deg, rgba(30,24,14,0.8), rgba(20,16,10,0.9))",
              border: activeTab === "prayer"
                ? "1px solid rgba(160,136,64,0.5)"
                : "1px solid rgba(160,136,64,0.12)",
              borderRadius: 12, padding: "16px 12px", cursor: "pointer",
              color: activeTab === "prayer" ? "#d4a840" : "#7a6a4a",
              textAlign: "center", transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              position: "relative",
            }}
          >
            {!isPro && (
              <div style={{
                position: "absolute", top: 6, right: 12,
                fontSize: 9, color: "#a08840", letterSpacing: "0.1em", textTransform: "uppercase",
              }}>Pro</div>
            )}
            <span style={{ fontSize: 18 }}>🙏</span>
            <span style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>Pray With This</span>
          </button>
        </div>

        {/* Insight Content */}
        {activeTab && (
          <div style={{
            marginTop: 16,
            background: "linear-gradient(145deg, rgba(35,28,16,0.95), rgba(25,20,10,0.98))",
            border: "1px solid rgba(160,136,64,0.18)", borderRadius: 14,
            padding: "28px 24px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            animation: "fadeIn 0.3s ease",
          }}>
            {loading[activeTab] ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ display: "inline-flex", gap: 6, alignItems: "center", color: "#a08840", fontSize: 13, letterSpacing: "0.1em" }}>
                  <span style={{ animation: "pulse 1.2s ease-in-out infinite" }}>✦</span>
                  <span>Loading...</span>
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 10, letterSpacing: "0.3em", color: "#a08840", textTransform: "uppercase", marginBottom: 14 }}>
                  {INSIGHT_TABS.find(t => t.id === activeTab)?.label}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: "#d4c8aa", margin: 0, fontStyle: activeTab === "prayer" ? "italic" : "normal" }}>
                  {content[activeTab]}
                </p>
              </>
            )}
          </div>
        )}

        {/* Paywall Modal */}
        {showPaywall && (
          <div
            onClick={() => setShowPaywall(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 100,
              background: "rgba(8,6,3,0.92)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: "linear-gradient(145deg, #1a1508, #120f05)",
                border: "1px solid rgba(160,136,64,0.3)", borderRadius: 20,
                padding: "40px 32px", maxWidth: 400, width: "100%", textAlign: "center",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(160,136,64,0.2)",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>✦</div>
              <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 10px", color: "#f0e6d0" }}>
                Continue Your Devotional
              </h2>
              <p style={{ fontSize: 14, color: "#8a7a5a", lineHeight: 1.7, margin: "0 0 24px" }}>
                You've had a taste of today's devotional. Subscribe to unlock the full sermon experience — every day, for less than a coffee a month.
              </p>
              <div style={{
                background: "rgba(160,136,64,0.08)", border: "1px solid rgba(160,136,64,0.2)",
                borderRadius: 12, padding: "18px", marginBottom: 20,
              }}>
                <div style={{ fontSize: 26, fontWeight: 300, color: "#d4a840", marginBottom: 4 }}>$4.99</div>
                <div style={{ fontSize: 11, color: "#8a7a5a", letterSpacing: "0.1em" }}>PER MONTH · CANCEL ANYTIME</div>
                <div style={{ marginTop: 12, fontSize: 12, color: "#9a8a6a", lineHeight: 2 }}>
                  ✦ The full devotional, every day<br />
                  ✦ The Background, A Story & Your Challenge<br />
                  ✦ Pray With This — close every devotional in prayer<br />
                  ✦ Track your daily streak 🔥
                </div>
              </div>
              <button
                onClick={handleCheckout}
                style={{
                  width: "100%", padding: "15px",
                  background: "linear-gradient(135deg, #c4982a, #a07820)",
                  border: "none", borderRadius: 10, cursor: "pointer",
                  color: "#1a1205", fontSize: 15, fontWeight: 600,
                  letterSpacing: "0.05em", marginBottom: 12, fontFamily: "Georgia, serif",
                }}
              >
                {checkoutLoading ? "Redirecting..." : "Start Free 7-Day Trial"}
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                style={{ background: "none", border: "none", color: "#5a4a2a", fontSize: 13, cursor: "pointer", letterSpacing: "0.06em" }}
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
        button:hover { opacity: 0.85; }
      `}</style>
    </div>
  );
}
