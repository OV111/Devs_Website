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

const LoadingSuspense = lazy(() => import("../../components/feedback/LoadingSuspense"));

const Mobile = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth, isLoading: authLoading } = useAuthStore();
  const containerRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    const load = auth
      ? fetchBlogs(1, 8, { category: "Mobile Development" }).then(({ blogs }) => blogs)
      : fetchDefaultPostsByCategory("mobile");
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
      <header className="min-h-screen mt-40">
        <FloatingIcons category="mobile" />

        <div className="flex justify-center items-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className=" text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
          >
            <div className="grid justify-center items-center">
              <span className="mx-auto mb-1 bg-linear-to-l from-purple-500 to-purple-800 bg-clip-text text-transparent">
                Mobile
              </span>
              <span className="bg-linear-to-r from-purple-800 to-purple-400 bg-clip-text text-transparent">
                Development
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
            Explore modern mobile development from end to end — craft
            responsive, user-friendly interfaces, handle data and APIs, and
            connect your apps to scalable, cloud-powered backends.
          </span>
        </motion.p>
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

export default Mobile;
