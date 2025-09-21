import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";

export default function BookmarkedBlogs({ session }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    const fetchBookmarkedBlogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookmarks")
        .select(`
          blog_id,
          blogs ( id, title, content, created_at, author_email )
        `)
        .eq("user_id", session.user.id);

      if (error) {
        console.error("Error fetching bookmarked blogs:", error);
      } else {
        const bookmarkedBlogs = data.map(item => item.blogs).filter(Boolean);
        setBlogs(bookmarkedBlogs);
      }
      setLoading(false);
    };

    fetchBookmarkedBlogs();
  }, [session]);

  if (!session) return <p>Please log in to see your bookmarked blogs.</p>;
  if (loading) return <p>Loading your bookmarked blogs...</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-w-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Bookmarked Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't bookmarked any blogs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="border p-6 rounded-lg shadow-lg bg-white">
              <Link to={`/blog/${blog.id}`}>
                <h2 className="text-2xl font-bold hover:text-blue-600 transition-colors truncate">{blog.title}</h2>
              </Link>
              <p className="text-gray-600 mt-2 text-sm">{new Date(blog.created_at).toLocaleDateString()}</p>
              <p className="text-gray-700 mt-4 truncate-3-lines">{blog.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}