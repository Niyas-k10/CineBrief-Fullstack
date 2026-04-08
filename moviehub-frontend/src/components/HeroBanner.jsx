import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function HeroBanner() {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    try {
      const res = await API.get("/movies/trending/");
      setMovies(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // 🔥 AUTO SLIDE
  useEffect(() => {
    if (!movies.length) return;

    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [movies]);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 10000); // 10 sec
  };

  const nextSlide = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % movies.length);
      setFade(true);
    }, 500);
  };

  const prevSlide = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) =>
        prev === 0 ? movies.length - 1 : prev - 1
      );
      setFade(true);
    }, 500);
  };

  if (!movies.length) return null;

  const movie = movies[index];

  const bgImage =
    movie.backdrop_path ||
    movie.poster ||
    "https://dummyimage.com/1200x600/000/fff&text=No+Image";

  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        alignItems: "center",
        padding: "60px",
        color: "#fff",
        position: "relative",
        overflow: "hidden",

        backgroundImage: `url(${bgImage})`,
        backgroundSize: "1000px",
        backgroundPosition: "right",
        backgroundRepeat: "no-repeat",

        transition: "opacity 0.5s ease-in-out",
        opacity: fade ? 1 : 0,
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,1) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 80%, transparent 100%)"
        }}
      />

      {/* Content */}
      <div style={{ maxWidth: "500px", position: "relative", zIndex: 2 }}>
        <h1 style={{ fontSize: "52px", marginBottom: "10px" }}>
          {movie.title}
        </h1>

        <p style={{ color: "#f5c518", marginBottom: "10px" }}>
          IMDb :  {movie.rating ? movie.rating.toFixed(1) : "N/A"} / 10
        </p>

        <p style={{ color: "#ccc" }}>
          {movie.overview
            ? movie.overview.slice(0, 160) + "..."
            : "No description available"}
        </p>

        <button
          onClick={() => navigate(`/movie/${movie.id}`)}
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            background: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          View Details
        </button>
      </div>

      {/* ⬅ LEFT ARROW */}
      <button
        onClick={prevSlide}
        style={arrowStyle("left")}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.2)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.3)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        <svg width="24" height="24">
          <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </button>

      {/* ➡ RIGHT ARROW */}
      <button
        onClick={nextSlide}
        style={arrowStyle("right")}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.2)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(0,0,0,0.3)";
          e.currentTarget.style.transform = "translateY(-50%) scale(1)";
        }}
      >
        <svg width="24" height="24">
          <path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" fill="none"/>
        </svg>
      </button>

      {/* 🔵 DOT INDICATORS */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 5
        }}
      >
        {movies.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: i === index ? "18px" : "8px",
              height: "8px",
              borderRadius: "10px",
              background: i === index ? "#fff" : "rgba(255,255,255,0.4)",
              transition: "0.3s",
              cursor: "pointer"
            }}
          />
        ))}
      </div>

    </div>
  );
}

// Arrow style
const arrowStyle = (position) => ({
  position: "absolute",
  top: "50%",
  [position]: position === "left" ? "10px" : "20px", // 👈 different spacing
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.3)",
  border: "none",
  padding: "10px",
  cursor: "pointer",
  borderRadius: "50%",
  backdropFilter: "blur(5px)",
  transition: "all 0.3s ease",
  zIndex: 3,
});

export default HeroBanner;