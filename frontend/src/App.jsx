import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5051/api/todos";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch todos from the backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;

    const todo = { id: Date.now().toString(), text: newTodo };
    try {
      const response = await axios.post(API_URL, todo);
      setTodos((prevTodos) => [...prevTodos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const startEditTodo = (id, currentText) => {
    setEditTodoId(id);
    setEditText(currentText);
  };

  const updateTodo = async () => {
    if (!editText.trim()) return;

    try {
      const response = await axios.put(`${API_URL}/${editTodoId}`, { text: editText });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === editTodoId ? { ...todo, text: response.data.text } : todo
        )
      );
      setEditTodoId(null);
      setEditText("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  return (
    <div className="todo-app">
      <h1>Todo App</h1>
      <div className="todo-input">
        <input
          type="text"
          value={newTodo}
          placeholder="Add a new todo"
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            {editTodoId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={updateTodo}>Save</button>
              </>
            ) : (
              <>
                {todo.text}
                <button onClick={() => startEditTodo(todo.id, todo.text)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
