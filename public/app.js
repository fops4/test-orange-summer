const { ipcRenderer } = require('electron');
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const messageDiv = document.getElementById("message");

const loginButton = document.getElementById("loginButton");
const registerButton = document.getElementById("registerButton");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");

const registerLink = document.getElementById("registerLink");
const loginLink = document.getElementById("loginLink");

// Fonction pour gérer la connexion
loginButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    if (!email || !password) {
        messageDiv.textContent = "Tous les champs sont requis!";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = "Connexion réussie!";
            // Gérer le succès de la connexion (par exemple, stockage du token)
        } else {
            messageDiv.textContent = data.error || "Erreur de connexion.";
        }
    } catch (error) {
        messageDiv.textContent = "Erreur serveur. Veuillez réessayer.";
    }
});

// Fonction pour gérer l'inscription
registerButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const name = registerName.value;
    const email = registerEmail.value;
    const password = registerPassword.value;

    if (!name || !email || !password) {
        messageDiv.textContent = "Tous les champs sont requis!";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = "Inscription réussie!";
            // Gérer le succès de l'inscription
        } else {
            messageDiv.textContent = data.error || "Erreur d'inscription.";
        }
    } catch (error) {
        messageDiv.textContent = "Erreur serveur. Veuillez réessayer.";
    }
});

// Afficher le formulaire d'inscription
registerLink.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

// Afficher le formulaire de connexion
loginLink.addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});
