import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function MovieDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);

      const movieRes = await API.get(`/movies/${id}/`);
      const castRes = await API.get(`/movies/${id}/cast/`);
      const similarRes = await API.get(`/movies/${id}/similar/`);

      const movieData = movieRes.data;

      setMovie(movieData);
      setCast(castRes.data.data || []);
      setSimilarMovies(
        similarRes.data.data ||
        similarRes.data.results ||
        []
      );

      await checkFavorite(movieData.id);

      setLoading(false);

    } catch (error) {
      console.error("Fetch movie error:", error);
      setLoading(false);
    }
  };

  const checkFavorite = async (movieId) => {
    try {
      const res = await API.get("/movies/favorites/");
      const favList = Array.isArray(res.data) ? res.data : [];

      const exists = favList.some(
        (m) => Number(m.movie_id) === Number(movieId)
      );

      setIsFavorite(exists);

    } catch (err) {
      console.error("Check favorite error:", err);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (!movie) return;

      if (!isFavorite) {

        await API.post("/movies/favorites/add/", {
          movie_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path || movie.poster
        });

        setIsFavorite(true);

      } else {

        await API.delete(`/movies/favorites/remove/${movie.id}/`);

        setIsFavorite(false);
      }

    } catch (error) {
      console.error("Favorite error:", error);
    }
  };

  const getImage = (path) => {
    if (!path) return "https://dummyimage.com/500x750/333/fff&text=No+Image";
    if (path.startsWith("http")) return path;

    return `https://image.tmdb.org/t/p/original${path}`;
  };

  if (loading) {
    return (
      <div style={loaderContainer}>
        <div style={loader}></div>
      </div>
    );
  }

  if (!movie) return null;

  const backdrop = getImage(movie.backdrop_path || movie.poster);

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>

      {/* HERO */}
      <div
        style={{
          height: "95vh",
          display: "flex",
          alignItems: "center",
          padding: "60px",
          backgroundImage: `url(${backdrop})`,
          backgroundSize: "1000px",
          backgroundPosition: "right",
          backgroundRepeat: "no-repeat",
          position: "relative"
        }}
      >
        <div style={overlay}></div>

        <div style={{ zIndex: 2, maxWidth: "650px" }}>

          <h1 style={{ fontSize: "64px", fontWeight: "700", marginBottom: "10px" }}>
            {movie.title}
          </h1>

          <button onClick={toggleFavorite} style={favBtn}>
            {isFavorite ? "Added" : "Add to Favorites"}
          </button>

          <button onClick={() => navigate(`/movie/${movie.id}/review`)} style={reviewBtn}>
            Add Review
          </button>

          <div style={meta}>
            <span>{movie.release_date}</span>
            <span>{movie.runtime || "N/A"} min</span>
            <span>{movie.vote_average?.toFixed(1) || "N/A"} rating</span>
            <span>{movie.genres?.map(g => g.name).join(" • ")}</span>
          </div>

          {movie.tagline && (
            <p style={tagline}>
              "{movie.tagline}"
            </p>
          )}

          <p style={overview}>{movie.overview}</p>

        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "15px" }}>

        <h2>Cast</h2>

        <div style={scrollRow}>
          {cast.map((actor, index) => (
            <div
              key={index}
              style={castCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <img src={getImage(actor.profile_image)} style={castImg} />
              <p>{actor.name}</p>
              <p style={{ color: "#888", fontSize: "12px" }}>
                {actor.character}
              </p>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: "40px" }}>Similar Movies</h2>

        <div style={scrollRow}>
          {similarMovies.map((m) => (
            <div
              key={m.id}
              style={movieCard}
              onClick={() => navigate(`/movie/${m.id}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.zIndex = "10";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.zIndex = "1";
              }}
            >
              <img
                src={getImage(m.poster || m.poster_path)}
                style={movieImg}
              />
              <p style={movieTitle}>{m.title}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ===== STYLES ===== */

const overlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to right, rgba(0,0,0,1) 20%, rgba(0,0,0,0.8) 40%, rgba(0,0,0,0.2) 80%, transparent 100%)"
};

const favBtn = {
  marginBottom: "15px",
  padding: "8px 18px",
  background: "rgba(255,255,255,0.1)",
  border: "1px solid #fff",
  color: "#fff",
  borderRadius: "5px",
  cursor: "pointer"
};

const reviewBtn = {
  marginLeft: "12px",
  marginBottom: "15px",
  padding: "10px 18px",
  background: "#e50914",
  border: "none",
  color: "#fff",
  borderRadius: "5px",
  cursor: "pointer"
};

const meta = {
  display: "flex",
  gap: "15px",
  fontSize: "14px",
  color: "#aaa",
  marginBottom: "20px",
  flexWrap: "wrap"
};

const tagline = {
  fontStyle: "italic",
  color: "#ccc",
  marginBottom: "10px"
};

const overview = {
  color: "#ddd",
  lineHeight: "1.6",
  fontSize: "15px"
};

const scrollRow = {
  display: "flex",
  overflowX: "auto",   // ✅ keep scroll
  overflowY: "hidden",
  gap: "15px",
  padding: "10px 0px",
  scrollBehavior: "smooth",

  scrollbarWidth: "none",   // ✅ Firefox
  msOverflowStyle: "none"   // ✅ IE/Edge
};

/* 🔥 UPDATED HOVER STYLES */
const castCard = {
  minWidth: "140px",
  textAlign: "center",
  flex: "0 0 auto",
  transition: "transform 0.3s ease",
  cursor: "pointer"
};

const castImg = {
  width: "140px",
  height: "180px",
  borderRadius: "8px",
  objectFit: "cover"
};

const movieCard = {
  minWidth: "160px",
  cursor: "pointer",
  flex: "0 0 auto",
  transition: "transform 0.3s ease"
};

const movieImg = {
  width: "160px",
  height: "240px",
  borderRadius: "10px",
  objectFit: "cover"
};

const movieTitle = {
  textAlign: "center",
  marginTop: "5px",
  fontSize: "14px"
};

const loaderContainer = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#000"
};

const loader = {
  width: "50px",
  height: "50px",
  border: "6px solid #333",
  borderTop: "6px solid #fff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite"
};

export default MovieDetails;