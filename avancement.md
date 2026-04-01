# Améliorations (priorité décroissante)
- [x] A1 Sécurité des rôles: rôle par défaut `user`, inscription admin verrouillée.
- [x] A2 Sécurité: retrait du register sur dashboard.
- [ ] A3 Validation d’entrée: schémas Joi/Zod sur toutes les routes, messages d’erreur clairs.
- [x] A4 CI/CD compose: aligner `compose.prod.yml` pour utiliser les images GHCR poussées (ou supprimer le push GHCR si build on-host).
- [ ] A5 Auth robuste: refresh token + rotation, expiry gérée côté front, stockage sécurisé (httpOnly si possible).
- [ ] A6 Journalisation/monitoring: logs structurés (pino/winston), tracing des requêtes, alerting basique.
- [ ] A7 Tests: API (Jest + Supertest), composants front critiques, scénarios e2e (Playwright).
- [ ] A8 CI/CD: lint + tests sur PR, build docker, scans vulnérabilités (npm audit/trivy), déploiement auto.
- [ ] A9 Validation métier: règles côté backend (ex: rating 0-5 déjà, mais contrôler doublons review utilisateur/jeu).
- [ ] A10 Optimisation DB: indexes sur champs utilisés (email, nickname, relations), projections pour alléger les listes.
- [ ] A11 Limites et sécurité API: rate limiting, helmet, CORS restreint, taille corps requête limitée.
- [ ] A12 Expérience admin: pagination/filtre/tri sur tables, états de chargement uniformes, toasts contextualisés.
- [x] A13 Données démo: scripts seed pour jeux Steam (download appids + seed 100 premiers) + script de purge collection.
- [ ] A14 Hygiène repo: regrouper les `.gitignore` à la racine, harmoniser les patterns.
- [ ] A15 Config: PORT configurable, variables d’URL d’API dans le front pour tous les environnements, gestion .env sécurisée.
- [ ] A16 Enhancement: Ajouter la possibilité de voir le mot de passe lors de la saisie dans les formulaires d’inscription et de connexion pour améliorer l’expérience utilisateur.

# Sources de données externes pour pré-peupler la base de données
- [x] S1 Source publique retenue pour jeux: liste complète d’appids Steam (API IStoreService + fallback GitHub).
- [ ] S2 Concevoir un script d’ingestion (cron ou commande) avec mappage vers nos modèles, déduplication par slug/titre.
- [ ] S3 Stocker l’ID source externe pour éviter les doublons et faciliter les mises à jour.
- [ ] S4 Gérer les limites de taux (backoff) et la pagination lors de l’import.

# Creation du front utilisateur classique
## Backend à faire
- [ ] CF-B1 Rôle par défaut `user`, seed admin initial + script de reset.
- [ ] CF-B2 Valider les payloads (Joi/Zod) et messages d’erreur standardisés.
- [ ] CF-B3 Rate limiting + helmet + CORS restreint prod.
- [ ] CF-B4 Indexes sur `email`, `nickname`, relations; vérifier performances des populate.
- [ ] CF-B5 Tests API (Jest/Supertest) + lint CI.
- [ ] CF-B6 Scripts seed données (genres, jeux, users demo) pour démo rapide.
- [ ] CF-B7 Code de validation par email.

## À réfléchir avant front utilisateur classique
- [ ] CF-R1 Parcours auth/inscription: création compte user only, flow de validation email éventuelle.
- [ ] CF-R2 Gestion préférences/langue/thème et persistance locale vs backend.
- [ ] CF-R3 Pagination/filtre/recherche côté API pour listes publiques (jeux, genres, reviews).
- [ ] CF-R4 Politique d’avis: qui peut poster, fréquence, modération, signalement.
- [ ] CF-R5 Recos (endpoint `/algo`): critères, tri, pagination, cache.
- [ ] CF-R6 Accessibilité et perf: lazy load, skeletons, tailles images, SEO basique.

## Infra front utilisateur
- [ ] CF-I1 Choisir stack/front utilisateur (framework, UI, i18n, theming) distinct du dashboard.
- [ ] CF-I2 Définir l’URL/API cible (`VITE_API_URL`) et CORS: exposer API + admin + front user sur le même VPS via ports dédiés ou reverse proxy (nginx/traefik) et sous-domaines `api/admin/app`.
- [ ] CF-I3 Ajouter service `frontend-user` dans `compose.prod.yml` (port dédié ou via proxy), réseau partagé avec l’API.
- [ ] CF-I4 Créer Dockerfile.prod + .dockerignore pour le front utilisateur, builder vers image GHCR.
- [ ] CF-I5 Étendre CI/CD: build/push image front user vers GHCR, puis `docker compose pull/down/up` incluant ce service sur le VPS.

# Algo (idées + impacts backend)
- [ ] AL1 Recommandations par similarité de genre + popularité: nécessite champs `playCount`/`reviewCount` et endpoint paginé trié.
- [ ] AL2 Score composite (popularité x fraîcheur): ajouter `createdAt` déjà là; prévoir index sur `createdAt` et `rating`.
- [ ] AL3 Collaborative filtering simple (utilisateurs similaires): stocker likes/favorites; endpoints pour noter/liker; index sur user->game.
- [ ] AL4 Personnalisation par historique: journaliser vues/clics (nouvelle collection `Events`), pipeline d’agrégation pour tendances perso.
- [ ] AL5 Recherche plein texte: indexes textuels sur `title`, `description`, suggestion auto (`$search` Atlas ou regex + limit).
- [ ] AL6 Anti-spam/qualité d’avis: heuristiques fréquence/longueur, seuils de confiance; champs de statut modération.
- [ ] AL7 A/B testing: flag de feature via config/collection `FeatureFlags`, traçage des variantes.
