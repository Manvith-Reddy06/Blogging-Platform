import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function BlogDetail() {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [blog, setBlog] = useState(null);

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
  async function likeBlog(blogId) {
    const { data, error } = await supabase
      .from("blogs")
      .update({ likes: blog.likes + 1 })
      .eq("id", blogId);

    if (error) {
      console.error("Error liking blog:", error);
      return null;
    }
    console.log("Blog liked:", blog.likes);
    return data;
  }

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <button
        onClick={() => {
          setLiked(!liked);
          likeBlog(blog.id);
        //   console.log("Liked:", liked);
        }}
        className={`px-4 py-2 rounded ${
          liked ? "bg-red-500 text-black" : "bg-gray-200 text-black"
        }`}
      >
        {liked ? "❤️ Liked" : "🤍 Like"}
      </button>
      <p className="text-gray-600 mb-2">by {blog.author_email}</p>
      <p className="whitespace-pre-line">{blog.content}</p>
    </div>
  );
}
