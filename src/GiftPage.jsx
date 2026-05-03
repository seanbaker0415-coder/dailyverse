import { useState } from "react";

const CHECKOUT_URL = "https://buy.stripe.com/28E28k6CcbHc0oV2KfdQQ01";
const SIGNUP_URL = "http://eepurl.com/jDwmGM";

export default function GiftPage() {
  const [hovering, setHovering] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: "#0e0c09",
      fontFamily: "'Georgia', serif",
      color: "#e8dcc8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 70% 50% at 50% 0%, rgba(180,140,80,0.1) 0%, transparent 70%),
          radial-gradient(ellipse 50% 40% at 80% 100%, rgba(120,80,40,0.07) 0%, transparent 60%)
        `,
      }} />

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 520, width: "100%",
        textAlign: "center",
        animation: "fadeUp 0.8s ease both",
      }}>

        {/* Eyebrow */}
        <div style={{
          fontSize: 11, letterSpacing: "0.4em", color: "#a08840",
          textTransform: "uppercase", marginBottom: 32,
          opacity: 0.9,
        }}>
          Mother's Day · May 11
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: "clamp(32px, 7vw, 52px)",
          fontWeight: 400,
          lineHeight: 1.15,
          color: "#f0e6d0",
          margin: "0 0 20px",
          letterSpacing: "-0.01em",
        }}>
          A free daily devotional.<br />Every morning. For her.
        </h1>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          margin: "0 auto 24px", maxWidth: 320,
        }}>
          <div style={{ flex: 1, height: 1, background: "rgba(160,136,64,0.25)" }} />
          <span style={{ color: "#a08840", fontSize: 14 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: "rgba(160,136,64,0.25)" }} />
        </div>

        {/* Subheadline */}
        <p style={{
          fontSize: "clamp(15px, 3vw, 18px)",
          lineHeight: 1.75,
          color: "#a09070",
          margin: "0 0 40px",
          maxWidth: 420,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          A verse from scripture and a story that stays with her all day —
          delivered free to her inbox every morning. No app. No church.
          Just her coffee and something worth reading.
        </p>

        {/* Testimonials */}
        <div style={{ marginBottom: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { quote: "This has turned into a morning ritual where I ground myself with God before I do anything else.", attr: "DailyVerse reader" },
            { quote: "I don't go to church as much as I used to — this is a nice way to feel like I'm still getting a little bit in.", attr: "DailyVerse reader" },
            { quote: "My new favorite part of the morning.", attr: "DailyVerse reader" },
          ].map((t, i) => (
            <div key={i} style={{
              background: "linear-gradient(145deg, rgba(40,32,20,0.8), rgba(28,22,14,0.9))",
              border: "1px solid rgba(160,136,64,0.15)",
              borderRadius: 12, padding: "18px 22px", textAlign: "left",
            }}>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#c8b878", margin: "0 0 8px", fontStyle: "italic" }}>
                "{t.quote}"
              </p>
              <div style={{ fontSize: 11, color: "#6a5a3a", letterSpacing: "0.08em" }}>— {t.attr}</div>
            </div>
          ))}
        </div>

        {/* Primary CTA — Free signup */}
        <a
          href={SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          style={{
            display: "block",
            background: hovering
              ? "linear-gradient(135deg, #d4a830, #b08820)"
              : "linear-gradient(135deg, #c4982a, #a07820)",
            color: "#1a1205",
            fontSize: 16,
            fontWeight: 600,
            letterSpacing: "0.04em",
            padding: "18px 32px",
            borderRadius: 12,
            textDecoration: "none",
            marginBottom: 10,
            fontFamily: "Georgia, serif",
            transition: "all 0.2s ease",
            transform: hovering ? "translateY(-1px)" : "none",
            boxShadow: hovering ? "0 8px 24px rgba(160,136,64,0.2)" : "none",
          }}
        >
          Sign Up Free — Start Tomorrow Morning
        </a>

        {/* Free note */}
        <div style={{
          fontSize: 12, color: "#6a5a3a", marginBottom: 28,
          letterSpacing: "0.06em",
        }}>
          Free forever · No credit card · Unsubscribe anytime
        </div>

        {/* Divider */}
        <div style={{
          fontSize: 12, color: "#4a3a22", marginBottom: 20,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          want to gift a subscription?
        </div>

        {/* Secondary CTA — paid gift */}
        <a
          href={CHECKOUT_URL}
          style={{
            display: "block",
            background: "transparent",
            border: "1px solid rgba(160,136,64,0.3)",
            color: "#a08840",
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: "0.06em",
            padding: "14px 32px",
            borderRadius: 12,
            textDecoration: "none",
            marginBottom: 40,
            fontFamily: "Georgia, serif",
            transition: "all 0.2s ease",
          }}
        >
          🎁 &nbsp; Gift DailyVerse Pro — $9.99/month
        </a>

        {/* Social proof / trust */}
        <div style={{
          borderTop: "1px solid rgba(160,136,64,0.12)",
          paddingTop: 28,
          display: "flex",
          justifyContent: "center",
          gap: 32,
          flexWrap: "wrap",
        }}>
          {[
            { icon: "✦", text: "New verse every morning" },
            { icon: "✦", text: "Free 7-day trial" },
            { icon: "✦", text: "Cancel anytime" },
          ].map((item, i) => (
            <div key={i} style={{
              fontSize: 12, color: "#6a5a3a",
              letterSpacing: "0.06em", display: "flex",
              alignItems: "center", gap: 6,
            }}>
              <span style={{ color: "#a08840" }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>

        {/* Back link */}
        <div style={{ marginTop: 32 }}>
          <a
            href="https://getyourdailyverse.com"
            style={{
              fontSize: 12, color: "#4a3a22",
              letterSpacing: "0.08em", textDecoration: "none",
            }}
          >
            ← Read today's devotional
          </a>
        </div>

      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 100%; background: #0e0c09; }
        a:hover { opacity: 0.9; }
      `}</style>
    </div>
  );
}
