import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlogCard from "@/components/blog/BlogCard";
import { FloatingIcons } from "../../components/effects/FloatingIcons";
import { fetchBlogs, fetchDefaultPostsByCategory } from "@/services/blogsApi";
import useAuthStore from "@/stores/useAuthStore";

gsap.registerPlugin(ScrollTrigger);

const LoadingSuspense = lazy(
  () => import("../../components/feedback/LoadingSuspense"),
);

const languageTags = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "Swift",
  "Kotlin",
  "PHP",
];

const Languages = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth, isLoading: authLoading } = useAuthStore();
  const containerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    const load = auth
      ? fetchBlogs(1, 8, { category: "languages" }).then(({ blogs }) => blogs)
      : fetchDefaultPostsByCategory("languages");
    load
      .then((items) => setData(items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth, authLoading]);

  useEffect(() => {
    if (loading || !data.length) return;

    const container = containerRef.current;
    const cards = cardsRef.current;
    const totalWidth = cards.scrollWidth - window.innerWidth;

    const ctx = gsap.context(() => {
      gsap.to(cards, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          start: "top top",
          end: () => `+=${totalWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
    };
  }, [loading, data]);

  return (
    <React.Fragment>
      <header className="min-h-screen pt-40 relative">
        <FloatingIcons category={"languages"} />

        <div className="flex justify-center items-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
          >
            <div className="grid justify-center items-center">
              <span className="mx-auto mb-1 bg-linear-to-l from-purple-500 to-purple-800 bg-clip-text text-transparent">
                Programming
              </span>
              <span className="bg-linear-to-r from-purple-800 to-purple-400 bg-clip-text text-transparent">
                Languages
              </span>
            </div>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="mt-6 max-w-3xl text-lg font-semibold sm:text-xl text-muted-foreground mx-auto"
        >
          <span className="bg-linear-to-r from-slate-400 via-purple-600 to-indigo-400 text-center block max-w-3xl mx-auto bg-clip-text text-transparent">
            Master the languages that power the modern world — from scripting
            and systems to web, mobile, and AI. Pick a language, go deep.
          </span>
        </motion.p>

        <section className="mx-auto py-20">
          <div className="rounded-3xl px-6 py-8">
            <p className="text-center text-2xl font-bold uppercase tracking-[4px] text-purple-700">
              Browse by Language
            </p>
            <p className="bg-linear-to-r from-slate-400 via-purple-600 to-indigo-400 text-transparent bg-clip-text mx-auto mt-3 lg:w-md lg:max-w-2xl text-center text-base font-medium sm:text-lg">
              Explore syntax, patterns, and real-world usage across the most
              in-demand programming languages
            </p>
            <div className="mt-6 flex flex-wrap lg:mx-20 justify-center gap-3">
              {languageTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-800 transition hover:bg-purple-700 hover:text-white dark:bg-purple-800 dark:text-white"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </section>
      </header>

      <main>
        <Suspense fallback={null}>
          {loading ? (
            <LoadingSuspense />
          ) : (
            <div ref={containerRef} className="overflow-hidden h-screen">
              <div
                ref={cardsRef}
                className="flex items-center gap-10 px-16 h-full"
                style={{ width: "max-content" }}
              >
                {data.map((card) => (
                  <div key={String(card._id)} className="w-[380px] shrink-0">
                    <BlogCard card={card} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Suspense>
      </main>
    </React.Fragment>
  );
};

export default Languages;
