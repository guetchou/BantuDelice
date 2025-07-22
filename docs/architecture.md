# Architecture du projet

```mermaid
graph TD
  A[Frontend (Nginx/React)] -->|API REST| B(Backend Node.js)
  A -->|WebSocket| B
  B -->|PostgreSQL| C[( DB)]
  B -->|Auth| D[ Auth]
  B -->|Stockage| E[ Storage]
  A -->| JS| D
  A -->| JS| E
  D -->|JWT| B
  E -->|Fichiers| F[Volumes Docker]
```

## Explication des flux

- **Frontend** (React via Nginx) communique avec le **backend** via API REST et WebSocket (chat, notifications).
- **Backend** gère la logique métier, l’authentification (via  Auth), la persistance (PostgreSQL/ DB) et le stockage de fichiers ( Storage).
- **Frontend** utilise aussi directement  JS pour certaines opérations (auth, stockage, temps réel).
- Les fichiers uploadés sont stockés dans des volumes Docker, accessibles par  Storage.
- Les tokens JWT générés par  Auth sont utilisés pour sécuriser les échanges entre frontend, backend et services .

---

Adapte ce schéma si tu ajoutes de nouveaux services (worker, analytics, etc.). 