import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Favorites() {

  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await API.get("/movies/favorites/");
      setMovies(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  // REMOVE FAVORITE
  const removeFavorite = async (movieId, e) => {
    e.stopPropagation();

    try {
      await API.delete(`/movies/favorites/remove/${movieId}/`);

      setMovies((prev) =>
        prev.filter((m) => m.movie_id !== movieId)
      );

    } catch (error) {
      console.error("Remove error:", error);
    }
  };

  const getImage = (path) => {
    if (!path) return "https://dummyimage.com/300x450/333/fff";
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>
        Your Favorites
      </h2>

      {movies.length === 0 ? (
        <p>No favorites yet</p>
      ) : (
        <div style={grid}>
          {movies.map((m) => (
            <div
              key={m.movie_id}
              style={card}
              onClick={() => navigate(`/movie/${m.movie_id}`)}

              // 🔥 hover zoom
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >

              {/* REMOVE BUTTON */}
              <button
                onClick={(e) => removeFavorite(m.movie_id, e)}
                style={removeBtn}
                onMouseEnter={(e) => {
                  e.target.style.background = "red";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(0,0,0,0.6)";
                  e.target.style.transform = "scale(1)";
                }}
              >
                X
              </button>

              {/* IMAGE */}
              <img src={getImage(m.poster_path)} style={img} />

              {/* TITLE OVERLAY */}
              <div style={titleOverlay}>
                {m.title}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== STYLES ===== */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, 150px)",
  gap: "20px"
};

const card = {
  cursor: "pointer",
  position: "relative",
  transition: "0.3s"
};

const img = {
  width: "150px",
  height: "220px",
  objectFit: "cover",
  borderRadius: "10px"
};

const removeBtn = {
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "rgba(0,0,0,0.6)",
  border: "1px solid rgba(255,255,255,0.3)",
  color: "#fff",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  cursor: "pointer",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(5px)",
  transition: "0.3s"
};

const titleOverlay = {
  position: "absolute",
  bottom: "0",
  left: "0",
  width: "100%",
  padding: "8px",
  background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
  color: "#fff",
  fontSize: "13px",
  textAlign: "center",
  borderBottomLeftRadius: "10px",
  borderBottomRightRadius: "10px"
};

export default Favorites;