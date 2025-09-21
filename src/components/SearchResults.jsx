import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const query = searchParams.get("q");

  useEffect(() => {
    if (!query) {
      setBlogs([]);
      setLoading(false);
      return;
    }

    const fetchBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .ilike("title", `%${query}%`); // Case-insensitive search

      if (error) {
        console.error("Error searching blogs:", error);
        setBlogs([]);
      } else {
        setBlogs(data);
      }
      setLoading(false);
    };

    fetchBlogs();
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Searching for blogs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Search Results for "{query}"
      </h1>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">
          No blogs found matching your search.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="border p-6 rounded-lg shadow-lg bg-white flex flex-col justify-between">
              <Link to={`/blog/${blog.id}`}><h2 className="text-xl font-bold hover:text-blue-600 transition-colors truncate">{blog.title}</h2></Link>
              <p className="text-gray-600 mt-2 text-sm">by {blog.author_email}</p>
              <p className="text-gray-700 mt-4 truncate-3-lines">{blog.content}</p>
              <p className="mt-4 font-semibold text-red-500">❤️ {blog.likes || 0} Likes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}