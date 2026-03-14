# Améliorations (priorité décroissante)
- [x] Sécurité des rôles: mettre le rôle par défaut à `user`, verrouiller l’inscription admin.
- [ ] Sécurité retrait du register sur dashboard
- [ ] Validation d’entrée: schémas Joi/Zod sur toutes les routes, messages d’erreur clairs.
- [x] CI/CD compose: aligner `compose.prod.yml` pour utiliser les images GHCR poussées (ou supprimer le push GHCR si build on-host).
- [ ] Auth robuste: refresh token + rotation, expiry gérée côté front, stockage sécurisé (httpOnly si possible).
- [ ] Journalisation/monitoring: logs structurés (pino/winston), tracing des requêtes, alerting basique.
- [ ] Tests: API (Jest + Supertest), composants front critiques, scénarios e2e (Playwright).
- [ ] CI/CD: lint + tests sur PR, build docker, scans vulnérabilités (npm audit/trivy), déploiement auto.
- [ ] Validation métier: règles côté backend (ex: rating 0-5 déjà, mais contrôler doublons review utilisateur/jeu).
- [ ] Optimisation DB: indexes sur champs utilisés (email, nickname, relations), projections pour alléger les listes.
- [ ] Limites et sécurité API: rate limiting, helmet, CORS restreint, taille corps requête limitée.
- [ ] Expérience admin: pagination/filtre/tri sur tables, états de chargement uniformes, toasts contextualisés.
- [ ] Données démo: scripts seed pour jeux/genres/reviews afin de tester rapidement le dashboard.
- [ ] Hygiène repo: regrouper les `.gitignore` à la racine, harmoniser les patterns.
- [ ] Config: PORT configurable, variables d’URL d’API dans le front pour tous les environnements, gestion .env sécurisée.

# Sources de données externes pour pré-peupler la base de données
- [ ] Évaluer une API publique de jeux (IGDB, RAWG, OpenCritic) pour pré-peupler genres/jeux; vérifier contraintes licences/quotas.
- [ ] Concevoir un script d’ingestion (cron ou commande) avec mappage vers nos modèles, déduplication par slug/titre.
- [ ] Stocker l’ID source externe pour éviter les doublons et faciliter les mises à jour.
- [ ] Gérer les limites de taux (backoff) et la pagination lors de l’import.

# Creation du front utilisateur classique
## Backend à faire
- [ ] Rôle par défaut `user`, seed admin initial + script de reset.
- [ ] Valider les payloads (Joi/Zod) et messages d’erreur standardisés.
- [ ] Rate limiting + helmet + CORS restreint prod.
- [ ] Indexes sur `email`, `nickname`, relations; vérifier performances des populate.
- [ ] Tests API (Jest/Supertest) + lint CI.
- [ ] Scripts seed données (genres, jeux, users demo) pour démo rapide.

## À réfléchir avant front utilisateur classique
- [ ] Parcours auth/inscription: création compte user only, flow de validation email éventuelle.
- [ ] Gestion préférences/langue/thème et persistance locale vs backend.
- [ ] Pagination/filtre/recherche côté API pour listes publiques (jeux, genres, reviews).
- [ ] Politique d’avis: qui peut poster, fréquence, modération, signalement.
- [ ] Recos (endpoint `/algo`): critères, tri, pagination, cache.
- [ ] Accessibilité et perf: lazy load, skeletons, tailles images, SEO basique.

## Infra front utilisateur
- [ ] Choisir stack/front utilisateur (framework, UI, i18n, theming) distinct du dashboard.
- [ ] Définir l’URL/API cible (VITE_API_URL) et CORS: exposer API + admin + front user sur le même VPS via ports dédiés ou reverse proxy (nginx/traefik) et sous-domaines `api/admin/app`.
- [ ] Ajouter service `frontend-user` dans `compose.prod.yml` (port dédié ou via proxy), réseau partagé avec l’API.
- [ ] Créer Dockerfile.prod + .dockerignore pour le front utilisateur, builder vers image GHCR.
- [ ] Étendre CI/CD: build/push image front user vers GHCR, puis `docker compose pull/down/up` incluant ce service sur le VPS.


# Algo (idées + impacts backend)
- [ ] Recommandations par similarité de genre + popularité: nécessite champs `playCount`/`reviewCount` et endpoint paginé trié.
- [ ] Score composite (popularité x fraîcheur): ajouter `createdAt` déjà là; prévoir index sur `createdAt` et `rating`.
- [ ] Collaborative filtering simple (utilisateurs similaires): stocker likes/favorites; endpoints pour noter/liker; index sur user->game.
- [ ] Personnalisation par historique: journaliser vues/clics (nouvelle collection `Events`), pipeline d’agrégation pour tendances perso.
- [ ] Recherche plein texte: indexes textuels sur `title`, `description`, suggestion auto (`$search` Atlas ou regex + limit).
- [ ] Anti-spam/qualité d’avis: heuristiques fréquence/longueur, seuils de confiance; champs de statut modération.
- [ ] A/B testing: flag de feature via config/collection `FeatureFlags`, traçage des variantes.
