import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function WriteBlog({ session }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(title, content);
    console.log("Session in WriteBlog:", session); // Debugging line
    if (!session) {
      alert("You must be logged in to write a blog!");
      return;
    }

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          content,
          user_id: session.user.id,
          author_email: session.user.email,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      alert("Error creating blog");
    } else {
      console.log("Blog created:", data);
      // Redirect to blog detail page after creation
      navigate(`/blog/${data[0].id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 items-center justify-center space-y-6"> 
      <h1 className="text-2xl font-bold mb-4">Write a Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Blog Title"
          className="w-full p-3 border rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your blog content here..."
          className="w-full p-3 border rounded-lg h-60"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 shadow-lg text-black px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
