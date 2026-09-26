import { useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import RiseText from "../components/RiseText";

const Home = () => {
  const { auth } = useAuthStore();

  // React Router keeps the window scroll position across navigations, so
  // arriving here from a scrolled page (e.g. the Google button on
  // GetStarted, via a client-side redirect after login) would drop you into
  // this page already scrolled down. Same fix AiAgent.jsx/ChallengeArena.jsx use.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
      {/* Top badge */}
      <div className="rt-fade mb-3 flex items-center gap-4" style={{ "--delay": "0ms" }}>
        <span className="text-[14px] leading-[20px] font-medium text-neutral-400">
          Vahoha
        </span>
        <span className="text-neutral-600">|</span>
        <span className="text-xs text-neutral-500">
          Built by devs, for devs
        </span>
      </div>

      {/* Headline */}
      <RiseText
        lines={["The Next generation of", "Developer learning."]}
        highlight="learning"
        className="max-w-xl text-[50px] leading-[48px] font-[450] tracking-[-0.48px] text-white"
        style={{ fontFamily: '"Geist Variable", system-ui, sans-serif' }}
      />

      <p
        className="rt-fade mt-6 max-w-xl text-[18px] leading-[29.25px] font-normal text-neutral-300"
        style={{ "--delay": "650ms" }}
      >
        Prove what you know, unlock real progress,
        <br className="hidden sm:block" />
        Guided by an AI mentor that knows your journey.
      </p>

      <div className="rt-fade mt-8 flex flex-wrap justify-center gap-3" style={{ "--delay": "800ms" }}>
        <Link
          to={auth ? "/my-profile" : "/get-started"}
          className="rounded-full bg-white px-5 py-3 text-[14px] leading-[20px] font-medium text-black transition hover:bg-neutral-200"
        >
          Start your path →
        </Link>
        <Link
          to="/roadmaps"
          className="rounded-full bg-neutral-800 px-5 py-3 text-[14px] leading-[20px] font-medium text-white transition hover:bg-neutral-700"
        >
          Explore content
        </Link>
      </div>
    </section>
  );
};

export default Home;
