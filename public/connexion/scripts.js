// Variables pour les boutons de bascule
const toggleRegisterBtn = document.getElementById("toggleRegisterBtn");
const toggleLoginBtn = document.getElementById("toggleLoginBtn");
const toggleLoginBtnFromForgot = document.getElementById("toggleLoginBtnFromForgot");
const forgotPasswordLink = document.getElementById("forgotPasswordLink");

// Formulaires
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

// Fonction pour basculer vers le formulaire d'inscription
toggleRegisterBtn.addEventListener("click", function() {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
    forgotPasswordForm.classList.remove("active");
});

// Fonction pour basculer vers le formulaire de connexion depuis l'inscription
toggleLoginBtn.addEventListener("click", function() {
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
    forgotPasswordForm.classList.remove("active");
});

// Fonction pour basculer vers le formulaire de mot de passe oublié
forgotPasswordLink.addEventListener("click", function(event) {
    event.preventDefault();
    loginForm.classList.remove("active");
    registerForm.classList.remove("active");
    forgotPasswordForm.classList.add("active");
});

// Fonction pour basculer vers le formulaire de connexion depuis mot de passe oublié
toggleLoginBtnFromForgot.addEventListener("click", function() {
    forgotPasswordForm.classList.remove("active");
    loginForm.classList.add("active");
});

