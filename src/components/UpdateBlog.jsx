import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateBlog({ session }) {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("title, content, user_id")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching blog for update:", error);
        navigate("/my-blogs"); 
      } else {
        if (session && data.user_id === session.user.id) {
          setTitle(data.title);
          setContent(data.content);
        } else {
          alert("You are not authorized to edit this blog.");
          navigate("/my-blogs");
        }
        setLoading(false);
      }
    };

    if (session) {
      fetchBlog();
    }
  }, [id, session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert("You must be logged in to update a blog!");
      return;
    }

    const { data, error } = await supabase
      .from("blogs")
      .update({ title, content })
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);
      alert("Error updating blog");
    } else {
      console.log("Blog updated:", data);
      navigate(`/blog/${id}`);
    }
  };

  if (loading) {
    return <p>Loading blog for editing...</p>;
  }

  return (
    <div className="container bg-gray-100 min-w-screen flex justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Update Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Blog Title" className="w-full p-3 border rounded-lg" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Write your blog content here..." className="w-full p-3 border rounded-lg h-60" value={content} onChange={(e) => setContent(e.target.value)} required />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Update
        </button>
      </form>
    </div>
  );
}