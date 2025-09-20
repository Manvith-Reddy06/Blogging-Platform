import React, { useState, useEffect } from "react";
import Header from "./components/Header";
// import Auth from "./components/Auth";
import { supabase } from "./supabaseClient";

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
    <div className="flex flex-col min-h-screen">
      <Header session={session} />
      <div className="container mx-auto px-4 pt-24 pb-6">
        <h1>Blogging Platform</h1>
        
      </div>
    </div>
  );
}

export default App;
