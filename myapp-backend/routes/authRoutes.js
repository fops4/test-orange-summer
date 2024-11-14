const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Import du contrôleur

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour la connexion
router.post('/login', authController.login);

// Route pour la réinitialisation de mot de passe
router.post('/reset-password', authController.resetPassword);

module.exports = router;
