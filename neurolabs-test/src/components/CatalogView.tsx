import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCatalogItems } from "../services/ApiService";
import { CatalogItem } from "../types";
import CatalogItemCard from "./CatalogItemCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const CatalogView: React.FC = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getCatalogItems();
        setItems(data);
      } catch (err) {
        setError("Failed to fetch catalog items");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="p-4 border rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold mb-4">Catalog Items</h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Back
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <CatalogItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CatalogView;
