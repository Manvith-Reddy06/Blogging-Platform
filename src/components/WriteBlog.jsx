import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { model } from "../gemini";

export default function WriteBlog({ session }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleAiSuggest = async () => {
    if (!title.trim()) {
      alert("Please enter a title before using AI suggestions.");
      return;
    }
    setIsSuggesting(true);
    setAiError(null);
    setAiSuggestions([]);

    try {
      const prompt = `You are an expert copywriter. Based on the following blog title, generate 5 alternative, more engaging and SEO-friendly titles. Return them as a JSON array of strings.

      Original Title: "${title}"

      JSON Array:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const cleanedText = text.replace(/```json|```/g, "").trim();
      const suggestions = JSON.parse(cleanedText);
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error with Gemini API:", error);
      setAiError("Sorry, something went wrong while getting suggestions.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      navigate(`/blog/${data[0].id}`);
    }
  };

  return (
    <div className="min-h-screen flex justify-center  min-w-screen bg-gray-50 p-6">
      <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Write a Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title input */}
          <div className="space-y-2">
            <label htmlFor="title" className="font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Your awesome blog title"
              className="w-full p-3 border rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Suggest Titles button BELOW input */}
            <button
              type="button"
              onClick={handleAiSuggest}
              className="mt-2 w-full bg-purple-600 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition disabled:bg-gray-400"
              disabled={isSuggesting}
            >
              {isSuggesting ? "Thinking..." : "✨ Suggest Titles"}
            </button>
          </div>

          {/* AI Suggestions */}
          {aiError && <p className="text-red-500">{aiError}</p>}
          {aiSuggestions.length > 0 && (
            <div className="p-4 border rounded-lg bg-gray-50 animate-fade-in">
              <h3 className="font-semibold mb-2 text-gray-800">
                AI Suggestions:
              </h3>
              <ul className="space-y-2">
                {aiSuggestions.map((suggestion, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      onClick={() => {
                        setTitle(suggestion);
                        setAiSuggestions([]);
                      }}
                      className="w-full text-left p-2 rounded text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Content */}
          <textarea
            placeholder="Write your blog content here..."
            className="w-full p-3 border rounded-lg h-60"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 shadow-lg text-black px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Publish
          </button>
        </form>
      </div>
    </div>
  );
}
