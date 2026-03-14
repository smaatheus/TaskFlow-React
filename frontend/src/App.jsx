import { useEffect, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import FilterButtons from "./components/FilterButtons";

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("http://localhost:3001/tasks");
        const data = await response.json();

        const formattedTasks = data.map((task) => ({
          id: task.id,
          text: task.title,
          priority: task.priority ?? "Média",
          completed: task.completed,
          createdAt: new Date(task.created_at).toLocaleDateString("pt-BR"),
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    }

    fetchTasks();
  }, []);

  async function addTask(text, priority) {
    const taskExists = tasks.some(
      (task) => task.text.toLowerCase() === text.toLowerCase(),
    );

    if (taskExists) {
      alert("Essa tarefa já existe.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: text,
          description: "",
          priority,
        }),
      });

      const newTaskFromApi = await response.json();

      const formattedTask = {
        id: newTaskFromApi.id,
        text: newTaskFromApi.title,
        priority: newTaskFromApi.priority || "normal",
        completed: newTaskFromApi.completed,
        createdAt: new Date(newTaskFromApi.created_at).toLocaleDateString(
          "pt-BR",
        ),
      };

      setTasks((prevTasks) => [formattedTask, ...prevTasks]);
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
    }
  }

  async function deleteTask(taskId) {
    console.log("deleteTask foi chamada com id:", taskId);
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir esta tarefa?",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: "DELETE",
      });

      const text = await response.text();
      console.log("status delete:", response.status);
      console.log("resposta delete:", text);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${text}`);
      }

      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Não foi possível excluir a tarefa");
    }
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
