import React, { useEffect, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import "./index.css";

import router from "./router";
import LoadingSuspense from "./components/feedback/LoadingSuspense";
import useAuthStore from "./stores/useAuthStore";
import useNotificationStore from "./stores/useNotificationStore";
import useBlogInteractionsStore from "./stores/useBlogInteractionsStore";
import useProfileStore from "./stores/useProfileStore";


const App = () => {
  const { isLoading, init, auth, session } = useAuthStore();
  const { connectWs, disconnectWs, clearNotifications } = useNotificationStore();
  const { fetchInteractions, reset } = useBlogInteractionsStore();
  const { fetchProfile, clearProfile } = useProfileStore();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (auth) {
      reset();
      clearProfile();
      clearNotifications();
      connectWs();
      fetchInteractions();
      fetchProfile();
    } else {
      disconnectWs();
      reset();
      clearProfile();
      clearNotifications();
    }
  }, [auth, session, clearNotifications, clearProfile, connectWs, disconnectWs, fetchInteractions, fetchProfile, reset]);
  if (isLoading) return <LoadingSuspense />;

  return (
    <React.Fragment>
      <Suspense fallback={<LoadingSuspense />}>
        <RouterProvider router={router}></RouterProvider>
      </Suspense>
    </React.Fragment>
  );
};
export default App;
