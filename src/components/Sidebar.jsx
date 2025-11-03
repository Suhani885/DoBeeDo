import { CheckCircle, Home, Circle, Trash2, LogOut } from "lucide-react";

const Sidebar = ({
  isOpen,
  onClose,
  activeFilter,
  setActiveFilter,
  onLogout,
}) => {
  const filters = [
    { id: "all", label: "All Tasks", icon: Home },
    { id: "active", label: "Active", icon: Circle },
    { id: "completed", label: "Completed", icon: CheckCircle },
    { id: "trash", label: "Trash", icon: Trash2 },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 object-contain" />
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeFilter === filter.id
                    ? "bg-pink-100 text-pink-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{filter.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
