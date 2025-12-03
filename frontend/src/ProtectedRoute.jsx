import { useContext } from "react";
import { authContext } from "./context/Context";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { user,loading } = useContext(authContext);

  // if(loading){
  //   return toast.loading("Loading...")
  // }

  // If still null but token exists → load user from localStorage
  // const token = localStorage.getItem("token");
  // const storedUser = localStorage.getItem("user");

  // if (!user && token && storedUser) {
  //   return children; // allow while context is still loading
  // }
  if (loading) {
    return <div>Loading...</div>; // use loader instead of toast
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
