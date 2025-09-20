import React, { useState, useEffect } from "react";
import Header from "./components/Header";
// import Auth from "./components/Auth";
import { supabase } from "./supabaseClient";
// import Home from "./Home";
import WriteBlog from "./components/WriteBlog";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MyBlogs from "./components/MyBlogs";
import BlogDetail from "./components/BlogDetail";

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
      <main className="pt-24 px-6">
        <Routes>
          <Route path="/" element={<MyBlogs session={session} />} />
          <Route path="/write" element={<WriteBlog session={session} />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/my-blogs" element={<MyBlogs session={session} />} />
        </Routes>
      </main>
    </BrowserRouter>
    </>
  );
}

export default App;
