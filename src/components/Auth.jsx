import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function Auth() {
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

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div>
      {session ? (
        <>
          <h2>Logged in as {session.user.email}</h2>
          <button onClick={signOut}>Logout</button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Login with Google</button>
      )}
    </div>
  );
}

// export default Auth;
