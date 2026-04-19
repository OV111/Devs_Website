import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      login(token); 
      navigate("/");
    } else {
      navigate("/login"); 
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;