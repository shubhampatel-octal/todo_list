import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";

const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
