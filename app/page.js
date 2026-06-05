import Link from "next/link";

function Nav() {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand">
          <span className="dot" />
          Nash
        </Link>
        <Link href="/refer" className="btn btn-primary" style={{ padding: "10px 18px" }}>
          Refer now
        </Link>
      </div>
    </nav>
  );
}

export default function Home() {
  return (
    <>
      <Nav />

      <header className="hero">
        <div className="container">
          <span className="eyebrow">Nash Referral Program</span>
          <h1>Know someone moving things through the real world? Introduce us.</h1>
          <p className="lede">
            You already know the operators wrestling with couriers, fleets, and delivery
            promises every day. Point them our way. When they turn out to be a fit for Nash,
            we send you a $500 gift card. That is the whole deal.
          </p>
          <div className="hero-cta">
            <Link href="/refer" className="btn btn-primary">
              Refer a peer
            </Link>
            <span className="hero-note">$500 per qualifying referral</span>
          </div>

          <div className="reward">
            <div className="amount">
              $<span>500</span>
            </div>
            <div className="reward-copy">
              <h3>A $500 gift card for every qualifying referral</h3>
              <p>
                No tiers, no fine print to wade through. Refer a peer in logistics or delivery
                who is a genuine fit for Nash, and the gift card is yours.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <span className="eyebrow">How it works</span>
          <h2>Three steps. Most of the work is ours.</h2>
          <div className="steps">
            <div className="step">
              <div className="num">
                <b>1</b> Share
              </div>
              <h3>Send us their details</h3>
              <p>
                Tell us who to reach out to and how. It takes about a minute, and you can do it
                as many times as you like.
              </p>
            </div>
            <div className="step">
              <div className="num">
                <b>2</b> We connect
              </div>
              <h3>We reach out and explore fit</h3>
              <p>
                Our team contacts your referral, learns about their logistics, and figures out
                whether Nash is the right call for them.
              </p>
            </div>
            <div className="step">
              <div className="num">
                <b>3</b> You get $500
              </div>
              <h3>A gift card lands in your inbox</h3>
              <p>
                When your referral qualifies, we send your $500 gift card. Refer again whenever
                another good name comes to mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="qualify">
            <span className="eyebrow">What counts as a qualifying referral</span>
            <h2 style={{ marginTop: 12 }}>A peer who would genuinely want what Nash does.</h2>
            <ul>
              <li>
                <span className="tick" />
                Someone at another company in logistics, delivery, retail, grocery, pharmacy, or
                anywhere goods and people have to meet on time.
              </li>
              <li>
                <span className="tick" />
                A person who would reasonably be interested in Nash's products and services, the
                platform that powers modern logistics.
              </li>
              <li>
                <span className="tick" />
                A real introduction to a real human. The more context you can give us, the better
                the conversation goes.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0, textAlign: "center" }}>
        <div className="container">
          <h2 style={{ margin: "0 auto" }}>Got a name in mind?</h2>
          <p className="sub" style={{ margin: "14px auto 32px" }}>
            Equilibrium in motion takes a network. Introduce us to one good operator and we will
            take it from there.
          </p>
          <Link href="/refer" className="btn btn-primary">
            Refer a peer
          </Link>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer">
          <span>© {new Date().getFullYear()} Nash</span>
          <span className="tagline">Equilibrium in motion.</span>
        </div>
      </footer>
    </>
  );
}
