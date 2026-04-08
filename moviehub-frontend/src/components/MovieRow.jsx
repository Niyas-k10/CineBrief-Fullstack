import MovieCard from "./MovieCard";

function MovieRow({ title, movies, size = "normal" }) {

  if (!movies || movies.length === 0) return null;

  return (
    <div style={{ marginBottom: "25px" }}>

      {/* TITLE */}
      <h2
        style={{
          paddingLeft: "20px",
          color: "#fff",
          marginBottom: "10px"
        }}
      >
        {title}
      </h2>

      {/* SCROLL */}
      <div
        className="movie-row-scroll"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "12px",
          padding: "10px 20px",
          scrollBehavior: "smooth",
          scrollbarWidth: "none"
        }}
      >

        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            size={size}
          />
        ))}

      </div>

    </div>
  );
}

export default MovieRow;


/* HIDE SCROLLBAR */
const style = document.createElement("style");
style.innerHTML = `
.movie-row-scroll::-webkit-scrollbar {
  display: none;
}
`;
document.head.appendChild(style);