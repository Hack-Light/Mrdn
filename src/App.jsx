import React, { useState, useEffect } from "react";
import {
  Building2, ArrowRight, ArrowLeft, CheckCircle2, Clock, ShieldAlert,
  AlertTriangle, RefreshCw, ChevronRight, ChevronDown, Menu, X,
  Landmark, Smartphone, FileText, TrendingUp, LayoutGrid, History, Plus,
} from "lucide-react";

const TOKENS = {
  // Primary - Teal
  ink: "#0F172A",
  inkDark: "#050B15",
  inkLight: "#1E293B",
  
  // Neutrals - Enhanced grays with better contrast
  bg: "#F5F7FA",
  bgAlt: "#EEF2F7",
  surface: "#FFFFFF",
  line: "#D4DAEF",
  lineSoft: "#E2E8F0",
  muted: "#64748B",
  mutedLight: "#94A3B8",
  
  // Primary Accent - Vibrant Teal
  accent: "#0891B2",
  accentDark: "#0E7490",
  accentLight: "#06B6D4",
  accentBg: "#E0F2FE",
  
  // Secondary Accent - Purple
  secondary: "#8B5CF6",
  secondaryLight: "#A78BFA",
  secondaryBg: "#F3E8FF",
  
  // Tertiary - Green (for success)
  tertiary: "#10B981",
  tertiaryLight: "#34D399",
  tertiaryBg: "#D1FAE5",
  
  // Functional colors
  success: "#10B981",
  successBg: "#D1FAE5",
  successDark: "#059669",
  
  hold: "#F97316",
  holdBg: "#FED7AA",
  
  // Shadows and overlays
  shadowXs: "rgba(15, 23, 42, 0.04)",
  shadowSm: "rgba(15, 23, 42, 0.08)",
  shadowMd: "rgba(15, 23, 42, 0.12)",
  shadowLg: "rgba(15, 23, 42, 0.16)",
  overlay: "rgba(0, 0, 0, 0.4)",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
.f-display { font-family: 'Space Grotesk', sans-serif; }
.f-body { font-family: 'Inter', sans-serif; }
.f-mono { font-family: 'IBM Plex Mono', monospace; }
`;

const CORRIDORS = {
  china: {
    label: "China", flag: "🇨🇳", city: "Shenzhen", currency: "CNY", coord: "22.5°N",
  },
  india: {
    label: "India", flag: "🇮🇳", city: "Mumbai", currency: "INR", coord: "19.0°N",
  },
  turkey: {
    label: "Turkey", flag: "🇹🇷", city: "Istanbul", currency: "TRY", coord: "41.0°N",
  },
};

const NAV_PRIMARY = [
  { key: "signup", label: "1. Onboarding" },
  { key: "dashboard", label: "2. Dashboard" },
  { key: "corridor", label: "3. Corridor + Supplier" },
  { key: "confirmbeneficiary", label: "3a. Confirm Beneficiary (Turkey/India)" },
  { key: "invoice", label: "4. Invoice Details" },
  { key: "review", label: "5. Review & Rate Lock" },
  { key: "tracker", label: "6. Status Tracker" },
  { key: "history", label: "10. Transaction History" },
  { key: "detail", label: "11. Transaction Detail" },
];
const NAV_STATES = [
  { key: "held", label: "7. Held for Review" },
  { key: "expired", label: "8. Rate-Lock Expired" },
  { key: "rejected", label: "9. Off-Ramp Rejected" },
  { key: "limitreached", label: "12. Tier 1 Limit Reached" },
  { key: "tier2upgrade", label: "13. Upgrade to Tier 2" },
];

function Logo({ small }) {
  return (
    <div className="flex items-center gap-2">
      <div>
        <div className="f-display font-bold tracking-tight" style={{ color: TOKENS.ink, fontSize: small ? 18 : 22 }}>
          Mrdn
        </div>
        <div style={{ height: 2, width: small ? 28 : 34, background: TOKENS.accent, marginTop: 2 }} />
      </div>
    </div>
  );
}

function TopBar({ onMenu, showAccount }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 border-b sticky top-0 z-10 backdrop-blur-sm" style={{ borderColor: TOKENS.lineSoft, background: `${TOKENS.surface}F2`, boxShadow: `0 1px 3px ${TOKENS.shadowSm}` }}>
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="p-1.5 -ml-1.5 rounded-lg transition-colors duration-200 hover:bg-opacity-50" style={{ color: TOKENS.ink, background: `${TOKENS.bg}66` }}>
          <Menu size={20} />
        </button>
        <Logo small />
      </div>
      {showAccount && (
        <div className="flex items-center gap-1.5 f-body text-xs font-medium px-3 py-2 rounded-lg" style={{ color: TOKENS.secondary, background: TOKENS.secondaryBg }}>
          <Building2 size={14} />
          <span>Business Owner</span>
        </div>
      )}
    </div>
  );
}

function NavSidebar({ screen, setScreen, open, setOpen }) {
  const Item = ({ item }) => (
    <button
      onClick={() => { setScreen(item.key); setOpen(false); }}
      className="w-full text-left px-3.5 py-2.5 rounded-lg f-body text-sm transition-all duration-200 font-medium hover:bg-opacity-60"
      style={{
        background: screen === item.key ? TOKENS.ink : "transparent",
        color: screen === item.key ? "#fff" : TOKENS.ink,
        fontWeight: screen === item.key ? 600 : 500,
      }}
    >
      {item.label}
    </button>
  );
  return (
    <>
      {open && <div className="absolute inset-0 z-20 transition-opacity duration-200" style={{ background: TOKENS.overlay }} onClick={() => setOpen(false)} />}
      <div
        className={`absolute z-30 top-0 left-0 h-full w-[82%] max-w-[300px] overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: TOKENS.surface, borderRight: `1px solid ${TOKENS.lineSoft}`, boxShadow: open ? `2px 0 12px ${TOKENS.shadowMd}` : "none" }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: TOKENS.lineSoft }}>
          <Logo small />
          <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-opacity-50 rounded-lg transition-colors" style={{ color: TOKENS.ink, background: `${TOKENS.bg}66` }}><X size={20} /></button>
        </div>
        <div className="p-3 space-y-0.5">
          <div className="f-body text-xs font-semibold uppercase tracking-wider px-3 pt-3 pb-2" style={{ color: TOKENS.mutedLight, letterSpacing: "0.05em" }}>Primary Flow</div>
          {NAV_PRIMARY.map((i) => <Item key={i.key} item={i} />)}
          <div className="f-body text-xs font-semibold uppercase tracking-wider px-3 pt-4 pb-2" style={{ color: TOKENS.mutedLight, letterSpacing: "0.05em" }}>Other States (demo)</div>
          {NAV_STATES.map((i) => <Item key={i.key} item={i} />)}
        </div>
      </div>
    </>
  );
}

function BottomNav({ screen, go }) {
  const isNewPayment = ["corridor", "confirmbeneficiary", "invoice", "review", "tracker"].includes(screen);
  const isHistory = ["history", "detail"].includes(screen);
  const isHome = screen === "dashboard";
  return (
    <div className="relative flex items-stretch border-t shrink-0" style={{ borderColor: TOKENS.lineSoft, background: TOKENS.surface, height: 68, boxShadow: `0 -1px 3px ${TOKENS.shadowSm}` }}>
      <button onClick={() => go("dashboard")} className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors hover:bg-opacity-50" style={{ background: isHome ? TOKENS.bgAlt : "transparent" }}>
        <LayoutGrid size={20} style={{ color: isHome ? TOKENS.accent : TOKENS.mutedLight }} />
        <span className="f-body text-[10px] font-semibold" style={{ color: isHome ? TOKENS.ink : TOKENS.muted }}>Home</span>
      </button>

      <div className="flex-1" />

      <button onClick={() => go("history")} className="flex-1 flex flex-col items-center justify-center gap-1 transition-colors hover:bg-opacity-50" style={{ background: isHistory ? TOKENS.bgAlt : "transparent" }}>
        <History size={20} style={{ color: isHistory ? TOKENS.accent : TOKENS.mutedLight }} />
        <span className="f-body text-[10px] font-semibold" style={{ color: isHistory ? TOKENS.ink : TOKENS.muted }}>History</span>
      </button>

      <button
        onClick={() => go("corridor")}
        className="absolute rounded-full flex items-center justify-center transition-all active:scale-95 active:shadow-md hover:shadow-lg"
        style={{ background: TOKENS.ink, width: 56, height: 56, left: "50%", transform: "translateX(-50%)", top: -22, boxShadow: `0 4px 16px ${TOKENS.shadowLg}` }}
      >
        <Plus size={24} color="#fff" strokeWidth={2.5} />
      </button>
      <div
        className="absolute f-body text-[10px] font-semibold text-center"
        style={{ left: "50%", transform: "translateX(-50%)", bottom: 6, width: 88, color: isNewPayment ? TOKENS.accent : TOKENS.muted, transition: "color 200ms" }}
      >
        New Payment
      </div>
    </div>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border p-6 transition-all duration-200 ${className}`} style={{ background: TOKENS.surface, borderColor: TOKENS.lineSoft, boxShadow: `0 1px 3px ${TOKENS.shadowSm}, 0 2px 6px ${TOKENS.shadowXs}` }}>
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, icon: Icon = ArrowRight, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="f-body font-semibold px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 w-full transition-all duration-200 active:scale-95 disabled:opacity-60"
      style={{ 
        background: disabled ? TOKENS.lineSoft : TOKENS.accent, 
        color: disabled ? TOKENS.mutedLight : "#fff", 
        boxShadow: disabled ? "none" : `0 4px 12px ${TOKENS.shadowMd}`,
        cursor: disabled ? "not-allowed" : "pointer"
      }}
    >
      {children} <Icon size={16} />
    </button>
  );
}

function GhostButton({ children, onClick, icon: Icon = ArrowLeft }) {
  return (
    <button onClick={onClick} className="f-body font-medium px-5 py-3.5 rounded-xl flex items-center justify-center gap-2 border w-full transition-all duration-200 active:scale-95 hover:bg-opacity-50" style={{ borderColor: TOKENS.lineSoft, color: TOKENS.ink, background: `${TOKENS.bgAlt}` }}>
      <Icon size={16} /> {children}
    </button>
  );
}

function ButtonGroup({ children }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <label className="block mb-4">
      <span className="f-body text-sm font-medium block mb-2" style={{ color: TOKENS.ink }}>{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-lg border outline-none f-body transition-all duration-200 ${mono ? "f-mono" : ""}`}
        style={{ 
          borderColor: focused ? TOKENS.accent : TOKENS.lineSoft, 
          color: TOKENS.ink,
          background: focused ? `${TOKENS.accentBg}66` : TOKENS.surface,
          boxShadow: focused ? `0 0 0 3px ${TOKENS.accentBg}` : "none"
        }}
      />
    </label>
  );
}

function ScreenHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8">
      {eyebrow && <div className="f-body text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: TOKENS.accent, letterSpacing: "0.08em" }}>
        <div style={{ width: 8, height: 8, background: TOKENS.accent, borderRadius: "50%" }} />
        {eyebrow}
      </div>}
      <h1 className="f-display font-bold text-3xl sm:text-4xl mb-2 leading-tight" style={{ color: TOKENS.ink }}>{title}</h1>
      {subtitle && <p className="f-body text-base leading-relaxed" style={{ color: TOKENS.muted, maxWidth: "480px" }}>{subtitle}</p>}
    </div>
  );
}

/* ---------- Screens ---------- */

function StepProgress({ step, total }) {
  return (
    <div className="relative mb-8 mt-4">
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex-1 flex items-center gap-2">
            <div 
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500"
              style={{
                background: i <= step ? TOKENS.accent : TOKENS.bgAlt,
                color: i <= step ? "#fff" : TOKENS.muted,
                border: `2px solid ${i <= step ? TOKENS.accent : TOKENS.lineSoft}`,
                boxShadow: i === step ? `0 0 0 4px ${TOKENS.accentBg}` : "none"
              }}
            >
              {i <= step ? "✓" : i + 1}
            </div>
            {i < total - 1 && (
              <div 
                className="flex-1 h-1 rounded-full transition-all duration-500"
                style={{
                  background: i < step ? TOKENS.accent : TOKENS.lineSoft
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Upload({ label, fileName, onChange }) {
  const inputId = "upload-" + label.replace(/[^a-zA-Z0-9]/g, "");
  const isUploaded = fileName !== null;
  return (
    <label
      htmlFor={inputId}
      className="w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border-2 border-dashed mb-3 text-left cursor-pointer transition-all duration-200"
      style={{ borderColor: isUploaded ? TOKENS.success : TOKENS.lineSoft, background: isUploaded ? TOKENS.successBg : TOKENS.bgAlt }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <FileText size={16} style={{ color: isUploaded ? TOKENS.success : TOKENS.muted }} className="shrink-0" />
        <div className="min-w-0">
          <div className="f-body text-sm font-semibold truncate" style={{ color: TOKENS.ink }}>{label}</div>
          {fileName && <div className="f-mono text-[11px] truncate" style={{ color: TOKENS.muted }}>{fileName}</div>}
        </div>
      </div>
      <span className="f-body text-xs font-bold shrink-0" style={{ color: isUploaded ? TOKENS.success : TOKENS.accent }}>
        {fileName ? "✓ Uploaded" : "Upload"}
      </span>
      <input
        id={inputId}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => onChange(e.target.files[0] ? e.target.files[0].name : null)}
      />
    </label>
  );
}

function Checkbox({ checked, onToggle, children }) {
  return (
    <button onClick={onToggle} className="w-full flex items-start gap-3 text-left mb-4 transition-opacity hover:opacity-70">
      <div className="mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all duration-200" style={{ 
        background: checked ? TOKENS.accent : TOKENS.surface,
        border: `2px solid ${checked ? TOKENS.accent : TOKENS.lineSoft}`,
        boxShadow: checked ? `0 0 0 3px ${TOKENS.accentBg}` : "none"
      }}>
        {checked && <CheckCircle2 size={14} color={TOKENS.ink} />}
      </div>
      <span className="f-body text-sm font-medium" style={{ color: TOKENS.ink }}>{children}</span>
    </button>
  );
}

function VerificationWaiting({ onDone }) {
  const checks = [
    { label: "Phone verified", detail: "Confirmed instantly" },
    { label: "Business details received", detail: "CAC and TIN matched to registry" },
    { label: "Documents received", detail: "CAC Certificate, Status Report, proof of address" },
    { label: "Screening in progress", detail: "Sanctions and PEP screening on business and directors" },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (idx >= checks.length - 1) return;
    const t = setTimeout(() => setIdx((i) => i + 1), 1300);
    return () => clearTimeout(t);
  }, [idx]);
  const donePct = (idx / (checks.length - 1)) * 100;
  const allDone = idx === checks.length - 1;

  return (
    <div className="max-w-lg">
      <ScreenHeader title="Verifying your business" subtitle="We'll notify you the moment this is done — no need to keep this open." />
      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="f-body text-xs font-semibold uppercase tracking-wide" style={{ color: TOKENS.accentDark }}>
            {allDone ? "Almost there" : "In progress"}
          </span>
          <span className="f-mono text-xs" style={{ color: TOKENS.muted }}>usually 2–5 min</span>
        </div>
        <div className="relative mb-8 mt-4">
          <div className="flex items-center justify-between gap-2">
            {checks.map((_, i) => (
              <div key={i} className="flex-1 flex items-center gap-2">
                <div 
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500"
                  style={{
                    background: i <= idx ? TOKENS.accent : TOKENS.bgAlt,
                    color: i <= idx ? "#fff" : TOKENS.muted,
                    border: `2px solid ${i <= idx ? TOKENS.accent : TOKENS.lineSoft}`,
                    boxShadow: i === idx ? `0 0 0 4px ${TOKENS.accentBg}` : "none"
                  }}
                >
                  {i <= idx ? "✓" : i + 1}
                </div>
                {i < checks.length - 1 && (
                  <div 
                    className="flex-1 h-1 rounded-full transition-all duration-500"
                    style={{
                      background: i < idx ? TOKENS.accent : TOKENS.lineSoft
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {checks.map((c, i) => {
            const isDone = i < idx;
            const isActive = i === idx && !allDone;
            const isFinalActive = i === idx && allDone && i === checks.length - 1;
            return (
              <div key={c.label} className="flex items-start gap-3 py-3 px-3 rounded-lg transition-all duration-300" style={{ 
                opacity: i <= idx ? 1 : 0.5,
                background: i <= idx ? TOKENS.bgAlt : "transparent"
              }}>
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <CheckCircle2 size={18} style={{ color: TOKENS.success }} />
                  ) : isActive ? (
                    <RefreshCw size={18} className="animate-spin" style={{ color: TOKENS.accent }} />
                  ) : isFinalActive ? (
                    <Clock size={18} style={{ color: TOKENS.accent }} />
                  ) : (
                    <div className="w-[18px] h-[18px] rounded-full border-2" style={{ borderColor: TOKENS.lineSoft }} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="f-body text-sm font-semibold" style={{ color: TOKENS.ink }}>{c.label}</div>
                  <div className="f-body text-xs mt-1" style={{ color: TOKENS.muted }}>{c.detail}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t" style={{ borderColor: TOKENS.line, transition: "opacity 400ms", opacity: allDone ? 1 : 0.35 }}>
          <PrimaryButton onClick={() => allDone && onDone()} icon={CheckCircle2} disabled={!allDone}>
            {allDone ? "Continue (demo: mark as verified)" : "Waiting for screening to finish..."}
          </PrimaryButton>
          <p className="f-body text-xs text-center mt-3" style={{ color: TOKENS.muted }}>Taking longer than expected? <span style={{ color: TOKENS.accentDark, fontWeight: 600 }}>Contact support</span></p>
        </div>
      </Card>
    </div>
  );
}

function OnboardingFlow({ next }) {
  const [stage, setStage] = useState("welcome"); // welcome | steps | submitted | verified
  const [step, setStep] = useState(0);
  const [phoneStage, setPhoneStage] = useState("enter"); // enter | otp
  const [consent, setConsent] = useState({ terms: false, data: false });
  const stepLabels = ["Phone", "Business", "Director", "Consent"];

  if (stage === "welcome") {
    return (
      <div className="max-w-lg">
        <ScreenHeader eyebrow="Before your first payment" title="Let's get you started" subtitle="Takes about 2 minutes. No documents needed yet." />
        <Card className="mb-5">
          {[
            "Your phone number, to secure your account",
            "Your business name and CAC registration number",
            "Your name and BVN, as the account's primary contact",
          ].map((t) => (
            <div key={t} className="flex items-start gap-2.5 mb-3 last:mb-0">
              <CheckCircle2 size={16} style={{ color: TOKENS.accent }} className="mt-0.5 shrink-0" />
              <span className="f-body text-sm" style={{ color: TOKENS.ink }}>{t}</span>
            </div>
          ))}
        </Card>
        <div className="f-body text-xs flex items-start gap-2 mt-1 mb-5 p-3 rounded-lg" style={{ background: TOKENS.bg, color: TOKENS.muted }}>
          <ShieldAlert size={14} className="mt-0.5 shrink-0" />
          <span>This gets you Tier 1 access — up to ₦1,000,000 in payments per month. You can upgrade to full verification anytime for higher limits.</span>
        </div>
        <PrimaryButton onClick={() => setStage("steps")}>Start verification</PrimaryButton>
      </div>
    );
  }

  if (stage === "steps") {
    return (
      <div className="max-w-lg">
        <div className="f-body text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: TOKENS.accentDark }}>
          Step {step + 1} of {stepLabels.length} · {stepLabels[step]}
        </div>
        <StepProgress step={step} total={stepLabels.length} />

        {step === 0 && (
          <Card>
            {phoneStage === "enter" ? (
              <>
                <Field label="Phone number" value="+234 803 555 0192" onChange={() => {}} mono />
                <PrimaryButton onClick={() => setPhoneStage("otp")}>Send code</PrimaryButton>
              </>
            ) : (
              <>
                <p className="f-body text-sm mb-4" style={{ color: TOKENS.muted }}>Enter the 6-digit code sent to +234 803 555 0192</p>
                <div className="flex gap-2 mb-5">
                  {[1,2,3,4,5,6].map((i) => (
                    <div key={i} className="flex-1 h-12 rounded-lg border flex items-center justify-center f-mono font-semibold" style={{ borderColor: TOKENS.line, color: TOKENS.ink }}>{i <= 4 ? "•" : ""}</div>
                  ))}
                </div>
                <PrimaryButton onClick={() => setStep(1)}>Verify</PrimaryButton>
                <button className="f-body text-xs mt-3 block mx-auto sm:mx-0" style={{ color: TOKENS.accentDark }}>Resend code</button>
              </>
            )}
          </Card>
        )}

        {step === 1 && (
          <Card>
            <Field label="Business name" value="Okafor Import & Trading Ltd" onChange={() => {}} />
            <Field label="CAC registration number" value="RC 1928374" onChange={() => {}} mono />
            <label className="block mb-4">
              <span className="f-body text-sm font-medium block mb-1.5" style={{ color: TOKENS.ink }}>Industry</span>
              <div className="relative">
                <select className="w-full px-3.5 py-2.5 rounded-lg border outline-none f-body appearance-none" style={{ borderColor: TOKENS.line, color: TOKENS.ink }}>
                  <option>Import & Trading</option><option>Manufacturing</option><option>Retail</option><option>Other</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-3" style={{ color: TOKENS.muted }} />
              </div>
            </label>
            <div className="f-body text-xs mb-1 px-3 py-2.5 rounded-lg" style={{ background: TOKENS.bg, color: TOKENS.muted }}>
              We validate your CAC number against the public registry - no certificate upload needed at this tier.
            </div>
            <ButtonGroup><GhostButton onClick={() => setStep(0)}>Back</GhostButton><PrimaryButton onClick={() => setStep(2)}>Continue</PrimaryButton></ButtonGroup>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <p className="f-body text-xs mb-4 px-3 py-2.5 rounded-lg" style={{ background: TOKENS.bg, color: TOKENS.muted }}>
              This is you, as the primary contact for this account. Other directors and government ID uploads are only needed if you upgrade to full verification later.
            </p>
            <Field label="Your full name" value="" onChange={() => {}} placeholder="As shown on government ID" />
            <Field label="BVN" value="•••••••••1029" onChange={() => {}} mono />
            <ButtonGroup><GhostButton onClick={() => setStep(1)}>Back</GhostButton><PrimaryButton onClick={() => setStep(3)}>Continue</PrimaryButton></ButtonGroup>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <Checkbox checked={consent.terms} onToggle={() => setConsent({ ...consent, terms: !consent.terms })}>
              I agree to Mrdn's Terms of Service and Payment Agreement.
            </Checkbox>
            <Checkbox checked={consent.data} onToggle={() => setConsent({ ...consent, data: !consent.data })}>
              I consent to Mrdn collecting and processing my business and personal data in line with the Nigeria Data Protection Act (NDPA), for the purposes of verification, screening, and payment processing.
            </Checkbox>
            <div className="flex flex-col gap-3 mt-2 w-full">
              <PrimaryButton onClick={() => setStage("submitted")} disabled={!consent.terms || !consent.data} icon={CheckCircle2}>Submit for verification</PrimaryButton>
              <GhostButton onClick={() => setStep(2)}>Back</GhostButton>
            </div>
          </Card>
        )}
      </div>
    );
  }

  if (stage === "submitted") {
    return <VerificationWaiting onDone={() => setStage("verified")} />;
  }

  return (
    <div className="max-w-lg">
      <Card>
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: TOKENS.successBg }}>
            <CheckCircle2 size={28} style={{ color: TOKENS.success }} />
          </div>
          <div className="f-display font-bold text-xl mb-1.5" style={{ color: TOKENS.ink }}>You're verified</div>
          <p className="f-body text-sm mb-6" style={{ color: TOKENS.muted }}>Okafor Import & Trading Ltd can now send payments up to ₦1,000,000/month through Mrdn.</p>
          <PrimaryButton onClick={next}>Go to dashboard</PrimaryButton>
        </div>
      </Card>
    </div>
  );
}

function Tier2UpgradeFlow({ next, back }) {
  const [step, setStep] = useState(0);
  const [docs, setDocs] = useState({ cac: null, statusReport: null, address: null });
  const [tin, setTin] = useState("");
  const [primaryIdDoc, setPrimaryIdDoc] = useState(null);
  const [directors, setDirectors] = useState([]);
  const addDirector = () => setDirectors([...directors, { id: Date.now(), name: "", bvn: "", idType: "National ID (NIN)", idDoc: null }]);
  const updateDirector = (id, field, value) => setDirectors(directors.map((d) => (d.id === id ? { ...d, [field]: value } : d)));
  const removeDirector = (id) => setDirectors(directors.filter((d) => d.id !== id));
  const stepLabels = ["Business Documents", "Directors", "Submitted"];

  if (step === 2) {
    return <VerificationWaiting onDone={next} />;
  }

  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow={`Upgrade · Step ${step + 1} of 2`} title="Full verification" subtitle="This unlocks unlimited monthly payment volume." />
      <StepProgress step={step} total={2} />

      {step === 0 && (
        <Card>
          <Field label="Tax Identification Number (TIN)" value={tin} onChange={setTin} mono placeholder="21983746-0001" />
          <Upload label="CAC Certificate of Incorporation" fileName={docs.cac} onChange={(name) => setDocs({ ...docs, cac: name })} />
          <Upload label="Status Report (Form CAC 7)" fileName={docs.statusReport} onChange={(name) => setDocs({ ...docs, statusReport: name })} />
          <Upload label="Proof of Address (utility bill)" fileName={docs.address} onChange={(name) => setDocs({ ...docs, address: name })} />
          <ButtonGroup><GhostButton onClick={back}>Cancel</GhostButton><PrimaryButton onClick={() => setStep(1)} disabled={!tin || !docs.cac || !docs.statusReport || !docs.address}>Continue</PrimaryButton></ButtonGroup>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <p className="f-body text-xs mb-4 px-3 py-2.5 rounded-lg" style={{ background: TOKENS.bg, color: TOKENS.muted }}>
            BVN and a valid government ID are required for every director on file with the CAC.
          </p>
          <Field label="Your full name" value="Adaeze Okafor" onChange={() => {}} />
          <Field label="BVN" value="•••••••••1029" onChange={() => {}} mono />
          <label className="block mb-4">
            <span className="f-body text-sm font-medium block mb-1.5" style={{ color: TOKENS.ink }}>ID type</span>
            <div className="relative">
              <select className="w-full px-3.5 py-2.5 rounded-lg border outline-none f-body appearance-none" style={{ borderColor: TOKENS.line, color: TOKENS.ink }}>
                <option>National ID (NIN)</option><option>International Passport</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3" style={{ color: TOKENS.muted }} />
            </div>
          </label>
          <Upload label="Upload government ID" fileName={primaryIdDoc} onChange={setPrimaryIdDoc} />
          <div className="flex items-center justify-between mb-1 mt-3 pt-3 border-t" style={{ borderColor: TOKENS.line }}>
            <span className="f-body text-sm font-medium" style={{ color: TOKENS.ink }}>Other directors ({directors.length})</span>
            <button onClick={addDirector} className="f-body text-xs font-semibold" style={{ color: TOKENS.accentDark }}>+ Add director</button>
          </div>
          {directors.map((d, i) => (
            <div key={d.id} className="rounded-lg p-3 mt-3" style={{ background: TOKENS.bg }}>
              <div className="flex items-center justify-between mb-2">
                <span className="f-body text-xs font-semibold" style={{ color: TOKENS.muted }}>Director {i + 2}</span>
                <button onClick={() => removeDirector(d.id)} className="f-body text-xs font-semibold" style={{ color: TOKENS.hold }}>Remove</button>
              </div>
              <Field label="Full name" value={d.name} onChange={(v) => updateDirector(d.id, "name", v)} />
              <Field label="BVN" value={d.bvn} onChange={(v) => updateDirector(d.id, "bvn", v)} mono />
              <label className="block mb-4">
                <span className="f-body text-sm font-medium block mb-1.5" style={{ color: TOKENS.ink }}>ID type</span>
                <div className="relative">
                  <select value={d.idType} onChange={(e) => updateDirector(d.id, "idType", e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border outline-none f-body appearance-none" style={{ borderColor: TOKENS.line, color: TOKENS.ink }}>
                    <option>National ID (NIN)</option><option>International Passport</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-3" style={{ color: TOKENS.muted }} />
                </div>
              </label>
              <Upload label="Upload government ID" fileName={d.idDoc} onChange={(name) => updateDirector(d.id, "idDoc", name)} />
            </div>
          ))}
          <div className="flex flex-col gap-3 w-full">
            <PrimaryButton onClick={() => setStep(2)} disabled={!primaryIdDoc || directors.some((d) => !d.idDoc)}>Submit for verification</PrimaryButton>
            <GhostButton onClick={() => setStep(0)}>Back</GhostButton>
          </div>
        </Card>
      )}
    </div>
  );
}

function DashboardScreen({ tier, goUpgrade }) {
  return (
    <div className="max-w-3xl">
      <ScreenHeader title="Welcome back" subtitle="Okafor Import & Trading Ltd" />

      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="f-body text-xs font-bold uppercase tracking-wider" style={{ color: TOKENS.accent, letterSpacing: "0.08em" }}>Account Status</span>
            <span className="f-body text-lg font-bold block mt-1" style={{ color: TOKENS.ink }}>
              {tier === "tier2" ? "Full verification" : "Tier 1 · Fast Start"}
            </span>
          </div>
          <span className="f-body text-xs px-3 py-1.5 rounded-full font-semibold" style={{ color: tier === "tier2" ? TOKENS.successDark : TOKENS.accentDark, background: tier === "tier2" ? TOKENS.successBg : TOKENS.accentBg }}>
            {tier === "tier2" ? "✓ Unlimited" : "₦650K / ₦1M"}
          </span>
        </div>
        {tier !== "tier2" && (
          <>
            <div className="relative h-2 rounded-full mb-3 overflow-hidden" style={{ background: TOKENS.lineSoft }}>
              <div className="absolute top-0 left-0 h-2 rounded-full transition-all duration-500" style={{ width: "65%", background: TOKENS.accent, boxShadow: `0 0 0 3px ${TOKENS.accentBg}` }} />
            </div>
            <button onClick={goUpgrade} className="f-body text-xs font-bold flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: TOKENS.accentDark }}>Upgrade for unlimited access <span>→</span></button>
          </>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: "This month", value: "₦650K", sub: "across 2 payments" },
          { label: "Avg. settlement", value: "6 min", sub: "vs. 3–5 days by bank" },
          { label: "Corridors used", value: "3", sub: "China · India · Turkey" },
        ].map((s) => (
          <Card key={s.label} className="hover:shadow-lg transition-all duration-200">
            <div className="f-body text-xs font-bold uppercase tracking-wider mb-2" style={{ color: TOKENS.mutedLight, letterSpacing: "0.08em" }}>{s.label}</div>
            <div className="f-display font-bold text-3xl leading-tight mb-2" style={{ color: TOKENS.ink }}>{s.value}</div>
            <div className="f-body text-xs font-medium" style={{ color: TOKENS.muted }}>{s.sub}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CorridorScreen({ corridor, setCorridor, supplier, setSupplier, next, back }) {
  const c = CORRIDORS[corridor];
  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="New Payment · Step 1 of 3" title="Where's this payment going?" />
      <Card className="mb-5">
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(CORRIDORS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setCorridor(key)}
              className="rounded-xl border-2 p-3.5 text-center f-body transition-all duration-200 hover:shadow-md active:scale-95"
              style={{ 
                borderColor: corridor === key ? TOKENS.accent : TOKENS.lineSoft, 
                borderWidth: 2,
                background: corridor === key ? TOKENS.accentBg : TOKENS.bgAlt,
                boxShadow: corridor === key ? `0 0 0 4px ${TOKENS.accentBg}66` : "none"
              }}
            >
              <div className="text-2xl mb-2">{val.flag}</div>
              <div className="text-sm font-bold" style={{ color: TOKENS.ink }}>{val.label}</div>
              <div className="text-xs f-mono mt-1" style={{ color: TOKENS.muted }}>{val.coord}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="f-body text-sm font-semibold mb-3" style={{ color: TOKENS.ink }}>Supplier payout details</div>
        <Field label="Beneficiary business name" value={supplier.name} onChange={(v) => setSupplier({ ...supplier, name: v })} placeholder={corridor === "china" ? "Registered name, Han characters" : "As on bank records"} />

        {corridor === "china" && (
          <>
            <Field label="Tax ID" value={supplier.docId} onChange={(v) => setSupplier({ ...supplier, docId: v })} mono />
            <Field label="CNAPS bank code (12 digits)" value={supplier.cnaps} onChange={(v) => setSupplier({ ...supplier, cnaps: v })} mono placeholder="105584001104" />
            <Field label="Bank account number" value={supplier.account} onChange={(v) => setSupplier({ ...supplier, account: v })} mono />
            <Field label="Beneficiary phone number" value={supplier.phone} onChange={(v) => setSupplier({ ...supplier, phone: v })} mono placeholder="+86 ..." />
          </>
        )}

        {corridor === "india" && (
          <>
            <Field label="UPI VPA" value={supplier.vpa} onChange={(v) => setSupplier({ ...supplier, vpa: v })} mono placeholder="supplier@bank" />
            <Field label="Beneficiary email" value={supplier.email} onChange={(v) => setSupplier({ ...supplier, email: v })} placeholder="supplier@company.in" />
            <Field label="Beneficiary phone number" value={supplier.phone} onChange={(v) => setSupplier({ ...supplier, phone: v })} mono placeholder="+91 ..." />
            <Field label="Beneficiary street address" value={supplier.address} onChange={(v) => setSupplier({ ...supplier, address: v })} />
          </>
        )}

        {corridor === "turkey" && (
          <>
            <Field label="IBAN" value={supplier.iban} onChange={(v) => setSupplier({ ...supplier, iban: v })} mono placeholder="TR__ ____ ____ ____ ____ ____ __" />
            <Field label="Beneficiary phone number" value={supplier.phone} onChange={(v) => setSupplier({ ...supplier, phone: v })} mono placeholder="+90 ..." />
          </>
        )}

        <div className="f-body text-xs flex items-start gap-2 mt-1 p-3 rounded-lg" style={{ background: TOKENS.bg, color: TOKENS.muted }}>
          <ShieldAlert size={14} className="mt-0.5 shrink-0" />
          <span>Delivered as {c.currency} directly to your supplier's bank account via dLocal — funds are never sent as crypto or to a crypto wallet.</span>
        </div>
      </Card>

      <div className="mt-5">
        <ButtonGroup>
          <GhostButton onClick={back}>Back</GhostButton>
          <PrimaryButton onClick={next}>Continue</PrimaryButton>
        </ButtonGroup>
      </div>
    </div>
  );
}

function ConfirmBeneficiaryScreen({ corridor, next, back }) {
  const [flagged, setFlagged] = useState(false);
  const isIndia = corridor === "india";
  const maskedName = isIndia ? "r***** s*********" : "ÖS*** ÇO***";
  const sourceCopy = isIndia
    ? "UPI returns the account holder's name for confirmation before a transfer. For privacy, part of the name is masked."
    : "Turkish banks return the account holder's name for confirmation before a transfer. For privacy, part of the name is masked.";
  const fixCopy = isIndia
    ? "Good catch. Go back and double-check the UPI VPA with your supplier before continuing — a small typo is the most common cause of a mismatch."
    : "Good catch. Go back and double-check the IBAN with your supplier before continuing — a small typo is the most common cause of a mismatch.";
  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="New Payment · Beneficiary Check" title="Confirm your supplier's account" subtitle="We checked this account with the bank before you send anything." />
      <Card className="mb-5">
        <div className="flex items-start gap-3 mb-5">
          <ShieldAlert size={20} style={{ color: TOKENS.accentDark }} className="mt-0.5" />
          <div className="f-body text-sm" style={{ color: TOKENS.muted }}>
            {sourceCopy}
          </div>
        </div>
        <div className="rounded-xl p-4 mb-4 text-center" style={{ background: TOKENS.bg }}>
          <div className="f-body text-[10px] uppercase tracking-wide font-semibold mb-1.5" style={{ color: TOKENS.muted }}>Account holder on file</div>
          <div className="f-mono font-semibold text-lg" style={{ color: TOKENS.ink }}>{maskedName}</div>
        </div>
        <p className="f-body text-sm mb-1" style={{ color: TOKENS.ink }}>Does this match your supplier's name?</p>
      </Card>
      {!flagged ? (
        <div className="flex flex-col gap-3 w-full">
          <PrimaryButton onClick={next} icon={CheckCircle2}>Yes, this matches</PrimaryButton>
          <GhostButton onClick={() => setFlagged(true)} icon={AlertTriangle}>This doesn't look right</GhostButton>
        </div>
      ) : (
        <Card>
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={20} style={{ color: TOKENS.hold }} className="mt-0.5" />
            <div className="f-body text-sm" style={{ color: TOKENS.ink }}>
              {fixCopy}
            </div>
          </div>
          <ButtonGroup>
            <PrimaryButton onClick={back} icon={ArrowLeft}>Back to supplier details</PrimaryButton>
          </ButtonGroup>
        </Card>
      )}
    </div>
  );
}

function InvoiceScreen({ invoice, setInvoice, corridor, next, back }) {
  const categories = ["Electronics / components", "Textiles / finished goods", "Machinery parts", "Raw materials", "Other"];
  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="New Payment · Step 2 of 3" title="Invoice details" />
      <Card>
        <Field label="Invoice reference" value={invoice.ref} onChange={(v) => setInvoice({ ...invoice, ref: v })} mono placeholder="INV-3391" />
        <Field label="Amount (₦)" value={invoice.amount} onChange={(v) => setInvoice({ ...invoice, amount: v })} placeholder="450,000" />
        <label className="block mb-2">
          <span className="f-body text-sm font-medium block mb-1.5" style={{ color: TOKENS.ink }}>Invoice category</span>
          <div className="relative">
            <select value={invoice.category} onChange={(e) => setInvoice({ ...invoice, category: e.target.value })} className="w-full px-3.5 py-2.5 rounded-lg border outline-none f-body appearance-none" style={{ borderColor: TOKENS.line, color: TOKENS.ink }}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-3" style={{ color: TOKENS.muted }} />
          </div>
        </label>
        {corridor === "india" && (
          <div className="f-body text-xs flex items-start gap-2 mt-3 p-3 rounded-lg" style={{ background: TOKENS.bg, color: TOKENS.muted }}>
            <FileText size={14} className="mt-0.5 shrink-0" />
            <span>We'll auto-select the correct RBI purpose code from your invoice category — you won't need to enter one manually.</span>
          </div>
        )}
      </Card>
      <div className="mt-5">
        <ButtonGroup>
          <GhostButton onClick={back}>Back</GhostButton>
          <PrimaryButton onClick={next}>Continue</PrimaryButton>
        </ButtonGroup>
      </div>
    </div>
  );
}

function ReviewScreen({ corridor, invoice, next, back }) {
  const c = CORRIDORS[corridor];
  const { amount } = invoice;
  const amt = Number(String(amount || "450000").replace(/,/g, "")) || 450000;
  const fee = Math.round(amt * 0.03);
  const mm = Math.floor(45 / 60), ss = 45 % 60;
  const rate = (Math.random() * 0.0001 + 0.00085).toFixed(5);
  const converted = (amt * parseFloat(rate)).toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="New Payment · Step 3 of 3" title="Review & lock your rate" />
      <Card className="mb-5">
        <div className="flex justify-between items-center pb-4 mb-4 border-b" style={{ borderColor: TOKENS.line }}>
          <div className="f-body text-sm" style={{ color: TOKENS.muted }}>Rate locked for</div>
          <div className="f-mono font-semibold text-lg" style={{ color: ss < 30 ? TOKENS.hold : TOKENS.ink }}>{mm}:{ss}</div>
        </div>
        <div className="flex justify-between mb-3">
          <span className="f-body text-sm" style={{ color: TOKENS.muted }}>You send</span>
          <span className="f-body font-semibold" style={{ color: TOKENS.ink }}>₦{amt.toLocaleString()}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="f-body text-sm" style={{ color: TOKENS.muted }}>Fee (3%, flat)</span>
          <span className="f-body font-semibold" style={{ color: TOKENS.ink }}>₦{fee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between pb-4 mb-4 border-b" style={{ borderColor: TOKENS.line }}>
          <span className="f-body text-sm" style={{ color: TOKENS.muted }}>Locked rate</span>
          <span className="f-mono text-sm" style={{ color: TOKENS.ink }}>1 NGN = {rate} {c.currency}</span>
        </div>
        <div className="flex justify-between">
          <span className="f-body text-sm font-semibold" style={{ color: TOKENS.ink }}>Supplier receives</span>
          <span className="f-display font-bold text-xl" style={{ color: TOKENS.success }}>{c.currency} {converted}</span>
        </div>
      </Card>
      <div className="flex flex-col gap-3 w-full">
        <PrimaryButton onClick={next} icon={ArrowRight}>Continue to transfer</PrimaryButton>
        <GhostButton onClick={back}>Back</GhostButton>
      </div>
    </div>
  );
}

function TrackerScreen({ corridor, goHome, goDetail }) {
  const c = CORRIDORS[corridor];
  const steps = [
    { label: "Received", detail: "Yellow Card confirmed your transfer" },
    { label: "Screening", detail: "Checking wallet risk and sanctions lists" },
    { label: "Converting", detail: `NGN to USDC, then to ${c.currency} at your locked rate` },
    { label: "In Transit", detail: "Funds moving to your supplier" },
    { label: "Settled", detail: "Supplier has received payment" },
  ];
  const [idx, setIdx] = useState(0);
  const [secs, setSecs] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (idx >= steps.length - 1) return;
    const t = setTimeout(() => setIdx((i) => i + 1), 1400);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => {
    if (idx >= steps.length - 1) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [idx]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const settled = idx === steps.length - 1;
  const ref = "MRDN-9931";

  const copyRef = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(ref).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="Payment TXN-00219" title={`Lagos → ${c.city}`} subtitle={`${c.coord} corridor`} />
      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="f-body text-xs font-bold uppercase tracking-wider" style={{ color: settled ? TOKENS.success : TOKENS.accent, letterSpacing: "0.08em" }}>
            {settled ? "✓ Settled" : "In progress"}
          </span>
          <span className="f-mono text-xs font-semibold" style={{ color: TOKENS.muted }}>{mm}:{ss} elapsed</span>
        </div>

        <div className="relative mb-8 mt-4">
          <div className="flex items-center justify-between gap-2">
            {steps.map((s, i) => (
              <div key={s.label} className="flex-1 flex items-center gap-2">
                <div 
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500"
                  style={{
                    background: i <= idx ? TOKENS.accent : TOKENS.bgAlt,
                    color: i <= idx ? "#fff" : TOKENS.muted,
                    border: `2px solid ${i <= idx ? TOKENS.accent : TOKENS.lineSoft}`,
                    boxShadow: i === idx ? `0 0 0 4px ${TOKENS.accentBg}` : "none"
                  }}
                >
                  {i <= idx ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div 
                    className="flex-1 h-1 rounded-full transition-all duration-500"
                    style={{
                      background: i < idx ? TOKENS.accent : TOKENS.lineSoft
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-2">
          {steps.map((s, i) => {
            const isActive = i === idx && !settled;
            if (i > idx) return null;
            return (
              <div key={s.label} className="flex items-start gap-3 py-3 px-3 rounded-lg transition-all duration-300" style={{ 
                background: i <= idx ? TOKENS.bgAlt : "transparent",
                opacity: i <= idx ? 1 : 0.5
              }}>
                <div className="mt-0.5 shrink-0">
                  {isActive ? (
                    <RefreshCw size={16} className="animate-spin" style={{ color: TOKENS.accent }} />
                  ) : (
                    <CheckCircle2 size={16} style={{ color: TOKENS.success }} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="f-body text-sm font-semibold" style={{ color: TOKENS.ink }}>{s.label}</div>
                  <div className="f-body text-xs mt-1 font-medium" style={{ color: TOKENS.muted }}>{s.detail}</div>
                </div>
              </div>
            );
          })}
        </div>

        {settled && (
          <div className="mt-6 pt-6 border-t" style={{ borderColor: TOKENS.lineSoft }}>
            <div className="flex items-start gap-3 mb-5 p-3 rounded-lg" style={{ background: TOKENS.successBg }}>
              <CheckCircle2 size={20} style={{ color: TOKENS.success }} className="mt-0.5 shrink-0 flex-shrink-0" />
              <div className="f-body text-sm font-medium" style={{ color: TOKENS.ink }}>
                Settled in {mm}m {ss}s — well within the estimate. Share the reference below with your supplier.
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-4 rounded-xl mb-4 border-2" style={{ background: TOKENS.bgAlt, borderColor: TOKENS.lineSoft }}>
              <div>
                <div className="f-body text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: TOKENS.mutedLight, letterSpacing: "0.08em" }}>Supplier Reference</div>
                <div className="f-mono text-base font-bold" style={{ color: TOKENS.ink }}>{ref}</div>
              </div>
              <button onClick={copyRef} className="f-body text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95" style={{ background: copied ? TOKENS.success : TOKENS.accent, color: "#fff" }}>
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <PrimaryButton onClick={goDetail} icon={ChevronRight}>View full details</PrimaryButton>
              <GhostButton onClick={goHome} icon={LayoutGrid}>Back to dashboard</GhostButton>
            </div>
          </div>
        )}
      </Card>
      {!settled && <div className="mt-6"><GhostButton onClick={goHome} icon={LayoutGrid}>Back to dashboard</GhostButton></div>}
    </div>
  );
}

function HeldScreen() {
  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="Payment TXN-00220" title="Under review" />
      <Card>
        <div className="flex items-start gap-3 mb-6 p-4 rounded-lg" style={{ background: TOKENS.accentBg }}>
          <ShieldAlert size={24} style={{ color: TOKENS.accentDark }} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="f-body font-bold" style={{ color: TOKENS.ink }}>We're double-checking this payment</div>
            <div className="f-body text-sm mt-1.5 font-medium" style={{ color: TOKENS.muted }}>
              This is routine for new suppliers. Your funds are safe and this payment has not been charged yet.
            </div>
          </div>
        </div>
        <div className="rounded-lg p-5 mb-5 border-2" style={{ background: TOKENS.bgAlt, borderColor: TOKENS.lineSoft }}>
          <div className="flex justify-between f-body text-sm mb-3"><span style={{ color: TOKENS.muted, fontWeight: 500 }}>Status</span><span style={{ color: TOKENS.ink, fontWeight: 700 }}>Pending review</span></div>
          <div className="flex justify-between f-body text-sm mb-3"><span style={{ color: TOKENS.muted, fontWeight: 500 }}>Reason</span><span style={{ color: TOKENS.ink, fontWeight: 600 }}>New supplier verification</span></div>
          <div className="flex justify-between f-body text-sm"><span style={{ color: TOKENS.muted, fontWeight: 500 }}>Expected update by</span><span className="f-mono font-semibold" style={{ color: TOKENS.accent }}>within 24h</span></div>
        </div>
        <div className="f-body text-xs font-medium leading-relaxed" style={{ color: TOKENS.muted }}>We'll notify you the moment this is resolved — no action needed from you right now.</div>
      </Card>
    </div>
  );
}

function ExpiredScreen({ retry }) {
  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="Payment TXN-00221" title="Your rate has expired" />
      <Card>
        <div className="flex items-start gap-3 mb-6 p-4 rounded-lg" style={{ background: TOKENS.holdBg }}>
          <Clock size={24} style={{ color: TOKENS.hold }} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="f-body font-bold" style={{ color: TOKENS.ink }}>The locked rate timed out</div>
            <div className="f-body text-sm mt-1.5 font-medium" style={{ color: TOKENS.muted }}>
              We never move your money on a stale rate. Here's the current one — confirm to continue.
            </div>
          </div>
        </div>
        <div className="rounded-lg p-5 mb-6 border-2 space-y-3" style={{ background: TOKENS.bgAlt, borderColor: TOKENS.lineSoft }}>
          <div className="flex justify-between f-body text-sm"><span style={{ color: TOKENS.muted, fontWeight: 500 }}>Old rate</span><span className="f-mono line-through" style={{ color: TOKENS.muted }}>1 NGN = 0.00087 CNY</span></div>
          <div className="h-px" style={{ background: TOKENS.lineSoft }} />
          <div className="flex justify-between f-body text-sm"><span style={{ color: TOKENS.muted, fontWeight: 500 }}>New rate</span><span className="f-mono font-bold" style={{ color: TOKENS.accent }}>1 NGN = 0.00089 CNY</span></div>
        </div>
        <PrimaryButton onClick={retry} icon={RefreshCw}>Reconfirm at new rate</PrimaryButton>
      </Card>
    </div>
  );
}

function RejectedScreen({ retry }) {
  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="Payment TXN-00222" title="This payment didn't go through" />
      <Card>
        <div className="flex items-start gap-3 mb-6 p-4 rounded-lg" style={{ background: TOKENS.holdBg }}>
          <AlertTriangle size={24} style={{ color: TOKENS.hold }} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="f-body font-bold" style={{ color: TOKENS.ink }}>Delivery failed</div>
            <div className="f-body text-sm mt-1.5 font-medium" style={{ color: TOKENS.muted }}>
              The receiving bank rejected the transfer — the account details don't match their records.
            </div>
          </div>
        </div>
        <div className="rounded-lg p-5 mb-6 f-body text-sm font-medium border-2" style={{ background: TOKENS.bgAlt, borderColor: TOKENS.lineSoft, color: TOKENS.ink }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "18px" }}>✓</span>
            <span>Your ₦450,000 has been returned to your balance in full. No fees were charged.</span>
          </div>
        </div>
        <PrimaryButton onClick={retry} icon={RefreshCw}>Retry with corrected details</PrimaryButton>
      </Card>
    </div>
  );
}

function LimitReachedScreen({ upgrade, back }) {
  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="New Payment · Tier 1 limit" title="This would take you over your monthly limit" />
      <Card>
        <div className="flex items-start gap-3 mb-6 p-4 rounded-lg" style={{ background: TOKENS.accentBg }}>
          <ShieldAlert size={24} style={{ color: TOKENS.accentDark }} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="f-body font-bold" style={{ color: TOKENS.ink }}>Tier 1 limit reached</div>
            <div className="f-body text-sm mt-1.5 font-medium" style={{ color: TOKENS.muted }}>
              Tier 1 accounts can send up to ₦1,000,000 per month across all corridors combined. This payment would put you over that limit.
            </div>
          </div>
        </div>
        <div className="rounded-lg p-5 mb-6 border-2 space-y-3" style={{ background: TOKENS.bgAlt, borderColor: TOKENS.lineSoft }}>
          <div className="flex justify-between f-body text-sm">
            <span style={{ color: TOKENS.muted, fontWeight: 500 }}>Used this month</span>
            <span style={{ color: TOKENS.ink, fontWeight: 700 }}>₦850,000</span>
          </div>
          <div className="h-px" style={{ background: TOKENS.lineSoft }} />
          <div className="flex justify-between f-body text-sm">
            <span style={{ color: TOKENS.muted, fontWeight: 500 }}>This payment</span>
            <span style={{ color: TOKENS.ink, fontWeight: 700 }}>₦300,000</span>
          </div>
          <div className="h-px" style={{ background: TOKENS.lineSoft }} />
          <div className="flex justify-between f-body text-sm">
            <span style={{ color: TOKENS.muted, fontWeight: 500 }}>Monthly limit</span>
            <span className="f-mono font-bold" style={{ color: TOKENS.accent }}>₦1,000,000</span>
          </div>
        </div>
        <div className="f-body text-xs mb-6 font-medium leading-relaxed" style={{ color: TOKENS.muted }}>
          Complete full verification to remove this limit — no need to wait for it to reset next month.
        </div>
        <div className="flex flex-col gap-3 w-full">
          <PrimaryButton onClick={upgrade} icon={ArrowRight}>Upgrade to full verification</PrimaryButton>
          <GhostButton onClick={back}>Back to dashboard</GhostButton>
        </div>
      </Card>
    </div>
  );
}

function HistoryScreen({ openDetail }) {
  const rows = [
    { id: "TXN-00219", to: "Shenzhen, China", amt: "₦450,000", status: "Settled", color: TOKENS.success, bg: TOKENS.successBg },
    { id: "TXN-00218", to: "Mumbai, India", amt: "₦1,120,000", status: "Settled", color: TOKENS.success, bg: TOKENS.successBg },
    { id: "TXN-00217", to: "Istanbul, Turkey", amt: "₦780,000", status: "Settled", color: TOKENS.success, bg: TOKENS.successBg },
    { id: "TXN-00220", to: "Shenzhen, China", amt: "₦300,000", status: "Pending review", color: TOKENS.accentDark, bg: TOKENS.bg },
  ];
  return (
    <div className="max-w-2xl">
      <ScreenHeader title="Transaction history" />
      <Card className="!p-0 overflow-hidden">
        {rows.map((r, i) => (
          <button key={r.id} onClick={openDetail} className="w-full flex items-center justify-between px-5 py-4 text-left" style={{ borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.line}` : "none" }}>
            <div>
              <div className="f-mono text-xs mb-1" style={{ color: TOKENS.muted }}>{r.id}</div>
              <div className="f-body font-semibold text-sm" style={{ color: TOKENS.ink }}>{r.to}</div>
            </div>
            <div className="text-right flex items-center gap-3">
              <div>
                <div className="f-body font-semibold text-sm" style={{ color: TOKENS.ink }}>{r.amt}</div>
                <span className="f-body text-xs px-2 py-0.5 rounded-full" style={{ color: r.color, background: r.bg }}>{r.status}</span>
              </div>
              <ChevronRight size={16} style={{ color: TOKENS.muted }} />
            </div>
          </button>
        ))}
      </Card>
    </div>
  );
}

function DetailScreen({ back }) {
  return (
    <div className="max-w-lg">
      <ScreenHeader eyebrow="TXN-00219" title="Settled" subtitle="Lagos → Shenzhen, China" />
      <Card>
        {[
          ["Invoice reference", "INV-3391"],
          ["Amount sent", "₦450,000"],
          ["Supplier received", "CNY 391.50"],
          ["Delivery route", "Bank transfer (dLocal)"],
          ["Initiated", "Jul 2, 2026 · 11:42 WAT"],
          ["Settled", "Jul 2, 2026 · 11:46 WAT"],
          ["Supplier reference", "MRDN-9931"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2.5 border-b last:border-0" style={{ borderColor: TOKENS.line }}>
            <span className="f-body text-sm" style={{ color: TOKENS.muted }}>{k}</span>
            <span className="f-mono text-sm text-right" style={{ color: TOKENS.ink }}>{v}</span>
          </div>
        ))}
        <div className="f-body text-xs mt-4 flex items-start gap-2" style={{ color: TOKENS.muted }}>
          <ShieldAlert size={13} className="mt-0.5 shrink-0" />
          Full settlement evidence is available to support staff on request — not shown here by default.
        </div>
      </Card>
      <div className="mt-6"><ButtonGroup><GhostButton onClick={back} icon={History}>Back to history</GhostButton></ButtonGroup></div>
    </div>
  );
}

/* ---------- App ---------- */

export default function MrdnPrototype() {
  const [screen, setScreen] = useState("signup");
  const [navOpen, setNavOpen] = useState(false);
  const [tier, setTier] = useState("tier1");
  const [corridor, setCorridor] = useState("china");
  const [supplier, setSupplier] = useState({ name: "", docId: "", cnaps: "", account: "", vpa: "", iban: "", phone: "", email: "", address: "" });
  const [invoice, setInvoice] = useState({ ref: "", amount: "", category: "Electronics / components" });

  const go = (s) => setScreen(s);
  const showBottomNav = !["signup", "expired", "rejected", "tier2upgrade"].includes(screen);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8" style={{ background: "#E8ECFF" }}>
      <style>{FONTS}</style>
      <div
        className="relative w-full overflow-hidden f-body"
        style={{
          maxWidth: 402,
          height: 830,
          background: TOKENS.bg,
          borderRadius: 40,
          border: "10px solid #14181F",
          boxShadow: "0 24px 60px rgba(15,27,45,0.35)",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl z-40" style={{ background: "#14181F" }} />
        <div className="h-full flex flex-col">
          <TopBar onMenu={() => setNavOpen(true)} showAccount={screen !== "signup"} />
          <NavSidebar screen={screen} setScreen={setScreen} open={navOpen} setOpen={setNavOpen} />
          <div className="flex-1 overflow-y-auto p-4" style={{ paddingBottom: showBottomNav ? 24 : 40 }}>
            {screen === "signup" && <OnboardingFlow next={() => go("dashboard")} />}
            {screen === "dashboard" && <DashboardScreen tier={tier} goUpgrade={() => go("tier2upgrade")} />}
            {screen === "corridor" && (
              <CorridorScreen corridor={corridor} setCorridor={setCorridor} supplier={supplier} setSupplier={setSupplier} next={() => go(["turkey", "india"].includes(corridor) ? "confirmbeneficiary" : "invoice")} back={() => go("dashboard")} />
            )}
            {screen === "confirmbeneficiary" && <ConfirmBeneficiaryScreen corridor={corridor} next={() => go("invoice")} back={() => go("corridor")} />}
            {screen === "invoice" && <InvoiceScreen invoice={invoice} setInvoice={setInvoice} corridor={corridor} next={() => go("review")} back={() => go(["turkey", "india"].includes(corridor) ? "confirmbeneficiary" : "corridor")} />}
            {screen === "review" && <ReviewScreen corridor={corridor} invoice={invoice} next={() => go("tracker")} back={() => go("invoice")} />}
            {screen === "tracker" && <TrackerScreen corridor={corridor} goHome={() => go("dashboard")} goDetail={() => go("detail")} />}
            {screen === "held" && <HeldScreen />}
            {screen === "expired" && <ExpiredScreen retry={() => go("review")} />}
            {screen === "rejected" && <RejectedScreen retry={() => go("corridor")} />}
            {screen === "limitreached" && <LimitReachedScreen upgrade={() => go("tier2upgrade")} back={() => go("dashboard")} />}
            {screen === "tier2upgrade" && <Tier2UpgradeFlow next={() => { setTier("tier2"); go("dashboard"); }} back={() => go("dashboard")} />}
            {screen === "history" && <HistoryScreen openDetail={() => go("detail")} />}
            {screen === "detail" && <DetailScreen back={() => go("history")} />}
          </div>
          {showBottomNav && <BottomNav screen={screen} go={go} />}
        </div>
      </div>
    </div>
  );
}
