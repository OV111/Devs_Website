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

const FullStack = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth, isLoading: authLoading } = useAuthStore();
  const containerRef = useRef(null);
  const cardsRef = useRef(null);
  const seg1Ref = useRef(null);
  const seg2Ref = useRef(null);
  const seg3Ref = useRef(null);

  useEffect(() => {
    if (authLoading) return;
    const load = auth
      ? fetchBlogs(1, 8, { category: "Full Stack Development" }).then(({ blogs }) => blogs)
      : fetchDefaultPostsByCategory("fullstack");
    load
      .then((items) => setData(items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [auth, authLoading]);

  useEffect(() => {
    if (loading || !data.length) return;

    const container = containerRef.current;
    const cards = cardsRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const mid = vh / 2 - 260;
    const totalWidth = cards.scrollWidth - vw;

    // Set the three path segments dynamically based on viewport size
    seg1Ref.current.setAttribute("d", `M 20 0 L 20 ${mid}`);
    seg2Ref.current.setAttribute("d", `M 21 ${mid} L ${vw - 20} ${mid}`);
    seg3Ref.current.setAttribute("d", `M ${vw - 20} ${mid} L ${vw - 20} ${vh}`);

    // Hide all segments (will be revealed by scroll)
    [seg1Ref, seg2Ref, seg3Ref].forEach((ref) => {
      const len = ref.current.getTotalLength();
      ref.current.style.strokeDasharray = len;
      ref.current.style.strokeDashoffset = len;
    });

    // Distance from page top to where the card section starts
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    // Total scroll = header phase + pin phase
    const totalScroll = containerTop + totalWidth;
    // Proportions for each phase
    const p1 = containerTop / totalScroll;
    const p2 = totalWidth / totalScroll;

    const seg3Len = seg3Ref.current.getTotalLength();

    const ctx = gsap.context(() => {
      // Cards horizontal scroll — needs its own ScrollTrigger for the pin
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

      // Master timeline: all three segments, one scrub, proportional durations
      gsap
        .timeline({
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: `+=${totalScroll}`,
            scrub: 1,
            onLeave: () =>
              gsap.to(seg3Ref.current, {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: "power2.inOut",
              }),
            onEnterBack: () =>
              gsap.to(seg3Ref.current, {
                strokeDashoffset: seg3Len,
                duration: 0.3,
                ease: "power2.inOut",
              }),
          },
        })
        .to(seg1Ref.current, {
          strokeDashoffset: 0,
          ease: "none",
          duration: p1,
        })
        .to(seg2Ref.current, {
          strokeDashoffset: 0,
          ease: "none",
          duration: p2,
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
      {/* Fixed SVG path: draws down left → right → down right as you scroll */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-50"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={seg1Ref}
          stroke="#7c3aed"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={seg2Ref}
          stroke="#7c3aed"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={seg3Ref}
          stroke="#7c3aed"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <header className="min-h-screen mt-40 relative">
        {/* fix: skeleton crossfades out as real content animates in — no blank viewport */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5"
        >
          <div className="h-16 w-56 rounded-2xl bg-purple-900/20 animate-pulse" />
          <div className="h-16 w-64 rounded-2xl bg-purple-900/15 animate-pulse" />
          <div className="mt-2 h-4 w-72 rounded-lg bg-purple-900/10 animate-pulse" />
          <div className="h-4 w-60 rounded-lg bg-purple-900/10 animate-pulse" />
        </motion.div>
        <FloatingIcons category="fullstack" />

        <div className="flex justify-center items-center">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className=" text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
          >
            <div className="grid justify-center items-center">
              <span className="mx-auto mb-1 bg-linear-to-l from-purple-500 to-purple-800 bg-clip-text text-transparent">
                Full Stack
              </span>
              <span className="bg-linear-to-r from-purple-800 to-purple-400 bg-clip-text text-transparent">
                Development
              </span>
            </div>
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-3xl text-lg font-semibold sm:text-xl text-muted-foreground mx-auto"
        >
          <span className="bg-gradient-to-r from-gray-600 via-purple-600 to-indigo-400 text-center block max-w-3xl mx-auto bg-clip-text text-transparent">
            Master every layer of modern web development—from crafting intuitive
            frontends to architecting scalable backends exploring DB's, APIs,
            Cloud infrastructure.
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

export default FullStack;
