import React from "react";
import { supabase } from "../supabaseClient";

const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({ provider: "google" });
};

const signOut = async () => {
  await supabase.auth.signOut();
};

function Header({ session }) {
  console.log("Session in Header:", session); // Add this for debugging

  const avatarUrl =
    session?.user?.user_metadata?.avatar_url ||
    session?.user?.user_metadata?.picture;
  console.log("Avatar URL in Header:", avatarUrl); 
  return (
    <header className="shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="w-full px-8 py-4 flex justify-between items-center">
        
        <div className="flex items-center">
          <img src="/writing.png" alt="Blog Platform Logo" className="h-8" />
        </div>
        
        <nav>
          <ul className="flex space-x-10">
            <li>
              <a
                href="#home"
                className="text-gray-800 hover:text-black transition-colors font-medium"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-gray-800 hover:text-black transition-colors font-medium"
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-gray-800 hover:text-black transition-colors font-medium"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors shadow-md">
            Write
          </button>
          {session ? (
            <button
              onClick={signOut}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Logout"
            >
              {avatarUrl ? (
                <img
                  className="w-10 h-10 rounded-full"
                  src={avatarUrl}
                  alt={session.user?.user_metadata?.full_name || "User avatar"}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold shadow">
                  {session.user?.email?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </button>
          ) : (
            <button onClick={signInWithGoogle} className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors shadow-md">Login</button>
          )}
        </div>
      </div>
    </header>   
  );
}

export default Header;
