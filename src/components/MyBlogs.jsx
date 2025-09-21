import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "../supabaseClient";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";

const BLOGS_PER_PAGE = 6;

export default function MyBlogs({ session }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      setBlogs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const from = page * BLOGS_PER_PAGE;
    const to = from + BLOGS_PER_PAGE - 1;

    supabase
      .from("blogs")
      .select("*", { count: "exact" })
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .range(from, to)
      .then(({ data, error, count }) => {
        if (error) {
          console.error("Error fetching blogs:", error);
        } else {
          setBlogs((prev) => (page === 0 ? data : [...prev, ...data]));
          setHasMore((page * BLOGS_PER_PAGE) + data.length < count);
        }
        setLoading(false);
      });
  }, [page, session]);
  
  useEffect(() => {
    setPage(0);
    setBlogs([]);
    setHasMore(true);
  }, [session]);
  
  const lastBlogElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  
  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      const { error } = await supabase.from("blogs").delete().eq("id", blogId);
  
      if (error) {
        console.error("Error deleting blog:", error);
        alert("Could not delete blog.");
      } else {
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
        alert("Blog deleted successfully.");
      }
    }
  };

  if (!session) return <p>You must be logged in to see your blogs.</p>;

  return (
    <div className="container flex justify-center flex-col p-6 min-w-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">My Blogs</h1>
      {blogs.length === 0 && !loading ? (
        <p className="text-center text-gray-500">
          No blogs yet.{" "}
          <Link to="/write" className="text-blue-600 hover:underline">Write one</Link>!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {blogs.map((blog, index) => {
            const isLastElement = blogs.length === index + 1;
            return (
              <div ref={isLastElement ? lastBlogElementRef : null} key={blog.id} className="border p-6 rounded-lg shadow-lg flex flex-col justify-between bg-white">
                <div>
                  <Link to={`/blog/${blog.id}`}>
                    <h2 className="text-2xl font-bold hover:text-blue-600 transition-colors truncate">{blog.title}</h2>
                  </Link>
                  <p className="text-gray-600 mt-2 text-sm">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mt-4 truncate-3-lines">{blog.content}</p>
                </div>
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <CustomButton onClick={() => navigate(`/edit-blog/${blog.id}`)} variant="warning" className="!px-3 !py-1 !text-sm !bg-black">
                    Update
                  </CustomButton>
                  <CustomButton onClick={() => handleDelete(blog.id)} variant="danger" className="!px-3 !py-1 !text-sm !bg-black">
                    Delete
                  </CustomButton>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {loading && <p className="text-center mt-8">Loading more blogs...</p>}
      {!hasMore && blogs.length > 0 && <p className="text-center mt-8 text-gray-500">You've reached the end!</p>}
    </div>
  );
}
