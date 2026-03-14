import { useState } from "react";

function TodoForm({ onAddTask }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Média");

  function handleSubmit(event) {
    event.preventDefault();

    if (text.trim() === "") return;

    onAddTask(text, priority);
    setText("");
    setPriority("Média");
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Digite uma nova tarefa"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />

      <select
        value={priority}
        onChange={(event) => setPriority(event.target.value)}
      >
        <option value="Baixa">Baixa</option>
        <option value="Média">Média</option>
        <option value="Alta">Alta</option>
      </select>

      <button type="submit">Adicionar</button>
    </form>
  );
}

export default TodoForm;
