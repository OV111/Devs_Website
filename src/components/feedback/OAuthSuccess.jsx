import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { init } = useAuthStore();

  useEffect(() => {
    // GitHub OAuth sets the httpOnly refresh cookie server-side (see
    // githubCallback in authController.js) and redirects here with no token
    // in the URL. init() exchanges that cookie for an access token the same
    // way a normal page-load does.
    const linked = searchParams.get("linked");

    (async () => {
      await init();
      const { auth } = useAuthStore.getState();
      if (auth) {
        navigate(linked ? "/my-profile/connected-accounts" : "/");
      } else {
        navigate("/get-started");
      }
    })();
  }, [searchParams, navigate, init]);

  return <p>Logging you in...</p>;
};

export default OAuthSuccess;
