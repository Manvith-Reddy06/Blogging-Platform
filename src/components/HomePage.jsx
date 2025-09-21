import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import CustomButton from "./CustomButton";

function PopularBlogsSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("likes", { ascending: false, nullsFirst: false })
        .limit(6);

      if (error) {
        console.error("Error fetching popular blogs:", error);
      } else {
        setBlogs(data);
      }
      setLoading(false);
    };

    fetchPopularBlogs();
  }, []);

  if (loading) return <div className="text-center p-10"><p>Loading popular blogs...</p></div>;

  return (
    <div id="popular-blogs" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 text-center">
          Popular Blogs
        </h2>
        {blogs.length === 0 ? (
          <p className="text-center mt-4">No blogs found.</p>
        ) : (
          <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">by {blog.author_email}</p>
                    <Link to={`/blog/${blog.id}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900 hover:text-indigo-700 truncate">{blog.title}</p>
                      <p className="mt-3 text-base text-gray-500 truncate-3-lines">{blog.content}</p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <span className="text-red-500">❤️ {blog.likes || 0} Likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 min-w-screen" >
        <div className="bg-black text-white p-12 rounded-lg shadow-2xl text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-4">Unleash Your Voice</h1>
          <p className="text-xl mb-8 text-gray-300">
            Discover a world of stories, ideas, and perspectives. Or, share your
            own. Our platform is a space for writers and readers to connect and
            inspire. Start your journey today.
          </p>
          <button onClick={() => navigate("/write")} className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-transform transform hover:scale-105 shadow-lg custom-button">
            Write Your Own Blog
          </button>
        </div>
      </div>
      <PopularBlogsSection />
    </>
  );
}