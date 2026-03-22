import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {

  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role;

      if (role !== requiredRole) {
        return <Navigate to="/" />;
      }
    } catch {
      return <Navigate to="/login" />;
    }
  }

  return children;
}

export default ProtectedRoute;