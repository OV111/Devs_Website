import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const linked = searchParams.get("linked");

    if (token) {
      login(token);
      navigate(linked ? "/my-profile/connected-accounts" : "/");
    } else {
      navigate("/get-started");
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;