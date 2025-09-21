import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Comments from "./Comments";

export default function BlogDetail({ session }) {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [blog, setBlog] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching blog:", error);
      } else {
        setBlog(data);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!session || !blog) return;
    const checkBookmark = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("blog_id", blog.id)
        .single();

      if (data) {
        setIsBookmarked(true);
        setBookmarkId(data.id);
      } else {
        setIsBookmarked(false);
        setBookmarkId(null);
      }
    };
    checkBookmark();
  }, [session, blog]);

  async function likeBlog(blogId) {
    if (liked) return; // Prevent multiple likes in one session

    const currentLikes = blog.likes || 0;
    const { data: updatedBlog, error } = await supabase
      .from("blogs")
      .update({ likes: currentLikes + 1 })
      .eq("id", blogId)
      .select()
      .single();

    if (error) {
      console.error("Error liking blog:", error);
    } else {
      setBlog(updatedBlog);
      setLiked(true);
    }
  }

  const toggleBookmark = async () => {
    if (!session) {
      alert("You need to be logged in to bookmark a blog.");
      return;
    }

    if (isBookmarked) {
      // Delete bookmark
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("id", bookmarkId);
      if (error) {
        console.error("Error removing bookmark:", error);
      } else {
        setIsBookmarked(false);
        setBookmarkId(null);
      }
    } else {
      // Add bookmark
      const { data, error } = await supabase
        .from("bookmarks")
        .insert({ user_id: session.user.id, blog_id: blog.id })
        .select("id")
        .single();

      if (error) {
        console.error("Error adding bookmark:", error);
      } else {
        setIsBookmarked(true);
        setBookmarkId(data.id);
      }
    }
  };

  if (!blog) return <p>Loading blog...</p>;

  return (
   <div className="min-w-screen bg-gray-100 flex justify-center py-10"> {/* ✅ w-full added */}
    <div className="max-w-4xl  p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className=" space-x-4 mb-4">
          <button
            onClick={() => likeBlog(blog.id)}
            className={`px-4 py-2 rounded ${
              liked ? "bg-red-500 text-black" : "bg-gray-200 text-black"
            }`}
            disabled={liked}
          >
            {liked ? "❤️ Liked" : "🤍 Like"} ({blog.likes || 0})
          </button>
          {session && (
            <button
              onClick={toggleBookmark}
              className={`px-4 py-2 rounded ${
                isBookmarked
                  ? "bg-blue-500 text-black"
                  : "bg-gray-200 text-black"
              }`}
            >
              {isBookmarked ? "🔖 Bookmarked" : "🔖 Bookmark"}
            </button>
          )}
        </div>
        <p className="text-gray-600 mb-2">by {blog.author_email}</p>
        <p className="whitespace-pre-line">{blog.content}</p>
        <Comments blogId={id} session={session} />
      </div>
    </div>
  );
}
