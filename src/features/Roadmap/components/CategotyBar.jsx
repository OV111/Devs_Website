import { CATEGORY_OPTIONS2 } from "../../../../constants/Categories";
import useRoadmapStore from "../../../stores/useRoadmapStore";

const CategoryBar = () => {
  const { selectedCategory, setCategory } = useRoadmapStore();

  return (
    <>
      {/* <style>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(147,51,234,0.6); }
          50% { box-shadow: 0 0 22px rgba(147,51,234,0.85); }
        }
        .glow-pulse { animation: glow-pulse 2.5s ease-in-out infinite; }
      `}</style> */}

      <div className="flex flex-wrap gap-3 justify-center items-center mx-auto">
        {CATEGORY_OPTIONS2.map((category) => {
          const isSelected = selectedCategory?.id === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setCategory(category)}
              className={`
                px-6 py-2 cursor-pointer rounded-xl border text-sm font-medium transition-all duration-200
                ${
                  isSelected
                    ? "bg-purple-600 border-purple-500 text-white glow-pulse"
                    : "bg-neutral-100 border-zinc-200 text-neutral-700 hover:border-neutral-400  dark:bg-neutral-900 dark:border-neutral-600 dark:text-white dark:hover:border-neutral-500"
                }
              `}
            >
              {category.title}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default CategoryBar;
