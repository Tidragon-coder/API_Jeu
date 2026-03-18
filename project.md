# Vue d'ensemble
- Monorepo avec `backend-API` (Express + MongoDB) et `admin-dashboard` (React 19 + Vite + MUI/Tailwind). Orchestration via `compose.yml` (dev) et `compose.prod.yml` (prod).
- Usage principal: gestion de jeux, avis, listes et genres, avec back office admin protege par JWT. Toutes les routes back sont prefixees par `/api`.

# Démarrage rapide
- Prerequis: Node 20+, Docker si utilisation des compose. Mongo local sinon variable `MONGO_URL`.
- Backend: `cd backend-API && npm install && npm run dev` (port fixe 3000). Env: copier `.env.sample` vers `.env`.
- Frontend: `cd admin-dashboard && npm install && npm run dev` (Vite sur 5173, `VITE_API_URL` doit pointer vers l'API, ex `http://localhost:3000/api`).
- Docker dev: `docker compose up --build` expose API 3000, Vite 5173, Mongo 27017. Prod: `docker compose -f compose.prod.yml up --build` (frontend sur 4173).

# Backend
**Tech**: Express 5, Mongoose 8, JWT, bcrypt, CORS global `*`, JSON body. Port 3000 hard-code.

**Middleware**:
- `verifyToken`: lit header `Authorization: Bearer <token>`, decode JWT avec `JWT_SECRET`, attache `req.user`.
- `authorizeRole(role)`: verifie `req.user.role`, renvoie 403 sinon.

**Schemas Mongo**
- User: `name`, `nickname` (unique), `email` (unique), `password` (hash bcrypt), `role` (`user`/`admin`, defaut user), `lastLogin`, timestamps.
- Game: `title` (req), `description`, `release_year`, `genre` ref Genre (req), `editor`, `platform`, `mode`, `perspective`, `slug`, timestamps.
- Genre: `name` (req), `description`, timestamps.
- Review: refs `user` (req) et `game` (req), `rating` 0-5 (req), `comment`, timestamps.
- Gamelist: refs `user` (req) et `game` (req), `status` enum `pending|in_progress|finished` (def pending), timestamps.
- SteamGame (jeux importés Steam): `steamAppId` (unique, index), `title`, `shortDescription`, `longDescription`, `headerImage`, `capsuleImage`, `background`, `genres` [String], `price{currency,initial,final,discountPercent}`, `publishers` [String], `releaseDate`, `requiredAge`, `metacriticScore`, `userRating`, timestamps.

**Routes (prefix /api)**
- `/users`:
  - POST `/register` (public) cree un user (role force `user`, refus admin) avec hash. 
  - POST `/login` (public) renvoie `{user, token}` (claims: id, role, expires `JWT_expiresIn`).
  - POST `/logout` (public stub).
  - GET `/` (admin) liste users sans password.
  - GET `/info/me` (admin) user courant.
  - GET `/ :id`, PUT `/ :id`, DELETE `/ :id` (admin). DELETE refuse auto-suppression.
- `/game` (token obligatoire, admin requis pour mutations):
  - POST `/new` creer un jeu.
  - GET `/all` liste avec `genre` populate.
  - GET `/ :id`, PUT `/ :id`, DELETE `/ :id`.
- `/genre` (token, admin pour write):
  - POST `/new`, GET `/all`, GET `/ :id`, PUT `/ :id`, DELETE `/ :id`.
- `/review` (token):
  - POST `/new`, GET `/all`, GET `/ :id`, PUT `/ :id`, DELETE `/ :id`; populate `game` & `user` a la lecture.
- `/gamelist` (token):
  - POST `/new`, GET `/all`, GET `/ :id`, PUT `/ :id`, DELETE `/ :id`; populate `game`.
- `/steam` (public):
  - GET `/steam?page&limit&q` pagination/filtre titre.
  - GET `/steam/:id` accepte `steamAppId` numérique ou `_id` Mongo.
- `/stats` (token):
  - GET `/online` renvoie message simple.
  - GET `/user-stats/QperDay` retourne `results` (comptes hebdomadaires sur 6 semaines) + `dateNow`.
- `/algo` (token):
  - GET `/gameAlgo/:id` retourne autres jeux du meme genre que `:id`.

**Config .env attendue**
- `MONGO_URL` (utilisee par `mongoose.connect`), `JWT_SECRET`, `JWT_expiresIn`, eventuel `PORT` (non lu), autres valeurs non requises.

**Scripts utilitaires**
- `scripts/downloadSteamAppIds.js`: récupère la liste complète des appids Steam (API officielle si `STEAM_API_KEY`, sinon fallback GitHub) et écrit `steamAppIds.json` (chemin override `STEAM_APPIDS_PATH`).
- `scripts/seedSteamGames.js`: lit `steamAppIds.json`, prend les `SEED_LIMIT` premiers appids (def 100), fetch détails Steam et upsert dans `SteamGame`.
- `scripts/clearSteamGames.js`: purge la collection `SteamGame`.

**Points d'attention**
- Role defaut `user` : l'inscription publique force `role=user` et refuse `admin`.
- Pas de validation schema cote requete; rely sur Mongoose.
- Pas de rate limit ni refresh token.
- CORS ouvert `*`.
- Tests absents.

# Frontend (admin-dashboard)
**Tech**: React 19, React Router 7, TypeScript, MUI + Tailwind 4, axios helper `api.ts`.
**Auth**: token JWT stocke dans `localStorage` (`token`, `id`). Route guard `Protected` redirige `/login` si absent. Page `Register` retirée du dashboard (création de comptes via backend uniquement).
**Pages principales**
- `Login`: appelle `/users/login` (plus de lien vers register dans l'UI admin).
- `Dashboard`: cards comptes (users, games, reviews, genres) + graph des stats users (`/stats/user-stats/QperDay`).
- `Users`: CRUD admin sur users, modal edit (`SideBarUser`), delete interdit sur soi.
- `Games`, `Genres`, `Reviews`, `GameList`: CRUD similaires via `callApi` (endpoints homonymes).
- `Algo`: affiche recommandations pour un jeu en appelant `/algo/gameAlgo/:id`.
**UI infra**
- `NotificationContext` + `NotificationList` pour toasts auto-dismiss 3s.
- `Sidebar` + `Topbar` pour layout; style principal dans `src/index.css` et `src/App.css`.

**Env frontend (.env)**
- `VITE_API_URL` (ex `http://localhost:3000/api`). En docker dev, l'URL par defaut `/api` suppose un proxy ou reseau compose.

# Docker/CI
- `compose.yml`: Mongo 7, service `node` (montage code + nodemon), service `vite` (montage code). Volumes anonymes pour node_modules.
- `compose.prod.yml`: utilise les images GHCR `ghcr.io/tidragon-coder/backend:latest` (port 3000) et `ghcr.io/tidragon-coder/frontend:latest` (Nginx sur port 80, mappé 4173 côté host). Reseau `app-network`, healthcheck Mongo.
- Dockerfiles: backend expose 3000; frontend build Vite puis sert via Nginx (port 80) avec fallback SPA `try_files ... /index.html`.
- CI/CD (branch `production`): build & push images vers GHCR, puis SSH vers le VPS (`VPS_HOST`, `VPS_USER`, `VPS_PATH`). Sur le VPS: `git pull --ff-only`, login GHCR avec `GHCR_TOKEN`, `docker compose -f compose.prod.yml pull/down/up` pour déployer.

# Notes pratiques
- API racine GET `/` renvoie message "Serveur backend-API online" (emoji).
- Les pages consomment les endpoints sans proxy; en dev hors docker, penser CORS deja permissif.
- Pour injecter des jeux/tests: utiliser POST `/genre/new` puis `/game/new` (genre obligatoire) ou seeder Steam: `node scripts/downloadSteamAppIds.js` puis `node scripts/seedSteamGames.js`.
- `steamAppIds.json` est attendu dans `backend-API/scripts/` par défaut.
- Les dates dans UI sont converties via `toLocaleDateString`, attention au fuseau.
- Aucun lint/test integre; prevoir `npm run lint` cote front seulement.
