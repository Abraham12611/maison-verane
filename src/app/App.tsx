import { useEffect, useState } from 'react';
import { BrandPlayer } from './BrandPlayer';

const NAV = [
  { href: '#collection', label: 'Collection' },
  { href: '#film', label: 'The Film' },
  { href: '#atelier', label: 'Atelier' },
  { href: '#materials', label: 'Leathers' },
  { href: '#journal', label: 'Journal' },
] as const;

const PRODUCTS = [
  { id: 'weekender', name: 'Le Voyageur', kind: 'Weekender', leather: 'Espresso calf', price: '€3,850', img: '/img/p-weekender.webp', dot: '#3a2118' },
  { id: 'tote', name: 'Le Cabas', kind: 'Tote', leather: 'Cognac vachette', price: '€2,450', img: '/img/p-tote.webp', dot: '#a8612b' },
  { id: 'satchel', name: 'La Besace', kind: 'Crossbody', leather: 'Noir-brun calf', price: '€2,150', img: '/img/p-satchel.webp', dot: '#2a1c16' },
  { id: 'trunk', name: 'La Malle', kind: 'Mini trunk', leather: 'Bordeaux box calf', price: '€4,200', img: '/img/p-trunk.webp', dot: '#5a1a1c' },
] as const;

const STEPS = [
  ['01', 'Select', 'Each hide is chosen by hand and rejected more often than it is kept.'],
  ['02', 'Cut', 'Panels are cut one at a time, following the grain rather than the pattern.'],
  ['03', 'Stitch', 'A saddle stitch, two needles, waxed linen. If one thread fails, the other holds.'],
  ['04', 'Finish', 'Edges are burnished, brass is fitted, and the bag is signed on the inside.'],
] as const;

const ANATOMY = [
  ['I', 'The clasp', 'Solid brass, cast in Paris and polished by hand for forty minutes.'],
  ['II', 'The corner', 'Riveted plates guard the points where a bag meets every platform and every floor.'],
  ['III', 'The seam', 'Eight stitches to the inch, each one pulled tight and set with a bone folder.'],
  ['IV', 'The handle', 'Cut from a single strip and rolled around a leather core. No glue.'],
] as const;

const LEATHERS = [
  ['Espresso', 'Deep, close-grained calf. Darkens with every handling.', '#3a2118'],
  ['Cognac', 'Vegetable-tanned. Warms to honey where light touches it.', '#a8612b'],
  ['Saddle', 'Firm, open-grained, built for years of weather.', '#c28a4a'],
  ['Bordeaux', 'Dyed through, finished with a soft wax sheen.', '#5a1a1c'],
  ['Noir', 'Matte and quiet, with a deep black that never greys.', '#17120f'],
] as const;

const SERVICES = [
  ['Monogramming', 'Three initials, hot-stamped in gold or blind, in the atelier while you wait.'],
  ['Repair for life', 'Every bag is restored by the hands that made it, at any age, at no charge for craft.'],
  ['Private viewings', 'An appointment with a specialist at any maison, or in your home.'],
  ['Delivery', 'Complimentary, insured and wrapped in cloth, to more than forty countries.'],
] as const;

const JOURNAL = [
  ['Notes', 'A weekend in a single bag', '6 min read'],
  ['Atelier', 'Why we stitch with two needles', '4 min read'],
  ['Travel', 'The last grand hotels of Europe', '9 min read'],
] as const;

function useScrolled(threshold = 40) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [threshold]);
  return scrolled;
}

function Header({ bag }: { bag: number }) {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [open]);
  return (
    <header className="site-header" data-scrolled={scrolled || undefined} data-open={open || undefined}>
      <a className="brand" href="#home" aria-label="Maison Verane, home" onClick={() => setOpen(false)}>
        <img src="/brand/logo-wordmark.svg" alt="Maison Verane" width="170" height="35" />
      </a>
      <nav className="nav" aria-label="Primary">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
      </nav>
      <div className="header-tools">
        <a className="tool" href="#footer">Boutiques</a>
        <a className="tool bag" href="#collection" aria-label={`Shopping bag, ${bag} items`}>
          Bag <span>{bag}</span>
        </a>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <i /><i />
        </button>
      </div>
      <div id="mobile-nav" className="mobile-nav" hidden={!open}>
        {NAV.map((n) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <img className="hero-img" src="/img/hero.webp" alt="" fetchPriority="high" decoding="async" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="wrap hero-inner">
        <p className="eyebrow">The Voyage Collection</p>
        <h1>
          Carried far,
          <br />
          <em>kept for life.</em>
        </h1>
        <p className="lede">Travel bags cut, stitched and finished by hand in our Paris atelier since 1894.</p>
        <div className="cta">
          <a className="btn solid" href="#collection">Discover the collection</a>
          <a className="btn ghost" href="#film">
            <span className="play" aria-hidden="true" /> Watch the film
          </a>
        </div>
      </div>
      <p className="hero-cap">Le Voyageur · Espresso calf, solid brass</p>
      <a className="scroll-cue" href="#maison" aria-label="Scroll to next section"><span /></a>
    </section>
  );
}

function Maison() {
  return (
    <section id="maison" className="section maison">
      <div className="wrap narrow center">
        <img className="mark" src="/brand/logo-mark.svg" alt="" width="54" height="74" />
        <p className="eyebrow">La Maison</p>
        <h2 className="statement">
          We make one kind of thing: a bag that is <em>better after a thousand journeys</em> than on the day it left the bench.
        </h2>
      </div>
      <dl className="stats wrap">
        <div><dt>112</dt><dd>hand operations in every bag</dd></div>
        <div><dt>38 h</dt><dd>at the bench, by one pair of hands</dd></div>
        <div><dt>For life</dt><dd>repair and restoration, always</dd></div>
      </dl>
    </section>
  );
}

function Collection({ onAdd }: { onAdd: (name: string) => void }) {
  return (
    <section id="collection" className="section collection">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <p className="eyebrow">Voyage</p>
            <h2>The Voyage collection</h2>
          </div>
          <p className="sec-note">Four shapes for the road. Each is made to order in a single leather of your choosing.</p>
        </header>
        <ul className="cards" role="list">
          {PRODUCTS.map((p) => (
            <li key={p.id} className="card">
              <div className="card-img">
                <img src={p.img} alt={`${p.name} ${p.kind.toLowerCase()} in ${p.leather.toLowerCase()}`} loading="lazy" width="768" height="1024" />
                <button type="button" className="add" onClick={() => onAdd(p.name)}>Add to bag</button>
              </div>
              <div className="card-body">
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.kind} · {p.leather}</p>
                </div>
                <div className="price">
                  <span>{p.price}</span>
                  <i className="dot" style={{ background: p.dot }} aria-hidden="true" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Film() {
  return (
    <section id="film" className="section film">
      <div className="wrap">
        <header className="sec-head center">
          <div>
            <p className="eyebrow">The Atelier Film</p>
            <h2>From a single sketch to the last stitch</h2>
          </div>
          <p className="sec-note">Watch a bag come together, one hand-worked step at a time. Press <kbd>K</kbd> to play, <kbd>F</kbd> for fullscreen.</p>
        </header>
        <div className="film-player">
          <BrandPlayer />
        </div>
        <p className="film-credit">
          Played with <a href="https://ecrin.vercel.app" target="_blank" rel="noreferrer">ÉCRIN · Voyage</a>, a skin for Video.js v10.
        </p>
      </div>
    </section>
  );
}

function Atelier() {
  return (
    <section id="atelier" className="section atelier">
      <div className="wrap split">
        <figure className="stitched">
          <img src="/img/craft.webp" alt="An artisan hand-stitching a leather panel with waxed thread" loading="lazy" width="2048" height="1536" />
        </figure>
        <div className="copy">
          <p className="eyebrow">The Atelier</p>
          <h2>Thirty-eight hours, <em>one pair of hands.</em></h2>
          <p className="body">
            No line, no hand-off. A single artisan follows each bag from the cutting table to the signature,
            and puts their mark inside it.
          </p>
          <ol className="steps" role="list">
            {STEPS.map(([n, t, d]) => (
              <li key={n}>
                <span className="n">{n}</span>
                <div><h3>{t}</h3><p>{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Anatomy() {
  return (
    <section className="section anatomy" aria-labelledby="anatomy-title">
      <div className="wrap">
        <header className="sec-head center">
          <div>
            <p className="eyebrow">Anatomy</p>
            <h2 id="anatomy-title">Le Voyageur, in four details</h2>
          </div>
        </header>
        <div className="anatomy-grid">
          <ol className="notes left" role="list">
            {ANATOMY.slice(0, 2).map(([n, t, d]) => (
              <li key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
          <img className="blueprint" src="/brand/blueprint.svg" alt="Line drawing of the Le Voyageur weekender with callouts" loading="lazy" />
          <ol className="notes right" role="list">
            {ANATOMY.slice(2).map(([n, t, d]) => (
              <li key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Materials() {
  return (
    <section id="materials" className="section materials">
      <div className="wrap split rev">
        <div className="copy">
          <p className="eyebrow">Leathers & hardware</p>
          <h2>Five hides, <em>one standard.</em></h2>
          <ul className="leathers" role="list">
            {LEATHERS.map(([name, desc, c]) => (
              <li key={name}>
                <i style={{ background: c }} aria-hidden="true" />
                <div><h3>{name}</h3><p>{desc}</p></div>
              </li>
            ))}
          </ul>
        </div>
        <figure className="stitched">
          <img src="/img/materials.webp" alt="Leather swatches in five colours with brass hardware and waxed thread" loading="lazy" width="2048" height="1536" />
        </figure>
      </div>
    </section>
  );
}

function Journal() {
  return (
    <section id="journal" className="section journal">
      <div className="wrap journal-grid">
        <figure className="portrait">
          <img src="/img/journey.webp" alt="A traveller in a camel coat walking a station platform at dusk with a leather weekender" loading="lazy" width="1536" height="2048" />
          <figcaption>Gare du Nord, 6:42 pm</figcaption>
        </figure>
        <div className="journal-copy">
          <p className="eyebrow">Journal</p>
          <blockquote>
            <p>Luggage is the only luxury that <em>gets better by leaving.</em></p>
          </blockquote>
          <figure className="wide">
            <img src="/img/hotel.webp" alt="Stacked steamer trunks and a weekender in a dark hotel corridor" loading="lazy" width="2176" height="1216" />
          </figure>
          <ul className="entries" role="list">
            {JOURNAL.map(([tag, title, meta]) => (
              <li key={title}>
                <a href="#journal">
                  <span className="tag">{tag}</span>
                  <span className="t">{title}</span>
                  <span className="m">{meta}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="section services">
      <div className="wrap services-grid">
        <div>
          <p className="eyebrow">Services</p>
          <h2>In service, <em>for life.</em></h2>
          <span className="tools" role="img" aria-label="Line icons of an awl, a buckle, a hide and a compass" />
        </div>
        <ul className="svc" role="list">
          {SERVICES.map(([t, d], i) => (
            <li key={t}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Footer() {
  const [sent, setSent] = useState(false);
  return (
    <footer id="footer" className="footer">
      <div className="wrap foot-top">
        <div className="letters">
          <p className="eyebrow">Letters from the atelier</p>
          <h2>One letter a season. <em>Never more.</em></h2>
          <form
            className="subscribe"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="email" className="sr">Email address</label>
            <input id="email" type="email" required placeholder="Your email address" autoComplete="email" />
            <button type="submit" className="btn solid">{sent ? 'Thank you' : 'Subscribe'}</button>
          </form>
          <p className="fine">By subscribing you agree to receive letters from Maison Verane. Unsubscribe at any time.</p>
        </div>
        <nav className="cols" aria-label="Footer">
          <div>
            <h3>Collection</h3>
            <ul role="list">
              <li><a href="#collection">Weekenders</a></li>
              <li><a href="#collection">Totes</a></li>
              <li><a href="#collection">Crossbody</a></li>
              <li><a href="#collection">Trunks</a></li>
            </ul>
          </div>
          <div>
            <h3>Maison</h3>
            <ul role="list">
              <li><a href="#maison">Our story</a></li>
              <li><a href="#atelier">The atelier</a></li>
              <li><a href="#materials">Leathers</a></li>
              <li><a href="#journal">Journal</a></li>
            </ul>
          </div>
          <div>
            <h3>Client care</h3>
            <ul role="list">
              <li><a href="#services">Repair for life</a></li>
              <li><a href="#services">Monogramming</a></li>
              <li><a href="#services">Delivery & returns</a></li>
              <li><a href="#footer">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3>Boutiques</h3>
            <ul role="list">
              <li>Paris · Rue Saint-Honoré</li>
              <li>London · Mount Street</li>
              <li>Tokyo · Ginza</li>
              <li>New York · Madison Ave</li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="giant" aria-hidden="true">VERANE</div>

      <div className="wrap foot-bottom">
        <img className="foot-logo" src="/brand/logo-lockup.svg" alt="Maison Verane" width="120" height="57" />
        <p className="legal">
          © 2026 Maison Verane. A fictional brand created to showcase the ÉCRIN Voyage video player for Video.js v10.
          The atelier film is a third-party promotional video used for demonstration only.
        </p>
        <ul className="legal-links" role="list">
          <li><a href="#footer">Privacy</a></li>
          <li><a href="#footer">Terms</a></li>
          <li><a href="#footer">Cookies</a></li>
          <li><a href="#footer">France · EUR</a></li>
        </ul>
      </div>
    </footer>
  );
}

export function App() {
  const [bag, setBag] = useState(0);
  const [toast, setToast] = useState('');
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2200);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <>
      <a className="skip" href="#collection">Skip to collection</a>
      <Header bag={bag} />
      <main>
        <Hero />
        <Maison />
        <Collection
          onAdd={(name) => {
            setBag((n) => n + 1);
            setToast(`${name} added to your bag`);
          }}
        />
        <Film />
        <Atelier />
        <Anatomy />
        <Materials />
        <Journal />
        <Services />
      </main>
      <Footer />
      <div className="toast" role="status" aria-live="polite" data-show={toast ? true : undefined}>{toast}</div>
    </>
  );
}
