// Définir l'URL du backend (à adapter selon l'environnement : local ou production)
const backendUrl = 'http://localhost:3000'; // Changez par l'URL de votre backend en production
let authToken = null; // Variable pour stocker le token d'authentification

// Sélection des éléments des formulaires
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const toggleRegisterBtn = document.getElementById('toggleRegisterBtn');
const toggleLoginBtn = document.getElementById('toggleLoginBtn');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const toggleLoginBtnFromForgot = document.getElementById('toggleLoginBtnFromForgot');

// Fonction pour masquer tous les formulaires et afficher uniquement celui sélectionné
function showForm(form) {
    loginForm.classList.remove('active');
    registerForm.classList.remove('active');
    forgotPasswordForm.classList.remove('active');
    form.classList.add('active');
}

// Gestion des boutons de navigation entre les formulaires
toggleRegisterBtn.addEventListener('click', () => showForm(registerForm));
toggleLoginBtn.addEventListener('click', () => showForm(loginForm));
forgotPasswordLink.addEventListener('click', () => showForm(forgotPasswordForm));
toggleLoginBtnFromForgot.addEventListener('click', () => showForm(loginForm));

// Soumission du formulaire de connexion
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${backendUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            localStorage.setItem('authToken', authToken); // Stocker le token
            window.location.href = '../task/index.html'; // Redirige vers la page d'accueil
        } else {
            const errorData = await response.json();
            alert('Échec de la connexion : ' + (errorData.message || 'Erreur inconnue'));
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
    }
});

// Soumission du formulaire d'inscription
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const termsAccepted = document.getElementById('terms').checked;

    if (!termsAccepted) {
        alert("Veuillez accepter les conditions générales");
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (response.ok) {
            window.location.href = '../task/index.html';
        } else {
            const errorData = await response.json();
            alert('Échec de l\'inscription : ' + (errorData.message || 'Erreur inconnue'));
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
    }
});

// Soumission du formulaire de réinitialisation de mot de passe
forgotPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('cpassword').value;

    if (newPassword !== confirmPassword) {
        alert("Les mots de passe ne correspondent pas");
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/api/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, newPassword })
        });

        if (response.ok) {
            alert('Mot de passe réinitialisé avec succès');
            window.location.href = 'index.html';
        } else {
            const errorData = await response.json();
            alert('Échec de la réinitialisation du mot de passe : ' + (errorData.message || 'Erreur inconnue'));
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
    }
});

// Fonction pour déconnecter l'utilisateur
function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    window.location.href = 'index.html'; // Redirige vers la page de connexion
}
