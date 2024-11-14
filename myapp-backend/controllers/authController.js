const bcrypt = require('bcrypt');
const db = require('../config/db'); // Import de la connexion à la base de données
const { createToken } = require('../routes/authMiddleware');

// Contrôleur d'inscription
exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Tous les champs sont requis' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        res.status(201).json({ message: 'Utilisateur inscrit avec succès' });
    });
};

// Contrôleur de connexion
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    db.query(sql, [email], (err, results) => {
        if (err || results.length === 0 || !bcrypt.compareSync(password, results[0].password)) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
        }

        // Récupération des informations utilisateur
        const user = results[0];
        console.log("Informations utilisateur récupérées :", user); // Affichage des informations utilisateur dans la console

        // Création du token après vérification réussie
        const token = createToken({
            login: email,
            role: 'user',  // ou autre rôle selon votre application
            id: user.id,  // ajoutez l'ID utilisateur pour le payload du token
        });

        // Affichage du token dans la console
        console.log("Token généré :", token);

        // Renvoi du token dans la réponse
        res.status(200).json({ 
            message: 'Connecté avec succès',
            token: token,
            user: { id: user.id, name: user.name, email: email } // informations utilisateur
        });
    });
};

// Contrôleur de réinitialisation de mot de passe
exports.resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const sql = 'UPDATE users SET password = ? WHERE email = ?';
    db.query(sql, [hashedPassword, email], (err, result) => {
        if (err || result.affectedRows === 0) return res.status(500).json({ error: 'Erreur serveur' });
        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    });
};
