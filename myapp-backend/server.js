require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Configuration des middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Route d'accueil
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend de Horizon Sans Fin');
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
