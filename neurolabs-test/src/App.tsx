import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import CatalogView from "./components/CatalogView";
import IRTaskView from "./components/IRTaskView";

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-4">
              <h1 className="text-4xl font-bold text-white animate-fade-in mb-12">
                Image Recognition Pet Project
              </h1>
              <div className="flex flex-col gap-4">
                <Link to="/catalog">
                  <button className="w-48 px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
                    View Catalog
                  </button>
                </Link>
                <Link to="/tasks">
                  <button className="w-48 px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-300">
                    View Tasks
                  </button>
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route path="/catalog" element={<CatalogView />} />
        <Route path="/tasks" element={<IRTaskView />} />
      </Routes>
    </Router>
  );
};

export default App;