import React, { useEffect, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import "./index.css";

import router from "./router";
import LoadingSuspense from "./components/feedback/LoadingSuspense";
import useAuthStore from "./stores/useAuthStore";
import useNotificationStore from "./stores/useNotificationStore";
import useBlogInteractionsStore from "./stores/useBlogInteractionsStore";

const App = () => {
  const { isLoading, init, auth } = useAuthStore();
  const { connectWs, disconnectWs } = useNotificationStore();
  const { fetchInteractions, reset } = useBlogInteractionsStore();

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (auth) {
      connectWs();
      fetchInteractions();
    } else {
      disconnectWs();
      reset();
    }
  }, [auth]);
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
