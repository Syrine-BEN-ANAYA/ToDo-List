import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes sont protégées
router.use(protect);

// GET toutes les tâches de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST nouvelle tâche
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      completed: req.body.completed || false,
      user: req.user._id
    });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Les autres routes (PUT, DELETE) restent similaires mais avec vérification de l'utilisateur
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    if (req.body.title !== undefined) task.title = req.body.title;
    if (req.body.completed !== undefined) task.completed = req.body.completed;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Tâche non trouvée' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;