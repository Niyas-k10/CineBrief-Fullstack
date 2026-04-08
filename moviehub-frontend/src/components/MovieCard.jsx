import { Link } from "react-router-dom";

function MovieCard({ movie, size = "normal" }) {

  const poster = movie.poster
    ? movie.poster
    : "https://dummyimage.com/300x450/cccccc/000000&text=No+Image";

  // 🎯 size control
const sizes = {
  large: { width: "180px", height: "260px" },
  normal: { width: "140px", height: "210px" },
  small: { width: "110px", height: "170px" }
};

  const currentSize = sizes[size];

  return (
    <Link
      to={`/movie/${movie.id}`}
      style={{ textDecoration: "none" }}
    >

      <div
        style={{
          minWidth: currentSize.width,
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.08)";
          e.currentTarget.style.zIndex = "20";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.zIndex = "1";
        }}
      >

        {/* IMAGE */}
        <img
          src={poster}
          alt={movie.title}
          style={{
            width: currentSize.width,
            height: currentSize.height,
            objectFit: "cover",
            borderRadius: "10px"
          }}
        />

        {/* GRADIENT OVERLAY */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "40%",
            background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
            borderRadius: "10px"
          }}
        />

        {/* TITLE */}
        <p
          style={{
            position: "absolute",
            bottom: "6px",
            width: "100%",
            textAlign: "center",
            fontSize: "13px",
            color: "#fff",
            padding: "0 5px"
          }}
        >
          {movie.title}
        </p>

      </div>

    </Link>
  );
}

export default MovieCard;