import { useState, useEffect } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes");
      setNotes(res.data);
      setError("");
    } catch {
      setError("Impossible de charger les notes");
    }
  };

  const addNote = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/notes", { 
        title: title.trim(), 
        content: content.trim() 
      });
      setNotes([...notes, res.data]);
      setTitle("");
      setContent("");
      setError("");
    } catch (err) {
      setError("Impossible d'ajouter la note");
    }
  };

  const updateNote = async () => {
    if (!title.trim() || !content.trim()) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/notes/${editingNote._id}`, { 
        title: title.trim(), 
        content: content.trim() 
      });
      setNotes(notes.map(note => note._id === editingNote._id ? res.data : note));
      setEditingNote(null);
      setTitle("");
      setContent("");
      setError("");
    } catch (err) {
      setError("Impossible de modifier la note");
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
      setError("");
    } catch (err) {
      setError("Impossible de supprimer la note");
    }
  };

  const editNote = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📔 Mes Notes Personnelles</h1>
        <p style={styles.subtitle}>Gardez vos idées et réflexions en sécurité</p>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.addSection}>
        <h3 style={styles.sectionTitle}>
          {editingNote ? "✏️ Modifier la note" : "➕ Nouvelle note"}
        </h3>
        <div style={styles.form}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre de la note..."
            style={styles.titleInput}
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Contenu de votre note..."
            rows="6"
            style={styles.contentInput}
          />
          <div style={styles.buttonGroup}>
            {editingNote ? (
              <>
                <button onClick={updateNote} style={styles.saveButton}>
                  💾 Sauvegarder
                </button>
                <button onClick={cancelEdit} style={styles.cancelButton}>
                  ❌ Annuler
                </button>
              </>
            ) : (
              <button onClick={addNote} style={styles.addButton}>
                📝 Ajouter la note
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={styles.notesSection}>
        <h3 style={styles.sectionTitle}>
          📚 Mes Notes ({notes.length})
        </h3>
        <div style={styles.notesGrid}>
          {notes.map(note => (
            <div key={note._id} style={styles.noteCard}>
              <div style={styles.noteHeader}>
                <h4 style={styles.noteTitle}>{note.title}</h4>
                <div style={styles.noteActions}>
                  <button 
                    onClick={() => editNote(note)} 
                    style={styles.editButton}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteNote(note._id)} 
                    style={styles.deleteButton}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div style={styles.noteContent}>
                {note.content.split('\n').map((line, index) => (
                  <p key={index} style={styles.noteParagraph}>
                    {line}
                  </p>
                ))}
              </div>
              <div style={styles.noteFooter}>
                <span style={styles.noteDate}>
                  Créée le {new Date(note.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {notes.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📔</div>
          <p style={styles.emptyText}>Aucune note pour le moment</p>
          <p style={styles.emptySubtext}>Commencez par ajouter votre première note !</p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "linear-gradient(135deg, #fff0f5 0%, #f0f8ff 100%)",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
    background: "linear-gradient(135deg, #d8bfd8 0%, #b0e0e6 100%)",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#6a5acd",
    fontSize: "2.5em",
    margin: "0 0 10px 0",
    textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
  },
  subtitle: {
    color: "#4682b4",
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
  sectionTitle: {
    color: "#6a5acd",
    margin: "0 0 20px 0",
    fontSize: "1.3em",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  titleInput: {
    padding: "12px 15px",
    border: "2px solid #e6e6fa",
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  contentInput: {
    padding: "12px 15px",
    border: "2px solid #e6e6fa",
    borderRadius: "10px",
    fontSize: "16px",
    outline: "none",
    resize: "vertical",
    minHeight: "120px",
    fontFamily: "inherit",
    transition: "border-color 0.3s",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  addButton: {
    background: "linear-gradient(135deg, #d8bfd8 0%, #b0e0e6 100%)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    transition: "transform 0.2s",
  },
  saveButton: {
    background: "linear-gradient(135deg, #32cd32 0%, #228b22 100%)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  cancelButton: {
    background: "linear-gradient(135deg, #ff6b6b 0%, #dc143c 100%)",
    border: "none",
    padding: "12px 20px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  notesSection: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  noteCard: {
    background: "linear-gradient(135deg, #f8f4ff 0%, #f0fff0 100%)",
    border: "2px solid #e6e6fa",
    borderRadius: "12px",
    padding: "20px",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  noteHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "15px",
  },
  noteTitle: {
    color: "#6a5acd",
    margin: "0",
    fontSize: "1.2em",
    fontWeight: "bold",
    flex: 1,
  },
  noteActions: {
    display: "flex",
    gap: "5px",
  },
  editButton: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "5px",
  },
  deleteButton: {
    background: "none",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "5px",
  },
  noteContent: {
    color: "#333",
    lineHeight: "1.5",
    marginBottom: "15px",
  },
  noteParagraph: {
    margin: "0 0 10px 0",
  },
  noteFooter: {
    borderTop: "1px solid #e6e6fa",
    paddingTop: "10px",
  },
  noteDate: {
    fontSize: "12px",
    color: "#888",
    fontStyle: "italic",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#888",
  },
  emptyIcon: {
    fontSize: "4em",
    marginBottom: "15px",
  },
  emptyText: {
    fontSize: "18px",
    margin: "0 0 10px 0",
    fontWeight: "bold",
  },
  emptySubtext: {
    fontSize: "14px",
    margin: "0",
  },
};

export default Notes;