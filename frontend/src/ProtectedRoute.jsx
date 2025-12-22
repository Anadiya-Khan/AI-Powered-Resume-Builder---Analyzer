import { useContext } from "react";
import { authContext } from "./context/Context";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user,loading } = useContext(authContext);
  if (loading) {
    return <div>Loading...</div>; 
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
