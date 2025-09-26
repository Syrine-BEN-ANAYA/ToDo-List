import { useState, useEffect } from "react";
import axios from "axios";

function Agenda() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks");
      setTasks(res.data);
      setError("");
    } catch {
      setError("Impossible de charger les tâches");
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/tasks", { title });
      setTasks([...tasks, res.data]);
      setTitle("");
      setError("");
    } catch (err) {
      setError("Impossible d'ajouter la tâche");
    }
  };

  const toggleTask = async (id, completed) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, { completed: !completed });
      setTasks(tasks.map(task => (task._id === id ? res.data : task)));
      setError("");
    } catch (err) {
      setError("Impossible de mettre à jour la tâche");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      setError("");
    } catch (err) {
      setError("Impossible de supprimer la tâche");
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🌸 Mon Agenda Personnel 🌸</h1>
        <p style={styles.subtitle}>Organisez votre journée avec élégance</p>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.addSection}>
        <div style={styles.inputContainer}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="✏️ Ajouter une nouvelle tâche..."
            onKeyPress={e => e.key === "Enter" && addTask()}
            style={styles.input}
          />
          <button onClick={addTask} style={styles.addButton}>
            ➕ Ajouter
          </button>
        </div>
      </div>

      <div style={styles.filterSection}>
        <h3 style={styles.filterTitle}>Filtrer les tâches :</h3>
        <div style={styles.filterButtons}>
          <button 
            onClick={() => setFilter("all")} 
            style={filter === "all" ? styles.filterButtonActive : styles.filterButton}
          >
            📋 Toutes ({tasks.length})
          </button>
          <button 
            onClick={() => setFilter("pending")} 
            style={filter === "pending" ? styles.filterButtonActive : styles.filterButton}
          >
            ⏳ En attente ({tasks.filter(t => !t.completed).length})
          </button>
          <button 
            onClick={() => setFilter("completed")} 
            style={filter === "completed" ? styles.filterButtonActive : styles.filterButton}
          >
            ✅ Terminées ({tasks.filter(t => t.completed).length})
          </button>
        </div>
      </div>

      <div style={styles.tasksSection}>
        <h3 style={styles.tasksTitle}>
          📅 Mes Tâches ({filteredTasks.length})
        </h3>
        <div style={styles.tasksList}>
          {filteredTasks.map(task => (
            <div key={task._id} style={styles.taskCard}>
              <div style={styles.taskContent}>
                <div style={styles.taskLeft}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task._id, task.completed)}
                    style={styles.checkbox}
                  />
                  <div style={styles.taskTextContainer}>
                    <span style={{
                      ...styles.taskText,
                      ...(task.completed && styles.taskCompleted)
                    }}>
                      {task.title}
                    </span>
                    <span style={styles.taskDate}>
                      {new Date(task.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => deleteTask(task._id)} 
                  style={styles.deleteButton}
                  title="Supprimer la tâche"
                >
                  🗑️
                </button>
              </div>
              {task.completed && (
                <div style={styles.completedBadge}>
                  ✅ Complétée le {new Date().toLocaleDateString('fr-FR')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📝</div>
          <p style={styles.emptyText}>
            {tasks.length === 0 
              ? "Commencez par ajouter votre première tâche !" 
              : filter === "completed" 
                ? "Aucune tâche terminée pour le moment" 
                : "Aucune tâche en attente"
            }
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #fff5f5 0%, #f8f4ff 100%)",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(255, 105, 180, 0.2)",
  },
  title: {
    color: "#8a2be2",
    fontSize: "2.5em",
    margin: "0 0 10px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  },
  subtitle: {
    color: "#6a5acd",
    fontSize: "1.1em",
    margin: "0",
    fontStyle: "italic",
  },
  error: {
    background: "#ff6b6b",
    color: "white",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "bold",
  },
  addSection: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px 15px",
    border: "2px solid #e6e6fa",
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  addButton: {
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    transition: "transform 0.2s",
  },
  filterSection: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    marginBottom: "25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  filterTitle: {
    color: "#8a2be2",
    margin: "0 0 15px 0",
    fontSize: "1.1em",
  },
  filterButtons: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  filterButton: {
    background: "#f8f4ff",
    border: "2px solid #e6e6fa",
    padding: "8px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    color: "#8a2be2",
    fontSize: "14px",
    transition: "all 0.3s",
  },
  filterButtonActive: {
    background: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    border: "2px solid #ff9a9e",
    padding: "8px 15px",
    borderRadius: "20px",
    cursor: "pointer",
    color: "white",
    fontSize: "14px",
    fontWeight: "bold",
  },
  tasksSection: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  tasksTitle: {
    color: "#8a2be2",
    margin: "0 0 20px 0",
    fontSize: "1.3em",
  },
  tasksList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  taskCard: {
    background: "#fafafa",
    border: "2px solid #f0f0f0",
    borderRadius: "12px",
    padding: "15px",
    transition: "all 0.3s",
  },
  taskContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  taskTextContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  taskText: {
    fontSize: "16px",
    color: "#333",
    marginBottom: "4px",
  },
  taskCompleted: {
    textDecoration: "line-through",
    color: "#888",
  },
  taskDate: {
    fontSize: "12px",
    color: "#999",
  },
  deleteButton: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "5px",
    transition: "background 0.3s",
  },
  completedBadge: {
    background: "#d4edda",
    color: "#155724",
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "10px",
    display: "inline-block",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#888",
  },
  emptyIcon: {
    fontSize: "3em",
    marginBottom: "10px",
  },
  emptyText: {
    fontSize: "16px",
    margin: "0",
  },
};

export default Agenda;