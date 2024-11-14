const backendUrl = 'http://localhost:3000'; // Changez par l'URL de votre backend en production
let authToken = null; // Variable pour stocker le token d'authentification

// Fonction pour récupérer les informations de l'utilisateur connecté
async function fetchUserData() {
    authToken = localStorage.getItem('authToken'); // Récupérer le token stocké dans le localStorage
    if (!authToken) {
        alert("Veuillez vous connecter");
        window.location.href = 'index.html'; // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
        return;
    }

    try {
        // Envoi du token dans l'en-tête d'autorisation
        const response = await fetch(`${backendUrl}/api/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Envoi du token dans l'en-tête
            }
        });

        if (response.ok) {
            const userData = await response.json();
            displayUserInfo(userData); // Appel de la fonction pour afficher les informations utilisateur
        } else {
            alert('Échec de la récupération des informations utilisateur');
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
    }
}

// Fonction pour afficher les informations de l'utilisateur dans le header
function displayUserInfo(userData) {
    const userInfoElement = document.getElementById('user-info');
    if (userData && userData.name) {
        userInfoElement.innerHTML = `Bienvenue, ${userData.name}`; // Afficher le nom de l'utilisateur
    } else {
        userInfoElement.innerHTML = 'Utilisateur non trouvé';
    }
}

// Fonction pour charger les tâches de l'utilisateur depuis la base de données
async function loadTasks() {
    const response = await fetch(`${backendUrl}/api/tasks`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}` // Envoi du token dans l'en-tête
        }
    });

    if (response.ok) {
        const tasks = await response.json();
        const taskListElement = document.getElementById('task-list');
        taskListElement.innerHTML = ''; // Vider la liste des tâches existantes

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.innerHTML = `
                <h3>${task.name}</h3>
                <p>${task.description}</p>
                <p>Deadline: ${task.deadline}</p>
            `;
            taskListElement.appendChild(taskElement);
        });
    } else {
        alert('Erreur lors du chargement des tâches');
    }
}

// Sélectionner le formulaire de tâche
const taskForm = document.getElementById('task-form');

// Soumettre une nouvelle tâche
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const taskName = document.getElementById('task-name').value;
    const taskDesc = document.getElementById('task-desc').value;
    const taskDeadline = document.getElementById('task-deadline').value;

    if (!taskName || !taskDesc || !taskDeadline) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    try {
        // Envoi des données de la tâche avec le token d'authentification
        const response = await fetch(`${backendUrl}/api/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}` // Envoi du token dans l'en-tête
            },
            body: JSON.stringify({ name: taskName, description: taskDesc, deadline: taskDeadline })
        });

        if (response.ok) {
            const data = await response.json();
            alert("Tâche ajoutée avec succès !");
            loadTasks(); // Recharger la liste des tâches après ajout
        } else {
            const errorData = await response.json();
            alert('Erreur lors de l\'ajout de la tâche : ' + (errorData.message || 'Erreur inconnue'));
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
    }
});

// Charger les tâches et les informations de l'utilisateur au démarrage de la page
window.addEventListener('DOMContentLoaded', () => {
    fetchUserData(); // Charger les informations de l'utilisateur
    loadTasks();     // Charger les tâches de l'utilisateur
});
