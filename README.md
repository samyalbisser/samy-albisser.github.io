# 💻 Portfolio BTS SIO SISR — Samy ALBISSER

[![Site en ligne](https://img.shields.io/badge/🌐_Site_en_ligne-samy--albisser.fr-2563eb?style=for-the-badge)](https://samy-albisser.fr)
[![BTS SIO](https://img.shields.io/badge/BTS_SIO-SISR-06b6d4?style=for-the-badge)](https://samy-albisser.fr/#projets)
[![Promotion](https://img.shields.io/badge/Promotion-2024--2026-334155?style=for-the-badge)](#)

Mon portfolio professionnel dans le cadre de mon **BTS SIO option SISR** (Solutions d'Infrastructure, Systèmes et Réseaux).  
Je suis actuellement en alternance en tant que **Technicien Poste de Travail** à la **CARSAT Alsace-Moselle** à Strasbourg.

> 🔗 **Consultez le site ici → [samy-albisser.fr](https://samy-albisser.fr)**

---

## 📋 Contenu du portfolio

Ce site regroupe l'ensemble de mon parcours et de mes réalisations dans le cadre du BTS SIO :

- **À propos** — Mon profil, mes formations et certifications (Cisco, ANSSI)
- **Parcours de formation** — Du Bac STI2D au BTS SIO en passant par le BUT Informatique
- **Expérience professionnelle** — Mon alternance CARSAT, mes missions et résultats chiffrés
- **Compétences techniques** — Systèmes, réseaux, sécurité, scripting... rattachées à leur contexte d'apprentissage
- **Ateliers Professionnels (AP1 à AP4)** — Les projets réalisés en formation avec livrables et documentation
- **Épreuve E5** — Synthèse des compétences et situations professionnelles
- **Veille technologique** — Sujet : IA et cybersécurité
- **Projet professionnel** — Mes objectifs pour la suite

---

## 🛠️ Stack technique

Le site est entièrement développé **from scratch**, sans framework ni dépendance :

| Technologie            | Usage                                                          |
| ---------------------- | -------------------------------------------------------------- |
| **HTML5**              | Structure sémantique, accessibilité, SEO                       |
| **CSS3**               | Design responsive, thème clair/sombre, animations              |
| **JavaScript vanilla** | Interactions, animations au scroll, formulaire                 |
| **GitHub Pages**       | Hébergement et déploiement                                     |
| **Cloudflare**         | DNS, CDN et analytics                                          |
| **Formspree**          | Backend formulaire de contact (plan Free, 50 soumissions/mois) |

Pas de React, pas de Vue, pas de bundler — juste les fondamentaux bien maîtrisés. 🙂

---

## ✨ Fonctionnalités

- 🌓 Thème clair / sombre avec sauvegarde des préférences
- 📱 Design responsive (mobile, tablette, desktop)
- ⚡ Animations au scroll (Intersection Observer)
- 📊 Compteurs animés et barres de compétences
- 📂 Accordéons pour les ateliers professionnels avec livrables intégrés
- 📄 Prévisualisation du CV en modal
- 📬 Formulaire de contact avancé (floating labels, validation temps réel, toast notifications, RGPD, honeypot anti-spam)
- 🔍 SEO optimisé (meta, Open Graph, Twitter Cards, Schema.org JSON-LD)
- ♿ Accessibilité (aria-labels, navigation clavier, sémantique HTML5)

---

## 📁 Structure du projet

```
├── index.html          # Page unique (SPA-like)
├── style.css           # Styles complets (thème clair/sombre)
├── script.js           # Interactions et animations
├── robots.txt          # Directives pour les moteurs de recherche
├── sitemap.xml         # Plan du site pour Google
├── CNAME               # Domaine personnalisé
└── assets/             # Documents, livrables et ressources
    ├── Ateliers Professionels BTS SIO/
    ├── épreuve E5/
    └── Informations Samy ALBISSER/
```

---

## 🚀 Déploiement

Le site est hébergé via **GitHub Pages** et accessible sur un domaine personnalisé :

- **URL** : [https://samy-albisser.fr](https://samy-albisser.fr)
- **Déploiement** : automatique à chaque `git push` sur la branche principale

---

## 📫 Contact

Si vous avez une question, une opportunité ou simplement envie d'échanger :

- 🌐 [samy-albisser.fr/#contact](https://samy-albisser.fr/#contact)
- 💼 [LinkedIn](https://www.linkedin.com/in/samy-albisser/)
- 📧 contact@samy-albisser.fr

---

## 📝 Changelog

### 11 février 2026 — Refonte du formulaire de contact

**Mise en place de Formspree**

- Configuration de [Formspree](https://formspree.io) (plan Free) pour l'envoi réel des messages du formulaire
- Endpoint : `https://formspree.io/f/mvzbzyan`
- Adresse de réception : `contact@samy-albisser.fr`

**Améliorations UX/UI du formulaire**

- ✨ **Floating labels** — Les labels sont positionnés à l'intérieur des champs au repos et flottent au-dessus avec une animation fluide au focus/saisie (style Material Design)
- ✅ **Validation en temps réel** — Bordure verte + icône ✅ quand un champ est valide, bordure rouge + icône ⚠️ + message d'erreur quand invalide (déclenchée au `blur`, puis en continu à chaque frappe)
- 🎉 **Toast notifications** — Bandeau animé vert (succès) ou rouge (erreur) affiché au-dessus du formulaire pendant 5 secondes, remplaçant le simple changement de texte du bouton
- 📱 **Champ Téléphone** — Nouveau champ optionnel avec validation du format
- 🔒 **Checkbox RGPD** — Case à cocher obligatoire avec checkbox custom animé et lien vers les mentions légales
- 🤖 **Honeypot anti-spam** — Champ caché invisible (`_gotcha`) : si un bot le remplit, le formulaire simule un succès sans envoyer

**Améliorations des emails reçus**

- Labels des champs en français dans l'email (Nom, Email, Entreprise, Téléphone, Objet, Message)
- Objet personnalisé : "📩 Nouveau message depuis samy-albisser.fr"
- Valeurs lisibles pour le select Objet ("Proposition d'alternance Bac+3" au lieu de "alternance")
- Suppression du champ RGPD dans l'email ("rgpd: on" inutile)
- `_replyto` dynamique pour répondre directement à l'expéditeur depuis l'email

**Responsive**

- Formulaire adapté mobile : champs empilés en colonne avec espacement correct
- Messages d'erreur en `position: absolute` pour ne jamais décaler le layout
- Retour à la ligne autorisé sur les messages d'erreur en petit écran

**Autre**

- Email de contact mis à jour : `contact@samy-albisser.fr` (panneau latéral + README)

---

<p align="center">
  <i>Développé avec ☕ et beaucoup de documentation — Samy ALBISSER, 2026</i>
</p>
