# 📜 LIVRABLE 1 – Réponse au Cahier des Charges

[⬅️ Retour à l'accueil](https://www.notion.so/AP3-Groupe-2-Samy-ALBISSER-Emre-ALBAYRAK-265dbb723a28805eaba8c7aa4849492d?pvs=21)

**Projet : AP3 – Système d'Information Hautement Disponible pour ECP**

**Groupe : Samy ALBISSER & Emre ALBAYRAK**

**Durée : 10 semaines (01/09/2025 – 31/12/2025)**

**Date de remise : 20 octobre 2025 à 20H**

![image.png](image.png)

---

---

## **1. Présentation du groupe**

Dans le cadre de l'AP3, notre groupe est composé de **Samy ALBISSER** et **Emre ALBAYRAK**, tous deux étudiants en 2ᵉ année de BTS SIO SISR.

**Samy ALBISSER** occupe le rôle de **chef de projet**. Il assure la coordination du projet, la structuration documentaire, ainsi que la gestion de l'infrastructure du **site A (Strasbourg Vauban)**. Il prend en charge la rédaction des procédures, l'installation des serveurs principaux et la validation technique.

**Emre ALBAYRAK** assure le rôle de **technicien infrastructure**, responsable du **site B (Strasbourg Somme)**. Il est en charge de l'installation, des tests, de l'intégration réseau et de la mise en place des solutions de sauvegarde.

Notre binôme fonctionne de manière **autonome et complémentaire**, avec une répartition équilibrée des tâches et une communication régulière pour garantir le respect des délais et la qualité des livrables.

---

## **2. Rappel des besoins et objectifs du projet**

### **2.1 Contexte**

L'**ECP Apprentissage** fait partie du Groupe GEFE (Groupe Europe Formation Éducation) et forme des professionnels dans les domaines de l'immobilier, de l'assurance, de la gestion patrimoniale et de l'informatique. L'établissement est implanté sur deux sites à Strasbourg : le site Vauban et le site Somme.

Suite à l'ouverture de deux nouvelles classes de BTS SIO, l'école doit aménager de nouvelles salles informatiques et créer un système d'information indépendant pour répondre aux besoins pédagogiques et administratifs.

> 💡 Explication pour le patron : L'ECP est un centre de formation qui accueille des étudiants sur deux bâtiments différents à Strasbourg. Ils ont besoin d'un système informatique fiable qui fonctionne même si l'un des deux sites rencontre un problème technique.
> 

### **2.2 Objectifs stratégiques**

Le projet doit permettre d'atteindre des améliorations sur 4 axes principaux :

![image.png](image%201.png)

Axe 1 : Amélioration du service aux utilisateurs

- Création d'un système d'information indépendant et unifié
- Liaison sécurisée entre les deux sites (Vauban et Somme)
- Redondance des services : si un serveur tombe en panne, un autre prend le relais automatiquement
- Facilité d'administration pour l'équipe informatique

> 💡 Explication pour le patron : Imaginez que vous avez deux magasins dans deux quartiers différents. Si le système informatique du premier magasin tombe en panne, les employés du second magasin peuvent continuer à travailler normalement. C'est ce qu'on appelle la redondance : avoir plusieurs copies des informations importantes pour éviter les interruptions.
> 

Axe 2 : Réduction des coûts

- Utilisation de solutions open-source gratuites lorsque c'est possible
- Documentation complète pour faciliter la maintenance future
- Réduction du temps d'intervention grâce à l'automatisation

Axe 3 : Travail collaboratif

- Partage de fichiers sécurisé entre les deux sites
- Accessibilité des données depuis n'importe quel site
- Synchronisation automatique des documents entre les serveurs

Axe 4 : **Sécurité des systèmes et des données**

- Plan de Continuité d'Activité (PCA) : pouvoir redémarrer rapidement en cas de panne majeure
- Redondance des serveurs et des données
- Sauvegarde régulière et automatique
- Chiffrement des communications entre les deux sites

> 💡 Explication pour le patron : Le chiffrement, c'est comme mettre vos documents importants dans un coffre-fort numérique. Même si quelqu'un intercepte les données qui circulent entre les deux sites, il ne pourra pas les lire sans la clé de déchiffrement
> 

### **2.3 Objectifs techniques attendus**

Le cahier des charges impose plusieurs objectifs techniques précis :

| **Objectif** | **Description** | **Bénéfice** |
| --- | --- | --- |
| VPN inter-sites | Liaison chiffrée (IPsec) entre Site A et Site B | Communication sécurisée entre les deux bâtiments |
| Active Directory | Annuaire centralisé avec 4 contrôleurs de domaine (1 principal + 3 secondaires) | Authentification unique (SSO) et gestion centralisée des utilisateurs |
| DNS + DHCP | Résolution de noms et attribution automatique d'adresses IP | Connexion automatique des ordinateurs au réseau |
| DFS + DFSR | Partage de fichiers distribué avec réplication automatique | Les fichiers sont accessibles depuis les deux sites et synchronisés en temps réel |
| Sauvegarde iSCSI | Sauvegarde complète des serveurs sur un espace de stockage dédié (SAN) | Protection contre la perte de données |
| Clichés instantanés | Snapshots automatiques des fichiers importants | Possibilité de restaurer une version antérieure d'un fichier |

![image.png](image%202.png)

***💡 Explication pour le patron :***

- **Active Directory (AD)** : C'est comme un annuaire téléphonique de votre entreprise, mais pour les ordinateurs. Il contient tous les comptes utilisateurs et permet de se connecter une seule fois pour accéder à toutes les ressources (c'est le SSO : Single Sign-On).
- **DFS (Distributed File System)** : Au lieu d'avoir vos documents sur un seul serveur, ils sont répartis sur plusieurs serveurs et synchronisés automatiquement. Si un serveur tombe, vous pouvez toujours accéder à vos fichiers depuis l'autre.
- **iSCSI** : C'est une technologie qui permet de créer un disque dur réseau. On l'utilise ici pour stocker les sauvegardes des serveurs.
- **Chiffrement** : C'est comme mettre vos documents importants dans un coffre-fort numérique. Même si quelqu'un intercepte les données qui circulent entre les deux sites, il ne pourra pas les lire sans la clé de déchiffrement.

### **2.4 Périmètre du projet**

**Nombre d'utilisateurs** : 90 personnes (60 à Strasbourg + 30 à Mulhouse prévus)

**Postes de travail** : 60 PC fixes + 90 PC portables

**Nombre de serveurs** : 8 serveurs au total :

- 2 routeurs/pare-feu (1 par site)
- 4 serveurs Windows Server 2022 Standard (2 par site)
- 2 serveurs NAS/SAN pour les sauvegardes (1 par site)

**Plans d'adressage réseau** :

- Site A (Vauban) : 192.168.100.0/24 (254 adresses IP disponibles)
- Site B (Somme) : 192.168.200.0/24 (254 adresses IP disponibles)
- Nom de domaine : IEF.LOCAL

![image.png](image%203.png)

### **2.5 Contraintes du projet**

| **Contrainte** | **Détail** |
| --- | --- |
| Budget maximum | 100 000 € HT |
| Durée du projet | 10 semaines (du 01/09/2025 au 31/12/2025) |
| Compatibilité | Windows Server 2022 Standard obligatoire |
| Open-source | Privilégier les solutions gratuites/open-source quand c'est possible |
| Documentation | Documentation complète obligatoire pour faciliter la maintenance |

> 💡 Explication pour le patron :
> 
> 
> Ce projet consiste à créer une infrastructure informatique **hautement disponible** (c'est-à-dire qui fonctionne 24h/24, même en cas de panne d'un serveur) et **interconnectée** (les deux sites de Strasbourg peuvent partager les données de manière sécurisée). Cela garantit que vos équipes peuvent travailler sans interruption et que les données sont protégées contre les pertes.
> 

---

## **3. 🔧 Solutions proposées et études comparatives**

Pour chaque besoin technique du projet, nous avons comparé deux solutions open-source ou gratuites afin de justifier nos choix. Les **critères de sélection** sont les suivants :

- Coût : solution gratuite ou peu coûteuse
- Facilité d'installation et de maintenance
- Performance et stabilité
- Compatibilité avec l'infrastructure existante
- Disponibilité de la documentation et du support communautaire

### **3.1 Solution pour le routeur/pare-feu avec VPN**

**Besoin** : Un routeur/pare-feu open-source capable de créer un tunnel VPN chiffré (IPsec) entre les deux sites

**Comparaison : pfSense vs OPNsense**

| **Critère** | **pfSense Community Edition** | **OPNsense** |
| --- | --- | --- |
| Type | Open-source (licence Apache) | Open-source (licence BSD) |
| Système de base | FreeBSD 14 | FreeBSD 14.2 |
| Interface graphique | Interface fonctionnelle mais plus traditionnelle | Interface moderne et intuitive |
| VPN intégrés | OpenVPN, IPsec, WireGuard (via package) | OpenVPN, IPsec, WireGuard (intégré nativement) |
| Mises à jour | Parfois en retard sur la version gratuite (priorité à pfSense Plus payant) | Cycle de mises à jour régulier et prévisible |
| Authentification 2FA | Via package supplémentaire | Intégré nativement |
| Communauté | ✅ Très large communauté, beaucoup de tutoriels | Communauté active et en croissance |
| Support commercial | Netgate (payant) | Deciso (payant) |
| Sécurité | Bonne, mais basée sur FreeBSD 14.0 qui est EOL depuis nov. 2023 | Très bonne, basée sur FreeBSD 14.2 (version supportée) |
| Avantages | ✅ Large base documentaire
✅ Très répandu en entreprise
✅ Support matériel Netgate | ✅ Interface plus moderne
✅ Mises à jour régulières
✅ 2FA natif
✅ FreeBSD à jour |
| Inconvénients | ❌ Interface vieillissante
❌ Version CE parfois délaissée au profit de Plus | ❌ Communauté plus petite
❌ Moins de matériel dédié |

**✅ Solution retenue : pfSense Community Edition**

**Justification :**

pfSense est une solution **mature, éprouvée et largement documentée**, idéale pour un contexte pédagogique. Ses avantages principaux :

- **Très large communauté** : des milliers de tutoriels en français et en anglais, forums actifs, documentation complète
- **Très répandu en entreprise** : compétences transférables et valorisables sur le marché du travail
- **Support matériel Netgate** : possibilité d'acheter du matériel dédié avec support professionnel
- **Excellentes performances** : gère jusqu'à 1000+ utilisateurs simultanés
- **Configuration VPN IPsec complète** : support natif d'IKEv1, IKEv2, conforme aux recommandations ANSSI

Bien qu'OPNsense ait une interface plus moderne, pfSense reste **le standard industriel** pour les pare-feu open source, ce qui en fait un meilleur choix pour notre formation professionnelle.

> 💡 Explication pour le patron :
> 
> 
> Un **routeur/pare-feu** protège votre réseau des intrusions extérieures en filtrant les connexions. Le **VPN IPsec** crée un "tunnel sécurisé" entre vos deux sites de Strasbourg, permettant aux données de transiter de manière chiffrée (cryptée), comme si les deux sites étaient dans le même bâtiment.
> 

---

### **3.2 Solution pour le NAS/SAN (sauvegarde iSCSI)**

**Besoin** : Un serveur de stockage capable de créer des cibles iSCSI pour héberger les sauvegardes complètes des serveurs Windows.

**Comparaison : TrueNAS Core vs OpenMediaVault**

| **Critère** | **TrueNAS Core** | **OpenMediaVault (OMV)** |
| --- | --- | --- |
| Type | Open-source (FreeBSD) | Open-source (Debian Linux) |
| Système de fichiers | ✅ ZFS (très robuste, intégrité des données) | ext4, XFS, BTRFS (au choix) |
| Support iSCSI | ✅ Natif, très performant | ✅ Natif, via plugin |
| RAM recommandée | Minimum 8 Go (ZFS gourmand) | Minimum 1 Go (très léger) |
| Interface | Interface web moderne et intuitive | Interface web fonctionnelle, plugins pour étendre |
| Déduplication | ✅ Intégré (ZFS) | ❌ Pas natif |
| Snapshots | ✅ Intégré (ZFS) | ✅ Via BTRFS ou LVM |
| Communauté | Très large, documentation complète | Active, documentation claire |
| Complexité | Moyenne (configuration ZFS) | Faible (installation simplifiée) |
| Avantages | ✅ ZFS ultra-fiable
✅ Snapshots performants
✅ Compression native
✅ Déduplication | ✅ Très léger en ressources
✅ Basé sur Debian (familier)
✅ Plugins nombreux |
| Inconvénients | ❌ Gourmand en RAM
❌ Configuration ZFS technique | ❌ Moins de fonctionnalités avancées
❌ Pas de déduplication native |

**✅ Solution retenue : TrueNAS Core**

**Justification :**

TrueNAS Core est la solution professionnelle par excellence pour le stockage critique. Ses avantages décisifs :

- **ZFS** : système de fichiers ultra-robuste avec vérification automatique de l'intégrité des données
- **Snapshots instantanés** pour restaurer rapidement en cas de problème
- **Déduplication et compression natives** pour économiser l'espace disque
- **Support iSCSI très performant** et bien documenté
- **Très utilisé en entreprise** et dans les environnements de formation
- Les machines virtuelles modernes disposent de suffisamment de RAM (nous allons allouer 2 Go par VM NAS, ce qui est largement suffisant pour notre usage)

**Alternative** : Si les ressources RAM sont très limitées, OpenMediaVault reste une excellente alternative, mais TrueNAS Core offre plus de fonctionnalités avancées et une meilleure protection des données avec ZFS.

**Approfondissement : Pourquoi ZFS est essentiel pour ce projet**

**ZFS (Zettabyte File System)** n'est pas un simple système de fichiers, c'est un gestionnaire de volumes et de système de fichiers combiné qui apporte des fonctionnalités critiques pour la haute disponibilité :

**Protection avancée des données** :

- **Checksums 256 bits** : Chaque bloc de données possède une empreinte numérique unique permettant de détecter automatiquement toute corruption silencieuse
- **Auto-réparation (Self-Healing)** : En cas de corruption détectée, ZFS utilise automatiquement les copies redondantes pour restaurer les données corrompues
- **Copy-on-Write (COW)** : Les données ne sont jamais écrasées directement, éliminant les risques de corruption lors des écritures

**Snapshots (Clichés instantanés)** :

- Les snapshots ZFS sont **instantanés, gratuits en espace disque et sans impact sur les performances** tant que les données ne sont pas modifiées
- Ils permettent de revenir à un état antérieur en quelques secondes, idéal pour récupérer des fichiers supprimés ou corrompus
- Contrairement aux sauvegardes classiques, les snapshots ZFS sont **atomiques** (cohérents à l'instant T)

**Déduplication au niveau bloc** :

- ZFS peut éliminer les doublons de données **au niveau des blocs** (et non des fichiers entiers)
- Cependant, la déduplication nécessite beaucoup de RAM (environ **5 Go de RAM par To de données dédupliquées**)
- Pour l'AP3, nous **désactiverons la déduplication** car les besoins en RAM dépasseraient les ressources disponibles en environnement pédagogique

**Compression transparente** :

- ZFS supporte la compression LZ4 (rapide et efficace) sans impact sur les performances
- La compression peut **améliorer les performances** en réduisant les I/O disque
- Pour l'AP3, nous activerons la **compression LZ4** sur les volumes de sauvegarde

![image.png](image%204.png)

> 💡 Explication pour le patron : Un NAS/SAN, c'est un serveur de fichiers dédié au stockage. Ici, on utilise la technologie iSCSI qui permet de créer un disque dur virtuel accessible via le réseau. Les serveurs Windows le voient comme un disque dur local, ce qui permet de faire des sauvegardes complètes très rapidement. ZFS est un système de fichiers ultra-sécurisé qui protège vos données contre la corruption et permet de revenir à une version antérieure en cas de problème (snapshots). C'est comme une "machine à remonter le temps" pour vos données.
> 

### **3.3 Solution pour le VPN site-to-site**

**Besoin** : Un protocole VPN fiable et sécurisé pour relier les deux sites de manière chiffrée.

**Comparaison : IPsec vs OpenVPN**

| **Critère** | **IPsec (Internet Protocol Security)** | **OpenVPN** |
| --- | --- | --- |
| Type | Standard ouvert (protocole réseau niveau 3) | Open-source (niveau applicatif) |
| Chiffrement | AES-256, 3DES, etc. | AES-256, ChaCha20, etc. |
| Performance | ⚡ Très rapide (protocole UDP, intégré au noyau OS) | ⚡ Légèrement plus lent (double encapsulation) |
| Compatibilité native | ✅ Intégré dans tous les OS (Windows, Linux, macOS, iOS, Android) | ❌ Nécessite installation d'un client |
| Configuration | Complexe (nombreux paramètres IKE, ESP, AH) | Plus simple (fichier de configuration unique) |
| Traversée de NAT | ❌ Plus difficile (nécessite NAT-T) | ✅ Facile (peut utiliser n'importe quel port TCP/UDP) |
| Usage recommandé | Site-to-site (liaison fixe entre deux réseaux) | Client-to-site (accès distant utilisateur) |
| Support firewall | ✅ Intégré nativement dans pfSense et OPNsense | ✅ Intégré nativement |
| Stabilité | ✅ Très stable pour les connexions permanentes | ✅ Très stable |
| Recommandations ANSSI | ✅ Recommandé (annexe 5 du sujet) | ✅ Accepté |
| Avantages | ✅ Très performant
✅ Standard industriel
✅ Pas de client à installer
✅ Recommandé par l'ANSSI | ✅ Configuration plus simple
✅ Traverse facilement les firewalls
✅ Bonne documentation |
| Inconvénients | ❌ Configuration complexe
❌ Dépannage difficile | ❌ Légèrement moins performant
❌ Nécessite installation client |

**✅ Solution retenue : IPsec**

**Justification :**

IPsec est **imposé par le cahier des charges** (Annexe 5 : recommandations ANSSI sur IPsec). Ses avantages pour notre projet :

- **Imposé par le cahier des charges** : conforme aux recommandations ANSSI
- **Protocole standard** pour les VPN site-to-site en entreprise
- **Performance maximale** grâce à l'intégration au niveau du noyau système
- **Pas de client à installer** sur les serveurs ou les postes
- **Très stable** pour les connexions permanentes 24h/24
- **Bien supporté nativement** par pfSense et OPNsense
- **IKEv2 (Internet Key Exchange version 2)** : protocole moderne et sécurisé pour l'échange de clés

**Alternative** : Si IPsec posait des problèmes de configuration, nous pourrions basculer sur OpenVPN (bien documenté et plus simple), ou même sur WireGuard (protocole VPN moderne et ultra-rapide), mais IPsec reste le choix le plus professionnel pour ce type de liaison.

> 💡 Explication pour le patron : IPsec, c'est le protocole de sécurité standard de l'internet. C'est comme un convoi blindé qui transporte vos données entre les deux sites. OpenVPN est une alternative plus moderne et plus facile à configurer, mais un peu moins rapide. Pour notre projet, IPsec est recommandé dans le cahier des charges car il est plus adapté aux connexions permanentes entre deux sites fixes.
> 

---

### **3.4. Solution de sauvegarde des serveurs Windows**

**Besoin** : Sauvegarder complètement les serveurs Windows (OS + données) sur un espace de stockage iSCSI.

**Comparaison : Windows Server Backup vs Veeam Agent (Community)**

| **Critère** | **Windows Server Backup** | **Veeam Agent for Windows (Community/Free)** |
| --- | --- | --- |
| **Type** | Natif (intégré à Windows Server) | Gratuit (édition Community) |
| **Interface** | Graphique (console MMC) et PowerShell | Graphique et ligne de commande |
| **Types de sauvegarde** | Complète, incrémentale, planifiée | Complète, incrémentale, différentielle |
| **Destination** | Disque local, réseau, iSCSI | Disque local, réseau, iSCSI, cloud, répertoire Veeam |
| **Restauration** | Complète ou fichier par fichier | Complète, fichier par fichier, instantanée |
| **Chiffrement** | ✅ Possible (BitLocker sur la cible) | ✅ Chiffrement intégré AES-256 |
| **Compression** | ❌ Non disponible | ✅ Oui (économie d'espace) |
| **Performance** | Bonnes (natif) | Excellentes (optimisations avancées) |
| **Planification** | Quotidienne uniquement | Flexible (horaire, quotidienne, hebdomadaire) |
| **Compatibilité** | Windows Server uniquement | Windows Server et postes clients |
| **Facilité d'utilisation** | Simple pour les sauvegardes basiques | Simple avec plus de fonctionnalités |
| **Évolutivité** | 🟡 Moyenne (jusqu'à 10 serveurs) | 🟡 Moyenne (jusqu'à 10 agents en version gratuite)[zones](https://media.zones.com/images/pdf/veeam_vaw_val_vam_11_editions_comparison.pdf) |
| **Coût** | Gratuit (intégré) | Gratuit (jusqu'à 10 agents)[zones](https://media.zones.com/images/pdf/veeam_vaw_val_vam_11_editions_comparison.pdf) |

**✅ Solution retenue : Windows Server Backup**

**Justification :**

Windows Server Backup est la solution idéale pour notre projet car :

- **Gratuit et intégré nativement** à Windows Server 2022, sans aucune installation supplémentaire
- **Simplicité d'utilisation** : interface graphique intuitive et configuration rapide via console MMC ou PowerShell
- **Compatibilité totale** avec les volumes iSCSI montés depuis TrueNAS
- **Fiabilité éprouvée** : solution Microsoft testée et validée depuis Windows Server 2008
- **Sauvegardes complètes et incrémentielles** programmables quotidiennement
- **Restauration flexible** : restauration complète du serveur ou fichier par fichier
- **Pas de limitation** : aucune restriction sur le nombre de serveurs sauvegardés
- **Documentation officielle Microsoft** très complète en français
- **Contexte pédagogique adapté** : permet de se concentrer sur la configuration sans complexité supplémentaire

**Alternative** : Veeam Agent offre des fonctionnalités avancées (compression, chiffrement natif, interface moderne) qui peuvent être intéressantes dans un contexte professionnel, mais Windows Server Backup répond parfaitement aux besoins du cahier des charges tout en respectant la philosophie "intégré et simple" du projet.

> 💡 Explication pour le patron :
> 
> 
> La **sauvegarde** consiste à créer une copie de secours complète de vos serveurs (système d'exploitation + toutes les données). En cas de panne matérielle ou de cyberattaque, vous pouvez **restaurer** rapidement votre serveur et reprendre votre activité sans perte de données.
> 

---

### **3.5 Système de fichiers distribués (DFS) et réplication (DFSR)**

**Besoin** : Permettre l'accès centralisé aux données depuis les deux sites et répliquer automatiquement les fichiers entre les serveurs.

**Solution imposée** : **DFS et DFSR (Windows Server 2022)**

Le cahier des charges impose l'utilisation de **DFS (Distributed File System)** et **DFSR (DFS Replication)** pour créer un espace de noms unique accessible depuis **`\\IEF.LOCAL\INTRANET`** et répliquer les données entre les 4 serveurs en maille pleine.

**Caractéristiques** :

- **DFS** : Espace de noms unifié permettant d'accéder aux données depuis un seul point d'entrée, indépendamment de leur localisation physique
- **DFSR** : Réplication automatique et bidirectionnelle des fichiers entre les serveurs, garantissant la redondance et la haute disponibilité
- **Clichés instantanés (Shadow Copy)** : Sauvegardes automatiques des versions précédentes des fichiers, permettant la restauration en cas de suppression ou modification accidentelle
- **Droits et permissions NTFS** : Gestion fine des accès (chaque utilisateur accède uniquement à ses propres dossiers)

**Évolutivité** : 🔵 Excellente (jusqu'à plusieurs milliers d'utilisateurs)

**Approfondissement : Fonctionnement de DFSR et topologies de réplication**

**Comment fonctionne DFSR** :

**Réplication multi-maître** :

- DFSR fonctionne en mode **multi-maître** : tous les serveurs peuvent recevoir des modifications simultanément
- En cas de conflit (modification simultanée du même fichier sur 2 sites), DFSR applique une **résolution automatique** basée sur l'horodatage (dernière écriture gagnante)
- Le fichier "perdant" est conservé dans un dossier **`ConflictAndDeleted`** pour récupération manuelle

**Remote Differential Compression (RDC)** :

- DFSR n'envoie que les **blocs modifiés** d'un fichier, pas le fichier entier
- Pour un fichier Word de 10 Mo modifié de 2 Ko, seuls 2 Ko sont transférés via le VPN
- Cela réduit considérablement la bande passante utilisée et accélère la réplication

**Topologies de réplication** :

Pour l'AP3, le cahier des charges impose une **topologie en maille pleine (Full Mesh)** :

| **Topologie** | **Description** | **Avantages** | **Inconvénients** |
| --- | --- | --- | --- |
| Hub and Spoke | Un serveur central (hub) réplique vers plusieurs serveurs secondaires (spokes) | Simple à gérer, économise la bande passante | Point de défaillance unique (hub), latence accrue |
| Full Mesh (Maille pleine) | Tous les serveurs répliquent entre eux directement | ✅ Haute disponibilité, ✅ Faible latence, ✅ Pas de point unique de défaillance | Plus complexe à gérer (pour 4+ serveurs) |
| Hybride | Combinaison Hub/Spoke + Mesh | Équilibre entre simplicité et redondance | Configuration complexe |

**Justification pour l'AP3** : La **maille pleine** garantit que chaque serveur peut communiquer directement avec les autres, même si le VPN entre les deux sites tombe en panne (les serveurs du même site continuent à se répliquer).

**Limitations de DFSR** :

- DFSR réplique un fichier **uniquement après sa fermeture** (pas de réplication en temps réel)
- **Non adapté** pour les bases de données ouvertes en permanence (SQL Server, Exchange)
- Pour ces cas, Microsoft recommande **Storage Replica** (disponible dans Windows Server 2016+)

![image.png](image%205.png)

![image.png](image%206.png)

> 💡 Explication pour le patron : DFS permet à vos employés d'accéder à leurs fichiers de manière transparente, qu'ils soient à Strasbourg Vauban ou Strasbourg Somme. DFSR synchronise automatiquement les données entre les deux sites : si un fichier est modifié sur un site, il est automatiquement mis à jour sur l'autre en quelques minutes. Les clichés instantanés permettent de récupérer une version antérieure d'un fichier supprimé par erreur (jusqu'à 64 versions précédentes conservées). Le maille pleine signifie que chaque serveur se synchronise avec tous les autres serveurs. Si vous modifiez un fichier sur le Site A, il sera automatiquement copié sur le Site B, et vice-versa. C'est comme avoir un miroir parfait de vos données à chaque endroit.
> 

---

### **3.6. Annuaire d'authentification (Active Directory)**

**Besoin** : Centraliser l'authentification des utilisateurs et des postes, déployer des stratégies de groupe (GPO).

**Solution imposée** : **Active Directory Domain Services (AD DS) – Windows Server 2022**

Le cahier des charges impose l'utilisation d'**Active Directory** comme annuaire centralisé avec **1 forêt unique** et **4 contrôleurs de domaine** (1 principal sur le site A, 3 supplémentaires répartis sur les sites A et B).

**Caractéristiques** :

- **Authentification unique (SSO)** : Les utilisateurs se connectent une seule fois avec leurs identifiants pour accéder à tous les services.
- **Gestion centralisée** : Création et gestion des comptes utilisateurs, groupes, unités organisationnelles (UO).
- **Stratégies de groupe (GPO)** : Déploiement automatique de configurations (fond d'écran, lecteurs réseau, restrictions, redirection de dossiers).
- **Redondance** : 4 contrôleurs de domaine garantissent la haute disponibilité (si un serveur tombe en panne, les autres prennent le relais).
- **Intégration DNS et DHCP** : Gestion automatique des noms de domaine et attribution des adresses IP.

**Évolutivité** : 🔵 Excellente (jusqu'à 1000+ utilisateurs).

> 💡 Explication pour le patron :
> 
> 
> **Active Directory** est l'annuaire centralisé qui gère tous les comptes utilisateurs et ordinateurs de l'entreprise. Grâce à lui, vos employés peuvent se connecter sur n'importe quel poste avec leurs identifiants, et l'administrateur peut déployer des paramètres de sécurité ou des logiciels automatiquement sur tous les ordinateurs.
> 

### **3.7 Synthèse des solutions retenues**

| **Besoin** | **Solution retenue** | **Justification principale** | **Alternative** |
| --- | --- | --- | --- |
| Routeur/Firewall | pfSense CE | Large communauté, très documenté, standard industriel | OPNsense |
| NAS/SAN iSCSI | TrueNAS Core | ZFS ultra-fiable, snapshots performants, déduplication native | OpenMediaVault |
| VPN site-to-site | IPsec | Standard industriel, recommandé ANSSI, très performant | OpenVPN |
| Sauvegarde serveurs | Windows Server Backup | Intégré nativement, gratuit, simple, fiable, pas d'installation | Veeam Agent Community |
| Serveurs Windows | Windows Server 2022 Standard | Imposé par le cahier des charges | - |
| Active Directory | AD DS avec 4 DC | Haute disponibilité, réplication automatique | - |
| Partage de fichiers | DFS + DFSR | Synchronisation automatique entre sites, transparence pour l'utilisateur | - |

> 💡 Explication pour le patron : Toutes les solutions que nous avons choisies sont soit gratuites, soit open-source, ce qui respecte le budget du projet. Les seuls coûts concernent les licences Windows Server 2022 et les licences CAL (Client Access License) qui sont obligatoires pour que les utilisateurs puissent se connecter aux serveurs Windows.
> 

---

## **4. 📐 Schéma réseau complet**

### 4.1 Vue d'ensemble de l'architecture

Le schéma ci-dessous présente l'architecture complète du système d'information hautement disponible déployé sur les deux sites de formation (Vauban et Somme).

![Schema_Reseau_AP3_ULTIME.drawio.png](Schema_Reseau_AP3_ULTIME.drawio.png)

### 4.2 Points clés de l'infrastructure

L'architecture s'articule autour de plusieurs composants essentiels :

**Site A (Vauban) - 192.168.100.0/24** :

- 1 routeur pfSense (RTE-STG01) assurant la sécurité périmétrique
- 2 contrôleurs de domaine Windows Server 2022 (STG-SRVW01 principal, STG-SRVW02 secondaire)
- 1 serveur de stockage TrueNAS (STG-SAN01) pour les sauvegardes iSCSI
- 1 poste client de test Windows 11

**Site B (Somme) - 192.168.200.0/24** :

- 1 routeur pfSense (RTE2-STG01) interconnecté via VPN IPsec
- 2 contrôleurs de domaine supplémentaires (STG2-SRVW01, STG2-SRVW02)
- 1 serveur de stockage TrueNAS (STG2-SAN01)
- 1 poste client de test Windows 11

**Interconnexion sécurisée** :

- Tunnel VPN IPsec permanent (IKEv2, chiffrement AES-256)
- Réplication Active Directory multi-maître entre les 4 DC
- Réplication DFS en maille pleine pour la haute disponibilité des données
- Sauvegardes iSCSI quotidiennes via Windows Server Backup

### 4.3 Légende du schéma

Le schéma utilise un code couleur pour faciliter la lecture :

| Élément | Couleur | Description |
| --- | --- | --- |
| **VPN IPsec** | 🟢 Vert épais | Tunnel chiffré permanent entre les sites |
| **Réplication DFSR** | 🔵 Bleu pointillé | Synchronisation des fichiers (maille pleine) |
| **Réplication AD DS** | 🟣 Violet pointillé | Synchronisation de l'annuaire (multi-maître) |
| **iSCSI** | 🟠 Orange | Connexions de sauvegarde vers TrueNAS |
| **LAN** | ⚫ Noir | Connexions réseau locales |
| **Zone LAN** | 🔵 Fond bleu | Réseau local de chaque site |
| **Zone SAN** | 🟡 Fond jaune | Réseau dédié au stockage iSCSI |
| **Zone WAN** | 🔴 Fond rouge | Connexion Internet |

---

## **5. 💰 Budget estimé du projet**

### 5.1 Méthodologie de calcul

Le budget est calculé en tenant compte :

- Des licences logicielles (Windows Server, CAL)
- Du matériel (serveurs physiques ou VM)
- De la main d'œuvre (heures × taux horaire)
- D'une marge de sécurité de 15% pour les imprévus

### 5.2 Devis professionnel

Le devis complet détaillé est disponible en **Annexe 1** (fichier Excel).

Ci-dessous, un extrait du récapitulatif financier :

![test_page-0001.jpg](1008ac64-98a3-4aec-9139-edf45d50f70b.png)

### 5.3 Synthèse budgétaire

| Poste de dépense | Montant HT | Montant TTC |
| --- | --- | --- |
| **Licences logicielles** | 3 491,50 € | 4 189,80 € |
| **Matériel informatique** | 1 580,00 € | 1 896,00 € |
| **Prestations de service** | 3 840,00 € | 4 608,00 € |
| **Sous-total** | 8 911,50 € | 10 693,80 € |
| **Marge de sécurité (15%)** | 1 336,73 € | 1 604,07 € |
| **TOTAL PROJET** | **10 248,23 € HT** | **12 297,87 € TTC** |

Le projet reste **largement en dessous** du budget maximum de 100 000 € HT imposé par le cahier des charges.

### 5.4 Conditions de paiement

- **Acompte de 30%** à la commande : 3 689,36 € TTC
- **40%** à la livraison du LOT 2 : 4 919,15 € TTC
- **Solde de 30%** à la recette finale : 3 689,36 € TTC

### 5.5 Budget version pédagogique

En tant qu'étudiants, nous n'avons pas de coûts réels :

- Licences Windows Server : version éducative gratuite via Microsoft Azure Dev Tools for Teaching
- Matériel : machines virtuelles sur Proxmox fourni par l'école
- Main d'œuvre : travail étudiant non facturé

**Coût réel pour le projet pédagogique : 0 €**

Cependant, il est important de présenter un budget réaliste pour montrer la valeur du projet dans un contexte professionnel.

---

## **6. 📋 Liste chronologique des tâches prévisionnelles**

### **6.1 Méthodologie de planification**

Pour organiser le projet, nous avons utilisé la méthode **SMART** :

- **S**pécifique : chaque tâche est clairement définie
- **M**esurable : durée estimée en heures
- **A**tteignable : objectifs réalistes
- **R**éaliste : tenant compte de nos compétences
- **T**emporel : dates de début et de fin précises

### **6.2 Liste détaillée des tâches**

| **N°** | **Tâche** | **Durée estimée** | **Responsable** | **Dépendances** |
| --- | --- | --- | --- | --- |
| PHASE 1 : ÉTUDE ET CONCEPTION |  |  |  |  |
| 1 | Lecture et analyse du cahier des charges | 2h | Samy + Emre | - |
| 2 | Étude comparative des solutions (routeur, NAS, VPN, sauvegarde) | 6h | Samy | Tâche 1 |
| 3 | Rédaction du livrable 1 (ce document) | 6h | Samy | Tâche 2 |
| 4 | Création du schéma réseau (Draw.io) | 2h | Samy | Tâche 2 |
| 5 | Élaboration du budget prévisionnel | 1h | Samy | Tâche 2 |
| 6 | Création du planning et du diagramme de Gantt | 1h | Samy | Tâche 2 |
| 7 | Remise du livrable 1 | - | Samy | Tâche 3-6 |
| PHASE 2 : LOT 1 - ROUTEURS ET VPN |  |  |  |  |
| 8 | Installation pfSense sur RTE-STG01 (Site A) | 2h | Samy | Tâche 7 |
| 9 | Installation pfSense sur RTE2-STG01 (Site B) | 2h | Emre | Tâche 7 |
| 10 | Configuration interfaces réseau (WAN/LAN/SAN) | 2h | Samy + Emre | Tâche 8-9 |
| 11 | Configuration du tunnel VPN IPsec entre les deux sites | 3h | Samy | Tâche 10 |
| 12 | Tests de connectivité et de chiffrement VPN | 1h | Emre | Tâche 11 |
| 13 | Documentation LOT 1 (version 1) | 2h | Samy | Tâche 12 |
| 14 | Livraison du LOT 1 + QCM 1 | - | Samy + Emre | Tâche 13 |
| PHASE 3 : LOT 2 - SERVEURS WINDOWS ET SERVICES |  |  |  |  |
| 15 | Installation Windows Server 2022 sur STG-SRVW01 (Site A) | 2h | Samy | Tâche 14 |
| 16 | Installation Windows Server 2022 sur STG-SRVW02 (Site A) | 2h | Samy | Tâche 14 |
| 17 | Installation Windows Server 2022 sur STG2-SRVW01 (Site B) | 2h | Emre | Tâche 14 |
| 18 | Installation Windows Server 2022 sur STG2-SRVW02 (Site B) | 2h | Emre | Tâche 14 |
| 19 | Promotion de STG-SRVW01 en contrôleur de domaine principal | 2h | Samy | Tâche 15 |
| 20 | Ajout de STG-SRVW02 en contrôleur de domaine secondaire | 2h | Samy | Tâche 19 |
| 21 | Ajout de STG2-SRVW01 en contrôleur de domaine supplémentaire | 2h | Emre | Tâche 19 |
| 22 | Ajout de STG2-SRVW02 en contrôleur de domaine supplémentaire | 2h | Emre | Tâche 19 |
| 23 | Configuration DNS sur les 4 contrôleurs | 2h | Samy + Emre | Tâche 20-22 |
| 24 | Configuration DHCP + DHCP failover | 3h | Samy + Emre | Tâche 23 |
| 25 | Création des UO, groupes et utilisateurs (Annexe 2) | 2h | Samy | Tâche 20 |
| 26 | Tests de réplication Active Directory | 1h | Emre | Tâche 22 |
| 27 | Documentation LOT 2 (version 1) | 2h | Samy | Tâche 26 |
| PHASE 4 : LOT 3 - DFS, DFSR, NAS ET SAUVEGARDES |  |  |  |  |
| 28 | Installation TrueNAS Core sur STG-SAN01 (Site A) | 1h | Samy | Tâche 27 |
| 29 | Installation TrueNAS Core sur STG2-SAN01 (Site B) | 1h | Emre | Tâche 27 |
| 30 | Configuration des cibles iSCSI (Backup01 et Backup02) | 2h | Samy + Emre | Tâche 28-29 |
| 31 | Montage des cibles iSCSI sur les serveurs principaux | 1h | Samy + Emre | Tâche 30 |
| 32 | Installation de la fonctionnalité Windows Server Backup | 1h | Samy + Emre | Tâche 27 |
| 33 | Configuration des tâches de sauvegarde (planification quotidienne) | 2h | Samy + Emre | Tâche 32 |
| 34 | Configuration DFS (espace de noms \\IEF.LOCAL\INTRANET) | 2h | Samy | Tâche 27 |
| 35 | Configuration DFSR (4 cibles en maille pleine) | 3h | Samy + Emre | Tâche 34 |
| 36 | Configuration Shadow Copy (clichés instantanés) | 2h | Samy | Tâche 35 |
| 37 | Configuration déduplication sur DATAS01 et DATAS03 | 1h | Samy + Emre | Tâche 35 |
| 38 | Tests de réplication DFSR et de sauvegarde | 2h | Emre | Tâche 37 |
| 39 | Documentation LOT 3 (version 1) | 2h | Samy | Tâche 38 |
| 40 | Livraison du LOT 2 + QCM 2 | - | Samy + Emre | Tâche 39 |
| PHASE 5 : LOT 4 - GPO ET SÉCURISATION |  |  |  |  |
| 41 | Application des GPO (Annexe 2) | 3h | Samy | Tâche 40 |
| 42 | Configuration des règles de pare-feu (WAN/LAN/VPN/SAN) | 2h | Emre | Tâche 40 |
| 43 | Tests de sécurité et de conformité | 2h | Samy + Emre | Tâche 41-42 |
| 44 | Documentation LOT 4 (version 1) | 1h | Samy | Tâche 43 |
| PHASE 6 : TESTS ET VALIDATION |  |  |  |  |
| 45 | Tests de haute disponibilité (simulation panne) | 3h | Samy + Emre | Tâche 44 |
| 46 | Tests d'authentification et d'accès aux fichiers | 1h | Emre | Tâche 44 |
| 47 | Tests de restauration (Veeam + Shadow Copy) | 2h | Samy | Tâche 44 |
| 48 | Optimisation et corrections | 2h | Samy + Emre | Tâche 45-47 |
| PHASE 7 : DOCUMENTATION FINALE |  |  |  |  |
| 49 | Rédaction du rapport de clôture (écarts prévisionnel/réel) | 3h | Samy | Tâche 48 |
| 50 | Finalisation de la documentation technique complète | 4h | Samy | Tâche 48 |
| 51 | Création du diaporama pour l'oral 2 | 2h | Samy + Emre | Tâche 49-50 |
| 52 | Préparation de la démonstration technique | 2h | Samy + Emre | Tâche 50 |
| 53 | Oral 2 : Démonstration technique et clôture du projet | - | Samy + Emre | Tâche 52 |
| 54 | Remise livrables 2 et 3 (fiche situation pro + documentation) | - | Samy | Tâche 50 |

### **6.3 Synthèse des heures par phase**

| **Phase** | **Durée totale** | **% du projet** |
| --- | --- | --- |
| Phase 1 : Étude et conception | 18h | 28% |
| Phase 2 : LOT 1 (Routeurs + VPN) | 12h | 19% |
| Phase 3 : LOT 2 (Serveurs Windows + AD) | 22h | 34% |
| Phase 4 : LOT 3 (DFS/DFSR + Sauvegardes) | 18h | 28% |
| Phase 5 : LOT 4 (GPO + Sécurité) | 8h | 12% |
| Phase 6 : Tests et validation | 8h | 12% |
| Phase 7 : Documentation finale | 11h | 17% |
| TOTAL | 63 heures | 100% |

**Répartition par personne** : ~32 heures chacun (Samy + Emre)

![image.png](image%207.png)

### **6.4 Dates clés du projet**

| **Événement** | **Date** |
| --- | --- |
| Lancement du projet | Lundi 01/09/2025 |
| Remise du livrable 1 | Lundi 20/10/2025, 23h59 |
| Oral 1 | Vendredi 31/10/2025, 8h30 |
| Livraison LOT 1 | Vendredi 03/10/2025 |
| Livraison LOT 2 | Vendredi 28/11/2025 |
| Oral 2 (démonstration technique) | Mardi 09/12/2025, 8h30 |
| Remise livrables 2 et 3 | Mardi 31/12/2025, 23h59 |

![image.png](image%208.png)

---

## **7. 📅 Diagramme de Gantt prévisionnel**

### 7.1 Outil utilisé

Nous avons utilisé **GanttProject 3.2** (logiciel open-source) pour créer le diagramme de Gantt du projet.

Le fichier source (.gan) est disponible en **Annexe 2** et peut être ouvert avec GanttProject pour une consultation interactive.

### 7.2 Planning visuel du projet

![AP3 Final.png](AP3_Final.png)

### 7.3 Lecture du diagramme de Gantt

Le diagramme utilise un code couleur pour identifier rapidement les responsabilités :

| Couleur | Responsable | Type de tâches |
| --- | --- | --- |
| 🔵 **Bleu** | Samy ALBISSER | Documentation, rédaction, coordination |
| 🟠 **Orange** | Emre ALBAYRAK | Tests techniques, configurations |
| 🟢 **Vert** | Samy + Emre | Installations, configurations en binôme |
| 🔴 **Rouge** | Jalons | Dates de remise et oraux |

**Jalons importants** :

- 📌 **20/10/2025** : Remise du livrable 1 (ce document)
- 📌 **03/10/2025** : Livraison LOT 1 (Routeurs + VPN)
- 📌 **31/10/2025** : Oral 1
- 📌 **28/11/2025** : Livraison LOT 2 (Serveurs + AD + DFS)
- 📌 **09/12/2025** : Oral 2 (Démonstration technique)
- 📌 **31/12/2025** : Remise livrables 2 et 3

### 7.4 Chemin critique du projet

Les tâches du **chemin critique** (qui ne peuvent pas être retardées sans décaler la fin du projet) sont :

![image.png](image%209.png)

1. Lecture et analyse du cahier des charges
2. Étude comparative des solutions
3. Rédaction du livrable 1
4. Installation des routeurs pfSense
5. Configuration du VPN IPsec
6. Installation des contrôleurs de domaine
7. Configuration Active Directory
8. Configuration DFS/DFSR
9. Configuration des sauvegardes
10. Tests de validation
11. Documentation finale

Toute tâche du chemin critique retardée d'un jour décale automatiquement la date de fin du projet.

### 7.5 Gestion des risques et marges

Conformément aux retours de l'AP2, nous avons intégré une **marge de sécurité de 15%** dans le planning pour anticiper les retards potentiels.

Les tâches critiques (VPN, AD principal, DFSR) bénéficient d'une surveillance renforcée et de tests supplémentaires.

---

## **8. 🎯 Conclusion**

### **8.1 Synthèse du projet**

Ce livrable 1 présente une réponse complète et argumentée au cahier des charges de l'AP3. Notre proposition technique repose sur **4 piliers essentiels** :

![image.png](image%2010.png)

**1. Haute disponibilité**

- 4 contrôleurs de domaine Active Directory pour une redondance totale
- Réplication DFSR en maille pleine entre les 4 serveurs
- VPN IPsec permanent entre les deux sites
- Si un serveur tombe, les autres prennent automatiquement le relais

**2. Sécurité renforcée**

- Pare-feu pfSense avec filtrage avancé des flux réseau
- VPN IPsec chiffré (AES-256) conforme aux recommandations ANSSI
- GPO de sécurité pour durcir les postes et les serveurs
- Sauvegardes quotidiennes avec chiffrement

**3. Protection des données**

- Sauvegardes complètes quotidiennes avec Windows Server Backup (intégré et fiable)
- Stockage des sauvegardes sur TrueNAS avec système de fichiers ZFS ultra-fiable
- Clichés instantanés (Shadow Copy) pour restaurer rapidement un fichier supprimé
- Réplication automatique des données entre les deux sites

**4. Facilité d'administration**

- Gestion centralisée avec Active Directory (un seul compte par utilisateur)
- DFS : accès transparent aux fichiers quel que soit le site
- GPO : déploiement automatique des configurations sur tous les postes
- Documentation complète pour faciliter la maintenance

### **8.2 Budget et respect des contraintes**

**Budget total estimé : 12 297,87 € TTC**

Ce budget représente **seulement 12% du budget maximum** de 100 000 € HT (120 000 € TTC) imposé par le cahier des charges. Cela laisse une marge confortable de **107 702,13 € TTC** pour :

- L'achat de postes clients Windows 11 Pro supplémentaires
- Des équipements réseau additionnels (switchs, câblage, onduleurs)
- Des licences supplémentaires (antivirus, monitoring)
- Des extensions futures du projet (site de Mulhouse)

### **8.3 Points forts de la solution**

✅ **Solutions open-source et intégrées** pour l'infrastructure (pfSense, TrueNAS, Windows Server Backup natif)

✅ **Technologies éprouvées** et largement utilisées en entreprise (compétences transférables)

✅ **Documentation abondante** : des milliers de tutoriels disponibles en ligne

✅ **Conformité ANSSI** : respect des recommandations de sécurité (IPsec, pare-feu, GPO)

✅ **Évolutivité** : l'infrastructure peut facilement supporter 500+ utilisateurs supplémentaires

✅ **Résilience** : tolérance aux pannes matérielles grâce à la redondance

✅ **Budget maîtrisé** : 88% en dessous du budget maximum autorisé

### **8.4 Engagement qualité**

Nous nous engageons à :

✅ **Respecter le planning** établi dans ce livrable (marge de sécurité de 20% incluse)

✅ **Documenter chaque étape** du projet avec captures d'écran et explications détaillées

✅ **Tester rigoureusement** toutes les fonctionnalités avant validation

✅ **Communiquer régulièrement** avec les formateurs en cas de difficulté

✅ **Respecter les recommandations ANSSI** en matière de sécurité

✅ **Livrer un projet fonctionnel** et démontrable lors de l'oral 2

### **8.5 Remerciements**

Nous remercions l'équipe pédagogique de l'ECP pour l'accompagnement sur ce projet, ainsi que nos tuteurs en entreprise (CARSAT pour Samy) pour leur soutien et leurs conseils.

## **9. 📚 Annexes et ressources**

### **9.1 Glossaire des termes techniques**

Pour faciliter la compréhension de ce document, voici la définition des principaux termes techniques utilisés :

| **Terme** | **Définition** |
| --- | --- |
| Active Directory (AD) | Service d'annuaire Microsoft qui centralise la gestion des utilisateurs, ordinateurs et ressources réseau |
| CAL (Client Access License) | Licence obligatoire pour qu'un utilisateur ou un ordinateur puisse se connecter à un serveur Windows |
| Contrôleur de domaine (DC) | Serveur hébergeant l'annuaire Active Directory et gérant l'authentification des utilisateurs |
| DFSR (DFS Replication) | Service de réplication automatique de fichiers entre plusieurs serveurs Windows |
| DHCP | Service qui attribue automatiquement des adresses IP aux ordinateurs du réseau |
| DNS | Service qui traduit les noms de domaine (ex :www.google.com) en adresses IP |
| GPO (Group Policy Object) | Stratégie de groupe permettant de configurer automatiquement les paramètres des postes et serveurs |
| iSCSI | Protocole permettant de créer un disque dur virtuel accessible via le réseau |
| IPsec | Protocole de sécurité pour chiffrer les communications entre deux réseaux (VPN site-to-site) |
| NAS (Network Attached Storage) | Serveur de fichiers centralisé accessible via le réseau |
| SAN (Storage Area Network) | Réseau dédié au stockage, séparé du réseau local classique |
| Snapshot (cliché instantané) | Capture de l'état d'un système de fichiers à un instant T, permettant une restauration rapide |
| VPN (Virtual Private Network) | Réseau privé virtuel créant un tunnel sécurisé entre deux sites distants |
| ZFS | Système de fichiers avancé offrant une protection maximale des données (auto-réparation, snapshots, compression) |

### **9.2 Sources et références**

**Documentation officielle** :

- Microsoft : Documentation Windows Server 2022, Active Directory, DFS/DFSR
- pfSense : Documentation officielle et forums communautaires ([**https://docs.netgate.com/**](https://docs.netgate.com/))
- TrueNAS : Documentation ZFS et iSCSI ([**https://www.truenas.com/docs/**](https://www.truenas.com/docs/))
- Microsoft : Documentation Windows Server Backup ([https://learn.microsoft.com/en-us/windows-server/administration/windows-server-backup/windows-server-backup](https://learn.microsoft.com/en-us/windows-server/administration/windows-server-backup/windows-server-backup))

**Recommandations ANSSI** :

- Guide des bonnes pratiques de configuration de pare-feu
- Recommandations sur l'usage d'IPsec
- Recommandations de sécurité relatives à Active Directory

**Tutoriels et formations** :

- IT-Connect.fr : Tutoriels Windows Server en français
- YouTube : chaînes TechWorld, Zwindler, xavki
- OpenClassrooms : cours administration système

---

> 💡 Note finale pour le patron : Ce document constitue la feuille de route complète du projet AP3. Il détaille toutes les solutions techniques que nous allons mettre en place, le budget prévisionnel, et le planning de réalisation. Une fois ce livrable validé lors de l'oral du 31 octobre, nous passerons à la phase de mise en œuvre technique (installation des serveurs, configuration des services, tests). Le projet sera finalisé le 31 décembre 2025 avec la remise de la documentation complète et la démonstration technique devant le jury.
> 

## 10. ANNEXES

### 10.1 Annexe 1 : Devis professionnel complet

**Fichier joint** : `DEVIS_PROFESSIONNEL_AP3_Samy-ALBISSER_Emre_ALBAYRAK.xlsx`

Le devis détaillé au format Excel contient :

- Section 1 : Licences logicielles (détail par produit)
- Section 2 : Matériel informatique (serveurs, stockage, réseau)
- Section 3 : Prestations de service (main d'œuvre)
- Récapitulatif financier complet
- Conditions de paiement et garanties

Ce devis peut être exporté en PDF pour envoi au client.

### 10.2 Annexe 2 : Fichier source du Gantt

**Fichier joint** : `AP3_GanttProject_FINAL_Samy-ALBISSER_Emre_ALBAYRAK.gan`

Le fichier source du diagramme de Gantt peut être ouvert avec **GanttProject** (gratuit) :

- Téléchargement : [https://www.ganttproject.biz/](https://www.ganttproject.biz/)
- Permet de consulter les dépendances entre tâches
- Affiche le chemin critique du projet
- Permet de suivre l'avancement en temps réel

### 10.3 Annexe 3 : Schéma réseau source

**Fichier joint** : `Schema_Reseau_AP3_ULTIME_Samy-ALBISSER_Emre_ALBAYRAK.drawio`

Le schéma réseau au format [Draw.io](http://draw.io/) peut être modifié en ligne :

- Ouvrir sur [https://app.diagrams.net/](https://app.diagrams.net/)
- Format vectoriel (qualité parfaite même agrandi)
- Permet d'exporter en PNG, PDF, SVG...