import { useEffect, useState } from "react";
import SideBar from "./components/SideBar";
import BlogCard from "@/components/blog/BlogCard";
import { Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Favourites = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/blogs/favourites`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("JWT")}` },
        });
        const data = await res.json();
        if (data.success) setBlogs(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <SideBar />

      <div className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Favourites
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Posts you saved for later
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[478px] rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"
              />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <Bookmark
              size={48}
              className="mb-4 text-gray-300 dark:text-gray-700"
            />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              No saved posts yet
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Tap the bookmark icon on any post to save it here.
            </p>
            <Link
              to="/"
              className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              Browse posts
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard key={String(blog._id)} card={blog} initialSaved={true} />
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default Favourites;
