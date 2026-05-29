import { TailChase } from "ldrs/react";
import "ldrs/react/TailChase.css";

const LoadingChatSuspense = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <TailChase size="36" speed="1.75" color="#a855f7" />
    </div>
  );
};

export default LoadingChatSuspense;
