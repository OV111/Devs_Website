import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";
import RiseText from "../components/RiseText";
import Divider from "../components/ui/Divider";
import HowItWorks from "../components/home/HowItWorks";
import vahohaMark from "@/assets/vahoha_mark_circle.png";

const Home = () => {
  const { auth } = useAuthStore();
  const { hash } = useLocation();

  // Scroll-to-top is handled app-wide by <ScrollRestoration /> in MainLayout.
  // This only adds a smooth glide for "/#how-it-works" links, instead of the
  // instant jump ScrollRestoration does for hash targets.
  useEffect(() => {
    if (!hash) return;
    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
  }, [hash]);

  return (
    <>
      <section className="flex min-h-[85dvh] flex-col items-center justify-center px-6 text-center">
        {/* Top badge */}
        <div
          className="rt-fade mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1"
          style={{ "--delay": "0ms" }}
        >
          <span className="inline-flex items-center gap-2.5 text-sm leading-6 font-normal text-neutral-300 sm:text-base sm:leading-7 md:text-[18px] md:leading-[29.25px]">
            <img src={vahohaMark} alt="" className="h-7 w-7 rounded-full md:h-8 md:w-8" />
            Vahoha
          </span>
          <span className="text-neutral-600" aria-hidden="true">|</span>
          <span className="text-sm leading-6 font-normal text-neutral-300 sm:text-base sm:leading-7 md:text-[18px] md:leading-[29.25px]">
            Built by devs, for devs
          </span>
        </div>

        {/* Headline */}
        <RiseText
          lines={["The Next Generation of", "Developer Learning."]}
          highlight="Learning"
          className="max-w-xl text-3xl leading-[1.1] font-[450] tracking-[-0.48px] text-balance [--rt-underline-offset:-0.2em] min-[420px]:text-4xl sm:text-5xl md:text-[50px] md:leading-[0.96] md:[--rt-underline-offset:-0.08em] [&_.rt-line]:inline md:[&_.rt-line]:block text-white"
          style={{ fontFamily: '"Geist Variable", system-ui, sans-serif' }}
        />

        <p
          className="rt-fade mt-4 max-w-xl text-sm leading-6 sm:text-base sm:leading-7 md:text-[18px] md:leading-[29.25px] font-normal text-neutral-300"
          style={{ "--delay": "650ms" }}
        >
          Prove what you know, unlock real progress,{" "}
          <br className="hidden sm:block" />
          guided by an AI mentor that knows your journey.
        </p>

        <div
          className="rt-fade mt-6 mx-auto flex w-full max-w-[11rem] flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:justify-center md:mt-8"
          style={{ "--delay": "800ms" }}
        >
          <Link
            to={auth ? "/my-profile" : "/get-started"}
            className="flex min-h-9 items-center justify-center rounded-full sm:min-h-11 bg-white px-4 py-1.5 text-[13px] sm:px-5 sm:py-2.5 sm:text-[14px] leading-[20px] font-medium text-black transition hover:bg-neutral-200"
          >
            Start your path →
          </Link>
          <Link
            to="/roadmaps"
            className="flex min-h-9 items-center justify-center rounded-full sm:min-h-11 border border-white/15 bg-neutral-800 px-4 py-1.5 text-[13px] sm:px-5 sm:py-2.5 sm:text-[14px] leading-[20px] font-medium text-white hover:border-white/25 transition hover:bg-neutral-700"
          >
            Explore content
          </Link>
        </div>
      </section>

      <Divider />

      <HowItWorks />
    </>
  );
};

export default Home;
