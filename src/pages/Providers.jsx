
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import providerService from "../services/providerService";
import ProviderCard from "../components/ProviderCard";

const CATEGORIES = [
  "",
  "ELECTRICIAN",
  "PLUMBER",
  "TUTOR",
  "CARPENTER",
  "PAINTER",
  "MECHANIC",
  "CLEANER",
  "GARDENER",
  "CHEF",
  "NURSE",
  "OTHER",
];

export default function Providers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");

  // Fetch providers from backend
  function doSearch(cat, loc) {
    setLoading(true);

    providerService
      .getAll(cat || undefined, loc || undefined)
      .then((data) => {
        setProviders(data);
      })
      .catch((err) => {
        console.error("Error loading providers:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // Run on page load
  useEffect(() => {
    doSearch(category, location);
  }, []);

  function handleSearch(e) {
    e.preventDefault();

    setSearchParams({
      ...(category && { category }),
      ...(location && { location }),
    });

    doSearch(category, location);
  }

  function handleReset() {
    setCategory("");
    setLocation("");

    setSearchParams({});
    doSearch("", "");
  }

  return (
    <div className="container page">
      <h1 className="page-title">Find Service Providers</h1>
      <p className="page-subtitle">
        Browse and search trusted local professionals in your area.
      </p>

      <form className="search-bar" onSubmit={handleSearch}>
        <select
          className="form-control"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ maxWidth: 220 }}
        >
          <option value="">All Categories</option>

          {CATEGORIES.filter(Boolean).map((c) => (
            <option key={c} value={c}>
              {c.charAt(0) + c.slice(1).toLowerCase()}
            </option>
          ))}
        </select>

        <input
          className="form-control"
          placeholder="📍 Location (e.g. Hyderabad)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button className="btn btn-primary" type="submit">
          Search
        </button>

        {(category || location) && (
          <button
            className="btn btn-secondary"
            type="button"
            onClick={handleReset}
          >
            Clear
          </button>
        )}
      </form>

      {loading ? (
        <div className="spinner" />
      ) : providers.length === 0 ? (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <h3>No providers found</h3>
          <p>Try adjusting your search filters.</p>
        </div>
      ) : (
        <>
          <p className="text-muted" style={{ marginBottom: "1rem" }}>
            Found <strong>{providers.length}</strong> provider
            {providers.length !== 1 ? "s" : ""}
            {category && (
              <>
                {" "}
                in{" "}
                <strong>
                  {category.charAt(0) + category.slice(1).toLowerCase()}
                </strong>
              </>
            )}
            {location && (
              <>
                {" "}
                near <strong>{location}</strong>
              </>
            )}
          </p>

          <div className="grid grid-2">
            {providers.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
