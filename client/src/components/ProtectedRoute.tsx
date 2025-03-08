import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from "react";
import useAuth from "../context/auth/useAuth";
import { AuthService } from "../services/auth-service";
import Loading from "./Loading";

const ProtectedRoute = ({ redirectTo = "/login" }) => {
  const { user, login, logout } = useAuth(); // Ensure `setUser` is available in context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await AuthService.getCurrentUser();
        login(data.user); // Update user state
      } catch (error) {
        console.log(error)
        logout(); // Clear user state on failure
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (!user) checkAuth();
    else setLoading(false);
  }, [user, login, logout]);

  if (loading) return <Loading />; // Show a loading state

  return user ? <Outlet /> : <Navigate to={redirectTo} replace />;
};

export default ProtectedRoute;
