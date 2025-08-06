# 📦 Plateforme de gestion et de tracking de colis Congo

## 1. Problématique

La plupart des Congolais de la diaspora et des nationaux rencontrent de grandes difficultés pour l’expédition et la réception de colis, notamment à l’international.

- **SOPECO** (poste congolaise) peine à remplir sa mission de service public :
  - Elle utilise le système de la poste mondiale, mais le **tracking s’arrête dès que le colis arrive au Congo** (Brazzaville ou Pointe-Noire).
  - Sur le territoire national, SOPECO fait face à une concurrence de nombreux petits opérateurs locaux, souvent plus agiles.
- **À l’international (notamment en France)**, des transitaires privés congolais proposent des solutions alternatives :
  - Ils reçoivent les colis à leur dépôt en France (souvent via Alibaba, Amazon, etc.), puis les acheminent eux-mêmes au Congo.
  - **Avantage** : ils évitent aux destinataires les tracasseries douanières et formalités administratives, offrant un service plus simple et direct.

**Conséquences :**
- Manque de transparence et de traçabilité pour les clients.
- Multiplication des acteurs informels, perte de confiance dans la poste officielle.
- Difficulté pour SOPECO à moderniser son offre et à regagner la clientèle.

---

## 2. Objectif de la solution

**Apporter une plateforme numérique qui :**
- Permet de **continuer le tracking du colis** même après son arrivée au Congo, jusqu’à la livraison finale.
- **Facilite la gestion, la traçabilité et la transparence** pour tous les acteurs (expéditeur, destinataire, opérateurs, SOPECO).
- **Soutient SOPECO** dans sa mission de service public, en lui apportant un outil moderne pour rivaliser avec les petits opérateurs privés.
- **Rassure la diaspora** et les nationaux sur la fiabilité et la visibilité de leurs envois.

---

## 3. Fonctionnalités principales

### Pour les clients (expéditeurs/destinataires)
- Création de demande d’envoi ou de réception de colis (national/international).
- Génération et suivi d’un numéro de tracking unique, utilisable de bout en bout.
- Visualisation de la timeline du colis (prise en charge, transit, arrivée, livraison…).
- Notifications à chaque étape (email, SMS, push).
- Paiement en ligne (MTN, Airtel, carte…).

### Pour SOPECO et les opérateurs privés
- Interface de gestion des colis, des statuts, des partenaires.
- Possibilité de mettre à jour le statut d’un colis (scan QR, application mobile, interface web).
- Gestion des dépôts, des points de retrait, des livreurs.
- Statistiques, reporting, audit log.

### Pour les transitaires/partenaires privés
- Création de compte opérateur.
- Enregistrement de leurs propres colis, génération de tracking, gestion des dépôts privés.
- Intégration API pour synchroniser leur workflow (scan, dépôt, livraison…).

---

## 4. Architecture technique

- **Frontend** : React/Vite, interface web moderne, responsive, PWA/mobile à venir.
- **Backend** : NestJS, API REST, gestion des rôles, statuts, tracking, paiements, notifications.
- **Base de données** : PostgreSQL, modèles pour colis, utilisateurs, tracking, partenaires, notifications, géolocalisation.
- **Docker** : Orchestration des services (front, back, DB), déploiement unifié.
- **API publique** : Endpoints pour le suivi universel, national, international, widget de tracking intégrable sur d’autres sites.
- **Intégration transporteurs** : Module DHL (et autres à venir), détection automatique du type de colis.

---

## 5. Points différenciants

- **Tracking “dernier kilomètre”** : suivi du colis jusqu’à la remise effective, même après l’arrivée au Congo.
- **Ouverture aux opérateurs privés** : portail dédié, API, gestion des dépôts.
- **Interopérabilité SOPECO** : possibilité de synchroniser les statuts, ou de donner la main à un agent SOPECO pour la mise à jour.
- **Expérience utilisateur fluide** : notifications, interface simple, multilingue, assistance intégrée.
- **Sécurité et traçabilité** : audit log, gestion fine des droits, archivage sécurisé.

---

## 6. Vision d’évolution

- **Application mobile pour livreurs/agents** (scan, géoloc, mise à jour statuts).
- **Notifications temps réel** (push, SMS, email).
- **Ouverture à d’autres transporteurs internationaux** (FedEx, UPS, etc.).
- **Statistiques avancées, dashboard pour SOPECO et partenaires**.
- **Support multilingue** (français, lingala, etc.).
- **Automatisation du tracking via webhooks, scan QR, etc.**

---

## 7. Enjeux stratégiques

- **Redonner confiance** à la diaspora et aux nationaux dans la chaîne logistique.
- **Moderniser l’image et l’efficacité de SOPECO**.
- **Structurer et digitaliser le marché informel des transitaires privés**.
- **Créer un écosystème ouvert, transparent et sécurisé pour tous les acteurs du colis au Congo.**

---

## 8. Schéma d’usage

```
[Expéditeur diaspora/France] 
    |
    v
[Transitaire privé ou SOPECO] --(tracking continu, scan, API)--> [Arrivée Congo (Brazzaville/Pointe-Noire)]
    |
    v
[Opérateur local (SOPECO ou privé)] --(tracking, scan, géoloc, notifications)--> [Destinataire final]
```

---

## 9. Contact & Support

- Pour toute question technique ou partenariat : [contact@bantudelice.cg]
- Documentation API : `/docs/API_PUBLIC_WIDGET.md`
- Support client : via l’interface web ou mobile 