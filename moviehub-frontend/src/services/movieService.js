import API from "./api";

export const getGenres = () => API.get("/movies/genres/");
export const getMoviesByGenre = (genreId) =>
  API.get(`/movies/genre/${genreId}/`);