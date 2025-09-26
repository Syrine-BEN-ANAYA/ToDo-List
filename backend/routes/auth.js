import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Générer un token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà.'
      });
    }

    // Créer le nouvel utilisateur
    const newUser = await User.create({
      username,
      email,
      password
    });

    // Générer le token
    const token = signToken(newUser._id);

    // Retourner la réponse sans le mot de passe
    res.status(201).json({
      message: 'Inscription réussie !',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        theme: newUser.theme
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de l\'inscription.',
      error: error.message
    });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({
        message: 'Veuillez fournir un email et un mot de passe.'
      });
    }

    // Trouver l'utilisateur et inclure le mot de passe
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        message: 'Email ou mot de passe incorrect.'
      });
    }

    // Générer le token
    const token = signToken(user._id);

    res.json({
      message: 'Connexion réussie !',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la connexion.',
      error: error.message
    });
  }
});

// Vérifier le token (pour la persistance de session)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        theme: user.theme
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
});

export default router;