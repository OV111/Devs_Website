import { Outlet } from "react-router-dom";
import ProtectedMyProfile from "@/routes/ProtectedMyProfile";

const ProtectedLayout = () => {
  return (
    <ProtectedMyProfile>
      <Outlet />
    </ProtectedMyProfile>
  );
};

export default ProtectedLayout;
