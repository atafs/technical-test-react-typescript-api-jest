import React from "react";
import { CatalogItem } from "../types";

interface Props {
  item: CatalogItem;
}

const CatalogItemCard: React.FC<Props> = ({ item }) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "READY":
        return { border: "border-green-500", text: "text-green-500" };
      case "PROCESSING":
        return {
          border: "border-red-500 border-4",
          text: "text-red-500 bg-red-100 px-2 py-1 rounded",
        };
      default:
        return { border: "border-gray-300", text: "text-gray-600" };
    }
  };

  const { border, text } = getStatusStyles(item.status);

  return (
    <div
      className={`p-4 border rounded bg-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${border}`}
    >
      <img
        src={item.thumbnail_url}
        alt={item.name}
        className="w-full h-32 object-cover mb-2 rounded"
      />
      <h3
        className="text-lg font-medium text-gray-800 w-full truncate"
        title={item.name} // Tooltip for full name on hover
      >
        {item.name}
      </h3>
      <p className={`text-sm font-semibold ${text}`}>Status: {item.status}</p>
      {item.barcode && (
        <p className="text-sm text-gray-600">Barcode: {item.barcode}</p>
      )}
      {item.brand && (
        <p className="text-sm text-gray-600">Brand: {item.brand}</p>
      )}
      {/* Commented out fields not in API response */}
      {/* {item.description && (
        <p className="text-sm text-gray-600">Description: {item.description}</p>
      )}
      {item.category && (
        <p className="text-sm text-gray-600">Category: {item.category}</p>
      )}
      {item.metadata?.brand && (
        <p className="text-sm text-gray-600">Brand: {item.metadata.brand}</p>
      )}
      {item.image_count !== undefined && (
        <p className="text-sm text-gray-600">Images: {item.image_count}</p>
      )} */}
    </div>
  );
};

export default CatalogItemCard;
