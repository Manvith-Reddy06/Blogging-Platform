import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Comments({ blogId, session }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchComments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("blog_id", blogId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (blogId) {
      fetchComments();
    }
  }, [blogId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from("comments")
      .insert({
        content: newComment,
        blog_id: blogId,
        user_id: session.user.id,
        author_email: session.user.email,
      })
      .select()
      .single();

    if (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment.");
    } else {
      // Add the new comment to the top of the list for immediate UI update
      setComments([data, ...comments]);
      setNewComment("");
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      {session && (
        <form onSubmit={handleSubmitComment} className="mb-8 flex flex-col">
          <textarea className="w-full p-3 border rounded-lg" rows="3" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} required ></textarea>
          <div className="flex justify-end">
            <button type="submit" className="mt-2 px-6 py-2 bg-blue-600 text-black font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition" >
              Post Comment
            </button>
          </div>
        </form>
      )}
      {!session && <p className="mb-8 text-gray-600">You must be logged in to post a comment.</p>}

      <div className="space-y-6">
        {loading ? ( <p>Loading comments...</p> ) : comments.length === 0 ? ( <p>No comments yet. Be the first to comment!</p> ) : (
          comments.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-50 rounded-lg border">
              <p className="font-semibold text-gray-800">{comment.author_email}</p>
              <p className="text-sm text-gray-500 mb-2"> {new Date(comment.created_at).toLocaleString()} </p>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}