import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, CheckCircle, Archive } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import AddTodoForm from "../components/AddTodo.jsx";
import TodoItem from "../components/TodoItem.jsx";
import { apiCall } from "../utils/api";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingTodos, setFetchingTodos] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiCall("get", "/auth/login");
        if (res.success) {
          setIsAuthenticated(true);
          fetchTodosByFilter("all");
        } else {
          navigate("/");
        }
      } catch (error) {
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchTodosByFilter = async (filter) => {
    setFetchingTodos(true);
    try {
      let endpoint = "/todos";
      switch (filter) {
        case "active":
          endpoint = "/todos/active";
          break;
        case "completed":
          endpoint = "/todos/completed";
          break;
        case "trash":
          endpoint = "/todos/deleted";
          break;
        default:
          endpoint = "/todos";
      }

      const response = await apiCall("get", endpoint);
      setTodos(response.data?.todos || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    } finally {
      setFetchingTodos(false);
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    fetchTodosByFilter(filter);
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

  const handleAddTodo = async (task) => {
    try {
      const response = await apiCall("post", "/todos", {
        data: { task },
      });
      if (response.data?.todo) {
        fetchTodosByFilter(activeFilter);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggleComplete = async (id) => {
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
        fetchTodosByFilter(activeFilter);
      }
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const handleEditTodo = async (id, newTask) => {
    if (!newTask.trim()) return;

    const todo = todos.find((t) => t._id === id);
    if (!todo) return;

    try {
      const response = await apiCall("put", `/todos/${id}`, {
        data: {
          task: newTask,
          completed: todo.completed,
        },
      });
      if (response.data?.todo) {
        fetchTodosByFilter(activeFilter);
      }
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      if (activeFilter === "trash") {
        await apiCall("delete", `/todos/${id}/permanent`);
      } else {
        await apiCall("delete", `/todos/${id}`);
      }
      fetchTodosByFilter(activeFilter);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleRestoreTodo = async (id) => {
    try {
      await apiCall("patch", `/todos/${id}/restore`);
      fetchTodosByFilter(activeFilter);
    } catch (error) {
      console.error("Error restoring todo:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-200 border-t-pink-500 mx-auto mb-4"></div>
          <p className="text-pink-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-purple-50 to-pink-100">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeFilter={activeFilter}
        setActiveFilter={handleFilterChange}
        onLogout={handleLogout}
      />

      <div className="lg:ml-64 min-h-screen">
        <header className="lg:hidden bg-white border-b border-pink-200 px-4 py-4 shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:bg-pink-50 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 object-contain" />
            </div>
            <div className="w-10"></div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              {activeFilter === "trash"
                ? "Trash"
                : activeFilter === "completed"
                ? "Completed Tasks"
                : activeFilter === "active"
                ? "Active Tasks"
                : "My Tasks"}
            </h1>
            <p className="text-gray-600">
              {activeFilter === "trash"
                ? "Deleted tasks are stored here"
                : `You have ${todos.length} ${
                    activeFilter === "all" ? "" : activeFilter
                  } task${todos.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {activeFilter !== "trash" && <AddTodoForm onAdd={handleAddTodo} />}

          {fetchingTodos ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-200 border-t-pink-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {activeFilter === "trash" ? (
                      <Archive className="w-12 h-12 text-pink-400" />
                    ) : (
                      <CheckCircle className="w-12 h-12 text-pink-400" />
                    )}
                  </div>
                  <p className="text-gray-500 text-lg">
                    {activeFilter === "trash"
                      ? "No deleted tasks"
                      : activeFilter === "completed"
                      ? "No completed tasks yet"
                      : activeFilter === "active"
                      ? "No active tasks"
                      : "No tasks yet! Add one to get started."}
                  </p>
                </div>
              ) : (
                todos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    onToggle={handleToggleComplete}
                    onEdit={handleEditTodo}
                    onDelete={handleDeleteTodo}
                    onRestore={handleRestoreTodo}
                    isTrash={activeFilter === "trash"}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Todo;
