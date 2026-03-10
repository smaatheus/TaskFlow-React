import { useState } from "react";

function TodoItem({ task, onDeleteTask, onToggleTask, onEditTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  function handleSaveEdit() {
    if (editedText.trim() === "") return;

    onEditTask(task.id, editedText);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setEditedText(task.text);
    setIsEditing(false);
  }

  function getPriorityClass(priority) {
    if (priority === "Alta") return "high";
    if (priority === "Média") return "medium";
    return "low";
  }

  return (
    <div className={`todo-item ${task.completed ? "completed" : ""}`}>
      <div className="todo-info">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask(task.id)}
        />

        <div className="todo-content">
          {isEditing ? (
            <input
              className="edit-input"
              type="text"
              value={editedText}
              onChange={(event) => setEditedText(event.target.value)}
            />
          ) : (
            <>
              <p className="task-text">{task.text}</p>

              <div className="task-meta">
                <span
                  className={`priority-badge ${getPriorityClass(task.priority)}`}
                >
                  {task.priority}
                </span>
                <span className="task-date">Criada em: {task.createdAt}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="actions">
        {isEditing ? (
          <>
            <button className="save" onClick={handleSaveEdit}>
              Salvar
            </button>
            <button className="cancel" onClick={handleCancelEdit}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <button className="edit" onClick={() => setIsEditing(true)}>
              Editar
            </button>
            <button className="delete" onClick={() => onDeleteTask(task.id)}>
              Excluir
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
