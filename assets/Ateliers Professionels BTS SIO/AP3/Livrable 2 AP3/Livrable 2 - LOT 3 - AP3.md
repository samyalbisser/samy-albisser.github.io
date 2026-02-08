# 💾 LOT 3 - Configuration du Stockage (SAN/NAS) et Système de Fichiers Distribués (DFS)

[⬅️ Retour au Menu Livrable 2](../%F0%9F%A7%B0%20LIVRABLE%202%20%E2%80%93%20Documentation%20Technique%202dadbb723a28805eb87fca5c5941ed36.md) ***|*** [🏡 Retour à l'accueil](../../AP3%20Groupe%202%20-%20Samy%20ALBISSER%20&%20Emre%20ALBAYRAK%20265dbb723a28805eaba8c7aa4849492d.md)

***La Haute Disponibilité : Stockage SAN et Ubiquité des Données***

> La donnée est le patrimoine le plus précieux de l'école. Ce lot répond à l'exigence critique de disponibilité et de protection de l'information. Nous avons mis en œuvre une stratégie de stockage hybride combinant la puissance du **SAN iSCSI sous TrueNAS Core** pour des sauvegardes immuables, et la flexibilité du **DFS (Système de fichiers distribué)** pour les utilisateurs. Grâce à une réplication en maille pleine (Full Mesh), les fichiers suivent l'utilisateur quel que soit son site de connexion, tandis que les mécanismes de **clichés instantanés** et de sauvegarde externalisée assurent une résilience maximale face aux incidents et aux erreurs humaines.
> 

---

## 0. Plan d'Adressage et de Stockage (LOT 3)

Ce tableau récapitule la configuration du stockage pour les deux sites. Nous distinguons les disques locaux (pour les données chaudes) des volumes iSCSI (pour les sauvegardes).

| **Site** | **Serveur Hôte** | **Interface SAN (iSCSI)** | **Disque Données (Local)** | **Disque Sauvegarde (iSCSI)** | **Rôle du Volume** |
| --- | --- | --- | --- | --- | --- |
| **Site A** | STG-SAN01 (TrueNAS) | 172.16.10.20 | - | Stockage ZFS | Cible iSCSI "Backup01" |
| **Site A** | STG-SRVW01 | 172.16.10.10 | **E:** (DATAS01) | **F:** (Backup01) | Production & Backup |
| **Site A** | STG-SRVW02 | 172.16.10.11 | **E:** (DATAS02) | - | Production (Réplica) |
| **Site B** | STG2-SAN01 (TrueNAS) | 172.16.20.20 | - | Stockage ZFS | Cible iSCSI "Backup02" |
| **Site B** | STG2-SRVW01 | 172.16.20.10 | **E:** (DATAS03) | **F:** (Backup02) | Production & Backup |
| **Site B** | STG2-SRVW02 | 172.16.20.11 | **E:** (DATAS04) | - | Production (Réplica) |

---

## 1. Mise en œuvre du SAN (TrueNAS Core)

### 1.1. Objectif Stratégique

> Objectif : Déployer et configurer les serveurs de stockage TrueNAS Core (STG-SAN01 et STG2-SAN01) sur le réseau dédié SAN (VLAN isolé configuré au LOT 1). L'objectif est de fournir un espace de stockage block (iSCSI) sécurisé pour héberger les sauvegardes complètes des serveurs Windows, garantissant ainsi l'intégrité des données via le système de fichiers ZFS et la séparation physique des flux de production et de sauvegarde.
> 

### 1.2. Configuration Réseau TrueNAS (Console)

Sur les VM `STG-SAN01` et `STG2-SAN01` :

1. Au menu principal de la console, choisir **1) Configure Network Interfaces**.
2. Utilisez les flèches pour descendre sur **`ipv4_dhcp`**.
3. Appuyez sur **Entrée** ou **Espace** pour changer la valeur de `Yes` à **`No`**.
4. Faites de même pour **`ipv6_auto`** : passez-le à **`No`**.
5. Dans alias rentrer : 
    - Pour **Site A** : IP `172.16.10.20`, Masque `/24`.
    - Pour **Site B** : IP `172.16.20.20`, Masque `/24`.

### 1.3. Configuration du Service iSCSI (Interface Web)

Accéder à l'interface web (ex: `http://172.16.10.20`) depuis un serveur Windows ou un client.

**Étapes à reproduire sur les deux sites :**

1. **Configuration de TrueNAS :** 
    - System > Localization > Settings
    - Console Keyboard Map : French (AZERTY)
    - Timezone : Europe/Paris
2. **Configuration réseau TrueNas :** 
    - Network > Global Configuration > Settings
    - Hostname : STG-SAN01 pour le site A et STG2-SAN01 pour le site B
    - Domain : ief.local
    - Namerserver 1 : 192.168.100.10 pour le site A et 192.168.200.10 pour le site B
    - Namerserver 2 : 192.168.100.11 pour le site A et 192.168.200.11 pour le site B
    - IPV4 Default Gateway : 172.16.10.1 pour le site A et 172.16.20.1 pour le site B
3. **Création du Pool ZFS :**
    - *Storage > Pools > Add*.
    - Créer un pool nommé `TankBackup`. Sélectionner le disque de 20Go disponible.
    - Cliquer sur Créer.
4. **Création du Zvol (Disque virtuel) :**
    - *Storage > Pools > TankBackup > 3 points > Add Zvol*.
    - Nom : `zvol_backup`.
    - Taille : `75 GiB` (Laisser une marge de sécurité).
    - Compression : `LZ4` (Recommandé).
5. **Configuration iSCSI (Shares > Block Shares (iSCSI)) :**
    - **Portals** : Ajouter un portail. IP : `0.0.0.0` (ou l'IP SAN spécifique). Port : `3260`.
    - **Initiators** : Ajouter. Autoriser tous les initiateurs (`ALL` / `ALL`) pour faciliter la connexion dans le VLAN sécurisé, ou restreindre aux IP `172.16.xx.10/11`.
    - **Targets** : Ajouter. Nom : `iqn.2025-10.local.ief:backup01` (Adaptez pour site B : `backup02`). Mode : `None` (Pas d'auth CHAP pour l'instant, ou configurer selon Annexe 1 optionnelle).
    - **Extents** : Ajouter. Nom : `extent_backup`. Type : `Device`. Device : `zvol_backup`.
    - **Associated Targets** : Lier la Target à l'Extent créée.
6. **Démarrage du service :**
    - *Système > Servcices*.
    - Activer **iSCSI**. Cocher **Start Automatically**.

---

## 2. Préparation du Stockage sur Windows Server

### 2.1. Objectif

> Objectif : Initialiser les volumes de données sur les quatre serveurs Windows. Nous devons configurer deux types de disques : le disque dur virtuel local de 60 Go qui hébergera les données utilisateurs (DATASxx) et le disque iSCSI distant provenant du SAN qui recevra les sauvegardes (Backupxx).
> 

### 2.2. Initialisation du Disque de Données (Local)

**Sur les 4 serveurs (GUI et Core) :**

1. Ouvrir le **Gestionnaire de disque** (`diskmgmt.msc`) sur GUI ou utiliser `diskpart` sur Core.
2. Mettre le Disque 1 (60 Go) en ligne et l'initialiser (GPT).
3. Créer un nouveau volume simple :
    - Lettre de lecteur : **E:**
    - Nom de volume : **DATAS01** (Adapter : `DATAS02`, `DATAS03`, `DATAS04`).
    - Système de fichiers : **NTFS**.
4. Créer le dossier racine : `E:\DATAS01` (et respectivement pour les autres serveurs).

### 2.3. Connexion de l'Initiateur iSCSI (Sauvegarde)

**Uniquement sur STG-SRVW01 (Site A) et STG2-SRVW01 (Site B) :**

1. Ouvrir l'outil **Initiateur iSCSI**. Accepter le démarrage du service.
2. Onglet **Cibles** :
    - Entrer l'IP du SAN local (ex: `172.16.10.20` pour Site A).
    - Cliquer sur **Connexion Rapide**.
    - Statut doit passer à "Connecté".
3. Onglet **Volumes et périphériques** :
    - Cliquer sur **Configuration automatique**.
4. Retourner dans `diskmgmt.msc` :
    - Un nouveau disque de 75 Go apparaît.
    - Initialiser, créer un volume simple.
    - Lettre : **F:**
    - Nom : **Backup_iSCSI**.

---

## 3. Déploiement DFS et DFSR (Système de Fichiers Distribués)

### 3.1. Objectif

> Objectif : Mettre en place un Espace de Noms unifié (\\IEF.LOCAL\INTRANET) permettant aux utilisateurs d'accéder à leurs fichiers de manière transparente, quel que soit leur site géographique. La réplication DFSR en maille pleine (Full Mesh) entre les 4 serveurs garantira que toute modification de fichier sur un site soit répliquée quasi-instantanément sur les trois autres serveurs, assurant ainsi la haute disponibilité des données (Objectif n°4 du CdC).
> 

### 3.2. Installation des Rôles

Sur les **4 serveurs**, installer le rôle **Serveur de fichiers** incluant :

- **Espace de noms DFS**
- **Réplication DFS**

Powershell (pour les Core et GUI) :

```powershell
Install-WindowsFeature -Name FS-DFS-Namespace, FS-DFS-Replication -IncludeManagementTools
```

### 3.3. Configuration de l'Espace de Noms (Namespace)

**Sur STG-SRVW01 (GUI) :**

1. Ouvrir la console **Gestion du système de fichiers distribués**.
2. Clic droit sur *Espaces de noms* > **Nouvel espace de noms**.
3. Serveur : `STG-SRVW01`.
4. Nom : **INTRANET**.
5. Type : **Espace de noms de domaine** (Mode 2008 R2 activé).
6. Valider. Le chemin d'accès est désormais : `\\IEF.LOCAL\INTRANET`.

**Redondance de l'Espace de Noms :**

1. Clic droit sur le namespace créé > **Ajouter un serveur d'espace de noms**.
2. Ajouter `STG-SRVW02`, `STG2-SRVW01` et `STG2-SRVW02`.
    - *Résultat : Si le serveur 01 tombe, l'accès au chemin réseau reste fonctionnel.*

### 3.4. Création du Groupe de Réplication (DFSR)

1. Dans la console DFS, clic droit sur *Réplication* > **Nouveau groupe de réplication**.
2. Type : **Groupe de réplication polyvalent**.
3. Nom : `RG_DATA_IEF`.
4. Membres : Ajouter les **4 serveurs** (`STG-SRVW01`, `02`, `STG2-SRVW01`, `02`).
5. Topologie : **Maille pleine** (Full Mesh).
    - *Note : Cela garantit que chaque serveur parle à tous les autres.*
6. Planification : **Bande passante complète** (ou limitée selon besoins VPN, mais complète pour le test).
7. Membre principal : `STG-SRVW01`.
8. Dossiers à répliquer :
    - Ajouter. Chemin local : `E:\DATAS01`.
    - Nom du dossier répliqué : **Partage_General**.
9. Modifier les chemins locaux pour les autres membres :
    - STG-SRVW02 : `E:\DATAS02`.
    - STG2-SRVW01 : `E:\DATAS03`.
    - STG2-SRVW02 : `E:\DATAS04`.
10. Valider la création.

### 3.5. Publication dans l'Espace de Noms

1. Une fois la réplication créée, l'assistant propose de publier le dossier.
2. Publier le dossier répliqué dans l'espace de noms :
    - Dossier parent : `\\IEF.LOCAL\INTRANET`.
    - Nom du dossier : **Documents**.
3. Vérification : Accéder à `\\IEF.LOCAL\INTRANET\Documents`. Créer un fichier texte. Vérifier qu'il apparaît sur le disque `E:` des 4 serveurs.

---

## 4. Organisation et Permissions (Conformité Annexe 2)

### 4.1. Structure des Dossiers

Dans le dossier répliqué (`E:\DATAS01`), créer l'arborescence suivante :

- `GRP1`
- `GRP2`
- `TRANSFERT`
- `Users` (Pour la redirection des dossiers personnels)

### 4.2. Application des Permissions NTFS et Partage

Il est recommandé de gérer les droits via **NTFS** et de laisser le **Partage** en "Tout le monde : Contrôle Total" (Microsoft Best Practice).

1. **Dossier TRANSFERT** :
    - Clic droit > Propriétés > Sécurité.
    - Ajouter le groupe `Utilisateurs du domaine`.
    - Droit : **Modification** (Lecture/Écriture).
2. **Dossier GRP1** :
    - Désactiver l'héritage (Convertir en droits explicites).
    - Supprimer `Utilisateurs du domaine`.
    - Ajouter le groupe **GRP1** (créé au LOT 2).
    - Droit : **Modification**.
3. **Dossier GRP2** :
    - Idem que GRP1 mais avec le groupe **GRP2**.
4. **Dossier Users** :
    - Permissions spéciales pour permettre la création automatique des dossiers personnels (Créateur Propriétaire : Contrôle Total, etc.).

---

## 5. Sauvegardes et Protection des Données

### 5.1. Objectif

> Objectif : Assurer la résilience des données face aux erreurs humaines (suppression accidentelle) via les Clichés Instantanés, et face aux pannes matérielles majeures via une sauvegarde complète quotidienne sur le support iSCSI externe, conformément aux exigences de sécurité.
> 

### 5.2. Configuration des Clichés Instantanés (Shadow Copies)

**Sur STG-SRVW01 et STG2-SRVW01 :**

1. Ouvrir l'Explorateur de fichiers > **Ce PC**.
2. Clic droit sur le disque **E: (DATAS01)** > **Configurer les clichés instantanés**.
3. Sélectionner le volume **E:**.
4. Cliquer sur **Activer**.
5. Dans **Paramètres**, configurer la planification (ex: 07:00 et 12:00) et la limite de stockage (utiliser le disque F: iSCSI si souhaité, ou rester sur E: selon espace dispo).
    - *Note Annexe 1 : "Possibilité de déplacer les clichés sur la cible iSCSI". Pour le faire, dans Paramètres, changer le "Volume de stockage" vers F:.*

### 5.3. Sauvegarde Windows Server Backup

**Sur STG-SRVW01 (Site A) :**

1. Installer la fonctionnalité **Sauvegarde Windows Server**.
2. Ouvrir la console **Sauvegarde Windows Server**.
3. Dans le volet Actions, cliquer sur **Planification de sauvegarde**.
4. Type de configuration : **Personnalisée**.
5. Éléments à sauvegarder : Ajouter **État du système** et le volume **E: (DATAS01)**.
6. Heure : **21:00** (Quotidien).
7. Type de destination : **Sauvegarder sur un volume**.
    - *Attention : Ne pas choisir 'Disque entier' pour conserver la lettre de lecteur F: nécessaire aux clichés instantanés.*
8. Sélectionner le volume **F: (Backup_iSCSI)**.
9. Valider la planification.

**Répéter l'opération sur STG2-SRVW01 pour le Site B.**

---

## 6. ⚠️ Difficultés Rencontrées et Résolutions Techniques

**Contexte de l'incident :**
Lors de la mise en place de la réplication de fichiers (DFSR) et du stockage iSCSI, nous avons rencontré plusieurs blocages techniques nécessitant une analyse approfondie. Ces incidents ont touché à la fois la couche réseau (communication inter-sites) et la couche stockage (dimensionnement et configuration SAN).

**Analyse technique des causes racines (Root Cause Analysis) :**

**Instabilité du Profil Réseau (NLA Service) :**

- **Symptôme :** Les serveurs basculaient en profil réseau "Privé" ou "Public" au lieu de "Domaine" après redémarrage.
- **Conséquence :** Le Pare-feu Windows appliquait des règles strictes bloquant les ports dynamiques RPC et le port DFSR (5722), empêchant l'établissement du canal de réplication initial.
- **Résolution :** Redémarrage forcé des cartes réseaux (`Restart-NetAdapter`) pour forcer la redétection du contrôleur de domaine et basculer le profil en "DomainAuthenticated".

**Conflit de Résolution IPv6 sur Tunnel IPv4 :**

- **Symptôme :** Les serveurs tentaient de résoudre les noms DNS de leurs partenaires via leurs adresses locales IPv6.
- **Conséquence :** Le tunnel VPN IPsec étant configuré en IPv4 uniquement, les connexions échouaient silencieusement (Timeout), provoquant des erreurs de "Serveur indisponible".
- **Résolution :** Désactivation complète de la pile IPv6 via le Registre et nettoyage du cache DNS (`ipconfig /flushdns`) pour forcer l'usage exclusif de l'IPv4 à travers le VPN.

**Latence de Convergence Active Directory :**

- **Symptôme :** La configuration DFS créée sur le Site A n'était pas connue du Site B, entraînant un rejet des demandes de réplication.
- **Conséquence :** Les mises à jour DFS (`dfsrdiag pollad`) étaient inefficaces car le serveur local interrogeait un AD local non synchronisé.
- **Résolution :** Utilisation de la commande `repadmin /syncall /AdeP` pour forcer la synchronisation immédiate de l'annuaire entre les sites, débloquant instantanément la configuration DFS.

**Erreur de dimensionnement du volume iSCSI (MiB vs GiB) :**

- **Symptôme :** Lors de la connexion initiale de la cible iSCSI sur le serveur Windows, le volume de sauvegarde (F:) affichait une capacité critique de 75 Mo au lieu des 75 Go prévus.
- **Conséquence :** Une confusion d'unité lors de la création du Zvol sur TrueNAS (sélection de MiB au lieu de GiB) a rendu le support inexploitable pour les sauvegardes.
- **Résolution :** Correction effectuée à chaud (*Hot Resize*) sans interruption de service : modification de la volumétrie sur TrueNAS à 75 GiB, suivie d'une actualisation des disques (*Rescan*) et d'une extension du volume directement depuis la console de gestion des disques Windows.

**Limitations de l'Assistant Automatique TrueNAS (Wizard) :**

- **Symptôme :** L'assistant de configuration iSCSI masquait les onglets de configuration avancée, empêchant le paramétrage fin des cibles et des permissions.
- **Conséquence :** Risque de configuration "boîte noire" non conforme et difficultés de diagnostic en cas d'échec de connexion.
- **Résolution :** Abandon de l'assistant au profit d'une configuration manuelle séquentielle : configuration explicite des *Portals*, *Initiators*, *Targets* et *Extents* via les onglets dédiés pour garantir une configuration maîtrisée et documentée.

**Conclusion et Validation :**
Après avoir assaini la couche réseau et corrigé la configuration du stockage, l'infrastructure est pleinement opérationnelle. La réplication DFSR est stable (Event ID 4104/4102) et les volumes de sauvegarde iSCSI sont correctement dimensionnés et connectés, permettant l'exécution des plans de sauvegarde.

---

## 7. Checklist de validation LOT 3

- [ ]  Serveurs TrueNAS (Site A et B) installés et configurés (IP SAN).
- [ ]  Volumes iSCSI créés sur TrueNAS (Portals, Targets, Extents).
- [ ]  Initiateur iSCSI connecté sur les serveurs Windows Principaux.
- [ ]  Disques de données (E:) et de sauvegarde (F:) formatés et accessibles.
- [ ]  Rôles DFS et DFSR installés sur les 4 serveurs.
- [ ]  Espace de noms `\\IEF.LOCAL\INTRANET` accessible depuis les 2 sites.
- [ ]  Réplication DFSR en maille pleine fonctionnelle (Test fichier texte).
- [ ]  Arborescence (GRP1, GRP2, TRANSFERT) créée et permissions NTFS appliquées.
- [ ]  Clichés instantanés activés sur les volumes de données.
- [ ]  Tâche planifiée de sauvegarde Windows configurée vers la cible iSCSI.
- [ ]  **Test de redondance :** Coupure d'un serveur et vérification de l'accès aux données.

---

**FIN DU LOT 3**

[⬅️ LOT précédent](%F0%9F%86%94%20LOT%202%20-%20D%C3%A9ploiement%20Active%20Directory,%20DNS%20et%20DHC%202b5dbb723a2880f5889dfa45e27cdd81.md) | [📂 Menu Livrable 2](../%F0%9F%A7%B0%20LIVRABLE%202%20%E2%80%93%20Documentation%20Technique%202dadbb723a28805eb87fca5c5941ed36.md) | [➡️ LOT suivant](%F0%9F%9B%A1%EF%B8%8F%20LOT%204%20-%20S%C3%A9curisation,%20Strat%C3%A9gies%20de%20Groupe%20(GPO%202c0dbb723a28800c8ffbf91109117e38.md)