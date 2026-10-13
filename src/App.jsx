import { useEffect, useRef, useState } from "react";
import "./App.css";
const regions = [
  "All regions",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
];
const format = (number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number || 0);
function Globe({ className = "" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="88" />
      <ellipse cx="100" cy="100" rx="43" ry="88" />
      <ellipse cx="100" cy="100" rx="72" ry="88" />
      <path d="M12 100h176M24 56h152M24 144h152M100 12v176" />
    </svg>
  );
}
function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All regions");
  const [savedOnly, setSavedOnly] = useState(false);
  const [limit, setLimit] = useState(12);
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("country-search-favorites") || "[]",
      );
      return Array.isArray(saved)
        ? saved.filter((item) => typeof item === "string")
        : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${import.meta.env.BASE_URL}data/countries.json`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Unavailable");
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Invalid response");
        setCountries(
          data.sort((a, b) => a.name.common.localeCompare(b.name.common)),
        );
        setError(false);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(true);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    try {
      localStorage.setItem(
        "country-search-favorites",
        JSON.stringify(favorites),
      );
    } catch {
      /* Favorites remain usable when browser storage is unavailable. */
    }
  }, [favorites]);
  useEffect(() => {
    if (selected) dialog.current?.showModal();
  }, [selected]);
  const toggleFavorite = (code) =>
    setFavorites((saved) =>
      saved.includes(code)
        ? saved.filter((item) => item !== code)
        : [...saved, code],
    );
  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = countries.filter(
    (country) =>
      (region === "All regions" || country.region === region) &&
      (!savedOnly || favorites.includes(country.cca3)) &&
      normalize(
        [
          country.name.common,
          country.name.official,
          ...(country.capital || []),
        ].join(" "),
      ).includes(normalize(search.trim())),
  );
  const reset = () => {
    setSearch("");
    setRegion("All regions");
    setSavedOnly(false);
    setLimit(12);
  };
  return (
    <>
      <header className="site-header wrap">
        <a className="brand" href="./">
          <Globe />
          country<span>search</span>
          <span className="brand-period">.</span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={!savedOnly ? "nav-button active" : "nav-button"}
            onClick={() => {
              setSavedOnly(false);
              setLimit(12);
            }}
          >
            Explore
          </button>
          <button
            className={savedOnly ? "nav-button active" : "nav-button"}
            onClick={() => {
              setSavedOnly(true);
              setLimit(12);
            }}
          >
            Saved places <span className="count">{favorites.length}</span>
          </button>
        </nav>
      </header>
      <main>
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">A WORLD OF DISCOVERY</p>
            <h1>
              Big world.
              <br />
              <span>Endless curiosity.</span>
            </h1>
            <p className="intro">
              From familiar places to faraway corners.
              <br />
              Get to know the countries that make up our world.
            </p>
            <div className="hero-note">
              <span className="small-line" />
              One planet. A thousand reasons to explore.
            </div>
          </div>
          <div className="globe-art">
            <span className="orbit-label north">90° N</span>
            <Globe className="hero-globe" />
            <span className="map-dot one" />
            <span className="map-dot two" />
            <span className="map-dot three" />
            <span className="globe-caption">THE WORLD IS WITHIN REACH ↗</span>
            <span className="orbit-label south">90° S</span>
          </div>
        </section>
        <section className="explorer wrap" aria-label="Explore countries">
          <div className="search-row">
            <label className="search">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <span className="sr-only">Search countries or capitals</span>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setLimit(12);
                }}
                placeholder="Where does your curiosity take you?"
                type="search"
              />
            </label>
            <label className="region-select">
              <span className="sr-only">Filter by region</span>
              <select
                value={region}
                onChange={(event) => {
                  setRegion(event.target.value);
                  setLimit(12);
                }}
              >
                {regions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="filter-row">
            <div className="region-chips" aria-label="Popular regions">
              {regions.map((item) => (
                <button
                  key={item}
                  aria-pressed={region === item}
                  onClick={() => {
                    setRegion(item);
                    setLimit(12);
                  }}
                >
                  {item === "All regions" ? "All places" : item}
                </button>
              ))}
            </div>
            <span className="data-note">REST COUNTRIES · REFERENCE DATA</span>
          </div>
          <div className="results-heading">
            <div>
              <span className="eyebrow">
                {savedOnly ? "YOUR PERSONAL ATLAS" : "EXPLORE THE ATLAS"}
              </span>
              <h2>
                {savedOnly
                  ? "Places to remember"
                  : search
                    ? "Your discoveries"
                    : "A little closer to everywhere"}
              </h2>
            </div>
            <span className="result-count" role="status">
              {loading
                ? "Finding places…"
                : error
                  ? "Connection unavailable"
                  : `${filtered.length} ${filtered.length === 1 ? "place" : "places"}`}
            </span>
          </div>
          {loading ? (
            <div className="skeleton-grid" aria-label="Loading countries">
              {Array.from({ length: 6 }, (_, i) => (
                <div className="skeleton" key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="empty">
              <Globe />
              <h3>A small detour</h3>
              <p>
                We couldn’t load the countries. Check your connection and try
                again.
              </p>
              <button
                className="primary"
                onClick={() => {
                  setLoading(true);
                  setError(false);
                  setAttempt((value) => value + 1);
                }}
              >
                Try again ↗
              </button>
            </div>
          ) : !filtered.length ? (
            <div className="empty">
              <Globe />
              <h3>
                {savedOnly
                  ? "Your next discovery belongs here"
                  : "No places found this time"}
              </h3>
              <p>
                {savedOnly
                  ? "Save a country with the star, or adjust your filters to see saved places."
                  : "Try another country, a capital, or a different region."}
              </p>
              <button className="primary" onClick={reset}>
                Explore all places ↗
              </button>
            </div>
          ) : (
            <>
              <div className="country-grid">
                {filtered.slice(0, limit).map((country) => (
                  <article className="country-card" key={country.cca3}>
                    <div className="flag-stage">
                      <img
                        src={country.flags.svg || country.flags.png}
                        alt={`Flag of ${country.name.common}`}
                        loading="lazy"
                      />
                      <span className="country-code">{country.cca3}</span>
                      <button
                        className="save"
                        aria-label={`${favorites.includes(country.cca3) ? "Unsave" : "Save"} ${country.name.common}`}
                        aria-pressed={favorites.includes(country.cca3)}
                        onClick={() => toggleFavorite(country.cca3)}
                      >
                        {favorites.includes(country.cca3) ? "★" : "☆"}
                      </button>
                    </div>
                    <div className="country-info">
                      <span className="card-region">{country.region}</span>
                      <button
                        className="country-title"
                        onClick={() => setSelected(country)}
                      >
                        <h3>{country.name.common}</h3>
                        <span aria-hidden="true">↗</span>
                      </button>
                      <p>
                        {country.capital?.join(", ") || "No official capital"}
                      </p>
                      <div className="country-meta">
                        <span>POPULATION</span>
                        <strong>{format(country.population)}</strong>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {filtered.length > limit && (
                <div className="load-more">
                  <button onClick={() => setLimit((value) => value + 12)}>
                    Discover more <span>↓</span>
                  </button>
                  <p>
                    Showing {Math.min(limit, filtered.length)} of{" "}
                    {filtered.length} places
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <footer className="wrap">
        <a className="brand" href="./">
          country<span>search.</span>
        </a>
        <p>250 countries & territories. Reference figures, not live data.</p>
        <span>Built by Francis Martinez</span>
      </footer>
      <dialog
        ref={dialog}
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
        aria-labelledby="country-detail-title"
      >
        {selected && (
          <>
            <button
              className="close"
              onClick={() => dialog.current.close()}
              aria-label="Close country details"
            >
              ×
            </button>
            <img
              className="detail-flag"
              src={selected.flags.svg || selected.flags.png}
              alt={`Flag of ${selected.name.common}`}
            />
            <span className="eyebrow">
              {selected.region} / {selected.cca3}
            </span>
            <h2 id="country-detail-title">{selected.name.common}</h2>
            <p className="official-name">{selected.name.official}</p>
            <dl>
              {[
                ["Capital", selected.capital?.join(", ")],
                ["Population", selected.population?.toLocaleString("en")],
                ["Subregion", selected.subregion],
                ["Area", `${selected.area?.toLocaleString("en")} km²`],
                [
                  "Languages",
                  Object.values(selected.languages || {}).join(", "),
                ],
                [
                  "Currencies",
                  Object.values(selected.currencies || {})
                    .map((currency) => currency.name)
                    .join(", "),
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value || "Not available"}</dd>
                </div>
              ))}
            </dl>
            <button
              className="primary"
              onClick={() => toggleFavorite(selected.cca3)}
            >
              {favorites.includes(selected.cca3)
                ? "★ Saved to your places"
                : "☆ Save this place"}
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
export default App;
