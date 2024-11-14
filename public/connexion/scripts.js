// Sélection des éléments des formulaires
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const toggleRegisterBtn = document.getElementById('toggleRegisterBtn');
const toggleLoginBtn = document.getElementById('toggleLoginBtn');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const toggleLoginBtnFromForgot = document.getElementById('toggleLoginBtnFromForgot');

// Vérifiez si les éléments existent avant d'ajouter des événements
if (toggleRegisterBtn) toggleRegisterBtn.addEventListener('click', () => showForm(registerForm));
if (toggleLoginBtn) toggleLoginBtn.addEventListener('click', () => showForm(loginForm));
if (forgotPasswordLink) forgotPasswordLink.addEventListener('click', () => showForm(forgotPasswordForm));
if (toggleLoginBtnFromForgot) toggleLoginBtnFromForgot.addEventListener('click', () => showForm(loginForm));

// Soumission du formulaire de connexion
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log("Tentative de connexion : ", { email, password }); // Affiche les données récupérées pour la connexion

        try {
            const response = await login(email, password);
            console.log("Réponse de la connexion : ", response); // Affiche la réponse après connexion
            window.location.href = '../task/index.html'; // Redirige vers la page d'accueil
        } catch (errorData) {
            console.error('Échec de la connexion : ', errorData); // Affiche l'erreur si la connexion échoue
            alert('Échec de la connexion : ' + (errorData.message || 'Erreur inconnue'));
        }
    });
}

// Soumission du formulaire d'inscription
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const termsAccepted = document.getElementById('terms').checked;

        console.log("Tentative d'inscription : ", { name, email, password, termsAccepted }); // Affiche les données d'inscription

        if (!termsAccepted) {
            alert("Veuillez accepter les conditions générales");
            return;
        }

        try {
            await register(name, email, password);
            console.log("Inscription réussie, redirection..."); // Affiche que l'inscription a réussi
            window.location.href = '../task/index.html';
        } catch (errorData) {
            console.error('Échec de l\'inscription : ', errorData); // Affiche l'erreur si l'inscription échoue
            alert('Échec de l\'inscription : ' + (errorData.message || 'Erreur inconnue'));
        }
    });
}

// Soumission du formulaire de réinitialisation de mot de passe
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        const newPassword = document.getElementById('password').value;
        const confirmPassword = document.getElementById('cpassword').value;

        console.log("Tentative de réinitialisation de mot de passe : ", { email, newPassword, confirmPassword }); // Affiche les données de réinitialisation

        if (newPassword !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        try {
            await resetPassword(email, newPassword);
            console.log("Mot de passe réinitialisé avec succès"); // Affiche que la réinitialisation a réussi
            alert('Mot de passe réinitialisé avec succès');
            window.location.href = 'index.html';
        } catch (errorData) {
            console.error('Échec de la réinitialisation du mot de passe : ', errorData); // Affiche l'erreur si la réinitialisation échoue
            alert('Échec de la réinitialisation du mot de passe : ' + (errorData.message || 'Erreur inconnue'));
        }
    });
}

// Déconnexion de l'utilisateur
function handleLogout() {
    console.log("Déconnexion de l'utilisateur..."); // Affiche un message avant de déconnecter l'utilisateur
    logout();
    window.location.href = 'index.html'; // Redirige vers la page de connexion
}
