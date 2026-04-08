import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/accounts/profile/");
      setUser(res.data);
    } catch (error) {
      console.error("Profile error:", error);
    }
  };

  if (!user) {
    return (
      <div style={loading}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={container}>

      <div style={card}>

        <h1 style={title}>Profile</h1>

        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>

        <div style={stats}>

          <div style={statBox}>
            <h3>{user.favorites}</h3>
            <p>Favorites</p>
          </div>

          {/* <div style={statBox}>
            <h3>{user.watchlist}</h3>
            <p>Watchlist</p>
          </div> */}

          <div style={statBox}>
            <h3>{user.reviews}</h3>
            <p>Reviews</p>
          </div>

        </div>

      </div>

    </div>
  );
}

/* ===== STYLES ===== */

const container = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "90vh",
  background: "#141414",
  color: "#fff"
};

const card = {
  background: "#1f1f1f",
  padding: "30px",
  borderRadius: "12px",
  width: "350px",
  textAlign: "center",
  boxShadow: "0 0 20px rgba(0,0,0,0.5)"
};

const title = {
  marginBottom: "20px"
};

const stats = {
  display: "flex",
  justifyContent: "center",
  marginTop: "25px",
  gap:"20px"
};

const statBox = {
  background: "#111",
  padding: "15px",
  borderRadius: "10px",
  width: "30%"
};

const loading = {
  color: "#fff",
  textAlign: "center",
  marginTop: "100px"
};

export default Profile;