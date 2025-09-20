// MyBlogs.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function MyBlogs({ session }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (!session) return;

    const fetchBlogs = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching blogs:", error);
      } else {
        setBlogs(data);
      }
    };

    fetchBlogs();
  }, [session]);

  if (!session) return <p>You must be logged in to see your blogs.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Blogs</h1>
      {blogs.length === 0 ? (
        <p>No blogs yet. <Link to="/write" className="text-blue-600">Write one</Link>!</p>
      ) : (
        <ul className="space-y-4">
          {blogs.map((blog) => (
            <li key={blog.id} className="border p-4 rounded-lg shadow">
              <Link to={`/blog/${blog.id}`} className="text-xl font-semibold text-blue-600">
                {blog.title}
              </Link>
              <p className="text-gray-700 truncate">{blog.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
