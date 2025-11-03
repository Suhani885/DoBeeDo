import { useState } from "react";

const TodoItem = ({ todo, onToggle, onEdit, onDelete, onRestore, isTrash }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.task);

  const handleEdit = () => {
    if (editText.trim() && editText !== todo.task) {
      onEdit(todo._id, editText);
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {!isTrash && (
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo._id)}
            className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
          />
        )}

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEdit();
              if (e.key === "Escape") {
                setEditText(todo.task);
                setIsEditing(false);
              }
            }}
            className="flex-1 px-2 py-1 border border-pink-300 rounded focus:outline-none focus:border-pink-500"
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 ${
              todo.completed ? "line-through text-gray-400" : "text-gray-700"
            }`}
            onDoubleClick={() => !isTrash && setIsEditing(true)}
          >
            {todo.task}
          </span>
        )}

        <div className="flex gap-2">
          {isTrash ? (
            <>
              <button
                onClick={() => onRestore(todo._id)}
                className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded hover:bg-green-200"
              >
                Restore
              </button>
              <button
                onClick={() => onDelete(todo._id)}
                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => onDelete(todo._id)}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
