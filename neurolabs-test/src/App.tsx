import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
              <h1 className="text-4xl font-bold text-white animate-fade-in mb-12">
                Neurolabs Technical Test
              </h1>
              <Link to="/home">
                <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
                  Start the Demo
                </button>
              </Link>
            </div>
          }
        />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
