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
          Give her five minutes<br />of peace every morning.
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
          A verse from scripture and a story that stays with you —
          delivered to her inbox every morning. No app. No church required.
          Just her coffee and something worth reading.
        </p>

        {/* Sample story teaser */}
        <div style={{
          background: "linear-gradient(145deg, rgba(40,32,20,0.8), rgba(28,22,14,0.9))",
          border: "1px solid rgba(160,136,64,0.18)",
          borderRadius: 14,
          padding: "24px 28px",
          marginBottom: 40,
          textAlign: "left",
        }}>
          <div style={{
            fontSize: 9, letterSpacing: "0.3em", color: "#a08840",
            textTransform: "uppercase", marginBottom: 10,
          }}>Today's story</div>
          <p style={{
            fontSize: 14, lineHeight: 1.8, color: "#c8b878",
            margin: 0, fontStyle: "italic",
          }}>
            "Margaret sat in the waiting room of the Cancer Center with her hands
            folded on top of her purse. She had come alone because that's how she'd
            always done hard things — quietly, without asking..."
          </p>
          <div style={{
            fontSize: 12, color: "#6a5a3a", marginTop: 12, letterSpacing: "0.06em",
          }}>
            ✦ &nbsp; Psalm 23:1 · Today's full devotional
          </div>
        </div>

        {/* Primary CTA — Gift subscription */}
        <a
          href={CHECKOUT_URL}
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
            marginBottom: 14,
            fontFamily: "Georgia, serif",
            transition: "all 0.2s ease",
            transform: hovering ? "translateY(-1px)" : "none",
            boxShadow: hovering ? "0 8px 24px rgba(160,136,64,0.2)" : "none",
          }}
        >
          🎁 &nbsp; Gift a DailyVerse Subscription
        </a>

        {/* Price note */}
        <div style={{
          fontSize: 12, color: "#6a5a3a", marginBottom: 28,
          letterSpacing: "0.06em",
        }}>
          $9.99 / month · 7-day free trial · Cancel anytime
        </div>

        {/* Divider */}
        <div style={{
          fontSize: 12, color: "#4a3a22", marginBottom: 20,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>
          or
        </div>

        {/* Secondary CTA — free signup */}
        <a
          href={SIGNUP_URL}
          target="_blank"
          rel="noopener noreferrer"
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
          Sign up free — try it yourself first
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
