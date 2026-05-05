import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

const ProtectedMyProfile = ({ children }) => {
  const navigate = useNavigate();
  const { auth, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !auth) {
      navigate("/get-started");
    }
  }, [auth, isLoading, navigate]);

  // if (isLoading) return null;
  // if (!auth) return null;

  return children;
};

export default ProtectedMyProfile;
