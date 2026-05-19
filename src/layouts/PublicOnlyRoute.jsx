import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore.js";

const PublicOnlyRoute = ({ children }) => {
  const { auth, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (auth) return <Navigate to="/" replace />;

  return children;
};

export default PublicOnlyRoute;
