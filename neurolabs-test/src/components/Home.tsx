import React from "react";
import { useNavigate } from "react-router-dom";
import CatalogView from "./CatalogView";
import IRTaskView from "./IRTaskView";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Neurolabs Demo</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
          >
            Back
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CatalogView />
          <IRTaskView />
        </div>
      </div>
    </div>
  );
};

export default Home;
