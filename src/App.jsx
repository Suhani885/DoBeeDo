import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Todo from "./pages/Todo.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </>
  );
}

export default App;
