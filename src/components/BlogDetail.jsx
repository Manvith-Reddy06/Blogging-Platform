import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function BlogDetail() {
  const { id } = useParams(); 
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

  if (!blog) return <p>Loading blog...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-600 mb-2">by {blog.author_email}</p>
      <p className="whitespace-pre-line">{blog.content}</p>
    </div>
  );
}
