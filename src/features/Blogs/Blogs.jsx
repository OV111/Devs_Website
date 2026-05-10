// import BlogCard from "@/components/blog/BlogCard";
import { useState, useEffect, lazy } from "react";
const BlogCard = lazy(() => import("@/components/blog/BlogCard"));
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import LoadingSuspense from "@/components/feedback/LoadingSuspense";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  // const [loading, setLoading] = useState(false);
  const fetchBlogs = async () => {
    try {
        const request = await fetch(
          `${VITE_API_BASE_URL}/blogs?page=${page}&limit=10`,
        );
        const data = await request.json();
  console.log(data)
    // console.log("API response:", data.data[0]); // ← log first blog
    // console.log("author:", data.data[0]?.author); 

      if (data.success) {
        setBlogs(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  return (
   
        <div className="flex flex-wrap justify-center gap-10 px-2 pb-10 lg:px-0">
          <h1>Blogs</h1>

          {blogs.map((blog) => (
            <BlogCard key={blog._id} card={blog} />
            // <div key={blog._id} className="text-white">
            //   <h2>{blog.title}</h2>
            //   <p>{blog.description}</p>
            // </div>
          ))}
          {pagination && (
            <div>
              <button onClick={() => setPage((p) => p - 1)}></button>
            </div>
          )}
          <p>some</p>
        </div>
     
  );
};

export default Blogs;
