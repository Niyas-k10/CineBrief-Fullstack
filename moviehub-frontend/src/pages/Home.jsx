import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ NEW
import API from "../services/api";
import MovieRow from "../components/MovieRow";
import HeroBanner from "../components/HeroBanner";

function Home() {

  const location = useLocation(); // ✅ NEW

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [recommended, setRecommended] = useState([]);

  const [genres, setGenres] = useState([]);
  const [genreMovies, setGenreMovies] = useState({});

  useEffect(() => {
    fetchMovies();
  }, []);

  // ✅ SCROLL WHEN COMING FROM OTHER PAGE
  useEffect(() => {
    if (location.state?.scrollToFooter) {
      setTimeout(() => {
        const footer = document.getElementById("footer");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth" });
        }
      }, 400);
    }
  }, [location]);

  const fetchMovies = async () => {
    try {

      const trendingRes = await API.get("/movies/trending/");
      const popularRes = await API.get("/movies/popular/");
      const topRatedRes = await API.get("/movies/top-rated/");
      const genreRes = await API.get("/movies/genres/");

      let recData = [];
      try {
        const recRes = await API.get("/movies/recommendations/");
        recData = recRes.data.recommended_movies || [];
      } catch {
        recData = [];
      }

      setTrending(trendingRes.data.data || []);
      setPopular(popularRes.data.data || []);
      setTopRated(topRatedRes.data.data || []);
      setRecommended(recData);
      setGenres(genreRes.data.data || []);

      const genreData = {};

      for (let genre of genreRes.data.data || []) {
        try {
          const res = await API.get(`/movies/genre/${genre.id}/`);
          genreData[genre.id] = res.data.data || [];
        } catch {
          genreData[genre.id] = [];
        }
      }

      setGenreMovies(genreData);

    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#141414",
        minHeight: "100vh",
        color: "#fff"
      }}
    >
      <HeroBanner />

      <div style={{ marginTop: "30px" }}>

        {recommended.length > 0 && (
          <MovieRow
            title="Recommended for You"
            movies={recommended}
            size="large"
          />
        )}

        <MovieRow
          title="Popular Movies"
          movies={popular}
          size="normal"
        />

        <MovieRow
          title="Top Rated Movies"
          movies={topRated}
          size="normal"
        />

        {genres.map((genre) => (
          <MovieRow
            key={genre.id}
            title={genre.name}
            movies={genreMovies[genre.id]}
            size="small"
          />
        ))}

      </div>
    </div>
  );
}

export default Home;