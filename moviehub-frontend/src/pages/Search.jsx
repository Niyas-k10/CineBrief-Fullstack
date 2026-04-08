import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Search() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 🔥 DEBOUNCE SEARCH
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim()) {
        fetchMovies();
      } else {
        setResults([]);
      }
    }, 500); // 0.5 sec delay

    return () => clearTimeout(delay);
  }, [query]);

  const fetchMovies = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/movies/search/?q=${query}`);
      setResults(res.data.data || []);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div style={container}>

      {/* 🔍 SEARCH INPUT */}
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={input}
      />

      {/* 🔄 LOADING */}
      {loading && <p style={infoText}>Searching...</p>}

      {/* ❌ NO RESULT */}
      {!loading && query && results.length === 0 && (
        <p style={infoText}>No movies found</p>
      )}

      {/* 🎬 RESULTS */}
      <div style={grid}>
        {results.map((movie) => (
          <div
            key={movie.id}
            style={card}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={movie.poster}
              alt={movie.title}
              style={img}
            />
            <p style={title}>{movie.title}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ===== STYLES ===== */

const container = {
  padding: "40px",
  background: "#000",
  minHeight: "100vh",
  color: "#fff"
};

const input = {
  width: "100%",
  padding: "14px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  marginBottom: "30px",
  fontSize: "16px"
};

const infoText = {
  textAlign: "center",
  marginBottom: "20px",
  color: "#aaa"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "20px"
};

const card = {
  cursor: "pointer",
  transition: "0.3s"
};

const img = {
  width: "100%",
  height: "240px",
  borderRadius: "10px",
  objectFit: "cover"
};

const title = {
  textAlign: "center",
  marginTop: "5px",
  fontSize: "14px"
};

export default Search;