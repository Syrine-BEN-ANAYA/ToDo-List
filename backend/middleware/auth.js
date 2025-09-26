import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Accès non autorisé. Veuillez vous connecter.'
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        message: "L'utilisateur associé à ce token n'existe plus."
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token invalide.'
    });
  }
};