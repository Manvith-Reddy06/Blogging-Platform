import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function PopularBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("likes", { ascending: false, nullsFirst: false })
        .limit(20);

      if (error) {
        console.error("Error fetching popular blogs:", error);
      } else {
        setBlogs(data);
      }
      setLoading(false);
    };

    fetchPopularBlogs();
  }, []);

  if (loading) return <p>Loading popular blogs...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Popular Blogs</h1>
      {blogs.length === 0 ? <p>No blogs found.</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="border p-6 rounded-lg shadow-lg bg-white">
              <Link to={`/blog/${blog.id}`}><h2 className="text-2xl font-bold hover:text-blue-600 transition-colors truncate">{blog.title}</h2></Link>
              <p className="text-gray-500 mt-1 text-sm">by {blog.author_email}</p>
              <p className="text-gray-700 mt-4 truncate-3-lines">{blog.content}</p>
              <p className="mt-4 font-semibold text-red-500">❤️ {blog.likes || 0} Likes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}