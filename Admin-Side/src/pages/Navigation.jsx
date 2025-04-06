import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const storedMode = localStorage.getItem("theme");
    return storedMode === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-purple-600 to-gray-900 text-white shadow-lg flex flex-col">
      <div className="p-8 text-center">
        <h1 className="text-3xl font-extrabold mb-3 tracking-wide">VoteIndia</h1>
        <p className="text-base text-gray-300 font-light">Decentralized Voting System</p>
      </div>
      <nav className="flex-1 mt-10">
        <ul className="space-y-10">
          <li>
            <Link
              to="/Dashboard"
              className="block py-4 px-6 text-lg font-medium text-center rounded-lg hover:bg-purple-700 transition"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/Candidate"
              className="block py-4 px-6 text-lg font-medium text-center rounded-lg hover:bg-purple-700 transition"
            >
              Candidates
            </Link>
          </li>
          <li>
            <Link
              to="/Voter"
              className="block py-4 px-6 text-lg font-medium text-center rounded-lg hover:bg-purple-700 transition"
            >
              Voters
            </Link>
          </li>
          <li>
            <Link
              to="/ElectionCommission"
              className="block py-4 px-6 text-lg font-medium text-center rounded-lg hover:bg-purple-700 transition"
            >
              Election Commission
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-8 border-t border-gray-700 text-center">
        <button
          onClick={toggleTheme}
          className="w-full py-3 px-6 bg-purple-700 text-lg font-semibold rounded-lg hover:bg-purple-600 transition"
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
        <p className="text-base text-gray-300 mt-6 font-light">Secure & Transparent Voting</p>
      </div>
    </div>
  );
};

export default Navigation;