import React, { useEffect, useState } from "react";
import { getCatalogItems } from "../services/ApiService";
import { CatalogItem } from "../types";
import CatalogItemCard from "./CatalogItemCard";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const CatalogView: React.FC = () => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <h2 className="text-2xl font-semibold mb-4">Catalog Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <CatalogItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CatalogView;
