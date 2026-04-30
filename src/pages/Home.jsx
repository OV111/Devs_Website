import { Link } from "react-router-dom";
import TextType from "../components/effects/TextType";
import GradientText from "../components/effects/GradientText";
import useAuthStore from "../stores/useAuthStore";
import heroIllustration from "../assets/Code typing-bro (1).svg";

const Home = () => {
  const { auth } = useAuthStore();

  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute top-10 -left-20 h-72 w-72 rounded-full bg-fuchsia-200/50 blur-3xl dark:bg-fuchsia-900/20" />
      <div className="pointer-events-none absolute top-10 right-10 h-72 w-72 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/20" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-100/60 blur-3xl dark:bg-purple-900/10" />

      <section className="relative flex justify-between gap-0 lg:gap-48 min-h-[80vh] lg:min-h-[85vh] items-center mx-auto max-w-8xl px-6 sm:px-10 md:px-20 lg:px-28 py-12 lg:py-0">
        <div className="flex flex-col gap-5 lg:gap-8 w-full max-w-2xl">
          <div className="w-full h-16 sm:h-20 lg:h-36">
            <h1 className="font-medium text-purple-800 dark:text-purple-400 text-3xl sm:text-5xl lg:text-7xl drop-shadow-[0_6px_24px_rgba(126,34,206,0.15)]">
              <TextType
                text={[
                  "Welcome to Developers Web",
                  "Level up your dev skills,",
                  "Next generation of learning",
                  "Created by Devs for Devs!",
                  "Every expert was once a beginner.",
                  "It is not ordinary platform"
                ]}
                typingSpeed={109}
                pauseDuration={1700}
                showCursor={true}
                cursorCharacter="|"
              />
            </h1>
          </div>

          <GradientText
            colors={["#8A2BE2", "#FF1493", "#FF00FF", "#9c40ff", "#00FF00"]}
            animationSpeed={8}
            showBorder={false}
            className="px-1 py-1 w-full font-medium text-xl sm:text-2xl md:text-3xl lg:text-[36px] text-start"
          >
            Read, write, and grow guided by an AI that knows your journey.
          </GradientText>

          <div className="flex gap-4 items-center mt-2">
            <Link
              to={auth ? "my-profile" : "get-started"}
              className="bg-fuchsia-700 hover:bg-fuchsia-600 dark:bg-fuchsia-800 dark:hover:bg-fuchsia-700 hover:shadow-lg
                px-5 py-2 lg:px-10 lg:py-2.5
                rounded-full lg:rounded-xl
                text-xs font-semibold tracking-wide lg:text-xl lg:font-medium lg:tracking-normal
                text-white
                shadow-md lg:shadow-none
                border-0 lg:border lg:border-fuchsia-600/70
                transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Get Started
            </Link>
            <Link
              to="/categories/fullstack"
              className="bg-fuchsia-100 hover:bg-fuchsia-200 dark:bg-fuchsia-900/30 dark:hover:bg-fuchsia-900/50 hover:shadow-lg
                px-4 py-2 lg:px-6 lg:py-2.5
                rounded-full lg:rounded-xl
                text-xs font-semibold tracking-wide lg:text-xl lg:font-medium lg:tracking-normal
                text-fuchsia-800 dark:text-fuchsia-200 hover:text-fuchsia-900 dark:hover:text-fuchsia-100
                border border-fuchsia-300 dark:border-fuchsia-700
                transition-all duration-200 hover:scale-105 cursor-pointer"
            >
              Explore Content
            </Link>
          </div>

        </div>

        <div className="hidden lg:block shrink-0 ">
          {/* <img
            src={heroIllustration}
            alt="hero illustration"
            width={500}
            height={500}
            fetchPriority="high"
            className="w-[500px] drop-shadow-2xl dark:drop-shadow-[0_20px_40px_rgba(147,51,234,0.3)]"
          /> */}
        </div>
      </section>


    </div>
  );
};

export default Home;
