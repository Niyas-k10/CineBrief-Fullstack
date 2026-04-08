import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function AddReview() {

  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchMovie();
    fetchReviews();
    fetchCurrentUser();
  }, [id]);

  // 🎬 GET MOVIE
  const fetchMovie = async () => {
    try {
      const res = await API.get(`/movies/${id}/`);
      setMovie(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🧑 CURRENT USER
  const fetchCurrentUser = async () => {
    try {
      const res = await API.get("/user/me/");
      setCurrentUserId(res.data.id);
    } catch (err) {
      console.log("User not logged in");
    }
  };

  // ⭐ GET REVIEWS
  const fetchReviews = async () => {
    try {
      const res = await API.get(`/movies/${id}/reviews/`);
      setReviews(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ➕ ADD REVIEW
  const handleSubmit = async () => {
    if (!rating || !comment) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post(`/movies/${id}/review/`, {
        rating: parseFloat(rating),   // ✅ decimal support
        comment
      });

      setRating("");
      setComment("");
      fetchReviews();

    } catch {
      alert("Already reviewed or error");
    }
  };

  // ❌ DELETE REVIEW
  const deleteReview = async (reviewId) => {
    try {
      await API.delete(`/reviews/${reviewId}/delete/`);
      fetchReviews();
    } catch {
      alert("Delete failed");
    }
  };

  // 🖼 IMAGE FIX
  const getImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `https://image.tmdb.org/t/p/original${path}`;
  };

  if (!movie) return null;

  const backdrop = getImage(movie.backdrop_path || movie.poster);

  return (
    <div style={{
      minHeight: "100vh",
      color: "#fff",
      backgroundImage: backdrop ? `url(${backdrop})` : "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative"
    }}>

      {/* OVERLAY */}
      <div style={overlay}></div>

      <div style={container}>

        {/* LEFT */}
        <div style={left}>
          {movie.poster && (
            <img src={getImage(movie.poster)} style={poster} />
          )}
          <h1>{movie.title}</h1>
        </div>

        {/* 🔥 POSTER (WHITE BOX POSITION) */}
        {/* 🔥 POSTER (added in white box position) */}
      <div style={posterWrapper}>
        <img
          src={getImage(movie.poster || movie.poster_path)}
          style={topPoster}
        />
      </div>

        {/* RIGHT */}
        <div style={right}>

          {/* ADD REVIEW */}
          <div style={reviewBox}>
            <h2>Add Review</h2>

            <input
              type="number"
              step="0.1"
              min="1"
              max="10"
              placeholder="Rate (1-10)"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              style={input}
            />

            <textarea
              placeholder="Write your review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={textarea}
            />

            <button onClick={handleSubmit} style={submitBtn}>
              Submit Review
            </button>
          </div>

          {/* REVIEWS */}
          <div style={{ marginTop: "20px" }}>
            <h3>All Reviews</h3>

            {reviews.length === 0 && <p>No reviews yet</p>}

            {reviews.map((r) => (
              <div key={r.id} style={reviewCard}>
                <strong>{r.username}</strong> ({r.rating}/10)
                <p>{r.comment}</p>

                {/* ✅ ONLY OWNER CAN DELETE */}
                {currentUserId && r.user_id === currentUserId && (
                  <button
                    onClick={() => deleteReview(r.id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* STYLES */

const overlay = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.75)"
};

const container = {
  position: "relative",
  display: "flex",
  padding: "60px",
  gap: "40px"
};

const left = {
  width: "300px"
};

const right = {
  flex: 1
};

const poster = {
  width: "250px",
  borderRadius: "10px"
};

const reviewBox = {
  background: "rgba(255,255,255,0.08)",
  padding: "20px",
  borderRadius: "10px",
  backdropFilter: "blur(10px)"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px"
};

const textarea = {
  width: "100%",
  padding: "10px",
  height: "100px",
  borderRadius: "5px",
  marginBottom: "10px"
};

const submitBtn = {
  width: "100%",
  padding: "12px",
  background: "#e50914",
  color: "#fff",
  border: "none",
  borderRadius: "5px"
};

const reviewCard = {
  background: "rgba(0,0,0,0.6)",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "8px"
};

const deleteBtn = {
  marginTop: "5px",
  background: "red",
  color: "#fff",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer"
};


/* POSTER POSITION FIX */

const posterWrapper = {
  position: "absolute",
  top: "130px",
  left: "55px",
  zIndex: 2
};

const topPoster = {
  width: "240px",
  height: "360px",
  objectFit: "cover",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.8)"
};

export default AddReview;