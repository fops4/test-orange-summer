const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 3000;
const SECRET_KEY = 'votre_clé_secrète'; // Utilisez une clé secrète plus sécurisée

// Configurer CORS
app.use(cors());
app.use(express.json());

// Configuration de la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // remplacez par votre nom d'utilisateur MySQL
  password: '',      // remplacez par votre mot de passe MySQL
  database: 'myapp'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    throw err;
  }
  console.log('Connecté à la base de données MySQL');
});

// Middleware pour vérifier le token JWT
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "Non autorisé" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide ou expiré" });
    req.user = user;
    next();
  });
}

// Route d'inscription
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email déjà utilisé' });
      }
      console.error('Erreur lors de l\'insertion dans la base de données:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ token, message: 'Utilisateur inscrit avec succès' });
  });
});

// Route de connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Génération du token JWT
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, message: 'Connecté avec succès' });
  });
});

// Route protégée pour récupérer les informations de l'utilisateur connecté
app.get('/api/user', authenticateToken, (req, res) => {
  const sql = 'SELECT id, name, email FROM users WHERE id = ?';
  
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (results.length === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json(results[0]);
  });
});

// Route de réinitialisation du mot de passe
app.post('/api/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  const sql = 'UPDATE users SET password = ? WHERE email = ?';
  db.query(sql, [hashedPassword, email], (err, result) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
