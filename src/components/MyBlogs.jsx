// MyBlogs.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function MyBlogs({ session }) {
  const [blogs, setBlogs] = useState([]);
  const [top, setTop] = useState([]);

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
  useEffect(() => {
    async function fetchTopBlogs() {
      // Fetch top 10 blogs sorted by likes
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("likes", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching top blogs:", error);
        setTop([]);
      } else {
        setTop(data);
      }
    }

    fetchTopBlogs();
  }, []);

  if (!session) return <p>You must be logged in to see your blogs.</p>;

  return (
    <>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {top.map((blog) => (
            <div key={blog.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-bold">{blog.title}</h2>
              <p>{blog.content.slice(0, 100)}...</p>
              <p className="mt-2 font-semibold">👍 {blog.likes} Likes</p>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">My Blogs</h1>
        {blogs.length === 0 ? (
          <p>
            No blogs yet.{" "}
            <Link to="/write" className="text-blue-600">
              Write one
            </Link>
            !
          </p>
        ) : (
          <ul className="space-y-4">
            {blogs.map((blog) => (
              <li key={blog.id} className="border p-4 rounded-lg shadow">
                <Link
                  to={`/blog/${blog.id}`}
                  className="text-xl font-semibold text-blue-600"
                >
                  {blog.title}
                </Link>
                <p className="text-gray-700 truncate">{blog.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
