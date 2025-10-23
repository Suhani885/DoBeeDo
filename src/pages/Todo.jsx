import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utils/api";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiCall("get", "/auth/login");
        if (res.success) {
          setIsAuthenticated(true);
          fetchTodos();
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchTodos = async () => {
    try {
      const response = await apiCall("get", "/todos");
      setTodos(response.data?.todos || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm("Do you really want to logout?")) {
      try {
        await apiCall("post", "/auth/logout");
      } catch (error) {
        console.warn("Logout failed:", error);
      } finally {
        setIsAuthenticated(false);
        navigate("/");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const response = await apiCall("post", "/todos", {
        data: {
          task: inputValue.trim(),
        },
      });
      if (response.data?.todo) {
        setTodos([...todos, response.data.todo]);
        setInputValue("");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiCall("delete", `/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo._id);
    setEditValue(todo.task);
  };

  const handleEdit = async (id) => {
    if (!editValue.trim()) return;

    try {
      const response = await apiCall("put", `/todos/${id}`, {
        data: {
          task: editValue,
        },
      });
      if (response.data?.todo) {
        setTodos(
          todos.map((todo) => (todo._id === id ? response.data.todo : todo))
        );
        setEditingId(null);
        setEditValue("");
      }
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  const toggleComplete = async (id) => {
    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const response = await apiCall("put", `/todos/${id}`, {
        data: {
          task: todo.task,
          completed: !todo.completed,
        },
      });
      if (response.data?.todo) {
        setTodos(todos.map((t) => (t._id === id ? response.data.todo : t)));
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-linear-to-r from-pink-100 via-pink-200 to-pink-300">
        <nav className="bg-white border-gray-200 shadow-sm">
          <div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-pink-600">TodoList</span>
            </div>
          </div>
        </nav>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pb-10 bg-linear-to-r from-pink-100 via-pink-200 to-pink-300">
      <nav className="bg-white border-gray-200 shadow-sm">
        <div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center gap-2">
            <img
              src="src/assets/logo.png"
              alt="Logo"
              className="max-h-10 object-contain"
            />
          </div>

          {isAuthenticated && (
            <div>
              <button
                onClick={handleLogout}
                className="bg-pink-500 flex items-center text-sm text-white px-4 py-2 gap-2 rounded-lg hover:bg-pink-600"
              >
                Logout
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-5"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6q.425 0 .713.288T12 4t-.288.713T11 5H5v14h6q.425 0 .713.288T12 20t-.288.713T11 21zm12.175-8H10q-.425 0-.712-.288T9 12t.288-.712T10 11h7.175L15.3 9.125q-.275-.275-.275-.675t.275-.7t.7-.313t.725.288L20.3 11.3q.3.3.3.7t-.3.7l-3.575 3.575q-.3.3-.712.288t-.713-.313q-.275-.3-.262-.712t.287-.688z"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-2xl mt-10 mx-auto px-4">
        <h1 className="text-4xl font-serif text-pink-600 text-center mb-8">
          My Todo List
        </h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
            placeholder="Add new task..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 flex items-center gap-2"
          >
            Add Task
          </button>
        </form>

        <div className="space-y-3">
          {todos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No todos yet! Add some tasks to get started.
            </div>
          )}

          {todos.map((todo) => (
            <div
              key={todo._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-pink-100 flex flex-wrap items-center gap-3 sm:flex-nowrap"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo._id)}
                className="w-5 h-5 text-pink-500 rounded border-pink-300"
              />
              {editingId === todo._id ? (
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 px-2 py-1 border border-pink-300 rounded"
                />
              ) : (
                <span
                  className={`flex-1 wrap-break-word ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {todo.task}
                </span>
              )}
              <div className="flex gap-2">
                {editingId === todo._id ? (
                  <button
                    onClick={() => handleEdit(todo._id)}
                    className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(todo)}
                    className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(todo._id)}
                  className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Todo;
