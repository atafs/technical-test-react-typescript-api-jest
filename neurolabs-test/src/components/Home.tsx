import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <p className="text-xl text-black mb-8 animate-fade-in">
        The demo is starting soon...
      </p>
      <Link to="/">
        <button className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-lg shadow-md hover:bg-yellow-800 transition-colors duration-300">
          Back
        </button>
      </Link>
    </div>
  );
};

export default Home;
