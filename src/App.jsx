import React, { useState, useEffect } from "react";
import Header from "./components/Header";
// import Auth from "./components/Auth";
import { supabase } from "./supabaseClient";
// import Home from "./Home";
import WriteBlog from "./components/WriteBlog";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyBlogs from "./components/MyBlogs";
import BlogDetail from "./components/BlogDetail";
import Profile from "./components/Profile";
import UpdateBlog from "./components/UpdateBlog";
import BookmarkedBlogs from "./components/BookmarkedBlogs";
import HomePage from "./components/HomePage";
import SearchResults from "./components/SearchResults";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
    <BrowserRouter>
      <Header session={session} />
      {/* <MyBlogs session={session}/> */}
      <main className="pt-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/write" element={<WriteBlog session={session} />} />
          <Route path="/blog/:id" element={<BlogDetail session={session} />} />
          <Route path="/my-blogs" element={<MyBlogs session={session} />} />
          <Route path="/profile" element={<Profile session={session} />} />
          <Route path="/edit-blog/:id" element={<UpdateBlog session={session} />} />
          <Route path="/bookmarked-blogs" element={<BookmarkedBlogs session={session} />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </main>
    </BrowserRouter>
    </>
  );
}

export default App;
