"use client";

import Link from "next/link";
import { useState } from "react";

const STEPS = [
  {
    key: "referrerEmail",
    type: "email",
    question: "What's your work email?",
    desc: "So we know who to thank and where to send your $500 gift card.",
    label: "Your work email",
    placeholder: "you@yourcompany.com",
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."),
  },
  {
    key: "friendName",
    type: "text",
    question: "Who are we reaching out to?",
    desc: "Your peer's full name. We need this before we get in touch with them.",
    label: "Their full name",
    placeholder: "Jamie Rivera",
    validate: (v) => (v.trim().length >= 2 ? "" : "Enter their full name."),
  },
  {
    key: "friendEmail",
    type: "email",
    question: "What's their email?",
    desc: "The best email address to start a conversation with them.",
    label: "Their email",
    placeholder: "jamie@theircompany.com",
    validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."),
  },
  {
    key: "friendPhone",
    type: "tel",
    question: "And their phone number?",
    desc: "A direct line helps us reach them. Include the country code if it's outside the US.",
    label: "Their phone number",
    placeholder: "(555) 123-4567",
    validate: (v) => (v.replace(/[^\d]/g, "").length >= 7 ? "" : "Enter a valid phone number."),
  },
];

export default function ReferPage() {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({
    referrerEmail: "",
    friendName: "",
    friendEmail: "",
    friendPhone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [done, setDone] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = done ? 100 : Math.round((step / STEPS.length) * 100);

  function update(v) {
    setValues((prev) => ({ ...prev, [current.key]: v }));
    if (error) setError("");
  }

  async function next() {
    const msg = current.validate(values[current.key]);
    if (msg) {
      setError(msg);
      return;
    }
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    await submit();
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/refer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setDone(true);
    } catch (e) {
      setSubmitError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  function back() {
    setSubmitError("");
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div className="form-wrap">
      <nav className="nav">
        <div className="container nav-inner">
          <Link href="/" className="brand">
            <span className="dot" />
            Nash
          </Link>
          <Link href="/" className="hero-note">
            Back to home
          </Link>
        </div>
      </nav>

      <main className="form-main">
        <div className="form-card">
          {done ? (
            <div className="thanks">
              <div className="check" />
              <h1>Thanks for the introduction.</h1>
              <p>
                We've got {values.friendName.trim().split(" ")[0] || "your referral"}'s details and
                we'll reach out soon. If it's a fit, your $500 gift card is on its way to{" "}
                {values.referrerEmail}.
              </p>
              <div style={{ marginTop: 32, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setValues({ referrerEmail: values.referrerEmail, friendName: "", friendEmail: "", friendPhone: "" });
                    setStep(1);
                    setDone(false);
                  }}
                >
                  Refer someone else
                </button>
                <Link href="/" className="btn btn-ghost">
                  Done for now
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="progress">
                <span>
                  {step + 1} / {STEPS.length}
                </span>
                <div className="track">
                  <div className="fill" style={{ width: `${progress}%` }} />
                </div>
                <span>{progress}%</span>
              </div>

              <h1 className="step-q">{current.question}</h1>
              <p className="step-desc">{current.desc}</p>

              <div className="field">
                <label htmlFor={current.key}>{current.label}</label>
                <input
                  id={current.key}
                  type={current.type}
                  value={values[current.key]}
                  placeholder={current.placeholder}
                  autoFocus
                  autoComplete="off"
                  onChange={(e) => update(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") next();
                  }}
                />
                <div className="error">{error || submitError}</div>
              </div>

              <div className="form-actions">
                <button className="btn btn-primary" onClick={next} disabled={submitting}>
                  {submitting ? "Sending..." : isLast ? "Submit referral" : "Next"}
                </button>
                {step > 0 && (
                  <button className="btn btn-ghost" onClick={back} disabled={submitting}>
                    Previous
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
