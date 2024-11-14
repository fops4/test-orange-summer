// api.js
const backendUrl = 'http://localhost:3000'; // Modifier selon votre environnement
let authToken = localStorage.getItem('authToken');

// Fonctions d'API pour la connexion, inscription, et réinitialisation du mot de passe
async function login(email, password) {
    const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        const data = await response.json();
        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        return data;
    } else {
        throw await response.json();
    }
}

async function register(name, email, password) {
    const response = await fetch(`${backendUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) throw await response.json();
}

async function resetPassword(email, newPassword) {
    const response = await fetch(`${backendUrl}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
    });
    if (!response.ok) throw await response.json();
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
}
