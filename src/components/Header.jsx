import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link, useLocation } from "react-router-dom";

const signInWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({ provider: "google" });
};

const signOut = async () => {
  await supabase.auth.signOut();
};

function Header({ session }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  console.log("Session in Header:", session); // Add this for debugging

  const avatarUrl =
    session?.user?.user_metadata?.avatar_url ||
    session?.user?.user_metadata?.picture;
  console.log("Avatar URL in Header:", avatarUrl); 

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handlePopularClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      document.getElementById("popular-blogs")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        document.getElementById("popular-blogs")?.scrollIntoView({ behavior: "smooth" });
      }, 100); // Delay to allow navigation to complete
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Optional: clear search bar after submit
    }
  };

  return (
    <header className="shadow-lg fixed top-0 left-0 w-full z-50 bg-white">
      <div className="w-full px-8 py-4 flex justify-between items-center">
        
        <div className="flex items-center">
          <img src="/writing.png" alt="Blog Platform Logo" className="h-8" />
        </div>
        
        <nav>
          <ul className="flex space-x-10">
            <li>
              <Link
                to="/"
                className="text-gray-800 hover:text-black transition-colors font-medium"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="/#popular-blogs"
                onClick={handlePopularClick}
                className="text-gray-800 hover:text-black transition-colors font-medium"
              >
                Popular
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
          <form onSubmit={handleSearchSubmit} className="hidden md:block">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="       Search blogs..."
                className="w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              />
              <button type="submit" className="absolute left-0 top-0 h-full px-3 text-gray-500 hover:text-gray-900">
                <svg className="w-4 h-4 pr-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
              </button>
            </div>
          </form>
          <button className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors shadow-md" onClick={()=>navigate('/write')}>
            Write
          </button>
          {session ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                title="User menu"
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
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-blogs"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Blogs
                  </Link>
                  <Link
                    to="/bookmarked-blogs"
                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Bookmarked Blogs
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-black hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={signInWithGoogle} className="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-md font-medium transition-colors shadow-md">Login</button>
          )}
        </div>
      </div>
    </header>   
  );
}

export default Header;
