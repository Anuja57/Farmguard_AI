import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}
