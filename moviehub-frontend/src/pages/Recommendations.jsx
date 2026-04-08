import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Recommendations() {

  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await API.get("/movies/recommendations/");
      setMovies(res.data.recommended_movies || []);
    } catch (error) {
      console.error("Error fetching recommendations", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>

      <h2 style={{ marginBottom: "20px" }}>
        Recommended For You
      </h2>

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "20px"
        }}
      >

        {movies.map((movie) => (
          <div
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{
              minWidth: "230px",
              height: "340px",
              borderRadius: "14px",
              overflow: "hidden",
              cursor: "pointer",
              position: "relative",
              transition: "0.3s",
              boxShadow: "0 0 15px rgba(255,255,255,0.15)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >

            {/* Poster */}
            <img
              src={movie.poster}
              alt={movie.title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />

            {/* Gradient Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                padding: "10px",
                background: "linear-gradient(transparent, rgba(0,0,0,0.9))"
              }}
            >
              <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                {movie.title}
              </p>

              <p style={{ fontSize: "12px", color: "#ccc" }}>
                 {movie.rating}
              </p>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Recommendations;