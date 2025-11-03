import { useState } from "react";

const AddTodo = ({ onAdd }) => {
  const [task, setTask] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setIsAdding(true);
    await onAdd(task);
    setTask("");
    setIsAdding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-lg border border-pink-200 focus:outline-none focus:border-pink-400"
          disabled={isAdding}
        />
        <button
          type="submit"
          disabled={isAdding || !task.trim()}
          className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAdding ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
};
export default AddTodo;
