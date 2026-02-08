# 📄 LIVRABLE 1 – Reponse au Cahier des Charges

**Projet : PARCUS – Création d’une DSI interne**

**Durée : 10 semaines (février à juin 2025)**

**Groupe : Samy ALBISSER (Chef de projet) & Emre ALBAYRAK**

---

# 0. 🏢 Présentation du prestataire – Altinux

![9fb46334-507e-4f4d-9fea-3ee08cc60c6a.png](f0508cd1-6ba1-43af-bd49-bec7aaccac88.png)

**Altinux** est le prestataire informatique retenu pour la mission de création de la DSI interne de PARCUS. Spécialisée dans l’intégration de solutions open-source et l’administration système, Altinux propose des services d’infogérance et de modernisation des infrastructures numériques.

![image.png](image.png)

> 💬 Slogan : « L’open-source au service de votre performance. »
> 

🎯 **Pitch express** :

> Altinux accompagne les entreprises dans leur transformation numérique en s’appuyant sur des solutions libres, robustes et sécurisées.
> 
> 
> L’objectif : automatiser, sécuriser et simplifier les environnements informatiques, tout en garantissant la conformité réglementaire.
> 

---

ℹ️ Dans ce projet AP2, **Samy ALBISSER** et **Emre ALBAYRAK** représentent l’équipe technique et projet d’Altinux.

# 1. 🔹 Présentation du groupe

Dans le cadre de ce projet AP2, le groupe est composé de deux membres complémentaires aux profils techniques affirmés : **Samy ALBISSER** et **Emre ALBAYRAK**.

**Samy**, actuellement en alternance en support informatique à la **CARSAT**, est passionné par l’administration systèmes, la cybersécurité et les pratiques DevOps. Il occupe le rôle de **chef de projet**, et assure la coordination globale de l’AP2, la structuration documentaire ainsi que la préparation à la soutenance.

**Emre**, également alternant en informatique, possède un intérêt marqué pour le **déploiement d’outils, le helpdesk et la gestion de parc**. Il assure la mise en place technique des différentes solutions retenues, notamment l’installation, les tests, ainsi que l’intégration réseau.

Le binôme fonctionne en autonomie, avec une répartition claire des rôles et un partage équilibré des tâches. Une attention particulière est portée à la communication interne, à la validation croisée des livrables et à l’anticipation des contraintes projet.

![image.png](image%201.png)

---

# 2. ✅ Rappel des objectifs du projet

L’entreprise **PARCUS**, acteur local reconnu dans la gestion de parkings et services urbains, a récemment décidé de **reprendre le contrôle de son système d'information**, auparavant externalisé. Ce virage stratégique vise une meilleure **réactivité**, une **maîtrise complète des outils numériques internes**, ainsi qu’une **optimisation des coûts** sur le long terme.

Le projet confié à notre équipe consiste à imaginer, planifier et mettre en œuvre la **création d’une DSI interne** fictive mais réaliste, sur une base technique cohérente. Il s’agit donc d’un projet complet mêlant **choix technologiques, contraintes budgétaires, conformité réglementaire (notamment RGPD)** et pédagogie.

![image.png](image%202.png)

Pour cela, huit **lots fonctionnels** ont été définis :

- La mise en place d’un **annuaire d’authentification SSO** (Active Directory)
- Un système de **déploiement de logiciels automatisé**
- Un outil d’**assistance à distance** sécurisé et conforme RGPD
- Une solution de **gestion de parc et d’inventaire automatisé**
- Un outil de **ticketing pour incidents et demandes**
- Un **serveur de messagerie interne** (optionnel mais envisagé)
- Un système de **sauvegarde/restauration d’images système**
- Et enfin, une **documentation technique complète** accompagnant le tout

![image.png](image%203.png)

Ce projet repose sur plusieurs **contraintes imposées** :

- L’**auto-hébergement** total des solutions (aucun flux sortant autorisé)
- L’utilisation de **solutions open-source ou gratuites**, dans la mesure du possible
- La **compatibilité RGPD** pour l’ensemble des outils
- Une **base utilisateur de 83 personnes**, à prendre en compte pour les licences, les accès, et les performances attendues.

![image.png](image%204.png)

---

# 3. 📊 Étude comparative des solutions (extraits)

Nous avons comparé **2 à 4 outils par lot**, avec des tableaux simples et visuels, selon deux points de vue :

• **Technicien** (installation, support, maintenance)

• **Utilisateur final** (simplicité, expérience, RGPD)

**Exemples de critères clés utilisés :**

- Auto-hébergement ✅/❌
- Open-source ✅/❌
- Coût €
- Compatibilité OS (Windows 11, Linux)
- Mise à jour automatique ?
- Interface claire pour utilisateur ?
- Conforme RGPD (flux, consentement...)
- Fréquence de mise à jour
- Existence d’un support communautaire

Pour chaque solution, on a estimé une charge max réaliste en nombre d’utilisateurs ou postes, afin de garantir que ça tienne la route si PARCUS évolue. L’idée, c’est d’éviter de tout refaire si l’entreprise passe à 200 ou 500 utilisateurs.

| Niveau de charge | Utilisateurs max (indicatif) | Exemple de formulation |
| --- | --- | --- |
| 🟢 Faible | 1 à 50 utilisateurs | Idéal TPE / tests |
| 🟡 Moyen | 50 à 200 utilisateurs | OK pour PME |
| 🔵 Élevé | 200 à 1000 utilisateurs | Scalable avec tuning |
| 🔴 Très élevé | 1000+ utilisateurs | Nécessite infra solide |

**Tous les tableaux détaillés figurent en annexe.**

![image.png](image%205.png)

---

# 4. ✉️ Synthèse des solutions retenues

| Domaine | Solution retenue | Justification | Évolutivité |
| --- | --- | --- | --- |
| Annuaire & SSO | **Active Directory** | Compatible Windows, standard entreprise, facile à maintenir | 🔵 Jusqu’à 1000 utilisateurs sans souci |
| Déploiement logiciels | **opsi (Basic Edition)** | Open-source, multi-OS, déploiement silencieux, installable hors ligne | 🟡 Jusqu’à 300-400 postes avec config adaptée |
| Assistance à distance | **RustDesk** | Conforme RGPD (code unique, serveur relais interne), facile pour les utilisateurs | 🟢 50 à 100 connexions simultanées selon CPU |
| Gestion de parc | **GLPI + OCS Inventory** | Solution française, très complète, agents compatibles multi-OS | 🟡 OK jusqu’à 300 postes (serveur dédié recommandé) |
| Ticketing | **GLPI Helpdesk** | Intégration avec l’annuaire, tickets par mail, interface web user-friendly | 🟡 Scalabilité moyenne, plugins possibles |
| Messagerie | **Modoboa** | Auto-hébergé, mail interne, webmail moderne, conforme RGPD | 🟡 100 à 300 comptes mails, tuning possible |
| Sauvegarde | **FOG Project** | Clonage et restauration en réseau via PXE, robuste en LAN | 🟡 Jusqu’à 200 déploiements simultanés |

![image.png](image%206.png)

---

# 5. 🛀 Schéma réseau (voir annexe)

Un schéma réseau complet sera réalisé avec **Draw.io**, incluant :

- 6 serveurs (AD, GLPI, opsi, messagerie, RustDesk, FOG)
- 1 poste client (Windows 11 Pro)
- IP fixes sur plage 192.168.100.0/24
    
    ![graphviz (1).svg](graphviz_(1).svg)
    
    ![graphviz.svg](graphviz.svg)
    

---

# 6. 📊 Configuration technique & IP

| Nom machine | Rôle / Services installés | IP | OS | CPU (vCore) | RAM | Disque Système | Disque Data | Remarques clés |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SRV-AD | Active Directory, DNS, DHCP (optionnel) | 192.168.100.10 | Windows Server 2022 | 2 vCore | 4 Go | 60 Go | 80 Go | Service critique, stockage logs |
| SRV-GLPI | GLPI (Helpdesk + inventaire) | 192.168.100.11 | Debian 12 | 2 vCore | 4 Go | 60 Go | - | Agents installés sur clients |
| SRV-OPSI | Déploiement automatisé de logiciels | 192.168.100.12 | Debian 12 | 2 vCore | 4 Go | 60 Go | - | Multi-OS, gestion paquets |
| SRV-MAIL | Modoboa (serveur mail interne) | 192.168.100.13 | Debian 12 | 2 vCore | 4 Go | 60 Go | - | Serveur SMTP/IMAP + webmail |
| SRV-RD | RustDesk (assistance à distance, RGPD compliant) | 192.168.100.14 | Debian 12 | 1 vCore | 2 Go | 40 Go | - | Serveur relais auto-hébergé |
| SRV-FOG | FOG Project (sauvegarde/restauration d’images PXE) | 192.168.100.15 | Debian 12 | 2 vCore | 4 Go | 60 Go | 80 Go | Déploiement en multicast PXE |
| CLIENT-01 | Poste de test Windows 11 Pro | 192.168.100.100 | Windows 11 Pro | 2 vCore | 4 Go | 40 Go | - | Rejoint domaine, tests automatisation |

![image.png](image%207.png)

---

# 7. 🌟 Liste des tâches

1. Lecture du cahier des charges (2h)
2. Comparaison & choix des solutions (5h)
3. Planification du projet (2h)
4. Mise en place des VM (6h)
5. Installation de chaque service (12h)
6. Tests de fonctionnement (4h)
7. Schéma réseau (1h)
8. Rédaction de la documentation (5h)
9. Création du Gantt (1h)
10. Soutenance préparatoire (2h)

![image.png](image%208.png)

---

# 8. 📆 Planning & Gantt

➤ **Durée estimée totale : 33h**

- Répartie entre Samy et Emre : **~16,5h chacun**

➤ **Répartition sur 10 semaines :**

- **Temps prévisionnel :**
    
    [Diagramme de Gantt](https://www.notion.so/1c0dbb723a2880d7ac76cc22b80d00ed?pvs=21)
    
    ![test.png](test.png)
    

---

# 9. 💰 Budget

**🧾 Budget Interne (projet étudiant)**

> Aucune dépense réelle – projet fictif
> 

| Description | Quantité | Prix unitaire HT | Total HT | Total TTC |
| --- | --- | --- | --- | --- |
| Matériel (machines virtuelles Proxmox) | 1 | 0,00 € | 0,00 € | 0,00 € |
| Logiciels open-source (GLPI, FOG, etc.) | 6 | 0,00 € | 0,00 € | 0,00 € |
| Windows Server 2022 (clé éducative) | 1 | 0,00 € | 0,00 € | 0,00 € |
| Documentation, Gantt, schémas | 1 | 0,00 € | 0,00 € | 0,00 € |
| Travail du groupe (Samy / Emre) | 40h | 0,00 € | 0,00 € | 0,00 € |
| **Total** | - | - | **0 €** | **0 €** |

🧾 **Budget Externe – Version réaliste pour 83 utilisateurs**

| Description | Quantité | Prix unitaire HT | Total HT | Total TTC |
| --- | --- | --- | --- | --- |
| Chef de projet (Samy – 20h) | 1 | 60 € | 1 200 € | 1 440 € |
| Technicien infra (Emre – 20h) | 1 | 60 € | 1 200 € | 1 440 € |
| **Windows Server 2022 Standard** | 1 | 100 € (éducatif) | 100 € | 120 € |
| **83 CAL Utilisateur (User CAL)** | 83 | 34,35 € (HT) | 2 851,05 € | 3 421,26 € |
| **83 RDS Device CAL** | 83 | 76,99 € (HT) | 6 389,17 € | 7 666,99 € |
| **opsi Enterprise – licence annuelle** | 83 postes | 8,99 € (HT) | 746,17 € | 895,40 € |
| Matériel serveur physique (Proxmox) | 1 | 500 € | 500 € | 600 € |
| Disque dur (sauvegarde) | 1 | 80 € | 80 € | 96 € |
| Switch 1Gbps | 1 | 40 € | 40 € | 48 € |
| Câblage, accessoires | 1 lot | 30 € | 30 € | 36 € |
| **Total HT** | - | - | **13 136,39 €** | **15 763,01 €** |
| + 15% imprévus | - | - | 1 970,46 € | 2 364,45 € |
| **Total TTC final avec imprévus** | - | - | - | **18 127,46 €** |

---

**🧾 Détail des calculs importants :**

- **CAL Utilisateur (Windows Server)** → 171,75 € HT pour 5 utilisateurs = **34,35 € HT / user**
- **CAL RDS Device** → 384,98 € HT pour 5 devices = **76,99 € HT / device**
- **opsi** : 83 × 8,99 € = 746,17 € HT

---

⚠️ Les licences CAL sont obligatoires pour chaque utilisateur accédant à un serveur Windows.
Dans un contexte réel de 83 utilisateurs, cela représente un investissement non négligeable à prévoir dans le budget global.
Idem pour les CAL RDS si l’accès Bureau à distance est prévu.
Opsi étant open-source dans sa version de base, une version entreprise payante est estimée ici pour correspondre à une montée en charge professionnelle.

---

# 10. ⚠️ Tableau Risques / Solutions

Voir section annexe "Risques" avec :

- Tableau synthétique
- Fiches préventives (fp1 à fp5)
- Fiches correctives (fc1 à fc3)

---

# 11. 📄 Conclusion

Nous avons sélectionné des solutions **adaptées à la structure de PARCUS**, respectueuses du RGPD, compatibles avec un déploiement local et faciles à documenter/tester. Le projet est techniquement réaliste, pédagogiquement intéressant et présenté avec une vision professionnelle.

Prochaine étape : **mise en place des VM et tests techniques**.

# 12. 📎 Annexes

---

## A1. Annuaire d’authentification (SSO)

| Ordre | Solution | Type | Technicien | Utilisateur | RGPD / Sécurité | Compatibilité | Pourquoi ce choix | Support / Maintenance | Évolutivité | Licence / Coût |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ✅ 1 | **Active Directory** | Propriétaire (Windows Server) | Installation sur Windows Server, GPO, DNS, Kerberos, éprouvé en entreprise | Connexion automatique au domaine | Très sécurisé (Kerberos, LDAP), conforme RGPD en interne | Windows 10/11, Linux/macOS (via LDAP) | Standard en entreprise, connu, simple à maintenir en BTS | Support Microsoft professionnel, documentation exhaustive | 🔵 Élevé : jusqu'à 1 000 utilisateurs sans souci | Licence commerciale avec CALs |
| 2 | **Samba 4 AD** | Open-source (Linux) | Plus technique, fichiers de configuration, similaire à AD sous Linux | Identique pour l’utilisateur (intégration au domaine) | Sécurité correcte si bien configuré | Windows 10/11, Linux, macOS | Alternative gratuite, mais moins connue/supportée | Communauté active, documentation disponible, support professionnel via tiers | 🟡 Moyen : jusqu'à 200 utilisateurs, nécessite une expertise Linux | Gratuit (GPL) |
| 3 | **Keycloak** | Open-source (Red Hat) | Interface web, gestion SSO, OIDC/SAML, moderne | Portail web intuitif pour toutes les applications | Chiffrement fort, MFA, conforme RGPD si hébergé localement | Tous OS (web) | Idéal pour applications web, pas indispensable pour BTS | Documentation complète, communauté Red Hat | 🔵 Élevé : scalable jusqu'à 1 000+ utilisateurs avec clustering | Gratuit (Apache 2.0) |
| 4 | **OpenLDAP** | Open-source | CLI, LDIF, très flexible | Pas d’interface native | Correcte | LDAP natif multi-OS | Solide mais trop technique sans interface graphique | Forte communauté, documentation technique détaillée | 🟡 Moyen : jusqu'à 500 utilisateurs, nécessite une expertise technique | Gratuit |

---

## A2. Déploiement automatisé des logiciels

| Ordre | Solution | Type | Technicien | Utilisateur | Offline ? | MAJ auto | Compatibilité | Pourquoi ce choix | Support / Maintenance | Évolutivité | Licence / Coût |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ✅ 1 | **opsi** | Open-source | Serveur Linux, agent Windows/Linux, déploiement massif possible | Silencieux, aucune action utilisateur | ✅ Oui | ✅ Si scripté | Windows 10/11, Linux | Multi-OS, scriptable, bon retour en BTS | Communauté active, support professionnel disponible | 🔵 Élevé : jusqu'à 1 000 postes avec configuration multi-site | Gratuit (GPL) |
| 2 | **WAPT** | Open-source | Interface web, serveur + paquets `.wapt`, français | Transparent pour l’utilisateur | ✅ Oui | ✅ Si configuré | Windows, Linux | Français, adapté aux écoles, mais moins complet que opsi | Communauté française active, documentation claire, support professionnel disponible | 🟡 Moyen : jusqu'à 500 postes, adapté aux environnements simples | Gratuit en version Community, version Enterprise payante |
| 3 | **PDQ Deploy** | Freemium/Pro | Facile à prendre en main, pas d’agent requis | Parfois redémarrage demandé | ❌ Non | ✅ Oui (console) | Windows uniquement | Ultra simple, mais version Pro nécessaire pour fonctionnalités avancées | Support payant disponible avec la version Pro | 🟡 Moyen : jusqu'à 250 postes, limité à l’environnement Windows | Version gratuite limitée, version Pro payante |

---

## A3. Assistance à distance (conformité RGPD)

| Ordre | Solution | Type | Technicien | Utilisateur | Consentement | Flux sécurisé | Compatibilité | Pourquoi ce choix | Support / Maintenance | Évolutivité | Licence / Coût |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ✅ 1 | **RustDesk** | Open-source | Serveur relais interne simple, interface claire | Lance l’outil et donne un code = action simple | ✅ Code unique requis | ✅ 100% local | Windows, Linux, macOS, Android | Conforme RGPD, fluide, proche de TeamViewer | Communauté GitHub active, documentation disponible | 🟡 Moyen : jusqu'à 100 connexions simultanées avec serveur local | Gratuit (GPL-3) |
| 2 | **MeshCentral** | Open-source | Plus complexe (Node.js), agents lourds | Peut être trop technique pour l’utilisateur final | ✅ Paramétrable | ✅ TLS/HTTPS | Windows, Linux, macOS | Très complet mais trop lourd pour BTS | Documentation complète, communauté active | 🔵 Élevé : jusqu'à 500 connexions simultanées avec configuration avancée | Gratuit |
| ❌ 3 | **TeamViewer** | Propriétaire | Dépend des serveurs externes, abonnement pro | Simple, rapide | ⚠️ Code, mais flux externe | ❌ Serveurs TeamViewer | Multi-OS | Non conforme RGPD en local → rejeté | Support professionnel disponible | 🔵 Élevé : scalable à grande échelle, dépend des serveurs externes | Abonnement payant |

---

## A4. Gestion de parc & inventaire automatisé (suite)

| Ordre | Solution | Type | Technicien | Utilisateur | Agent requis | MAJ | Compatibilité | Pourquoi ce choix | Support / Maintenance | Évolutivité | Licence / Coût |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ✅ 1 | **GLPI + OCS Inventory** | Open-source | GLPI pour tickets + inventaire ; OCS pour remontée automatique | Interface claire pour créer un ticket ou voir son matériel | ✅ Oui (OCS agent) | ✅ Actif | Windows 10/11, Linux, macOS | Solution complète, solide et connue | Communauté active, support professionnel possible | 🔵 Élevé : jusqu’à 1 000 équipements si bien configuré | Gratuit (GPL) |
| 2 | **Snipe-IT** | Open-source | Gestion manuelle (attribution, licences, parc) | Peu d’impact direct, utilisé par les techniciens | ❌ Non | ✅ | Web (Docker, Linux) | Design moderne, utile si l’inventaire automatique n’est pas prioritaire | Communauté GitHub active, docs modernes | 🟡 Moyen : jusqu’à 300–400 postes gérables | Gratuit (MIT) |

---

## A5. Ticketing & gestion des demandes

| Ordre | Solution | Type | Technicien | Utilisateur | Intégration AD | Ticket par mail | Pourquoi ce choix | Support / Maintenance | Évolutivité | Licence / Coût |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ✅ 1 | **GLPI Helpdesk** | Open-source | Interface web, suivi, assignation, notifications | Portail web simple pour créer et suivre un ticket | ✅ Oui (LDAP) | ✅ Oui (support@...) | Intégré avec GLPI + AD, simple et efficace | Communauté active, support pro dispo | 🔵 Élevé : jusqu’à 1 000 tickets/mois sans problème | Gratuit (GPL) |
| 2 | **osTicket** | Open-source | Plus léger, interface plus simple, paramétrage rapide | Interface claire, mail de suivi automatique | ✅ Via plugin | ✅ Oui | Bonne alternative mais moins intégrée que GLPI | Documentation complète, communauté active | 🟡 Moyen : adapté pour environnements < 300 utilisateurs | Gratuit |

---

## A6. Serveur de messagerie (optionnel)

| Ordre | Solution | Type | Technicien | Utilisateur | Open-source | MAJ | Fonctions clés | Pourquoi ce choix | Support / Maintenance | Évolutivité | Licence / Coût |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ✅ 1 | **Modoboa** | Open-source | Interface web, stack modulaire, install auto | Webmail moderne, simple d’utilisation | ✅ Oui | ✅ | Mail, antivirus, antispam, webmail | Français, simple à installer, adapté pour l'interne | Communauté francophone active | 🟢 Bonne : jusqu’à 200 utilisateurs sans charge élevée | Gratuit (GPL) |
| 2 | **iRedMail** | Open-source | Script d’installation tout-en-un, fiable | Webmail type Roundcube, administration facile | ✅ Oui | ✅ | Mail, antispam, gestion utilisateurs | Très complet, adapté à la production | Documentation complète, communauté active | 🟢 Bonne : jusqu’à 500 utilisateurs | Gratuit (sauf support pro) |
| 3 | **Zimbra (OS)** | Partiellement open-source | Installation lourde, gestion complexe (RAM, I/O) | Webmail complet avec agenda, tâches | ⚠️ Partielle | ✅ | Suite collaborative | Trop lourd pour un projet BTS | Support pro sur version payante | 🔵 Excellente, mais coûteuse en ressources | Gratuit (Community), payant (Pro) |

---

## A7. Sauvegarde / Restauration d’images

| Ordre | Solution | Type | Technicien | Utilisateur | Offline | Compatibilité | Pourquoi ce choix | Support / Maintenance | Évolutivité | Licence / Coût |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ✅ 1 | **FOG Project** | Open-source | Serveur PXE Linux, déploiement d’images sur le réseau | Boot PXE → restauration automatique sans effort | ✅ Oui | Windows, Linux | Clonage efficace, utilisé dans de nombreux lycées | Communauté active, docs techniques claires | 🟢 Bonne : jusqu’à 500 postes clonés en multicast LAN | Gratuit (GPL) |
| 2 | **Veeam Agent (Community)** | Propriétaire | Agent installé, sauvegarde planifiée incrémentale | Restauration possible par technicien uniquement | ⚠️ Mi-offline | Windows, Linux | Très bien pour postes critiques, limitations sur version gratuite | Support pro sur version payante | 🟡 Moyenne : 10 postes max (version gratuite), + si payant | Gratuit (jusqu’à 10 agents), payant ensuite |

---

## **A8. Fiches Préventives et Correctives – Risques Projet PARCUS**

---

## A9. ⚠️ **Tableau des Risques – Projet PARCUS (DSI interne)**

| NB | Catégorie | Risque | Gravité (G) | Probabilité (P) | Niveau de risque (G×P) | Description | Prévention | Correction | Couverture |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Technique | Pertes de données | 9 | 7 | **63** (⚠️ élevé) | Perte de fichiers, docs ou VMs suite à erreur, panne ou mauvaise gestion de versions | fp1 | fc1 | ✅ Très bien couvert |
| 2 | Réseau | VM inaccessible / problème IP | 7 | 6 | **42** (⚠️ moyen) | Perte de connectivité liée à un conflit IP, bridge mal affecté ou erreur dans le plan réseau | fp2 | fc2 | ✅ Bien couvert |
| 3 | RGPD / Juridique | Connexion à distance non conforme | 8 | 4 | **32** (⚠️ modéré) | Assistance distante lancée sans consentement explicite → non conformité RGPD | fp3 | fc3 | ✅ Bien couvert |
| 4 | Organisationnel | Déséquilibre binôme (charge inégale) | 5 | 6 | 30 (Modéré) | Retards ou tensions internes si le travail est mal réparti entre les membres du groupe | fp4* | fc4* | Moyennement couvert |
| 5 | Logiciel / Tech | Instabilité d’un outil open-source | 6 | 5 | 30 (Modéré) | Un service open-source comme GLPI ou opsi plante suite à bug ou MAJ instable | fp5* | fc5* | Bien couvert |

---

🔷 Légende :

- **Gravité (G)** : Impact sur le projet si le risque se réalise (de 1 à 10)
- **Probabilité (P)** : Chances que le risque arrive (de 1 à 10)
- **Niveau de risque** = Gravité × Probabilité
- **Prévention / Correction** : Renvoie aux fiches préventives et correctives (annexes A9)
- Les fiches **fp4/fp5** et **fc4/fc5** sont **optionnelles** mais tu peux les rédiger en plus si tu veux aller encore plus loin 💪

## A10. ✅ **Fiches Préventive (fp)**

---

### ✅ **Fiche Préventive fp1 – Pertes de données**

- **Référence** : FPD-PARCUS-001
- **Type de risque** : Technique – Données

🔎 **Description du risque :**

Le risque de pertes de données concerne les fichiers critiques du projet : configurations système, documentations techniques, schémas réseau, captures d’écran, scripts ou fichiers de déploiement.

Ce risque peut provenir de :

- Suppression involontaire
- Surcharge ou crash de VM non sauvegardée
- Conflits de versions entre membres
- Stockage unique sur une seule machine

🛡️ **Mesures préventives :**

1. Mise en place de **snapshots réguliers** des machines virtuelles sous Proxmox (avant chaque modification majeure).
2. Réalisation de **sauvegardes manuelles hebdomadaires** (archives .zip des documents, configs et captures).
3. Stockage des documents partagés sur **un drive collaboratif sécurisé** (ex. OneDrive partagé du binôme).
4. Mise en place d’un **workflow de vérification croisée** : chaque livrable est validé par le binôme avant finalisation.
5. Rédaction d’une procédure claire de **nommage et d’organisation des fichiers** pour éviter les doublons ou l’écrasement.

👤 **Responsables désignés :**

- **Samy** : Documentation, arborescence des fichiers, procédures
- **Emre** : Sauvegardes techniques, snapshots, restauration

![image.png](image%209.png)

---

### ✅ **Fiche Préventive fp2 – Problèmes réseau / IP**

- **Référence** : FPD-PARCUS-002
- **Type de risque** : Réseau – Connectivité

🔎 **Description du risque :**

Perte de communication entre les VMs du projet (serveurs et client) due à :

- Conflit d’adresses IP
- Mauvaise configuration du bridge Proxmox
- Passerelle ou DNS mal configurés
- Mauvaise interface réseau (NAT au lieu de Host-Only)

🛡️ **Mesures préventives :**

1. Attribution d’adresses **IP fixes** sur la plage définie (192.168.100.0/24) pour toutes les VMs.
2. Création d’un **fichier de référence des IP** (ex : `Plan_IP.txt`) versionné et partagé dans le dossier projet.
3. Réseau isolé en mode **Host-Only (VMNet1)** pour éviter les conflits extérieurs et simuler un LAN sécurisé.
4. Réalisation de **tests systématiques de connectivité** après chaque ajout/modification (ping, SSH, accès web).
5. Mise en place d’un schéma réseau **annoté et cohérent** pour éviter les oublis d’IP ou de rôle.

👤 **Responsables désignés :**

- **Emre** : Plan IP, configuration réseau dans Proxmox, test d’accès
- **Samy** : Documentation réseau, cohérence entre schéma et plan IP

![image.png](image%2010.png)

---

### ✅ **Fiche Préventive fp3 – RGPD & Connexion non autorisée**

- **Référence** : FPD-PARCUS-003
- **Type de risque** : Juridique / RGPD – Conformité

🔎 **Description du risque :**

Connexion à distance sur un poste utilisateur sans son **consentement explicite**, ce qui constitue une **non-conformité RGPD** et peut invalider le projet. Risques liés :

- Outil d’assistance utilisé sans autorisation utilisateur
- Connexion automatique ou persistante à l’insu de l’usager
- Manque de traçabilité ou d’audit

🛡️ **Mesures préventives :**

1. Utilisation exclusive de **RustDesk en mode auto-hébergé**, avec activation obligatoire du **code unique à usage unique**.
2. Aucune assistance distante possible **sans action volontaire de l’utilisateur** (ex : ouverture de RustDesk par l’usager).
3. Stockage des **logs RustDesk localement** pour vérification en cas de doute.
4. Intégration d’un **chapitre RGPD dans la soutenance orale**, démonstration en direct incluse.
5. Rappel du **cadre légal** dans la documentation livrée avec le projet.

👤 **Responsables désignés :**

- **Samy** : Cadre RGPD, documentation, oral
- **Emre** : Installation de RustDesk serveur + configuration sécurisée

![image.png](image%2011.png)

---

### ✅ Fiche Préventive **fp4 – Déséquilibre dans le binôme**

- **Référence** : FPD-PARCUS-004
- **Type de risque** : Organisationnel – Répartition du travail

🔎 **Description du risque :**

Dans un travail en binôme, une mauvaise répartition des tâches ou un manque de communication peut entraîner :

- Un déséquilibre de la charge de travail (un membre fait tout)
- Une démotivation ou une frustration
- Un retard dans les livrables
- Des difficultés de présentation lors des oraux (si un membre ne maîtrise pas tous les aspects)

🛡️ **Mesures préventives :**

1. Création d’un **document partagé de suivi des tâches** (ex : Trello ou Google Sheets) accessible aux deux membres.
2. Répartition claire des rôles dès le début du projet (ex : Samy = Docs & oral, Emre = Tech & déploiement).
3. Réunions hebdomadaires de 10–15 min pour faire le point et ajuster si besoin.
4. Chaque membre doit maîtriser **toutes les étapes clés** du projet (même celles gérées par l’autre) pour l’oral.
5. Si déséquilibre identifié : signalement immédiat à l’autre membre + réajustement via planning.

👤 **Responsables désignés :**

- Samy : Répartition documentaire et présentation
- Emre : Suivi technique et installation

![image.png](image%2012.png)

---

### ✅ Fiche Préventive **fp5 – Instabilité d’un outil open-source**

- **Référence** : FPD-PARCUS-005
- **Type de risque** : Technique – Logiciel

🔎 **Description du risque :**

Les outils open-source sont puissants, mais peuvent présenter certains risques :

- Bugs ou incompatibilités non corrigés
- Dépendance à une communauté bénévole
- Manque de support ou documentation
- Failles de sécurité non corrigées à temps

Exemples à risque : GLPI, opsi, RustDesk, Modoboa...

🛡️ **Mesures préventives :**

1. Vérifier la **fréquence des mises à jour** et l’activité de la communauté (GitHub, forums...).
2. Préférer les solutions déjà utilisées en entreprise ou dans d’autres BTS.
3. Réaliser des **tests de stabilité sur plusieurs jours** dans Proxmox avant validation finale.
4. Garder une **solution alternative prête** en cas de bug bloquant (ex : WAPT au lieu de opsi).
5. Documenter toute installation pas à pas pour pouvoir réinstaller rapidement.

👤 **Responsables désignés :**

- Samy : Veille sur les failles, versions, alternatives
- Emre : Tests de stabilité, sandbox Proxmox

![image.png](image%2013.png)

## A11. 🛠 **Fiches Correctives (fc)**

---

### ✅ **fc1 – Procédure de correction : Données perdues**

- **Référence** : FCD-PARCUS-001

🛠️ **Procédures à suivre :**

1. Restaurer la machine virtuelle depuis le **dernier snapshot Proxmox disponible**.
2. Si snapshot indisponible : **réimporter manuellement** les fichiers depuis la dernière sauvegarde partagée (zip OneDrive).
3. Informer immédiatement le professeur référent si les données sont **irrécupérables**.
4. Documenter l’incident dans un fichier `log_incident.txt` (date, cause, action corrective).
5. Mettre à jour la **procédure de sauvegarde** pour éviter la récidive.

![image.png](image%2014.png)

---

### ✅ **fc2 – Procédure de correction : VM inaccessible**

- **Référence** : FCD-PARCUS-002

🛠️ **Procédures à suivre :**

1. Accéder à la VM via la console Proxmox (interface web ou terminal).
2. Vérifier l’adresse IP et la correspondance avec le plan IP prévu.
3. Réaffecter une IP correcte manuellement si nécessaire (`ip a` ou fichier de config).
4. Vérifier le bridge utilisé (host-only recommandé).
5. Redémarrer proprement la VM si nécessaire.
6. Mettre à jour le `Plan_IP.txt` si un changement a été effectué.

![image.png](image%2015.png)

---

### ✅ **fc3 – Procédure de correction : RGPD non respecté**

- **Référence** : FCD-PARCUS-003

🛠️ **Procédures à suivre :**

1. **Clôturer immédiatement la session distante** suspecte ou non autorisée.
2. Informer l’utilisateur concerné et **s’excuser formellement** (email / message écrit).
3. Vérifier les paramètres de RustDesk : **forcer le code unique** à chaque session.
4. Vérifier les logs de connexion sur le serveur RustDesk.
5. Mettre à jour la documentation RGPD et intégrer une **preuve de conformité** dans la soutenance orale.
6. Réaliser une **démonstration corrigée** pour les enseignants lors de la prochaine session.

![image.png](image%2016.png)

---

### ✅ **fc4 – Procédure de correction : Rééquilibrage du binôme**

- **Référence** : FCD-PARCUS-004

🛠️ **Procédures à suivre :**

1. Identifier le problème lors d’une réunion courte entre membres (retard, surcharge...).
2. Réattribuer certaines tâches restantes pour équilibrer les efforts.
3. Si nécessaire, **alléger la charge d’un membre** pour éviter le burn-out ou la perte de motivation.
4. Préparer ensemble une **soutenance équilibrée** (chaque membre doit pouvoir répondre à toutes les questions).
5. Informer le professeur si un déséquilibre persiste ou affecte la qualité du travail.

![image.png](image%2017.png)

---

### ✅ **fc5 – Procédure de correction : Instabilité d’un logiciel open-source**

- **Référence** : FCD-PARCUS-005

🛠️ **Procédures à suivre :**

1. Identifier précisément le problème (bug, crash, lenteur, incompatibilité).
2. Consulter la documentation ou les issues GitHub du projet.
3. Rechercher un **correctif ou un patch**, ou rétrograder à une version stable antérieure.
4. Si blocage complet : remplacer l’outil par une **alternative déjà testée** (ex : passer de Modoboa à iRedMail).
5. Mettre à jour la documentation, schéma, plan IP et tableau des solutions retenues.
6. Expliquer le changement dans le livrable + oral comme une **décision de gestion de risque technique**.

![image.png](image%2018.png)

---

*Document réalisé par le Groupe 2 Samy & Emre – BTS SIO SISR – 2025*