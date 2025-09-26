import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks.js';
import noteRoutes from './routes/notes.js';
import authRoutes from './routes/auth.js'; // Ajouter cette ligne

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes publiques
app.use('/api/auth', authRoutes);

// Routes protégées
app.use('/api/tasks', taskRoutes);
app.use('/api/notes', noteRoutes);

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'API MERN Todo & Notes fonctionne!' });
});

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/merntodo')
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch((error) => console.error('❌ Erreur de connexion MongoDB:', error));

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});