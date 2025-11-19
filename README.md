# API_Jeu

Une API REST pour la gestion d'un jeu (ou des jeux) — backend en Node.js / TypeScript (ou JavaScript selon ton code).

## Description

Cette API est conçue pour un systeme de gestion, suivi et d'avis autour d'un ou plusieurs jeux. Elle permet la gestion des utilisateurs, des entités de jeu, et offre des fonctionnalités d'authentification et de validation des données.

## Fonctionnalités

- Gestion des utilisateurs (inscription, connexion)
- CRUD de différents types de table (ex : “game”, “item”, “gamelist”, etc.)
- Gestion des avis / reviews
- Authentification (JWT ou autre)
- Validation des données
- Middleware, logs, gestion d'erreurs

## Technos

- **Node.js** avec **Express** (framework web)
- **TypeScript** (ou JavaScript)
- Base de données : MongoDB
- Fichiers de configuration via `.env`
- Le projet est dockérisé 

## Installation

1. Cloner le repo : `git clone https://github.com/Tidragon-coder/API_Jeu/tree/dev`
2. Installer les dépendances : `npm install` 

## Configuration

1. Copier le fichier d'environnement exemple : `cp .env.example .env`
2. Remplir les variables d'environnement dans `.env` :
	- `PORT` : le port sur lequel le serveur va tourner
	- `DB_URI` : l'URI de la base de données
	- `JWT_SECRET` : secret pour générer les tokens
	- `JWT_expiresIn` : durée de validité des tokens

## Lancer l'API

En mode développement : `npm run dev`

En production : `npm run start`

## Routes / Endpoints

Voici quelques exemples d'endpoints de l'API :

| Méthode | Route | Description |
| --- | --- | --- |
| POST | /auth/register | Inscription d'un utilisateur |
| POST | /auth/login | Connexion / obtention d'un token |
| GET | /games | Récupérer tous les jeux |
| POST | /games | Créer un jeu |
| GET | /games/:id | Récupérer un jeu par ID |
| PUT | /games/:id | Mettre à jour un jeu |
| DELETE | /games/:id | Supprimer un jeu |



## Authentification

L'API utilise JWT pour protéger 95% des routes.

Les tokens doivent être envoyés dans le header Authorization: Bearer <token>.

Le Role Admin est exigé pour certains endpoints (surtout les endpoints dans `/admin-dashboard`).

## Base de données

Type de BDD : MongoDB

Structure des principales collections / tables :

| Collection / Table | Description |
| --- | --- |
| User | id, email, passwordHash, pseudo, … |
| Game | id, name, description, createdAt, … |
| Review | id, userId, gameId, rating, comment, createdAt, … |
| GameList | id, userId, name, games[], createdAt, … |

## Déploiement

Préparer un environnement .env sur le serveur cible

Utiliser Docker 

## Contribuer

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le repo
2. Crée ta branche : `git checkout -b feature/ma-fonctionnalité`
3. Fais tes commits : `git commit -m 'Ajoute ma fonctionnalité'`
4. Pousse sur ta branche : `git push origin feature/ma-fonctionnalité`
5. Ouvre une Pull Request

Merci d'ajouter des tests + de bien documenter les nouvelles routes.

## Licence

Ce projet est sous licence MIT (à adapter si tu utilises une autre licence).