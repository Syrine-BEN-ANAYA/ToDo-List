import express from 'express';
import Note from '../models/Note.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(protect);

// GET toutes les notes de l'utilisateur connecté
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST nouvelle note
router.post('/', async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title,
      content: req.body.content || '',
      user: req.user._id
    });

    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT modifier une note
router.put('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });

    if (req.body.title !== undefined) note.title = req.body.title;
    if (req.body.content !== undefined) note.content = req.body.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE supprimer une note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note non trouvée' });

    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: 'Note supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
