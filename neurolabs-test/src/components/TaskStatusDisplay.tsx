import React from "react";
import { TaskStatus } from "../types";

interface Props {
  status: TaskStatus;
}

const TaskStatusDisplay: React.FC<Props> = ({ status }) => {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium">Status: {status.status}</p>
      {status.result && (
        <div className="mt-2">
          <h3 className="text-lg font-medium">Recognized Items:</h3>
          <ul className="list-disc pl-5">
            {status.result.recognized_items.map((item, index) => (
              <li key={index} className="text-sm">
                Item ID: {item.item_id}, Confidence:{" "}
                {(item.confidence * 100).toFixed(2)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskStatusDisplay;
