import { useState, useEffect } from "react";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const fetchBlogs = async () => {
    try {
      const request = await fetch(
        `${VITE_API_BASE_URL}/blogs?page=${page}&limit=10`,
      );
      const data = await request.json();

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
    <div>
      <h1>Blogs</h1>

      {blogs.map((blog) => (
        <div key={blog._id} className="text-white">
          <h2>{blog.title}</h2>
          <p>{blog.description}</p>
        </div>
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
