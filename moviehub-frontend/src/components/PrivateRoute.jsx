import { Navigate } from "react-router-dom";

function PrivateRoute({ children, token }) {
  return token ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;