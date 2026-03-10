import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import FilterButtons from "./components/FilterButtons";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(text, priority) {
    const taskExists = tasks.some(
      (task) => task.text.toLowerCase() === text.toLowerCase(),
    );

    if (taskExists) {
      alert("Essa tarefa já existe.");
      return;
    }

    const newTask = {
      id: Date.now(),
      text,
      priority,
      completed: false,
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  }

  function deleteTask(taskId) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta tarefa?",
    );

    if (!confirmDelete) return;

    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  }

  function toggleTask(taskId) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );

    setTasks(updatedTasks);
  }

  function editTask(taskId, newText) {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, text: newText } : task,
    );

    setTasks(updatedTasks);
  }

  function clearCompletedTasks() {
    const completedTasks = tasks.some((task) => task.completed);

    if (!completedTasks) {
      alert("Não há tarefas concluídas para remover.");
      return;
    }

    const confirmClear = window.confirm(
      "Deseja remover todas as tarefas concluídas?",
    );

    if (!confirmClear) return;

    const updatedTasks = tasks.filter((task) => !task.completed);
    setTasks(updatedTasks);
  }

  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter((task) => task.text.toLowerCase().includes(search.toLowerCase()));

  const pendingTasksCount = tasks.filter((task) => !task.completed).length;
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const totalTasksCount = tasks.length;

  return (
    <div className="app">
      <div className="todo-container">
        <header className="header">
          <p className="tag">React Project</p>
          <h1>TaskFlow</h1>
          <p className="subtitle">
            Organize suas tarefas de forma simples, bonita e eficiente.
          </p>
        </header>

        <TodoForm onAddTask={addTask} />

        <div className="summary">
          <div className="summary-card">
            <span>Total</span>
            <strong>{totalTasksCount}</strong>
          </div>

          <div className="summary-card">
            <span>Pendentes</span>
            <strong>{pendingTasksCount}</strong>
          </div>

          <div className="summary-card">
            <span>Concluídas</span>
            <strong>{completedTasksCount}</strong>
          </div>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar tarefa..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="top-bar">
          <FilterButtons filter={filter} setFilter={setFilter} />
          <button className="clear-button" onClick={clearCompletedTasks}>
            Limpar concluídas
          </button>
        </div>

        <TodoList
          tasks={filteredTasks}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          onEditTask={editTask}
        />
      </div>
    </div>
  );
}

export default App;
