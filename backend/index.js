const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let todos = [];

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const todo = req.body;
  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const updatedText = req.body.text;
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex !== -1) {
    todos[todoIndex].text = updatedText;
    res.status(200).json(todos[todoIndex]);
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  todos = todos.filter((todo) => todo.id !== id);
  res.status(200).send();
});

const PORT = 5051;
app.listen(PORT, "0.0.0.0", () => console.log(`Backend running on port ${PORT}`));
