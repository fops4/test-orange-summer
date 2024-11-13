const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const app = express();
const cors = require('cors');
const port = 3000;

// Configurer CORS pour accepter les requêtes de votre frontend
// Middleware CORS avec options spécifiques (si nécessaire)
app.use(cors());
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
    console.error('Erreur de connexion à la base de données:', err); // Ajoutez un log pour les erreurs
    throw err; // Lancer l'erreur si la connexion échoue
  }
  console.log('Connecté à la base de données MySQL');
});


// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Route d'inscription
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
  
    // Validation des données
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
  
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("Tentative d'inscription de l'utilisateur :", { name, email, hashedPassword });
  
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Email déjà utilisé' });
        }
        console.error('Erreur lors de l\'insertion dans la base de données:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
    });
  });

// Route de connexion
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    res.status(200).json({ message: 'Connecté avec succès' });
  });
});

// Route de réinitialisation du mot de passe
app.post('/reset-password', (req, res) => {
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
