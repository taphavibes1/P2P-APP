import { useState, useEffect, useRef } from "react";
import "./index.css";

// ─── Demo Data ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { id: 1, emoji: "📚", title: "CHM 101 Textbook", price: 2500, seller: "Adaeze N.", distance: "~150m away", category: "Textbooks", rating: 4.8, condition: "Good", description: "Chemistry 101 textbook used for just one semester. All pages intact, no missing sheets. Perfect for 100-level students.", location: "Ekosodin Hostel Block A" },
  { id: 2, emoji: "💡", title: "Reading Lamp", price: 3800, seller: "Tunde B.", distance: "~200m away", category: "Hostel Gear", rating: 4.5, condition: "Excellent", description: "USB-powered LED reading lamp. Adjustable neck, 3 brightness levels. Works perfectly. Selling because I'm graduating.", location: "Ugbowo Main" },
  { id: 3, emoji: "🍛", title: "Jollof Rice (plate)", price: 700, seller: "Mama Ngozi", distance: "~80m away", category: "Food & Snacks", rating: 4.9, condition: "Fresh", description: "Party jollof rice with fried chicken and plantain. Made fresh every day. Order before 2pm for same-day delivery within campus.", location: "Ekosodin Gate" },
  { id: 4, emoji: "👕", title: "UNIBEN Hoodie", price: 8500, seller: "Emeka O.", distance: "~300m away", category: "Fashion", rating: 4.6, condition: "New", description: "Official UNIBEN hoodie, navy blue, size L. Bought two by mistake. Tags still on. Perfect campus wear.", location: "Ugbowo Junction" },
  { id: 5, emoji: "🛏️", title: "Mattress Topper", price: 6000, seller: "Chioma A.", distance: "~120m away", category: "Hostel Gear", rating: 4.3, condition: "Good", description: "4-inch foam mattress topper. Makes the hostel mattress actually comfortable. Selling because I'm moving off-campus.", location: "Mariere Hostel" },
  { id: 6, emoji: "🔌", title: "Data Cable (Type-C)", price: 1200, seller: "Bello I.", distance: "~250m away", category: "Electronics", rating: 4.7, condition: "New", description: "1.5m braided Type-C cable. Fast charging compatible. Bought extras from a bulk order. Original quality.", location: "Mass Com Block" },
  { id: 7, emoji: "📖", title: "Biochem Practical Manual", price: 1500, seller: "Ngozi E.", distance: "~180m away", category: "Textbooks", rating: 4.4, condition: "Good", description: "BCH 305 Practical Manual with all experiments documented. Has some pencil annotations — easily erasable. Very useful for exams.", location: "Faculty of Science" },
  { id: 8, emoji: "🩴", title: "Flip Flops (Size 42)", price: 900, seller: "Kunle A.", distance: "~90m away", category: "Fashion", rating: 4.2, condition: "Good", description: "Quality rubber flip flops, barely worn. Size 42. Great for hostel bathroom runs.", location: "Ugbowo Hostel Zone" },
];

const CATEGORIES = ["All", "Textbooks", "Hostel Gear", "Food & Snacks", "Fashion", "Electronics"];

const DEMO_CHATS = {
  1: [
    { from: "buyer", text: "Hi! Is the CHM 101 textbook still available?", time: "10:02 AM" },
    { from: "seller", text: "Yes it is! Just used it for one semester. All pages are intact 📚", time: "10:04 AM" },
    { from: "buyer", text: "Any torn pages or writing inside?", time: "10:06 AM" },
    { from: "seller", text: "No torn pages. There's a little highlighter on chapter 3 only. Very minor.", time: "10:08 AM" },
    { from: "buyer", text: "Okay, can we meet today? I'm near Ekosodin.", time: "10:10 AM" },
  ],
  2: [
    { from: "buyer", text: "Hello, is the reading lamp USB powered?", time: "9:15 AM" },
    { from: "seller", text: "Yes! USB-C. Works on powerbank too 💡", time: "9:17 AM" },
    { from: "buyer", text: "How long is the neck extension?", time: "9:20 AM" },
    { from: "seller", text: "About 40cm, fully flexible. Great for night reading without disturbing roommates.", time: "9:22 AM" },
    { from: "buyer", text: "Perfect! Let's meet at the Main Gate safe zone.", time: "9:25 AM" },
  ],
};

const DEFAULT_CHAT = [
  { from: "buyer", text: "Hi! Is this item still available?", time: "11:00 AM" },
  { from: "seller", text: "Yes, still available! Come and get it 😊", time: "11:02 AM" },
  { from: "buyer", text: "What condition is it in exactly?", time: "11:04 AM" },
  { from: "seller", text: "Almost as good as new. You'll be satisfied, I promise!", time: "11:06 AM" },
  { from: "buyer", text: "Can we meet at the Main Gate safe zone?", time: "11:08 AM" },
];

const PAYMENT_METHODS = [
  { id: "card", label: "Debit/Credit Card", icon: "💳", desc: "Visa, Mastercard, Verve · Powered by Paystack" },
  { id: "transfer", label: "Bank Transfer", icon: "🏦", desc: "GTBank, Access, Zenith & more" },
  { id: "ussd", label: "USSD", icon: "📱", desc: "Dial code from any phone" },
  { id: "qr", label: "QR Code", icon: "◼️", desc: "Scan with any banking app" },
  { id: "wallet", label: "UniMart Wallet", icon: "👛", desc: "Balance: ₦15,400" },
  { id: "crypto", label: "Crypto (USDT)", icon: "₿", desc: "TRC-20 Network" },
];

// ─── Utility Components ────────────────────────────────────────────────────────

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 9999 }} className="slide-up">
      <div style={{ background: "#1a6b3c", color: "white", padding: "12px 20px", borderRadius: 16, boxShadow: "0 8px 32px rgba(26,107,60,0.4)", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 8, maxWidth: 320, whiteSpace: "nowrap" }}>
        <span>✓</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: 11, color: i <= Math.floor(rating) ? "#facc15" : "#d1d5db" }}>★</span>
      ))}
      <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 2 }}>{rating}</span>
    </span>
  );
}

function BackButton({ onBack }) {
  return (
    <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, color: "#1a6b3c", fontWeight: 700, fontSize: 14, background: "none", border: "none", cursor: "pointer" }}>
      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}

function EscrowBadge() {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0faf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "6px 12px", fontSize: 12, color: "#1a6b3c", fontWeight: 700 }}>
      🛡️ Protected by UniMart Escrow
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#f0faf4", border: "1px solid #1a6b3c", borderRadius: 999, padding: "2px 8px", fontSize: 10, color: "#1a6b3c", fontWeight: 800 }}>
      ✓ Verified
    </span>
  );
}

function QRCodeBlock({ size = 120 }) {
  const cells = [];
  const rows = 9;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < rows; c++) {
      const isCorner = (r < 3 && c < 3) || (r < 3 && c >= 6) || (r >= 6 && c < 3);
      const isDark = isCorner || ((r + c * 3 + r * c) % 3 === 0 || (r * 2 + c) % 5 === 1);
      cells.push(
        <div key={`${r}-${c}`} style={{ width: size / rows, height: size / rows, background: isDark ? "#111" : "#fff" }} />
      );
    }
  }
  return (
    <div style={{ border: "4px solid #111", borderRadius: 8, display: "inline-flex", flexWrap: "wrap", width: size + 8, height: size + 8 }}>
      {cells}
    </div>
  );
}

// ─── Screen 1: Splash ─────────────────────────────────────────────────────────

function SplashScreen({ onNavigate }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", height: "100%", background: "#1a6b3c", padding: "48px 32px 40px" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <div className="pulse-ring" style={{ width: 96, height: 96, background: "white", borderRadius: 28, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
          <span style={{ fontSize: 48 }}>🛒</span>
        </div>
        <h1 style={{ color: "white", fontSize: 52, fontWeight: 900, letterSpacing: -2, margin: 0, marginBottom: 8 }}>UniMart</h1>
        <p style={{ color: "#bbf7d0", fontSize: 18, fontWeight: 600, margin: 0, marginBottom: 4 }}>Buy. Sell. Stay Safe.</p>
        <p style={{ color: "#86efac", fontSize: 13, margin: 0, marginBottom: 32 }}>UNIBEN's own marketplace</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
          {["🎓 For UNIBEN Students", "📍 Ugbowo Only", "🛡️ Escrow Safe"].map(t => (
            <span key={t} style={{ background: "rgba(255,255,255,0.15)", color: "#bbf7d0", borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 600 }}>{t}</span>
          ))}
        </div>
      </div>
      <div style={{ width: "100%", gap: 12, display: "flex", flexDirection: "column" }}>
        <button
          onClick={() => onNavigate("login")}
          style={{ width: "100%", background: "white", color: "#1a6b3c", border: "none", borderRadius: 20, padding: "16px 0", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}
        >
          Get Started 🚀
        </button>
        <p style={{ color: "#86efac", fontSize: 12, textAlign: "center", margin: 0 }}>Exclusively for UNIBEN students in Ugbowo</p>
      </div>
    </div>
  );
}

// ─── Screen 2: Login ──────────────────────────────────────────────────────────

function LoginScreen({ onNavigate, showToast }) {
  const [email, setEmail] = useState("");
  const [verified, setVerified] = useState(false);
  const [tab, setTab] = useState("login");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const handleVerify = () => {
    if (email.includes("@")) { setVerified(true); showToast("Student verified ✓"); }
    else showToast("Enter a valid student email first");
  };

  if (showForgot) {
    return (
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4" }}>
        <div style={{ background: "#1a6b3c", padding: "40px 20px 24px" }}>
          <button onClick={() => setShowForgot(false)} style={{ background: "none", border: "none", color: "#86efac", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
            ← Back
          </button>
          <h2 style={{ color: "white", fontSize: 24, fontWeight: 800, margin: 0 }}>Reset Password</h2>
          <p style={{ color: "#bbf7d0", fontSize: 13, margin: "4px 0 0" }}>We'll send a reset link to your UNIBEN email</p>
        </div>
        <div style={{ flex: 1, padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Student Email</label>
            <input style={{ width: "100%", marginTop: 8, border: "2px solid #e5e7eb", borderRadius: 14, padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box" }} placeholder="yourname@uniben.edu.ng" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
          </div>
          <button onClick={() => { showToast("Reset link sent! Check your email"); setShowForgot(false); }} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "16px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
            Send Reset Link
          </button>
        </div>
      </div>
    );
  }

  const inp = { width: "100%", border: "2px solid #e5e7eb", borderRadius: 14, padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4" }}>
      <div style={{ background: "#1a6b3c", padding: "40px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 40, height: 40, background: "white", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 20 }}>🛒</span>
          </div>
          <div>
            <div style={{ color: "white", fontSize: 20, fontWeight: 900 }}>UniMart</div>
            <div style={{ color: "#86efac", fontSize: 11 }}>UNIBEN's Marketplace</div>
          </div>
        </div>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.2)", borderRadius: 14, padding: 4 }}>
          {["login", "register"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", background: tab === t ? "white" : "transparent", color: tab === t ? "#1a6b3c" : "white", transition: "all 0.2s" }}>
              {t === "login" ? "Log In" : "Create Account"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {tab === "register" && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Full Name</label>
            <input style={{ ...inp, marginTop: 8 }} placeholder="Chukwuemeka Obi" />
          </div>
        )}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Student Email</label>
          <input style={{ ...inp, marginTop: 8 }} placeholder="yourname@uniben.edu.ng" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Password</label>
          <input type="password" style={{ ...inp, marginTop: 8 }} placeholder="••••••••" />
        </div>
        {tab === "register" && (
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Confirm Password</label>
            <input type="password" style={{ ...inp, marginTop: 8 }} placeholder="••••••••" />
          </div>
        )}

        {verified ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 14, padding: "12px 16px" }}>
            <span style={{ color: "#16a34a", fontWeight: 800 }}>✓</span>
            <span style={{ color: "#15803d", fontSize: 14, fontWeight: 700 }}>Student identity verified</span>
          </div>
        ) : (
          <button onClick={handleVerify} style={{ width: "100%", background: "white", border: "2px solid #1a6b3c", color: "#1a6b3c", borderRadius: 20, padding: "14px 0", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
            🎓 Verify with Student ID
          </button>
        )}

        <button onClick={() => onNavigate("home")} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "16px 0", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: "0 4px 20px rgba(26,107,60,0.3)" }}>
          {tab === "login" ? "Continue →" : "Create Account →"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        <button onClick={() => { showToast("Redirecting to Google..."); setTimeout(() => onNavigate("home"), 900); }} style={{ width: "100%", background: "white", border: "2px solid #e5e7eb", color: "#374151", borderRadius: 20, padding: "14px 0", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>🌐</span> Continue with Google
        </button>

        {tab === "login" && (
          <button onClick={() => setShowForgot(true)} style={{ background: "none", border: "none", color: "#1a6b3c", fontWeight: 700, fontSize: 13, cursor: "pointer", padding: "8px 0" }}>
            Forgot Password?
          </button>
        )}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ─── Screen 3: Home Feed ──────────────────────────────────────────────────────

function HomeScreen({ onNavigate, showToast }) {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCat === "All" || p.category === activeCat;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4" }}>
      <div style={{ background: "#1a6b3c", padding: "40px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <p style={{ color: "#86efac", fontSize: 11, margin: 0 }}>📍 Ugbowo, Benin City</p>
            <h2 style={{ color: "white", fontSize: 22, fontWeight: 900, margin: 0 }}>UniMart 🛒</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: "50%", border: "none", color: "white", fontSize: 16, cursor: "pointer" }}>🔔</button>
            <button onClick={() => onNavigate("profile")} style={{ width: 36, height: 36, background: "white", borderRadius: "50%", border: "none", color: "#1a6b3c", fontWeight: 900, fontSize: 12, cursor: "pointer" }}>CO</button>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }}>🔍</span>
          <input
            style={{ width: "100%", background: "white", borderRadius: 16, paddingLeft: 40, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 13, border: "none", outline: "none", boxSizing: "border-box" }}
            placeholder="Search items near you..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto", background: "white", borderBottom: "1px solid #f3f4f6", scrollbarWidth: "none" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)} style={{ flexShrink: 0, padding: "6px 14px", borderRadius: 999, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: activeCat === cat ? "#1a6b3c" : "#f3f4f6", color: activeCat === cat ? "white" : "#6b7280", transition: "all 0.15s" }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ margin: "12px 16px 0", background: "linear-gradient(135deg, #1a6b3c, #22863a)", borderRadius: 20, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ color: "white", fontWeight: 800, fontSize: 13, margin: 0 }}>🛡️ Safe Trading Zone</p>
          <p style={{ color: "#86efac", fontSize: 11, margin: "2px 0 0" }}>All payments protected by escrow</p>
        </div>
        <span style={{ fontSize: 28 }}>✅</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 10 }}>{filtered.length} items near you</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {filtered.map(product => (
            <div key={product.id} onClick={() => onNavigate("product", product)} style={{ background: "white", borderRadius: 20, padding: 12, border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", cursor: "pointer" }}>
              <div style={{ width: "100%", height: 88, background: "#f0faf4", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 36 }}>{product.emoji}</span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#1f2937", margin: "0 0 4px", lineHeight: 1.3 }}>{product.title}</p>
              <p style={{ color: "#1a6b3c", fontWeight: 900, fontSize: 14, margin: "0 0 4px" }}>₦{product.price.toLocaleString()}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <p style={{ color: "#9ca3af", fontSize: 10, margin: 0 }}>{product.distance}</p>
                <VerifiedBadge />
              </div>
              <button
                onClick={e => { e.stopPropagation(); onNavigate("product", product); }}
                style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 12, padding: "7px 0", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
              >
                Buy
              </button>
            </div>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

// ─── Screen 4: Product Detail ─────────────────────────────────────────────────

function ProductDetailScreen({ product, onNavigate }) {
  if (!product) return null;
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4" }}>
      <div style={{ background: "#1a6b3c", padding: "40px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
        <BackButton onBack={() => onNavigate("home")} />
        <h2 style={{ color: "white", fontWeight: 700, fontSize: 14, flex: 1, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{product.title}</h2>
        <button style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer" }}>♡</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ background: "white", margin: "16px", borderRadius: 24, padding: "28px 0 20px", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <span style={{ fontSize: 88 }}>{product.emoji}</span>
          <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, marginTop: 8 }}>{product.condition}</span>
        </div>

        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "white", borderRadius: 20, padding: 16, border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div>
                <h3 style={{ fontWeight: 900, color: "#111827", fontSize: 18, margin: "0 0 4px", lineHeight: 1.2 }}>{product.title}</h3>
                <p style={{ color: "#1a6b3c", fontWeight: 900, fontSize: 24, margin: 0 }}>₦{product.price.toLocaleString()}</p>
              </div>
              <VerifiedBadge />
            </div>
            <p style={{ color: "#6b7280", fontSize: 13, margin: "12px 0 0", lineHeight: 1.6 }}>{product.description}</p>
          </div>

          <div style={{ background: "white", borderRadius: 20, padding: 16, border: "1px solid #f3f4f6" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>Seller</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, background: "#1a6b3c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
                {product.seller.split(" ").map(w => w[0]).join("").slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, color: "#1f2937", margin: "0 0 4px", fontSize: 15 }}>{product.seller}</p>
                <StarRating rating={product.rating} />
                <div style={{ marginTop: 4 }}><VerifiedBadge /></div>
              </div>
            </div>
          </div>

          <div style={{ background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: 20, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>📍</span>
            <div>
              <p style={{ fontWeight: 700, color: "#1a6b3c", fontSize: 14, margin: "0 0 2px" }}>Safe Zone Meeting Spot</p>
              <p style={{ color: "#15803d", fontSize: 12, margin: 0 }}>Main Gate · Security Camera Area</p>
            </div>
          </div>

          <EscrowBadge />

          <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingBottom: 24 }}>
            <button onClick={() => onNavigate("chat", product)} style={{ width: "100%", border: "2px solid #1a6b3c", background: "white", color: "#1a6b3c", borderRadius: 20, padding: "15px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              💬 Chat with Seller
            </button>
            <button onClick={() => onNavigate("payment", product)} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "15px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(26,107,60,0.3)" }}>
              🔒 Pay to Escrow – ₦{product.price.toLocaleString()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Screen 5: Chat ───────────────────────────────────────────────────────────

function ChatScreen({ product, onNavigate, showToast }) {
  const [messages, setMessages] = useState(DEMO_CHATS[product?.id] || DEFAULT_CHAT);
  const [input, setInput] = useState("");
  const [showOffer, setShowOffer] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(m => [...m, { from: "buyer", text: input, time: now }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [...m, { from: "seller", text: "Thanks! Let's meet at the safe zone 😊", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1100);
  };

  const sendOffer = () => {
    if (!offerPrice) return;
    setShowOffer(false);
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(m => [...m, { from: "buyer", text: `💰 Offer: ₦${Number(offerPrice).toLocaleString()}`, time: now }]);
    showToast("Offer Sent! 💸");
    setTimeout(() => {
      setMessages(m => [...m, { from: "seller", text: "Offer received! Let me think 🤔", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1400);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4", position: "relative" }}>
      <div style={{ background: "#1a6b3c", padding: "40px 20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <BackButton onBack={() => onNavigate("product", product)} />
        <div style={{ width: 36, height: 36, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a6b3c", fontWeight: 900, fontSize: 11, flexShrink: 0 }}>
          {product?.seller.split(" ").map(w => w[0]).join("").slice(0, 2)}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ color: "white", fontWeight: 700, fontSize: 14, margin: 0 }}>{product?.seller}</p>
          <p style={{ color: "#86efac", fontSize: 10, margin: 0 }}>● Online now</p>
        </div>
        <button onClick={() => onNavigate("payment", product)} style={{ background: "white", color: "#1a6b3c", border: "none", borderRadius: 999, padding: "6px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Pay</button>
      </div>

      <div style={{ background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 14 }}>📦</span>
        <p style={{ color: "#92400e", fontSize: 11, fontWeight: 700, margin: 0 }}>{product?.title} · ₦{product?.price?.toLocaleString()}</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 11, color: "#9ca3af", background: "#f3f4f6", borderRadius: 999, padding: "3px 12px" }}>Today</span>
        </div>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.from === "buyer" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "75%", padding: "10px 14px", borderRadius: msg.from === "buyer" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", background: msg.from === "buyer" ? "#1a6b3c" : "white", color: msg.from === "buyer" ? "white" : "#1f2937", fontSize: 13, lineHeight: 1.5, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <p style={{ margin: 0 }}>{msg.text}</p>
              <p style={{ margin: "3px 0 0", fontSize: 10, color: msg.from === "buyer" ? "#86efac" : "#9ca3af", textAlign: "right" }}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={{ background: "white", borderTop: "1px solid #f3f4f6", padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setShowOffer(true)} style={{ flexShrink: 0, background: "#f0faf4", color: "#1a6b3c", border: "1px solid #bbf7d0", borderRadius: 12, padding: "8px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
          💰 Offer
        </button>
        <input
          style={{ flex: 1, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 14, padding: "10px 14px", fontSize: 13, outline: "none", fontFamily: "inherit" }}
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMsg()}
        />
        <button onClick={sendMsg} style={{ width: 40, height: 40, background: "#1a6b3c", border: "none", borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
        </button>
      </div>

      {showOffer && (
        <div onClick={() => setShowOffer(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "flex-end", zIndex: 40 }}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", background: "white", borderRadius: "24px 24px 0 0", padding: "24px 24px 32px", boxSizing: "border-box" }}>
            <div style={{ width: 48, height: 4, background: "#e5e7eb", borderRadius: 2, margin: "0 auto 20px" }} />
            <h3 style={{ fontWeight: 900, fontSize: 18, margin: "0 0 4px" }}>Make an Offer</h3>
            <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 16px" }}>Listed at ₦{product?.price?.toLocaleString()}</p>
            <div style={{ position: "relative", marginBottom: 16 }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700 }}>₦</span>
              <input
                type="number"
                style={{ width: "100%", border: "2px solid #e5e7eb", borderRadius: 14, paddingLeft: 32, paddingRight: 16, paddingTop: 14, paddingBottom: 14, fontSize: 18, fontWeight: 700, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                placeholder="Your offer"
                value={offerPrice}
                onChange={e => setOfferPrice(e.target.value)}
              />
            </div>
            <button onClick={sendOffer} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "16px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              Send Offer 💸
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Screen 6: Payment ────────────────────────────────────────────────────────

function CountdownTimer({ seconds: init }) {
  const [secs, setSecs] = useState(init);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#1a6b3c", fontSize: 20 }}>{m}:{s}</span>;
}

function CardPaymentForm({ product, onSuccess }) {
  const [num, setNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const inp = { width: "100%", border: "2px solid #e5e7eb", borderRadius: 14, padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };

  const formatCard = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = v => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "linear-gradient(135deg, #1a6b3c, #145530)", borderRadius: 20, padding: 20, color: "white" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <span style={{ fontSize: 12, color: "#86efac", fontWeight: 600 }}>UniMart Card</span>
          <div style={{ display: "flex" }}>
            <div style={{ width: 24, height: 24, background: "#facc15", borderRadius: "50%", opacity: 0.9 }} />
            <div style={{ width: 24, height: 24, background: "#ca8a04", borderRadius: "50%", opacity: 0.6, marginLeft: -8 }} />
          </div>
        </div>
        <p style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: 3, margin: "0 0 14px" }}>{num || "•••• •••• •••• ••••"}</p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div><p style={{ fontSize: 9, color: "#86efac", margin: "0 0 2px" }}>CARD HOLDER</p><p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{name || "YOUR NAME"}</p></div>
          <div><p style={{ fontSize: 9, color: "#86efac", margin: "0 0 2px" }}>EXPIRES</p><p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{expiry || "MM/YY"}</p></div>
        </div>
      </div>
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>Card Number</label>
        <input style={{ ...inp, marginTop: 6, fontFamily: "monospace" }} placeholder="0000 0000 0000 0000" value={num} onChange={e => setNum(formatCard(e.target.value))} maxLength={19} />
      </div>
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>Name on Card</label>
        <input style={{ ...inp, marginTop: 6 }} placeholder="Chukwuemeka Obi" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>Expiry</label>
          <input style={{ ...inp, marginTop: 6, fontFamily: "monospace" }} placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} maxLength={5} />
        </div>
        <div style={{ width: 100 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>CVV</label>
          <input type="password" style={{ ...inp, marginTop: 6, fontFamily: "monospace" }} placeholder="•••" value={cvv} onChange={e => setCvv(e.target.value.slice(0, 3))} maxLength={3} />
        </div>
      </div>
      <p style={{ fontSize: 11, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6, margin: 0 }}>🔒 Secured by Paystack · 256-bit SSL</p>
      <button onClick={() => { setLoading(true); setTimeout(onSuccess, 2200); }} disabled={loading} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "15px 0", fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {loading ? "Processing..." : `Pay ₦${product?.price?.toLocaleString()} to Escrow`}
      </button>
    </div>
  );
}

function BankTransferForm({ product, onSuccess }) {
  const banks = [
    { name: "GTBank", bg: "#f97316", icon: "🏦" }, { name: "Access", bg: "#ef4444", icon: "🏦" },
    { name: "Zenith", bg: "#2563eb", icon: "🏦" }, { name: "OPay", bg: "#22c55e", icon: "📱" }, { name: "Kuda", bg: "#7c3aed", icon: "💜" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#eff6ff", border: "2px solid #bfdbfe", borderRadius: 20, padding: 16 }}>
        <p style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, margin: "0 0 2px" }}>Transfer exactly</p>
        <p style={{ fontSize: 30, fontWeight: 900, color: "#111827", margin: "0 0 2px" }}>₦{product?.price?.toLocaleString()}</p>
        <p style={{ fontSize: 11, color: "#6b7280", margin: "0 0 14px" }}>to this virtual account</p>
        <div style={{ background: "white", borderRadius: 14, padding: 14, border: "1px solid #bfdbfe" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#6b7280" }}>Account Number</span>
            <button style={{ fontSize: 11, color: "#3b82f6", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Copy</button>
          </div>
          <p style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 24, color: "#111827", margin: "0 0 4px" }}>0123456789</p>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>UniMart Escrow — Wema Bank</p>
        </div>
        <p style={{ fontSize: 12, color: "#ea580c", fontWeight: 700, margin: "10px 0 0" }}>⏰ Account expires in 30 minutes</p>
      </div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: 0 }}>Open your banking app</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {banks.map(b => (
          <button key={b.name} onClick={onSuccess} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer" }}>
            <div style={{ width: 50, height: 50, background: b.bg, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{b.icon}</div>
            <span style={{ fontSize: 10, color: "#6b7280", fontWeight: 600 }}>{b.name}</span>
          </button>
        ))}
      </div>
      <button onClick={onSuccess} style={{ width: "100%", border: "2px solid #1a6b3c", background: "white", color: "#1a6b3c", borderRadius: 20, padding: "14px 0", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
        I've Completed the Transfer ✓
      </button>
    </div>
  );
}

function USSDForm({ product, onSuccess }) {
  const [bank, setBank] = useState("GTBank (*737#)");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>Select Your Bank</label>
        <select style={{ width: "100%", marginTop: 6, border: "2px solid #e5e7eb", borderRadius: 14, padding: "12px 16px", fontSize: 13, outline: "none", background: "white", boxSizing: "border-box" }} value={bank} onChange={e => setBank(e.target.value)}>
          {["GTBank (*737#)", "Access (*901#)", "Zenith (*966#)", "UBA (*919#)", "First Bank (*894#)"].map(b => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div style={{ background: "#111827", borderRadius: 20, padding: 20, textAlign: "center" }}>
        <p style={{ color: "#6b7280", fontSize: 12, margin: "0 0 8px" }}>Dial this code on your phone</p>
        <p style={{ color: "#4ade80", fontFamily: "monospace", fontSize: 24, fontWeight: 900, margin: "0 0 8px" }}>*737*2550*12345#</p>
        <p style={{ color: "#4b5563", fontSize: 12, margin: 0 }}>Amount: ₦{product?.price?.toLocaleString()}</p>
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 18, padding: 16 }}>
        {["Dial the code above", "Enter your bank PIN when prompted", `Confirm ₦${product?.price?.toLocaleString()} payment`, "Come back and tap confirm below"].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: i < 3 ? 12 : 0 }}>
            <div style={{ width: 22, height: 22, background: "#1a6b3c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.4 }}>{step}</p>
          </div>
        ))}
      </div>
      <button onClick={onSuccess} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "15px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
        I've Completed the Payment ✓
      </button>
    </div>
  );
}

function QRPaymentForm({ product, onSuccess }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Scan with any Nigerian banking app</p>
      <QRCodeBlock size={160} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
        <span style={{ color: "#6b7280" }}>Expires in:</span>
        <CountdownTimer seconds={900} />
      </div>
      <div style={{ width: "100%", background: "#f9fafb", borderRadius: 18, padding: 16, textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: "0 0 4px" }}>Amount to Pay</p>
        <p style={{ fontSize: 30, fontWeight: 900, color: "#1a6b3c", margin: "0 0 4px" }}>₦{product?.price?.toLocaleString()}</p>
        <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>UniMart Escrow Account</p>
      </div>
      <button onClick={onSuccess} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "15px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
        I've Scanned & Paid ✓
      </button>
    </div>
  );
}

function WalletPaymentForm({ product, onSuccess }) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const balance = 15400;
  const remaining = balance - (product?.price || 0);

  const handlePin = (i, v) => {
    const p = [...pin]; p[i] = v.slice(-1); setPin(p);
    if (v && i < 3) document.getElementById(`pin-${i + 1}`)?.focus();
    if (p.every(d => d !== "")) setTimeout(onSuccess, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "linear-gradient(135deg, #1a6b3c, #145530)", borderRadius: 20, padding: 20, color: "white" }}>
        <p style={{ fontSize: 12, color: "#86efac", fontWeight: 600, margin: "0 0 4px" }}>UniMart Wallet Balance</p>
        <p style={{ fontSize: 36, fontWeight: 900, margin: "0 0 14px" }}>₦{balance.toLocaleString()}</p>
        <div style={{ paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.2)", display: "flex", justifyContent: "space-between" }}>
          <div><p style={{ fontSize: 10, color: "#86efac", margin: "0 0 2px" }}>Paying</p><p style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>₦{product?.price?.toLocaleString()}</p></div>
          <div><p style={{ fontSize: 10, color: "#86efac", margin: "0 0 2px" }}>Remaining</p><p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: remaining < 0 ? "#fca5a5" : "white" }}>₦{remaining.toLocaleString()}</p></div>
        </div>
      </div>
      {remaining < 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "10px 14px", color: "#dc2626", fontSize: 12, fontWeight: 700 }}>
          ⚠️ Insufficient balance. Top up ₦{Math.abs(remaining).toLocaleString()} to continue.
        </div>
      )}
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", textAlign: "center", margin: "0 0 14px" }}>Enter 4-digit PIN</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 14 }}>
          {pin.map((d, i) => (
            <input key={i} id={`pin-${i}`} type="password" inputMode="numeric" maxLength={1} value={d} onChange={e => handlePin(i, e.target.value)}
              style={{ width: 56, height: 56, border: "2px solid #e5e7eb", borderRadius: 16, textAlign: "center", fontSize: 24, fontWeight: 900, outline: "none", background: "#f9fafb", fontFamily: "inherit" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CryptoPaymentForm({ product, onSuccess }) {
  const addr = "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE";
  const rate = 1650;
  const usdt = ((product?.price || 0) / rate).toFixed(2);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 14, padding: "10px 14px", fontSize: 12, color: "#92400e", fontWeight: 700 }}>
        ⚠️ Only send USDT on TRC-20 network. Other networks = permanent loss.
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 18, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {[["Amount (Naira)", `₦${product?.price?.toLocaleString()}`], ["Exchange Rate", `₦${rate.toLocaleString()} / USDT`]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{v}</span>
          </div>
        ))}
        <div style={{ paddingTop: 10, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>Send USDT</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#1a6b3c" }}>{usdt} USDT</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <QRCodeBlock size={130} />
        <div style={{ width: "100%", background: "#111827", borderRadius: 14, padding: 14 }}>
          <p style={{ fontSize: 10, color: "#6b7280", margin: "0 0 4px" }}>TRC-20 Wallet Address</p>
          <p style={{ fontFamily: "monospace", color: "#4ade80", fontSize: 11, wordBreak: "break-all", margin: "0 0 8px" }}>{addr}</p>
          <button style={{ background: "#374151", color: "white", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Copy Address</button>
        </div>
      </div>
      <button onClick={onSuccess} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "15px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
        I've Sent the Payment ✓
      </button>
    </div>
  );
}

function PaymentSuccessScreen({ product, escrowRef }) {
  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 24px", gap: 20, textAlign: "center" }}>
      <div className="pulse-ring" style={{ width: 96, height: 96, background: "#f0faf4", border: "4px solid #1a6b3c", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 44 }}>✅</span>
      </div>
      <div>
        <h3 style={{ fontSize: 22, fontWeight: 900, color: "#111827", margin: "0 0 8px" }}>Payment Held in Escrow</h3>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>Your money is safe. Funds release when seller shows QR code at pickup.</p>
      </div>
      <div style={{ width: "100%", background: "#f0faf4", border: "2px solid #bbf7d0", borderRadius: 20, padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {[["Item", product?.title], ["Amount", `₦${product?.price?.toLocaleString()}`], ["Escrow Ref", escrowRef], ["Status", "🔒 In Escrow"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{k}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: k === "Amount" ? "#1a6b3c" : "#111827" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ width: "100%", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 20, padding: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 800, color: "#1e40af", margin: "0 0 10px" }}>🤝 Pickup QR Code</p>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}><QRCodeBlock size={100} /></div>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#1d4ed8", margin: "0 0 4px" }}>Scan at meetup</p>
        <p style={{ fontSize: 11, color: "#3b82f6", margin: 0 }}>Show to seller at Main Gate safe zone</p>
      </div>
      <div style={{ width: "100%", background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 14, padding: "10px 14px", fontSize: 12, color: "#9a3412", fontWeight: 700 }}>
        ⏰ Auto-refund in 48 hours if pickup doesn't happen
      </div>
      <EscrowBadge />
    </div>
  );
}

function PaymentScreen({ product, onNavigate, showToast }) {
  const [method, setMethod] = useState(null);
  const [step, setStep] = useState("select");
  const [escrowRef] = useState("UME-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  const handleSuccess = () => {
    setStep("processing");
    setTimeout(() => { setStep("success"); showToast("Payment Held in Escrow ✓"); }, 2000);
  };

  if (step === "processing") {
    return (
      <div className="fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", background: "#f0faf4", gap: 20 }}>
        <div style={{ position: "relative", width: 80, height: 80 }}>
          <div style={{ position: "absolute", inset: 0, border: "4px solid #e5e7eb", borderRadius: "50%" }} />
          <div style={{ position: "absolute", inset: 0, border: "4px solid transparent", borderTopColor: "#1a6b3c", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: "#111827", margin: 0 }}>Processing Payment</h3>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Securing funds in escrow...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4" }}>
        <div style={{ background: "#1a6b3c", padding: "40px 20px 16px" }}>
          <h2 style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0 }}>Escrow Payment</h2>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <PaymentSuccessScreen product={product} escrowRef={escrowRef} />
          <div style={{ padding: "0 24px 32px" }}>
            <button onClick={() => onNavigate("home")} style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "15px 0", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              Back to Home 🏠
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4" }}>
      <div style={{ background: "#1a6b3c", padding: "40px 20px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <BackButton onBack={step === "form" ? () => setStep("select") : () => onNavigate("product", product)} />
        <h2 style={{ color: "white", fontWeight: 700, fontSize: 16, margin: 0, flex: 1 }}>Escrow Payment</h2>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ background: "white", borderRadius: 20, padding: 16, border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px" }}>Order Summary</p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 52, height: 52, background: "#f0faf4", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, flexShrink: 0 }}>{product?.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 14, margin: "0 0 2px" }}>{product?.title}</p>
              <p style={{ color: "#1a6b3c", fontWeight: 900, fontSize: 18, margin: 0 }}>₦{product?.price?.toLocaleString()}</p>
            </div>
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <EscrowBadge />
            <span style={{ fontSize: 11, color: "#9ca3af" }}>+ ₦0 fee</span>
          </div>
        </div>

        {step === "select" && (
          <>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Choose Payment Method</p>
            {PAYMENT_METHODS.map(m => (
              <button key={m.id} onClick={() => { setMethod(m.id); setStep("form"); }}
                style={{ width: "100%", background: "white", border: "2px solid #f3f4f6", borderRadius: 20, padding: 14, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", transition: "border-color 0.15s", boxSizing: "border-box" }}>
                <span style={{ fontSize: 26, width: 36, textAlign: "center" }}>{m.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 14, margin: "0 0 2px" }}>{m.label}</p>
                  <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>{m.desc}</p>
                </div>
                <svg width="20" height="20" fill="none" stroke="#d1d5db" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </>
        )}

        {step === "form" && (
          <div className="slide-up" style={{ background: "white", borderRadius: 20, padding: 20, border: "1px solid #f3f4f6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ fontSize: 22 }}>{PAYMENT_METHODS.find(m => m.id === method)?.icon}</span>
              <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 15, margin: 0 }}>{PAYMENT_METHODS.find(m => m.id === method)?.label}</p>
            </div>
            {method === "card" && <CardPaymentForm product={product} onSuccess={handleSuccess} />}
            {method === "transfer" && <BankTransferForm product={product} onSuccess={handleSuccess} />}
            {method === "ussd" && <USSDForm product={product} onSuccess={handleSuccess} />}
            {method === "qr" && <QRPaymentForm product={product} onSuccess={handleSuccess} />}
            {method === "wallet" && <WalletPaymentForm product={product} onSuccess={handleSuccess} />}
            {method === "crypto" && <CryptoPaymentForm product={product} onSuccess={handleSuccess} />}
          </div>
        )}
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ─── Screen 7: Sell ────────────────────────────────────────────────────────────

function SellScreen({ onNavigate, showToast }) {
  const [form, setForm] = useState({ name: "", category: "Textbooks", price: "", description: "" });
  const [photoAdded, setPhotoAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePost = () => {
    if (!form.name || !form.price) { showToast("Fill in name and price first"); return; }
    setLoading(true);
    setTimeout(() => { showToast("Listing Live! 🎉"); setLoading(false); onNavigate("home"); }, 1500);
  };

  const inp = { width: "100%", border: "2px solid #e5e7eb", borderRadius: 14, padding: "12px 16px", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit", background: "white" };

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4" }}>
      <div style={{ background: "#1a6b3c", padding: "40px 20px 20px" }}>
        <h2 style={{ color: "white", fontWeight: 900, fontSize: 22, margin: "0 0 4px" }}>Create Listing</h2>
        <p style={{ color: "#86efac", fontSize: 12, margin: 0 }}>Sell to students near you</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#dcfce7", border: "1px solid #86efac", borderRadius: 999, padding: "6px 14px" }}>
          <span style={{ fontSize: 13 }}>📍</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#15803d" }}>You're in Ugbowo Zone ✓</span>
        </div>

        <button onClick={() => setPhotoAdded(true)}
          style={{ width: "100%", height: 130, borderRadius: 20, border: `2px dashed ${photoAdded ? "#22c55e" : "#d1d5db"}`, background: photoAdded ? "#f0fdf4" : "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer" }}>
          <span style={{ fontSize: 36, color: photoAdded ? undefined : "#d1d5db" }}>{photoAdded ? "📸" : "📷"}</span>
          <p style={{ fontSize: 14, fontWeight: 600, color: photoAdded ? "#16a34a" : "#9ca3af", margin: 0 }}>{photoAdded ? "Photo Added ✓" : "Tap to Upload Photo"}</p>
          {!photoAdded && <p style={{ fontSize: 11, color: "#d1d5db", margin: 0 }}>PNG, JPG up to 10MB</p>}
        </button>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Item Name *</label>
          <input style={{ ...inp, marginTop: 8 }} placeholder="e.g. CHM 101 Textbook" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Category *</label>
          <select style={{ ...inp, marginTop: 8 }} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Price (₦) *</label>
          <div style={{ position: "relative", marginTop: 8 }}>
            <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700 }}>₦</span>
            <input type="number" style={{ ...inp, paddingLeft: 32 }} placeholder="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>Description</label>
          <textarea rows={4} style={{ ...inp, marginTop: 8, resize: "none" }} placeholder="Describe condition, why selling, any defects..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 16, padding: 14 }}>
          <p style={{ fontSize: 12, fontWeight: 800, color: "#1e40af", margin: "0 0 8px" }}>📋 Listing Guidelines</p>
          <ul style={{ fontSize: 12, color: "#3b82f6", margin: 0, paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {["Only list items you own and can deliver", "All transactions must use UniMart Escrow", "Meet only at designated safe zones"].map(t => (
              <li key={t} style={{ display: "flex", gap: 6 }}>• {t}</li>
            ))}
          </ul>
        </div>

        <button onClick={handlePost} disabled={loading}
          style={{ width: "100%", background: "#1a6b3c", color: "white", border: "none", borderRadius: 20, padding: "16px 0", fontWeight: 900, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(26,107,60,0.3)" }}>
          {loading ? "Posting..." : "Post Listing 🚀"}
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  );
}

// ─── Screen 8: Profile ────────────────────────────────────────────────────────

function ProfileScreen({ onNavigate, showToast }) {
  const [notif, setNotif] = useState(true);
  const myListings = [
    { id: 101, emoji: "📚", title: "MTH 201 Textbook", price: 2000 },
    { id: 102, emoji: "🖥️", title: "Laptop Stand", price: 4500 },
  ];

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f0faf4" }}>
      <div style={{ background: "#1a6b3c", padding: "40px 20px 24px", textAlign: "center" }}>
        <div style={{ width: 80, height: 80, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", color: "#1a6b3c", fontWeight: 900, fontSize: 24 }}>CO</div>
        <h2 style={{ color: "white", fontSize: 20, fontWeight: 900, margin: "0 0 4px" }}>Chukwuemeka Obi</h2>
        <p style={{ color: "#86efac", fontSize: 12, margin: "0 0 8px" }}>chukwuemeka@uniben.edu.ng</p>
        <VerifiedBadge />
        <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}><StarRating rating={4.7} /></div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "white", borderBottom: "1px solid #f3f4f6" }}>
          {[["12", "Items Sold"], ["3", "Active"], ["2023", "Since"]].map(([v, l], i) => (
            <div key={l} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", borderRight: i < 2 ? "1px solid #f3f4f6" : "none" }}>
              <p style={{ color: "#1a6b3c", fontWeight: 900, fontSize: 22, margin: "0 0 2px" }}>{v}</p>
              <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontWeight: 900, color: "#111827", fontSize: 16, margin: 0 }}>My Listings</p>
              <button onClick={() => onNavigate("sell")} style={{ background: "#f0faf4", border: "1px solid #bbf7d0", color: "#1a6b3c", borderRadius: 999, padding: "5px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>+ New</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myListings.map(item => (
                <div key={item.id} style={{ background: "white", borderRadius: 20, padding: 12, border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 52, height: 52, background: "#f0faf4", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: "#1f2937", fontSize: 14, margin: "0 0 2px" }}>{item.title}</p>
                    <p style={{ color: "#1a6b3c", fontWeight: 900, fontSize: 14, margin: "0 0 4px" }}>₦{item.price.toLocaleString()}</p>
                    <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 11, fontWeight: 700, borderRadius: 999, padding: "2px 10px" }}>● Active</span>
                  </div>
                  <button style={{ background: "none", border: "none", color: "#d1d5db", fontSize: 20, cursor: "pointer" }}>⋮</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #f3f4f6", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, padding: "12px 16px", borderBottom: "1px solid #f3f4f6", margin: 0 }}>Settings</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18 }}>🔔</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Push Notifications</span>
              </div>
              <button onClick={() => setNotif(n => !n)} style={{ width: 48, height: 26, borderRadius: 999, border: "none", background: notif ? "#1a6b3c" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 3, width: 20, height: 20, background: "white", borderRadius: "50%", boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "transform 0.2s", transform: `translateX(${notif ? 25 : 3}px)` }} />
              </button>
            </div>
            {[["🛡️", "Privacy & Safety"], ["💬", "Chat Settings"], ["🏦", "Payment Methods"], ["❓", "Help & Support"]].map(([icon, label]) => (
              <button key={label} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #f3f4f6", background: "none", border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{label}</span>
                </div>
                <svg width="16" height="16" fill="none" stroke="#d1d5db" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            ))}
          </div>

          <button onClick={() => { showToast("Logged out"); setTimeout(() => onNavigate("splash"), 500); }}
            style={{ width: "100%", background: "#fef2f2", border: "2px solid #fecaca", color: "#dc2626", borderRadius: 20, padding: "14px 0", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            🚪 Log Out
          </button>
          <div style={{ height: 16 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({ activeScreen, onNavigate }) {
  const tabs = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "sell", label: "Sell", icon: "➕" },
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];
  if (["splash", "login"].includes(activeScreen)) return null;

  return (
    <div style={{ background: "white", borderTop: "1px solid #f3f4f6", display: "flex" }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onNavigate(tab.id)}
          style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 8px", gap: 2, border: "none", background: "none", cursor: "pointer", color: activeScreen === tab.id ? "#1a6b3c" : "#9ca3af", transition: "color 0.15s" }}>
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 700 }}>{tab.label}</span>
          {activeScreen === tab.id && <div style={{ width: 4, height: 4, background: "#1a6b3c", borderRadius: "50%" }} />}
        </button>
      ))}
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("splash");
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const toastKey = useRef(0);

  const showToast = msg => {
    toastKey.current += 1;
    setToast({ msg, key: toastKey.current });
  };

  const navigate = (screenName, data = null) => {
    if (data) setProduct(data);
    setScreen(screenName);
  };

  const renderScreen = () => {
    switch (screen) {
      case "splash": return <SplashScreen onNavigate={navigate} />;
      case "login": return <LoginScreen onNavigate={navigate} showToast={showToast} />;
      case "home": return <HomeScreen onNavigate={navigate} showToast={showToast} />;
      case "product": return <ProductDetailScreen product={product} onNavigate={navigate} showToast={showToast} />;
      case "chat": return <ChatScreen product={product} onNavigate={navigate} showToast={showToast} />;
      case "payment": return <PaymentScreen product={product} onNavigate={navigate} showToast={showToast} />;
      case "sell": return <SellScreen onNavigate={navigate} showToast={showToast} />;
      case "profile": return <ProfileScreen onNavigate={navigate} showToast={showToast} />;
      default: return <HomeScreen onNavigate={navigate} showToast={showToast} />;
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", background: "linear-gradient(135deg, #d1fae5 0%, #e5e7eb 100%)", padding: "0" }}>
      {toast && <Toast key={toast.key} message={toast.msg} onClose={() => setToast(null)} />}
      <div style={{
        width: "100%", maxWidth: 420, minHeight: "100vh",
        background: "white", display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)"
      }}>
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {renderScreen()}
        </div>
        <BottomNav activeScreen={screen} onNavigate={navigate} />
      </div>
    </div>
  );
}
