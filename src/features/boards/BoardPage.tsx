import { useEffect, useMemo, useState, type DragEvent, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useTaskStore } from "../../store/taskStore";
import type { Task, TaskStatus } from "../tasks/types";
import "./BoardPage.css";

const COLUMNS: { status: TaskStatus; title: string }[] = [
  { status: "TODO", title: "To Do" },
  { status: "IN_PROGRESS", title: "In Progress" },
  { status: "DONE", title: "Done" },
];

export default function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { tasks, loading, error, fetchTasks, addTask, updateTask, removeTask } =
    useTaskStore();

  const [newTitle, setNewTitle] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<TaskStatus | null>(null);

  useEffect(() => {
    if (projectId) fetchTasks(projectId);
  }, [projectId, fetchTasks]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      TODO: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    for (const task of tasks) {
      grouped[task.status]?.push(task);
    }
    for (const status of Object.keys(grouped) as TaskStatus[]) {
      grouped[status].sort((a, b) => a.position - b.position);
    }
    return grouped;
  }, [tasks]);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || !projectId) return;
    await addTask(projectId, {
      title,
      status: "TODO",
      priority: "MEDIUM",
      position: tasksByStatus.TODO.length,
    });
    setNewTitle("");
  };

  const handleDrop = (e: DragEvent, status: TaskStatus) => {
    e.preventDefault();
    setOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain") || draggedId;
    setDraggedId(null);
    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === status) return;
    updateTask(task.id, { status, position: tasksByStatus[status].length });
  };

  if (!projectId) return <p className="board-message">No project selected.</p>;

  return (
    <div className="board-page">
      <header className="board-header">
        <h1>Board</h1>
        <form className="board-add-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="New task title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button type="submit" disabled={!newTitle.trim()}>
            Add task
          </button>
        </form>
      </header>

      {error && <p className="board-message board-error">{error}</p>}
      {loading && tasks.length === 0 && (
        <p className="board-message">Loading tasks…</p>
      )}

      <div className="board-columns">
        {COLUMNS.map((column) => {
          const columnTasks = tasksByStatus[column.status];
          return (
            <section
              key={column.status}
              className={`board-column${overColumn === column.status ? " is-over" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setOverColumn(column.status);
              }}
              onDragLeave={() => setOverColumn(null)}
              onDrop={(e) => handleDrop(e, column.status)}
            >
              <h2 className="board-column-title">
                {column.title}
                <span className="board-column-count">{columnTasks.length}</span>
              </h2>

              <div className="board-column-tasks">
                {columnTasks.length === 0 && (
                  <p className="board-empty">No tasks</p>
                )}
                {columnTasks.map((task) => (
                  <article
                    key={task.id}
                    className={`task-card${draggedId === task.id ? " is-dragging" : ""}`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", task.id);
                      setDraggedId(task.id);
                    }}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    <div className="task-card-header">
                      <h3>{task.title}</h3>
                      <button
                        className="task-delete"
                        aria-label={`Delete ${task.title}`}
                        onClick={() => removeTask(task.id)}
                      >
                        ×
                      </button>
                    </div>
                    {task.description && <p>{task.description}</p>}
                    <div className="task-card-meta">
                      <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      {task.dueDate && (
                        <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    <select
                      className="task-status-select"
                      aria-label="Change status"
                      value={task.status}
                      onChange={(e) =>
                        updateTask(task.id, { status: e.target.value as TaskStatus })
                      }
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.status} value={c.status}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
