# Livrable 2 AP2 Parcus - Samy ALBISSER & Emre ALBAYRAK

# 0. Introduction et Prérequis

## 0.1. Contexte du projet PARCUS

La société PARCUS, acteur majeur de la gestion de stationnement, connaît une croissance soutenue qui rend son modèle de gestion informatique actuel, basé sur l'externalisation, obsolète. Ce modèle présente des limites en termes de réactivité, de visibilité sur le parc et d'alignement avec les nouveaux objectifs de qualité de service.

Pour répondre à ces enjeux, la direction a validé la décision stratégique d'internaliser son service informatique en créant une **Direction des Systèmes d'Informations (DSI)**. Cette nouvelle entité aura pour missions principales de :

- **Cartographier et inventorier** l'ensemble du parc matériel et logiciel.
- **Automatiser** les tâches récurrentes comme les installations et les mises à jour.
- **Maîtriser et sécuriser** le Système d'Information (SI).
- **Améliorer la qualité de service** et le support technique offerts aux 83 collaborateurs.

Le projet technique AP2 constitue le socle de cette nouvelle DSI. Il a pour objectif de concevoir et de déployer une infrastructure technique centralisée, robuste et sécurisée. Ce déploiement inclut la mise en place d'un annuaire d'entreprise, d'outils de gestion de parc et de tickets, de solutions de déploiement d'images système et de logiciels, ainsi que d'un outil d'assistance à distance.

L'objectif final est de doter PARCUS d'un SI performant et maîtrisé, capable de soutenir efficacement la croissance de l'entreprise.

## 0.2. Objectifs de la documentation

Ce document constitue le **Livrable 2** pour le projet AP2 PARCUS. Il se présente comme un guide technique complet et détaillé, conçu pour guider un technicien système, étape par étape, dans la mise en œuvre de l'ensemble de l'infrastructure requise.

Les objectifs principaux de cette documentation sont de :

1. **Fournir des instructions claires :** Détailler chaque procédure d'installation, de configuration et d'intégration des différents services (Active Directory, WDS, GLPI, etc.).
2. **Garantir la reproductibilité :** Permettre à un technicien disposant des prérequis nécessaires de reconstruire l'infrastructure de manière identique et fonctionnelle.
3. **Servir de référence technique :** Centraliser l'ensemble des informations techniques, des choix d'implémentation, des configurations réseau, des scripts et des commandes utilisés tout au long du projet.
4. **Valider les compétences techniques :** Démontrer la maîtrise des savoir-faire listés dans le cahier des charges à travers une mise en pratique concrète et documentée.

À la fin de ce guide, vous aurez déployé une infrastructure complète et opérationnelle, répondant aux besoins de la nouvelle DSI de PARCUS.

## 0.3. Architecture Cible

L'infrastructure du projet PARCUS sera entièrement virtualisée sous Proxmox et hébergée localement pour garantir la maîtrise complète des données et des services. Elle est conçue pour être robuste, évolutive et sécurisée, tout en s'appuyant principalement sur des solutions standards du marché et open-source.

### 0.3.1. Schéma réseau final

Le réseau sera segmenté au sein d'un plan d'adressage unique en **192.168.100.0/24**. Tous les serveurs disposeront d'adresses IP statiques pour assurer la stabilité des services, tandis que les postes clients recevront leur configuration IP dynamiquement via un serveur DHCP.

Le schéma ci-dessous représente l'architecture réseau finale après le déploiement de tous les services et le retrait de la passerelle PFsense temporaire.

- **SRV-AD** est le cœur du réseau : il authentifie les utilisateurs, distribue les adresses IP, résout les noms DNS et déploie les logiciels et les images système.
- **SRV-GLPI** centralise la gestion de l'inventaire et des tickets de support.
- **SRV-RD** héberge le service d'assistance à distance.
- **CLIENT-01** représente un poste de travail type, intégré au domaine et géré par la nouvelle DSI.

### 0.3.2. Tableau des serveurs et rôles

Le tableau suivant détaille chaque machine virtuelle (VM) du projet, son rôle, son système d'exploitation et sa configuration IP finale.

| Nom de la VM | Rôle(s) principaux | Système d'Exploitation | Adresse IP |
| --- | --- | --- | --- |
| **SRV-AD** | Contrôleur de Domaine, DNS, DHCP, WDS, Partages | Windows Server 2022 | 192.168.100.10 |
| **SRV-GLPI** | Serveur GLPI (Helpdesk) & OCS Inventory (Inventaire) | Debian 12 | 192.168.100.11 |
| **SRV-RD** | Serveur RustDesk (Assistance à distance) | Debian 12 | 192.168.100.14 |
| **CLIENT-01** | Poste client de test et de référence | Windows 11 Pro | DHCP (dynamique) |

---

> À retenir :
> 
> 
> L'infrastructure est conçue pour fonctionner en autarcie sur le réseau local 192.168.100.0/24. L'accès à Internet, nécessaire uniquement pour les phases initiales de mise à jour, sera fourni temporairement par une passerelle PFsense qui sera ensuite retirée.
> 

---

## 0.4. Prérequis techniques et logiciels

Avant de débuter le déploiement de l'infrastructure, il est impératif de s'assurer que tous les outils et fichiers nécessaires sont disponibles et que l'environnement d'accueil est correctement configuré.

### 0.4.1. Logiciels et ISO nécessaires

Veuillez télécharger et rassembler les fichiers ISO et les logiciels suivants. Il est recommandé de les stocker dans un dossier dédié sur votre poste de travail pour un accès facilité.

| Type | Logiciel / Système d'exploitation | Version | Source / Lien de téléchargement |
| --- | --- | --- | --- |
| **Système d'exploitation** | Windows Server 2022 | (Version d'évaluation) | [Microsoft Evaluation Center](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.microsoft.com%2Fevalcenter%2F) |
| **Système d'exploitation** | Windows 11 Professionnel | (Version d'évaluation) | [Microsoft Evaluation Center](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.microsoft.com%2Fevalcenter%2F) |
| **Système d'exploitation** | Debian | 12 ("Bookworm") Net-install | [Debian.org](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.debian.org%2Fdistrib%2F) |
| **Système d'exploitation** | PFsense Community Edition | Dernière stable | [pfSense.org](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.pfsense.org%2Fdownload%2F) |
| **Gestion de parc** | GLPI | Dernière stable | [GLPI Project on GitHub](https://www.google.com/url?sa=E&q=https%3A%2F%2Fgithub.com%2Fglpi-project%2Fglpi%2Freleases) |
| **Inventaire** | OCS Inventory NG Server | Dernière stable | [OCSInventory-NG.org](https://www.google.com/url?sa=E&q=https%3A%2F%2Focsinventory-ng.org%2Fen%2Fdownload-server.html) |
| **Assistance à distance** | RustDesk Server | Dernière stable | [RustDesk on GitHub](https://www.google.com/url?sa=E&q=https%3A%2F%2Fgithub.com%2Frustdesk%2Frustdesk-server%2Freleases) |
| **Déploiement logiciel** | 7-Zip (pour l'exemple GPO) | (MSI 64-bit) | [7-zip.org](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.7-zip.org%2Fdownload.html) |

> Astuce :
> 
> 
> Une fois téléchargés, transférez tous les fichiers ISO (.iso) dans le stockage dédié de votre hyperviseur Proxmox (généralement local (pve) > ISO Images) pour pouvoir les attacher facilement aux machines virtuelles.
> 

### 0.4.2. Configuration de l'hyperviseur Proxmox (rappel)

Cette documentation part du principe que vous disposez d'un **serveur Proxmox fonctionnel**. La création et la configuration des machines virtuelles (VM) seront détaillées dans les chapitres suivants, mais ne couvriront pas l'installation de l'hyperviseur lui-même.

La configuration réseau de Proxmox est essentielle pour le bon déroulement du projet. Assurez-vous que :

1. **Une interface bridge vmbr0 est configurée** et connectée à votre réseau physique. C'est par cette interface que la VM PFsense obtiendra son accès à Internet (rôle WAN).
2. **Un second bridge Linux vmbr1 est créé**, mais **sans être rattaché à une interface physique**. Ce bridge servira de commutateur virtuel isolé pour notre réseau LAN 192.168.100.0/24. Toutes les machines virtuelles du projet (serveurs et client) seront connectées à ce bridge vmbr1.

Cette configuration à deux bridges est cruciale :

- vmbr0 donne un accès à l'extérieur.
- vmbr1 crée un LAN interne sécurisé où tous nos services communiqueront, sans interférence avec votre réseau physique principal.

# 1. Mise en Place de l'Infrastructure Réseau Initiale avec PFsense

Pour déployer nos serveurs, nous avons besoin d'un accès à Internet pour télécharger les paquets de mise à jour et les dépendances logicielles. Cependant, notre architecture cible est conçue pour fonctionner sur un réseau local isolé (192.168.100.0/24).

Pour résoudre cette problématique, nous allons déployer une machine virtuelle **PFsense** qui agira comme une passerelle et un routeur temporaires.

## 1.1. Rôle et caractère temporaire de PFsense

La VM PFsense aura un rôle très spécifique et limité dans le temps :

1. **Fournir un accès Internet :** Elle sera connectée d'un côté à notre réseau physique (via le bridge vmbr0) pour accéder à Internet (interface WAN) et de l'autre à notre réseau LAN isolé (via le bridge vmbr1).
2. **Agir comme passerelle :** Elle routera le trafic de notre LAN (192.168.100.0/24) vers Internet, permettant à nos VM de se mettre à jour.
3. **Être le serveur DNS initial :** Elle servira de redirecteur DNS pour nos VM avant que notre propre contrôleur de domaine ne prenne le relais.

> Important :
> 
> 
> PFsense est une solution temporaire. Une fois que tous nos serveurs seront installés, configurés et mis à jour, **la machine virtuelle PFsense sera arrêtée et supprimée**. Les rôles de passerelle et de DNS seront alors entièrement gérés par notre infrastructure interne, notamment par le serveur **SRV-AD**. Cette étape est cruciale pour garantir que notre environnement final est bien autonome, comme le demande le cahier des charges.
> 

## 1.2. Création de la machine virtuelle PFsense

Nous allons maintenant créer la machine virtuelle (VM) qui hébergera notre routeur PFsense.

1. Depuis l'interface web de Proxmox, cliquez sur le bouton **"Créer VM"** en haut à droite.
    
    **Onglet Général :**
    
2. **Nom :** Saisissez PFSENSE-GW (ou un nom similaire).
3. **ID VM :** Laissez la valeur par défaut ou choisissez-en une disponible.
4. Cliquez sur **Suivant**.
    
    **Onglet OS :**
    
5. Sélectionnez **"Utiliser une image CD/DVD (iso)"**.
6. **Stockage :** Choisissez local.
7. **Image ISO :** Sélectionnez le fichier ISO de PFsense que vous avez préalablement téléversé.
8. **Type d'OS :** Other.
9. Cliquez sur **Suivant**.
    
    **Onglet Système :**
    
10. Laissez les valeurs par défaut (machine q35, BIOS SeaBIOS).
11. Cochez la case **"Agent QEMU"**. Cela permet une meilleure communication entre l'hôte Proxmox et la VM.
12. Cliquez sur **Suivant**.
    
    **Onglet Disques :**
    
13. **Bus/Device :** SATA.
14. **Taille du disque (Go) :** 16 Go est amplement suffisant pour PFsense.
15. Cliquez sur **Suivant**.
    
    **Onglet CPU :**
    
16. **Cœurs :** 1. PFsense est très léger et n'a pas besoin de plus pour notre usage.
17. **Type :** Laissez Default (kvm64).
18. Cliquez sur **Suivant**.
    
    **Onglet Mémoire :**
    
19. **Mémoire (Mo) :** 1024 Mo (1 Go) est suffisant.
20. Cliquez sur **Suivant**.
    
    **Onglet Réseau :**
    
21. **Réseau :** vmbr0. Il s'agit de la première carte réseau, qui servira d'interface **WAN**. Elle doit être connectée au bridge ayant accès au réseau physique et à Internet.
22. **Modèle :** VirtIO (paravirtualisé).
23. Cliquez sur **Suivant**.
    
    **Onglet Confirmer :**
    
24. Vérifiez le résumé de la configuration.
25. **Ne cochez pas** "Démarrer après création". Nous devons ajouter une seconde carte réseau avant le premier démarrage.
26. Cliquez sur **Terminer**.

La VM PFSENSE-GW est maintenant créée. Nous devons lui ajouter son interface LAN.

1. Sélectionnez la VM PFSENSE-GW dans le panneau de gauche, puis allez dans la section **"Matériel"**.
2. Cliquez sur **Ajouter > Carte réseau**.
3. **Réseau :** vmbr1. C'est le bridge de notre LAN isolé.
4. **Modèle :** VirtIO (paravirtualisé).
5. Cliquez sur **Ajouter**.

Votre machine virtuelle PFsense est maintenant prête avec ses deux interfaces réseau :

- **net0 (sur vmbr0) :** Pour le WAN.
- **net1 (sur vmbr1) :** Pour le LAN.

Nous pouvons maintenant procéder à son installation.

## 1.3. Installation et configuration de base de PFsense

Maintenant que la machine virtuelle est prête, nous pouvons la démarrer et procéder à l'installation du système PFsense.

### 1.3.1. Démarrage et assistant d'installation

1. Sélectionnez la VM PFSENSE-GW et cliquez sur **"Démarrer"** en haut à droite, puis ouvrez la **"Console"**.
2. L'installeur démarre. Acceptez le copyright en appuyant sur **Entrée**.
3. Sur l'écran "Welcome to pfSense!", choisissez **"Install"** et validez avec **Entrée**.
4. **Keymap Selection :** Conservez la disposition de clavier par défaut (Continue with default keymap) ou choisissez celle qui vous convient (ex: fr.kbd). Validez votre choix.
5. **Partitioning :** Choisissez **"Auto (ZFS)"**. C'est le système de fichiers recommandé. Validez avec **Entrée**.
6. Sur l'écran de configuration ZFS, naviguez avec les flèches jusqu'à **"> Install"** et validez.
7. **Pool Type/Disks :** Choisissez **"stripe - No Redundancy"**. Nous n'avons qu'un seul disque virtuel, donc pas de redondance possible. Sélectionnez le disque (space bar pour cocher) et validez sur **"> OK"**.
8. **Last Chance! :** L'installeur vous demande de confirmer la destruction des données sur le disque. Naviguez sur **"> YES"** et validez.
9. L'installation des fichiers commence. Cette opération peut prendre quelques minutes.
10. Une fois l'installation terminée, le système vous demandera si vous souhaitez ouvrir un shell. Choisissez **"No"** et validez.
11. L'écran final vous propose de redémarrer. Sélectionnez **"Reboot"** et validez.

> Important :
> 
> 
> Avant que la VM ne redémarre complètement, retournez dans la section **"Matériel"** de la VM sur Proxmox, sélectionnez le **"Lecteur CD/DVD"** et cliquez sur **"Modifier"** pour sélectionner l'option **"Ne pas utiliser de média"**. Cela évitera de redémarrer sur l'ISO d'installation.
> 

### 1.3.2. Configuration des interfaces (WAN/LAN)

Après le redémarrage, PFsense vous guidera dans l'assignation des interfaces réseau.

1. La console PFsense vous demandera si les VLANs doivent être configurées maintenant. Tapez **n** (non) et validez avec **Entrée**.
2. L'installeur va détecter les deux cartes réseau (vtnet0 et vtnet1) et vous demander d'assigner l'interface **WAN**.
3. L'interface WAN est celle connectée à votre réseau externe (vmbr0). Dans notre cas, il s'agit de vtnet0. Tapez **vtnet0** et validez.
4. Ensuite, il vous demandera d'assigner l'interface **LAN**. C'est notre seconde carte, vtnet1. Tapez **vtnet1** et validez.
5. PFsense vous présentera un résumé des assignations. Si tout est correct, tapez **y** (oui) pour confirmer.

Le système termine sa configuration. Après quelques instants, le menu principal de la console PFsense s'affichera. Il doit indiquer :

- **WAN (vtnet0) :** a reçu une adresse IP de votre réseau physique (via DHCP).
- **LAN (vtnet1) :** a l'adresse IP par défaut **192.168.1.1**.

Notre routeur PFsense est maintenant installé et fonctionnel avec sa configuration de base.

### 1.3.3 Création de la machine virtuelle Windows 11 Client (Poste témoin)

Cette machine virtuelle jouera plusieurs rôles tout au long du projet : elle nous a déjà servi à configurer PFsense, et elle servira plus tard de **poste de référence** pour valider l'intégration au domaine, l'application des GPO, le déploiement de logiciels et, enfin, pour créer notre image système avec WDS.

Si vous avez déjà utilisé cette VM pour configurer PFsense, vous pouvez passer directement à la section suivante. Sinon, voici la procédure complète pour la créer.

1. Sur l'interface Proxmox, cliquez sur **"Créer VM"**.
    
    **Onglet Général :**
    
2. **Nom :** CLIENT-01.
3. Cliquez sur **Suivant**.
    
    **Onglet OS :**
    
4. Sélectionnez **"Utiliser une image CD/DVD (iso)"** et choisissez votre image ISO de **Windows 11 Pro**.
5. **Type d'OS :** Microsoft Windows.
6. **Version :** 11.
7. Cliquez sur **Suivant**.
    
    **Onglet Système :**
    
8. **Machine :** q35.
9. **BIOS :** **OVMF (UEFI)**. Windows 11 requiert un firmware UEFI.
10. **Stockage EFI :** Sélectionnez un stockage pour le disque EFI (ex: local-lvm).
11. Cochez **"Ajouter TPM"**. Le module TPM 2.0 est également un prérequis pour Windows 11.
12. **Stockage TPM :** Sélectionnez un stockage (ex: local-lvm).
13. **Version :** v2.0.
14. Cochez **"Agent QEMU"**.
15. Cliquez sur **Suivant**.
    
    **Onglet Disques :**
    
16. **Bus/Device :** SCSI.
17. **Taille du disque (Go) :** 64 Go est un minimum confortable.
18. Cliquez sur **Suivant**.
    
    **Onglet CPU :**
    
19. **Cœurs :** 2. Pour une expérience fluide.
20. Cliquez sur **Suivant**.
    
    **Onglet Mémoire :**
    
21. **Mémoire (Mo) :** 4096 Mo (4 Go).
22. Cliquez sur **Suivant**.
    
    **Onglet Réseau :**
    
23. **Réseau :** **vmbr1**. C'est le bridge de notre LAN isolé.
24. **Modèle :** VirtIO (paravirtualisé).
25. Cliquez sur **Suivant**.
    
    **Onglet Confirmer :**
    
26. Vérifiez le résumé, puis cliquez sur **Terminer**.

Une fois la VM créée, vous pouvez la démarrer et procéder à une installation standard de Windows 11.

> Astuce d'installation :
> 
> 
> Lors de l'installation de Windows 11, il se peut que l'installeur bloque à l'étape "Connectons-nous à un réseau" car il ne trouvera pas Internet (ce qui est normal). Pour contourner cela :
> 
> 1. Appuyez sur **Maj + F10** pour ouvrir une invite de commandes.
> 2. Tapez la commande OOBE\BYPASSNRO et appuyez sur **Entrée**.
> 3. La machine va redémarrer et vous proposera l'option **"Je n'ai pas Internet"**, vous permettant de finaliser l'installation avec un compte local.

À l'issue de cette étape, nous disposons d'une infrastructure réseau de base fonctionnelle et d'un poste client prêt à être utilisé pour les phases de test et de validation à venir.

## 1.4. Accès à l'interface web de PFsense

Pour configurer PFsense de manière plus approfondie, nous devons utiliser son interface d'administration web. Cependant, cette interface n'est accessible que depuis son réseau **LAN**. Or, pour l'instant, aucune machine n'est connectée à ce réseau isolé (vmbr1).

Nous allons donc utiliser notre **poste client Windows 11** comme machine de configuration temporaire.

1. Dans l'interface Proxmox, sélectionnez la machine virtuelle CLIENT-01 que nous utiliserons plus tard comme poste témoin.
2. Allez dans la section **"Matériel"** de la VM.
3. Assurez-vous que sa carte réseau (net0) est bien connectée au bridge **vmbr1**. C'est le même bridge que l'interface LAN de PFsense.
4. Démarrez la VM CLIENT-01.
5. Une fois Windows 11 démarré, ouvrez une invite de commande et tapez ipconfig. Vous devriez voir que la machine a reçu une adresse IP du serveur DHCP de PFsense, dans la plage 192.168.1.0/24.
6. Ouvrez un navigateur web (Edge) sur le CLIENT-01.
7. Entrez l'adresse de l'interface LAN de PFsense dans la barre d'adresse : **https://192.168.1.1**.
    
    > Note : Il est normal que votre navigateur affiche un avertissement de sécurité, car PFsense utilise un certificat auto-signé par défaut.
    > 
8. Cliquez sur "Paramètres avancés" (ou équivalent), puis sur "Continuer vers 192.168.1.1 (non sécurisé)".
9. Vous êtes maintenant sur la page de connexion de PFsense. Utilisez les identifiants par défaut :
    - **Username :** admin
    - **Password :** pfsense
10. Cliquez sur **Sign In**.
    
    ![16-06-2025_22-35-42.png](16-06-2025_22-35-42.png)
    

Vous êtes maintenant connecté à l'interface web de PFsense et prêt à la configurer.

## 1.5. Modification du plan d'adressage LAN

La première étape de configuration via l'interface web est d'aligner le réseau LAN de PFsense sur notre plan d'adressage cible pour le projet PARCUS, qui est **192.168.100.0/24**.

### 1.5.1. Connexion à l'interface web (192.168.1.1)

Comme vu à l'étape précédente, assurez-vous d'être connecté à l'interface d'administration de PFsense depuis le navigateur du CLIENT-01. Au premier accès, un assistant de configuration ("Setup Wizard") se lance. Nous allons le passer pour l'instant afin de modifier l'IP de l'interface directement.

### 1.5.2. Changement de l'IP LAN vers 192.168.100.1/24

1. Dans le menu supérieur, naviguez vers **Interfaces > LAN**.
    
    ![16-06-2025_22-36-50.png](16-06-2025_22-36-50.png)
    
2. Dans la section **"Static IPv4 Configuration"**, modifiez les champs suivants :
    - **IPv4 Address :** Remplacez 192.168.1.1 par **192.168.100.1**.
    - Juste à côté de l'adresse, dans la liste déroulante du masque de sous-réseau, sélectionnez **24**.
        
        ![16-06-2025_22-37-23.png](16-06-2025_22-37-23.png)
        
3. Faites défiler la page jusqu'en bas et cliquez sur **Save**.
    
    ![16-06-2025_22-38-03.png](16-06-2025_22-38-03.png)
    
4. PFsense appliquera la modification et affichera un message vous informant que vous devrez peut-être renouveler l'adresse IP de votre poste client pour accéder à la nouvelle adresse. Cliquez sur **Apply Changes**.
    
    ![16-06-2025_22-38-15.png](16-06-2025_22-38-15.png)
    

À cet instant, vous allez perdre la connexion à l'interface web, ce qui est tout à fait normal. L'adresse 192.168.1.1 n'existe plus.

1. Retournez sur la machine CLIENT-01. Ouvrez une nouvelle invite de commande et exécutez les commandes suivantes pour forcer le renouvellement de l'adresse IP :
    
          `ipconfig /release
    ipconfig /renew`
    
    ![16-06-2025_22-40-07.png](16-06-2025_22-40-07.png)
    
2. Après quelques instants, exécutez de nouveau ipconfig. Vous devriez voir que votre poste client a maintenant une adresse IP dans la nouvelle plage, par exemple 192.168.100.100.
3. Dans le navigateur web du CLIENT-01, vous pouvez maintenant accéder à la nouvelle adresse de l'interface PFsense : **https://192.168.100.1**.

Le plan d'adressage de notre LAN temporaire est maintenant correctement configuré.

![16-06-2025_22-39-02.png](16-06-2025_22-39-02.png)

## 1.6. Désactivation du serveur DHCP de PFsense

Notre infrastructure finale reposera sur le serveur DHCP du contrôleur de domaine (SRV-AD). Pour éviter tout conflit d'adressage lorsque nous déploierons ce serveur, il est essentiel de désactiver le service DHCP actuellement actif sur PFsense.

1. Depuis le navigateur de votre CLIENT-01, connectez-vous à l'interface web de PFsense via sa nouvelle adresse : **https://192.168.100.1**.
    
    ![16-06-2025_22-41-23.png](16-06-2025_22-41-23.png)
    
2. Dans le menu supérieur, naviguez vers **Services > DHCP Server**.
3. Vous êtes sur l'onglet de l'interface **LAN**. C'est ici que le service est configuré.
4. Décochez la case **"Enable DHCP server on LAN interface"**. Cette action est la seule nécessaire pour désactiver complètement le service.
    
    ![16-06-2025_22-43-34.png](16-06-2025_22-43-34.png)
    
5. Choisissez une plage d’adresse dans la section “**Address Pool Range”**
6. Faites défiler la page jusqu'en bas et cliquez sur **Save**.
7. Si un message s’affiche disan que ISC DHCP est en fin de vie, cliquez sur le lien, 
    
    ![16-06-2025_22-45-14.png](16-06-2025_22-45-14.png)
    
    puis sélectionnez Keap DHCP, ensuite faites défiler la page jusqu'en bas et cliquez sur **Save**.
    
    ![16-06-2025_22-45-33.png](16-06-2025_22-45-33.png)
    

Le serveur DHCP de PFsense est maintenant désactivé.

> À retenir :
> 
> 
> À partir de cet instant, aucune nouvelle machine connectée au réseau LAN (vmbr1) ne pourra obtenir une adresse IP automatiquement. C'est le comportement attendu. Nous configurerons manuellement les adresses IP de nos serveurs, et le futur serveur DHCP de notre contrôleur de domaine prendra ensuite le relais pour les postes clients.
> 

L'infrastructure réseau de base est maintenant prête et saine pour accueillir nos serveurs.

# 2. Déploiement et Configuration du Contrôleur de Domaine (SRV-AD)

Le contrôleur de domaine est le pilier de notre infrastructure. Il centralisera l'authentification des utilisateurs, la gestion des ordinateurs, les services réseau essentiels (DNS, DHCP) et les stratégies de sécurité (GPO).

## 2.1. Création de la machine virtuelle Windows Server 2022

La procédure de création de la VM pour notre serveur est similaire à celle du client Windows 11, avec quelques ajustements.

1. Dans l'interface web de Proxmox, cliquez sur **"Créer VM"**.
    
    **Onglet Général :**
    
2. **Nom :** SRV-AD.
3. Cliquez sur **Suivant**.
    
    **Onglet OS :**
    
4. Sélectionnez **"Utiliser une image CD/DVD (iso)"** et choisissez votre image ISO de **Windows Server 2022**.
5. **Type d'OS :** Microsoft Windows.
6. **Version :** 11/2022.
7. Cliquez sur **Suivant**.
    
    **Onglet Système :**
    
8. **Machine :** q35.
9. **BIOS :** **OVMF (UEFI)**.
10. **Stockage EFI :** Sélectionnez un stockage approprié (ex: local-lvm).
11. Cochez **"Agent QEMU"**.
12. Cliquez sur **Suivant**.
    
    **Onglet Disques :**
    
13. **Bus/Device :** SCSI.
14. **Taille du disque (Go) :** 80 Go pour le système et les rôles.
15. Cliquez sur **Suivant**.
    
    **Onglet CPU :**
    
16. **Cœurs :** 2. C'est un minimum recommandé pour un contrôleur de domaine.
17. Cliquez sur **Suivant**.
    
    **Onglet Mémoire :**
    
18. **Mémoire (Mo) :** 4096 Mo (4 Go).
19. Cliquez sur **Suivant**.
    
    **Onglet Réseau :**
    
20. **Réseau :** **vmbr1**. Notre serveur doit être sur le LAN isolé.
21. **Modèle :** VirtIO (paravirtualisé).
22. Cliquez sur **Suivant**.
    
    **Onglet Confirmer :**
    
23. Vérifiez le résumé, puis cliquez sur **Terminer**.

Une fois la VM créée, démarrez-la et ouvrez la console pour commencer l'installation de Windows Server 2022.

> Astuce d'installation :
> 
> 
> Au cours de l'installation, veillez à sélectionner l'édition **"Windows Server 2022 Standard (Expérience de bureau)"**. La version sans expérience de bureau (Server Core) se gère uniquement en ligne de commande et n'est pas adaptée pour ce projet pédagogique.
> 

Procédez à l'installation standard. Créez un mot de passe administrateur complexe lorsque le système vous le demandera.

## 2.2. Configuration post-installation initiale

Une fois Windows Server 2022 installé, deux actions sont primordiales avant de pouvoir installer les rôles : donner un nom explicite au serveur et lui assigner une adresse IP statique.

### 2.2.1. Nommage du serveur (SRV-AD)

1. Le **Gestionnaire de serveur** s'ouvre automatiquement au démarrage. Si ce n'est pas le cas, ouvrez-le depuis le menu Démarrer.
2. Dans le volet de gauche, cliquez sur **Serveur local**.
3. Dans le volet principal, cliquez sur le nom actuel de l'ordinateur (un nom généré aléatoirement, ex: WIN-XXXXXXX).
4. La fenêtre **Propriétés système** s'ouvre. Cliquez sur le bouton **Modifier...**.
5. Dans le champ "Nom de l'ordinateur", saisissez **SRV-AD**.
    
    ![16-06-2025_23-02-54.png](16-06-2025_23-02-54.png)
    
6. Cliquez sur **OK**, puis **Fermer**.
7. Le système vous demandera de redémarrer pour appliquer les changements. Cliquez sur **Redémarrer maintenant**.

### 2.2.2. Configuration de l'adressage IP fixe

Après le redémarrage, nous allons configurer l'IP statique.

1. Ouvrez le **Panneau de configuration** > **Réseau et Internet** > **Centre Réseau et partage**.
2. Dans le volet de gauche, cliquez sur **Modifier les paramètres de la carte**.
3. Faites un clic droit sur votre carte réseau (généralement nommée Ethernet0) et choisissez **Propriétés**.
4. Sélectionnez la ligne **Protocole Internet version 4 (TCP/IPv4)** et cliquez sur le bouton **Propriétés**.
5. Cochez la case **"Utiliser l'adresse IP suivante"** et remplissez les champs comme suit :
    - **Adresse IP :** 192.168.100.10
    - **Masque de sous-réseau :** 255.255.255.0
    - **Passerelle par défaut :** 192.168.100.1 (C'est l'adresse de notre routeur PFsense temporaire).
6. Ensuite, cochez la case **"Utiliser l'adresse de serveur DNS suivante"** :
    - **Serveur DNS préféré :** 127.0.0.1
    
    > À retenir :
    > 
    > 
    > Nous utilisons l'adresse de bouclage (loopback) 127.0.0.1 car ce serveur hébergera lui-même le service DNS pour le futur domaine. C'est une pratique standard pour un contrôleur de domaine.
    > 
7. Cliquez sur **OK** pour valider.
    
    ![16-06-2025_23-06-43.png](16-06-2025_23-06-43.png)
    

Le serveur SRV-AD est maintenant correctement nommé et dispose d'une adresse IP fixe sur notre réseau. Il est prêt pour l'installation du rôle Active Directory.

## 2.3. Installation du rôle Active Directory Domain Services (AD DS)

Le rôle **AD DS** est le service fondamental qui transforme un serveur Windows en contrôleur de domaine. Il contient tous les objets de l'annuaire (utilisateurs, groupes, ordinateurs) et gère l'authentification.

Nous allons maintenant l'installer via le **Gestionnaire de serveur**.

1. Sur le tableau de bord du **Gestionnaire de serveur**, cliquez sur **"Ajouter des rôles et des fonctionnalités"**.
    
    ![16-06-2025_23-08-47.png](16-06-2025_23-08-47.png)
    
2. L'assistant d'ajout s'ouvre. Sur la page **"Avant de commencer"**, cliquez sur **Suivant**.
3. **Type d'installation :** Laissez l'option par défaut **"Installation basée sur un rôle ou une fonctionnalité"** et cliquez sur **Suivant**.
4. **Sélection du serveur :** Assurez-vous que votre serveur SRV-AD est sélectionné dans la liste et cliquez sur **Suivant**.
5. **Rôles de serveurs :** Dans la liste des rôles, cochez la case **"Services de domaine Active Directory"**.
6. Une fenêtre contextuelle apparaît, vous proposant d'ajouter les fonctionnalités requises pour AD DS (comme les outils d'administration). Cliquez sur le bouton **"Ajouter des fonctionnalités"**.
    
    ![16-06-2025_23-10-41.png](16-06-2025_23-10-41.png)
    
7. Vous revenez à la liste des rôles. Cliquez sur **Suivant**.
8. **Fonctionnalités :** La fonctionnalité **"Gestion de stratégie de groupe"** est déjà sélectionnée. N'ajoutez rien d'autre pour l'instant et cliquez sur **Suivant**.
9. **AD DS :** Une page d'information sur Active Directory s'affiche. Lisez-la et cliquez sur **Suivant**.
10. **Confirmation :** Sur la page de confirmation, cochez la case **"Redémarrer automatiquement le serveur de destination, si nécessaire"**. Un avertissement apparaîtra, confirmez en cliquant sur **Oui**.
11. Cliquez sur **Installer**.
    
    ![16-06-2025_23-12-54.png](16-06-2025_23-12-54.png)
    

L'installation des binaires du service AD DS commence. Cette étape n'installe que les fichiers ; elle ne configure pas encore le domaine. La progression s'affiche à l'écran.

Une fois l'installation terminée, un lien bleu **"Promouvoir ce serveur en contrôleur de domaine"** apparaît. Nous utiliserons ce lien dans la prochaine étape pour créer notre forêt parcus.local.

## 2.4. Promotion du serveur en contrôleur de domaine

Maintenant que les fichiers du service AD DS sont installés, nous devons "promouvoir" le serveur. Ce processus configure le serveur pour qu'il devienne le premier contrôleur de domaine d'une nouvelle forêt Active Directory.

### 2.4.1. Création de la nouvelle forêt parcus.local

1. Dans le **Gestionnaire de serveur**, cliquez sur le drapeau de notification en haut à droite, puis sur le lien bleu **"Promouvoir ce serveur en contrôleur de domaine"**.
    
    ![16-06-2025_23-21-11.png](16-06-2025_23-21-11.png)
    
2. L'assistant de configuration des services de domaine Active Directory s'ouvre. Sur la page **"Configuration de déploiement"**, sélectionnez l'option **"Ajouter une nouvelle forêt"**.
3. Dans le champ **"Nom de domaine racine"**, saisissez le nom de notre domaine interne : **parcus.local**.
    
    > Astuce : L'utilisation du TLD (Top-Level Domain) .local est une pratique courante pour les domaines Active Directory qui ne sont pas destinés à être joignables depuis l'Internet public.
    > 
4. Cliquez sur **Suivant**.
    
    ![16-06-2025_23-23-01.png](16-06-2025_23-23-01.png)
    

### 2.4.2. Options du contrôleur de domaine et mot de passe DSRM

1. Sur la page **"Options du contrôleur de domaine"** :
    - **Niveau fonctionnel de la forêt et du domaine :** Laissez la valeur par défaut **Windows Server 2016**. Cela garantit la compatibilité maximale si nous devions ajouter d'anciens serveurs, bien que ce ne soit pas le cas ici.
    - **Fonctionnalités du contrôleur de domaine :** Assurez-vous que les cases **"Serveur DNS (Domain Name System)"** et **"Catalogue global (GC)"** sont cochées. Elles le sont par défaut et sont essentielles.
    - **Mot de passe du mode de restauration des services d'annuaire (DSRM) :** Saisissez et confirmez un mot de passe complexe. Ce mot de passe est crucial et sert à restaurer l'annuaire Active Directory en cas de problème majeur. Conservez-le en lieu sûr.
2. Cliquez sur **Suivant**.
    
    ![16-06-2025_23-24-02.png](16-06-2025_23-24-02.png)
    
3. **Options DNS :** Un avertissement concernant l'impossibilité de créer une délégation pour ce serveur DNS peut apparaître. C'est normal, car il n'existe pas encore de zone parente. Ignorez-le et cliquez sur **Suivant**.
4. **Options supplémentaires :** Le nom de domaine NetBIOS (PARCUS) est automatiquement généré. Vérifiez-le et cliquez sur **Suivant**.
5. **Chemins d'accès :** Conservez les chemins par défaut pour la base de données, les fichiers journaux et le dossier SYSVOL. Cliquez sur **Suivant**.
6. **Vérification de la configuration :** L'assistant vérifie que toutes les conditions préalables sont remplies. Si des avertissements apparaissent (notamment sur la cryptographie ou le DNS), c'est généralement sans incidence pour une installation standard. Assurez-vous d'obtenir le message vert "Toutes les vérifications des conditions préalables ont été menées à bien".
7. Cliquez sur **Installer**.
    
    ![16-06-2025_23-26-05.png](16-06-2025_23-26-05.png)
    

L'installation et la configuration du domaine commencent. Ce processus peut prendre plusieurs minutes. **Le serveur redémarrera automatiquement** à la fin de l'opération.

Une fois redémarré, l'écran de connexion affichera le nom du domaine avant le nom d'utilisateur (ex: PARCUS\Administrateur). Votre serveur est désormais un contrôleur de domaine pleinement fonctionnel.

## 2.5. Installation et configuration du serveur DHCP

Le service DHCP (Dynamic Host Configuration Protocol) est essentiel pour attribuer automatiquement des configurations réseau (adresse IP, masque, passerelle, serveurs DNS) aux postes clients. Nous allons l'installer sur notre contrôleur de domaine SRV-AD.

### 2.5.1. Ajout du rôle DHCP

1. Ouvrez le **Gestionnaire de serveur**.
2. Cliquez sur **"Ajouter des rôles et des fonctionnalités"**.
3. Passez les premières étapes (Avant de commencer, Type d'installation, Sélection du serveur) en cliquant sur **Suivant**.
4. Sur la page **"Rôles de serveurs"**, cochez la case **"Serveur DHCP"**.
5. Une fenêtre contextuelle s'ouvre pour ajouter les outils de gestion. Cliquez sur **"Ajouter des fonctionnalités"**.
6. Cliquez sur **Suivant** jusqu'à la page de confirmation.
    
    ![16-06-2025_23-42-09.png](16-06-2025_23-42-09.png)
    
7. Sur la page **"Confirmation"**, cliquez sur **Installer**.
    
    ![16-06-2025_23-44-12.png](16-06-2025_23-44-12.png)
    
8. Une fois l'installation terminée, cliquez sur le lien bleu **"Terminer la configuration DHCP"**.
    
    ![16-06-2025_23-45-44.png](16-06-2025_23-45-44.png)
    

### 2.5.2. Autorisation du serveur DHCP dans Active Directory

1. L'assistant de post-installation DHCP s'ouvre. Il vous informe que le serveur doit être autorisé dans AD pour pouvoir servir des adresses. Cliquez sur **Suivant**.
2. Sur la page **"Autorisation"**, assurez-vous que l'option **"Utiliser les informations d'identification de l'utilisateur suivant"** est sélectionnée et que le compte administrateur du domaine est affiché.
3. Cliquez sur **Valider**. Un message de succès apparaîtra. Cliquez sur **Fermer**.
    
    > À retenir :
    > 
    > 
    > L'autorisation est une mesure de sécurité d'Active Directory qui empêche des serveurs DHCP non autorisés de distribuer des adresses sur le réseau.
    > 
    
    ![16-06-2025_23-46-33.png](16-06-2025_23-46-33.png)
    

### 2.5.3. Création et configuration d'une étendue pour le LAN

Maintenant que le service est installé et autorisé, nous devons créer une "étendue" (scope), c'est-à-dire une plage d'adresses IP à distribuer.

1. Dans le **Gestionnaire de serveur**, allez dans **Outils > DHCP**.
2. Dans la console DHCP, développez le nom de votre serveur (srv-ad.parcus.local), faites un clic droit sur **IPv4** et choisissez **"Nouvelle étendue..."**.
    
    ![16-06-2025_23-48-39.png](16-06-2025_23-48-39.png)
    
3. L'assistant de création d'étendue se lance. Cliquez sur **Suivant**.
4. **Nom de l'étendue :** Saisissez un nom explicite, par exemple LAN-PARCUS-Siege, et une description. Cliquez sur **Suivant**.
    
    ![16-06-2025_23-49-57.png](16-06-2025_23-49-57.png)
    
5. **Plage d'adresses :** Définissez la plage d'adresses qui sera distribuée. Pour ne pas interférer avec les IP statiques de nos serveurs, nous allons commencer plus haut.
    - **Adresse IP de début :** 192.168.100.100
    - **Adresse IP de fin :** 192.168.100.200
    - **Masque de sous-réseau :** 255.255.255.0 (la longueur 24 est calculée automatiquement).
        
        ![16-06-2025_23-52-54.png](16-06-2025_23-52-54.png)
        
6. Cliquez sur **Suivant**.
7. **Exclusions et délai :** Nous n'ajouterons pas d'exclusions pour l'instant. Cliquez sur **Suivant**.
8. **Durée du bail :** Conservez la durée par défaut de 8 jours. Cliquez sur **Suivant**.

### 2.5.4. Configuration des options de l'étendue (passerelle, DNS)

1. **Configurer les options DHCP :** Laissez l'option **"Oui, je veux configurer ces options maintenant"** cochée et cliquez sur **Suivant**.
2. **Routeur (Passerelle par défaut) :** Saisissez l'adresse IP de notre futur routeur interne (qui sera SRV-AD lui-même, mais ce rôle sera ajouté plus tard). Pour l'instant, mettons une IP qui servira de placeholder ou l'IP du serveur.
    - **Adresse IP :** 192.168.100.10 (Nous la configurerons plus tard via une GPO pour pointer sur la bonne passerelle).
    - Cliquez sur **Ajouter**, puis sur **Suivant**.
3. **Serveurs DNS :** Le serveur DNS de notre domaine (192.168.100.10) est automatiquement détecté et ajouté. Ajouté ensuite 10.10.10.1. Cliquez sur **Suivant**.
4. **Serveurs WINS :** Nous n'utilisons pas WINS. Cliquez sur **Suivant**.
5. **Activer l'étendue :** Laissez **"Oui, je veux activer cette étendue maintenant"** coché et cliquez sur **Suivant**.
6. Cliquez sur **Terminer**.

Votre serveur DHCP est maintenant pleinement opérationnel. L'étendue est active (icône verte) et prête à distribuer des adresses IP à tout nouveau client qui se connectera au réseau vmbr1.

## 2.6. Configuration du serveur DNS

Le service DNS (Domain Name System) a été installé automatiquement lors de la promotion du serveur en contrôleur de domaine. Il est crucial pour la résolution des noms au sein de notre domaine parcus.local. Nous allons maintenant finaliser sa configuration en créant une zone de recherche inversée et en configurant les redirecteurs.

### 2.6.1. Création d'une zone de recherche inversée

La recherche inversée permet de retrouver un nom d'hôte à partir de son adresse IP. C'est une bonne pratique qui est souvent requise pour le bon fonctionnement de certains services et pour le dépannage.

1. Dans le **Gestionnaire de serveur**, allez dans **Outils > DNS**.
2. Dans la console du Gestionnaire DNS, développez le nom de votre serveur (SRV-AD).
3. Faites un clic droit sur le dossier **"Zones de recherche inversée"** et choisissez **"Nouvelle zone..."**.
    
    ![17-06-2025_00-04-09.png](17-06-2025_00-04-09.png)
    
4. L'assistant de création de zone s'ouvre. Cliquez sur **Suivant**.
5. **Type de zone :** Laissez **"Zone principale"** coché et assurez-vous que la case **"Stocker la zone dans Active Directory"** est également cochée. Cliquez sur **Suivant**.
6. **Étendue de la réplication de zone :** Laissez l'option par défaut **"À tous les serveurs DNS s'exécutant sur des contrôleurs de domaine dans ce domaine"**. Cliquez sur **Suivant**.
7. **Nom de la zone de recherche inversée :** Sélectionnez **"Zone de recherche inversée IPv4"**. Cliquez sur **Suivant**.
8. **ID de réseau :** Saisissez les trois premiers octets de notre réseau : **192.168.100**. Le nom de la zone se complète automatiquement en dessous.
    
    ![17-06-2025_00-05-39.png](17-06-2025_00-05-39.png)
    
9. Cliquez sur **Suivant**.
10. **Mise à jour dynamique :** Laissez l'option par défaut **"N'autoriser que les mises à jour dynamiques sécurisées"**. C'est le paramètre recommandé pour un domaine Active Directory. Cliquez sur **Suivant**.
11. Cliquez sur **Terminer**.

La zone 100.168.192.in-addr.arpa est maintenant créée et visible dans la console DNS.

### 2.6.2. Configuration des redirecteurs DNS

Les redirecteurs (forwarders) sont des serveurs DNS que notre serveur local interrogera s'il ne parvient pas à résoudre un nom de domaine qui n'est pas dans sa propre zone (par exemple, www.google.com). Pendant notre phase de déploiement, nous allons le faire pointer vers notre passerelle PFsense.

1. Dans la console du Gestionnaire DNS, faites un clic droit sur le nom de votre serveur (SRV-AD) et choisissez **Propriétés**.
2. Allez dans l'onglet **"Redirecteurs"**.
3. Cliquez sur le bouton **Modifier...**.
4. Dans la fenêtre qui s'ouvre, saisissez : 10.10.10.1
5. Cliquez sur **Entrée**. Le système vérifiera l'adresse et devrait afficher une coche verte.
6. Cliquez sur **OK**, puis de nouveau sur **OK** pour fermer les propriétés du serveur.
    
    ![17-06-2025_00-11-26.png](17-06-2025_00-11-26.png)
    

Notre serveur DNS est maintenant entièrement configuré. Il peut résoudre les noms internes pour parcus.local et rediriger les requêtes externes vers Internet via PFsense.

# 3. Structuration et Gestion de l'Active Directory

Une structure Active Directory bien organisée est fondamentale pour une administration efficace. Elle simplifie la gestion des permissions et permet d'appliquer des stratégies de groupe (GPO) de manière ciblée. Nous allons utiliser les Unités d'Organisation (OU) pour segmenter nos objets (utilisateurs, groupes, ordinateurs).

## 3.1. Création de l'arborescence des Unités d'Organisation (OU)

### 3.1.1. Schéma des OU

Nous allons créer une arborescence simple et logique pour représenter le siège de PARCUS. Cette structure pourra être étendue à l'avenir pour d'autres sites si nécessaire.

- **PARCUS_Siege** (OU principale pour le site)
    - **Utilisateurs** (Pour les comptes des collaborateurs)
    - **Groupes** (Pour les groupes de sécurité)
    - **Postes_Travail** (Pour les objets ordinateur des clients Windows)
    - **Serveurs** (Pour les objets ordinateur des serveurs membres)

> À retenir :
> 
> 
> Une OU est un conteneur sur lequel on peut lier des GPO, contrairement aux conteneurs par défaut (comme "Users" ou "Computers") qui n'offrent pas cette flexibilité. Il est donc crucial de ne pas laisser les objets dans les conteneurs par défaut.
> 

### 3.1.2. Procédure de création des OU

1. Sur SRV-AD, ouvrez le **Gestionnaire de serveur**, puis naviguez vers **Outils > Utilisateurs et ordinateurs Active Directory**.
2. Dans la console, faites un clic droit sur votre domaine **parcus.local**, puis choisissez **Nouveau > Unité d'organisation**.
    
    ![2025-06-17_13-39.png](2025-06-17_13-39.png)
    
3. **Nom :** Saisissez PARCUS_Siege.
4. Assurez-vous que la case **"Protéger le conteneur contre une suppression accidentelle"** est cochée. C'est une mesure de sécurité utile.
5. Cliquez sur **OK**. L'OU PARCUS_Siege apparaît maintenant dans l'arborescence.
    
    ![2025-06-17_13-41.png](2025-06-17_13-41.png)
    
6. Nous allons maintenant créer les sous-OU. Faites un clic droit sur la nouvelle OU **PARCUS_Siege** et choisissez **Nouveau > Unité d'organisation**.
7. Répétez l'opération pour créer les quatre OU suivantes à l'intérieur de PARCUS_Siege :
    - Utilisateurs
    - Groupes
    - Postes_Travail
    - Serveurs

À la fin de cette étape, votre arborescence dans la console "Utilisateurs et ordinateurs Active Directory" doit ressembler à ceci :

![2025-06-17_13-44.png](2025-06-17_13-44.png)

Notre annuaire est maintenant structuré et prêt à accueillir les groupes, utilisateurs et ordinateurs de l'entreprise.

## 3.2. Création des groupes de sécurité

Les groupes de sécurité sont la pierre angulaire de la gestion des permissions dans Active Directory. Plutôt que d'assigner des droits à des utilisateurs individuels, nous assignerons des droits à des groupes, puis nous ajouterons les utilisateurs à ces groupes. Cette méthode, conforme au principe **AGDLP** (Account, Global, Domain Local, Permission), simplifie grandement l'administration.

Nous allons créer quelques groupes de base correspondant à des fonctions ou des niveaux d'accès au sein de PARCUS.

1. Ouvrez la console **Utilisateurs et ordinateurs Active Directory** (si elle n'est pas déjà ouverte).
2. Naviguez jusqu'à l'OU que nous avons créée à cet effet : parcus.local > PARCUS_Siege > **Groupes**.
3. Faites un clic droit dans le volet droit (ou sur l'OU Groupes), puis choisissez **Nouveau > Groupe**.
    
    ![2025-06-17_13-46.png](2025-06-17_13-46.png)
    
4. La fenêtre de création de groupe s'ouvre. Remplissez les informations suivantes pour le premier groupe :
    - **Nom du groupe :** GRP-Direction
    - **Étendue du groupe :** Laissez **Global**.
    - **Type de groupe :** Laissez **Sécurité**.
        
        ![2025-06-17_13-47.png](2025-06-17_13-47.png)
        
5. Cliquez sur **OK**.
6. Répétez cette procédure pour créer les groupes suivants, en conservant les mêmes options par défaut (Global, Sécurité) :
    - GRP-Administratif
    - GRP-Technique
    - GRP-Support-N1 (pour les futurs techniciens du helpdesk)
    - GRP-Tous-Utilisateurs (un groupe qui contiendra tous les employés de PARCUS)

À la fin de cette étape, votre OU Groupes doit contenir l'ensemble de ces nouveaux groupes de sécurité.

![2025-06-17_13-50.png](2025-06-17_13-50.png)

> Astuce :
> 
> 
> Adopter une convention de nommage claire (comme le préfixe GRP-) permet d'identifier facilement les objets et leur fonction dans l'annuaire.
> 

Ces groupes sont maintenant prêts à recevoir des membres et à se voir attribuer des permissions sur des ressources comme les dossiers partagés ou les applications.

## 3.3. Création des comptes utilisateurs

Nous allons créer quelques comptes utilisateurs de test pour simuler différents profils au sein de l'entreprise. Ces comptes nous permettront de valider les stratégies de sécurité, les permissions et le déploiement de logiciels.

1. Ouvrez la console **Utilisateurs et ordinateurs Active Directory**.
2. Naviguez jusqu'à l'OU dédiée : parcus.local > PARCUS_Siege > **Utilisateurs**.
3. Faites un clic droit dans le volet droit et choisissez **Nouveau > Utilisateur**.
    
    ![2025-06-17_13-51.png](2025-06-17_13-51.png)
    
4. L'assistant de création d'utilisateur s'ouvre. Remplissez les informations pour un utilisateur type, par exemple un membre de la direction :
    - **Prénom :** Alain
    - **Nom :** Terrieur
    - **Nom d'ouverture de session de l'utilisateur :** a.terrieur (nous utiliserons la convention prénom.nom).
        
        ![2025-06-17_13-53.png](2025-06-17_13-53.png)
        
5. Cliquez sur **Suivant**.
6. Sur la page suivante, configurez le mot de passe et les options du compte :
    - **Mot de passe :** Saisissez un mot de passe temporaire complexe.
    - **Confirmer le mot de passe :** Retapez le mot de passe.
    - Cochez la case **"L'utilisateur doit changer le mot de passe à la prochaine ouverture de session"**. C'est une bonne pratique de sécurité qui force l'utilisateur à définir son propre mot de passe.
    - Décochez les autres cases.
        
        ![2025-06-17_13-54.png](2025-06-17_13-54.png)
        
7. Cliquez sur **Suivant**, puis sur **Terminer**.

Le compte de Alain Terrieur est maintenant créé.

1. Nous allons maintenant l'ajouter au bon groupe. Faites un clic droit sur le nouvel utilisateur Alain Terrieur et choisissez **"Ajouter à un groupe..."**.
2. Dans la fenêtre qui s'ouvre, tapez le nom du groupe GRP-Direction et cliquez sur **"Vérifier les noms"**. Le nom complet du groupe devrait se souligner.
3. Cliquez sur **OK**. Un message confirme que l'opération s'est bien déroulée.
    
    ![2025-06-17_13-56.png](2025-06-17_13-56.png)
    
4. Répétez ce processus pour créer au moins un autre utilisateur de test, par exemple :
    - **Nom :** Press / **Prénom :** Alex
    - **Login :** a.press
    - **Groupe :** GRP-Administratif
5. Enfin, n'oubliez pas d'ajouter **tous** les utilisateurs (y compris l'Administrateur du domaine si besoin) au groupe GRP-Tous-Utilisateurs pour les stratégies globales.
Pour faciliter cette tâche, vous pouvez ajouter un point virgule “;” entre chaque groupe auquel vous souhaitez que l’utilisateur rejoigne.
    
    ![image.png](image.png)
    
6. Création des utilisateurs de test supplémentaires
    
    Pour simuler un environnement d'entreprise crédible, nous allons créer les utilisateurs suivants en répétant le processus décrit ci-dessus pour chacun. Chaque utilisateur sera placé dans l'OU PARCUS_Siege\Utilisateurs et ajouté aux groupes de sécurité correspondants.
    
    **1. Utilisateur du service Administratif :**
    
    - **Prénom :** Alex
    - **Nom :** Press
    - **Nom d'ouverture de session :** a.press
    - **Mot de passe :** Définir un mot de passe temporaire complexe.
    - **Options :** Cocher "L'utilisateur doit changer le mot de passe à la prochaine ouverture de session".
    - **Groupes à ajouter :**
        - GRP-Administratif
        - GRP-Tous-Utilisateurs
    
    **2. Utilisateur du service Technique :**
    
    - **Prénom :** Axel
    - **Nom :** Air
    - **Nom d'ouverture de session :** a.air
    - **Mot de passe :** Définir un mot de passe temporaire complexe.
    - **Options :** Cocher "L'utilisateur doit changer le mot de passe à la prochaine ouverture de session".
    - **Groupes à ajouter :**
        - GRP-Technique
        - GRP-Tous-Utilisateurs
    
    **3. Utilisateur du Support de Niveau 1 (Helpdesk) :**
    
    - **Prénom :** Eva
    - **Nom :** Pauré
    - **Nom d'ouverture de session :** e.paure
    - **Mot de passe :** Définir un mot de passe temporaire complexe.
    - **Options :** Cocher "L'utilisateur doit changer le mot de passe à la prochaine ouverture de session".
    - **Groupes à ajouter :**
        - GRP-Support-N1
        - GRP-Tous-Utilisateurs
7. Vérification finale

Après avoir créé ces deux utilisateurs supplémentaires et les avoir ajoutés à leurs groupes respectifs, votre OU Utilisateurs devrait contenir 4 comptes.

![image.png](image%201.png)

Votre OU Groupes ne change pas, mais si vous ouvrez les propriétés de chaque groupe (par exemple GRP-Technique > onglet Membres), vous devriez y voir l'utilisateur correspondant.

![image.png](image%202.png)

Nous disposons maintenant d'une structure d'annuaire peuplée et cohérente, prête pour l'application des stratégies de groupe.

## 3.4. Gestion des mots de passe et des stratégies de groupe (GPO)

Les stratégies de groupe (Group Policy Objects ou GPO) sont un ensemble de paramètres qui permettent de contrôler l'environnement de travail des utilisateurs et des ordinateurs membres du domaine. Nous allons les utiliser pour renforcer la sécurité en imposant une politique de mots de passe robuste.

### 3.4.1. Création de la GPO de sécurité PARCUS-SEC-Global

Plutôt que de modifier la stratégie de domaine par défaut ("Default Domain Policy"), il est recommandé de créer une GPO dédiée pour nos paramètres de sécurité.

1. Sur SRV-AD, ouvrez le **Gestionnaire de serveur**, puis naviguez vers **Outils > Gestion de stratégie de groupe**.
2. Dans la console de gestion, développez l'arborescence : Forêt: parcus.local > Domaines > parcus.local.
3. Faites un clic droit sur votre domaine **parcus.local** et choisissez **"Créer un objet GPO dans ce domaine, et le lier ici..."**.
    
    ![2025-06-17_14-12.png](2025-06-17_14-12.png)
    
4. Dans la fenêtre qui s'ouvre, nommez la nouvelle GPO : **PARCUS-SEC-Global**.
5. Cliquez sur **OK**. La GPO est créée et immédiatement liée à la racine du domaine, ce qui signifie qu'elle s'appliquera à tous les objets en dessous.

### 3.4.2. Configuration de la politique de mot de passe

Nous allons maintenant modifier cette GPO pour définir nos exigences en matière de mots de passe.

1. Dans la console de **Gestion de stratégie de groupe**, faites un clic droit sur la nouvelle GPO **PARCUS-SEC-Global** et choisissez **Modifier...**.
    
    ![2025-06-17_14-14.png](2025-06-17_14-14.png)
    
2. L'Éditeur de gestion de stratégie de groupe s'ouvre. Naviguez dans l'arborescence suivante :
    
    Configuration ordinateur > Stratégies > Paramètres Windows > Paramètres de sécurité > Stratégies de comptes > **Stratégie de mot de passe**.
    
    ![2025-06-17_14-18.png](2025-06-17_14-18.png)
    
3. Dans le volet droit, configurez les paramètres suivants en double-cliquant sur chaque ligne :
    - **Conserver l'historique des mots de passe :** Définissez à **24** mots de passe mémorisés.
        
        ![2025-06-17_14-20.png](2025-06-17_14-20.png)
        
    - **Durée de vie maximale du mot de passe :** Définissez à **90** jours.
        
        ![image.png](image%203.png)
        
    - **Durée de vie minimale du mot de passe :** Définissez à **1** jour.
        
        ![2025-06-17_14-24.png](2025-06-17_14-24.png)
        
    - **Longueur minimale du mot de passe :** Définissez à **12** caractères.
        
        ![image.png](image%204.png)
        
    - **Le mot de passe doit respecter des exigences de complexité :** Cochez **Activé**. (Cela impose l'utilisation de majuscules, minuscules, chiffres et symboles).
        
        ![2025-06-17_14-26.png](2025-06-17_14-26.png)
        
    1. Vérification :
        
        ![image.png](image%205.png)
        

### 3.4.3. Configuration de la politique de verrouillage de compte

Cette politique permet de bloquer un compte après plusieurs tentatives de connexion infructueuses, prévenant ainsi les attaques par force brute.

1. Dans le même éditeur de GPO, naviguez vers la section juste en dessous : **Stratégie de verrouillage de compte**.
2. Configurez les paramètres suivants :
    - **Seuil de verrouillage de compte :** Définissez à **5** tentatives d'ouverture de session non valides.
        
        ![image.png](image%206.png)
        
    - Windows vous proposera automatiquement de configurer les deux autres paramètres. Acceptez avec **OK**.
        
        ![image.png](image%207.png)
        
    - **Durée de verrouillage de compte :** Laissez à **30** minutes.
    - **Réinitialiser le compteur de verrouillage de compte après :** Laissez à **30** minutes.
3. Vérification :
    
    ![image.png](image%208.png)
    
4. Fermez l'Éditeur de gestion de stratégie de groupe. Les modifications sont enregistrées automatiquement.

Pour forcer l'application immédiate de cette nouvelle stratégie sur le contrôleur de domaine, ouvrez une invite de commande en tant qu'administrateur et exécutez :

`gpupdate /force`

![image.png](image%209.png)

Notre domaine est maintenant doté d'une politique de sécurité de base robuste qui s'appliquera à tous les utilisateurs.

## 3.5. Intégration du poste client au domaine

Maintenant que notre annuaire est structuré et que les stratégies de base sont en place, il est temps d'intégrer notre poste de test CLIENT-01 au domaine parcus.local. Cette étape est indispensable pour pouvoir vérifier l'application des stratégies de groupe et préparer le poste pour les déploiements futurs.

### **3.5.1. Jonction au domaine**

1. Démarrez la machine virtuelle CLIENT-01 et ouvrez une session avec le compte local.
2. **Vérification de la connectivité :** Ouvrez une invite de commandes et vérifiez que le client peut contacter le contrôleur de domaine :
    
    `ping srv-ad.parcus.local`
    
    Si le test échoue, vérifiez que le client a bien reçu une adresse IP de votre serveur DHCP (192.168.100.100 ou supérieur).
    
3. **Procédure de jonction :**
    - Ouvrez les **Paramètres > Système > Informations système**.
    - Cliquez sur **"Paramètres de domaine ou de groupe de travail"**.
    - Cliquez sur **Modifier...** et dans la section “Nom de l’ordinateur”, entrez “CLIENT-01”, puis redémarrer le PC.
    - Ensuite, dans la section "Membre de", cochez **"Domaine"**.
    - Saisissez parcus.local et cliquez sur OK.
    - Authentifiez-vous avec un compte autorisé (ex: PARCUS\Administrateur).
4. Acceptez les messages de bienvenue et **redémarrez** l'ordinateur lorsque le système vous y invite.

### **3.5.2. Déplacement de l'objet ordinateur**

Par défaut, l'objet ordinateur CLIENT-01 sera créé dans le conteneur Computers. Pour que nos GPO s'appliquent, nous devons le déplacer dans la bonne OU.

1. Sur SRV-AD, ouvrez **Utilisateurs et ordinateurs Active Directory**.
2. Cliquez sur le conteneur Computers. Vous y verrez l'objet CLIENT-01.
3. Faites un clic droit sur CLIENT-01 et choisissez **"Déplacer..."**.
4. Dans la fenêtre qui s'ouvre, naviguez jusqu'à votre OU PARCUS_Siege et sélectionnez le sous-dossier **Postes_Travail**.
5. Cliquez sur **OK**.

![image.png](image%2010.png)

Le poste CLIENT-01 est maintenant un membre géré du domaine et se trouve dans l'unité d'organisation correcte pour recevoir les stratégies logicielles.

# 4. Déploiement de Logiciels par Stratégie de Groupe (GPO)

Le déploiement de logiciels par GPO est une méthode centralisée et puissante pour installer, mettre à jour ou supprimer des applications sur un parc d'ordinateurs sans intervention manuelle sur chaque poste. C'est un gain de temps considérable et cela garantit l'homogénéité du parc logiciel.

## 4.1. Principe du déploiement par GPO

Le fonctionnement repose sur trois éléments clés :

1. **Un paquet d'installation MSI :** Les GPO ne peuvent déployer nativement que des fichiers .msi (Microsoft Windows Installer). Ces paquets contiennent toutes les informations nécessaires à une installation silencieuse (sans intervention de l'utilisateur). Pour les logiciels ne fournissant qu'un fichier .exe, des outils de reconditionnement (repackaging) sont nécessaires, mais ne seront pas couverts par ce guide.
2. **Un point de distribution :** Il s'agit d'un dossier partagé sur le réseau, accessible en lecture par tous les ordinateurs sur lesquels le logiciel doit être installé. C'est dans ce dossier que nous stockerons les fichiers .msi. Le groupe spécial Ordinateurs du domaine doit avoir les droits de lecture sur ce partage.
3. **Un objet de stratégie de groupe (GPO) :** Nous créerons une GPO spécifique qui indiquera aux ordinateurs cibles d'aller chercher le paquet .msi sur le point de distribution et de l'installer automatiquement au démarrage.

Nous allons illustrer ce principe en déployant l'utilitaire **7-Zip** sur tous les postes de travail du siège.

## 4.2. Création du point de distribution logicielle

Le point de distribution est le référentiel central où seront stockés tous nos paquets logiciels (.msi). Ce dossier doit être partagé sur le réseau et ses permissions doivent être configurées avec soin pour garantir à la fois la sécurité et l'accessibilité par les ordinateurs clients.

Nous allons créer ce partage sur notre serveur SRV-AD.

### 4.2.1. Création du dossier partagé Deploy

1. Ouvrez l'**Explorateur de fichiers** sur SRV-AD.
2. Naviguez à la racine du disque C:.
3. Créez un nouveau dossier et nommez-le **Deploy**.
4. Faites un clic droit sur ce nouveau dossier Deploy et choisissez **Propriétés**.

### 4.2.2. Configuration des permissions de partage et NTFS

Nous devons configurer deux niveaux de permissions : les permissions de **Partage** (qui contrôle l'accès via le réseau) et les permissions **NTFS** (qui contrôle l'accès au niveau du système de fichiers). La permission la plus restrictive des deux l'emporte.

**Étape A : Configuration des permissions de Partage**

1. Dans la fenêtre des propriétés du dossier, allez dans l'onglet **"Partage"**.
2. Cliquez sur le bouton **"Partage avancé..."**.
3. Cochez la case **"Partager ce dossier"**.
4. Le nom du partage est par défaut Deploy. Conservez-le.
5. Cliquez sur le bouton **"Autorisations"**.
    
    ![image.png](image%2011.png)
    
6. Par défaut, le groupe Tout le monde a des permissions de Lecture. Nous allons le remplacer pour plus de sécurité.
7. Cliquez sur **Ajouter...**.
8. Dans la fenêtre qui s'ouvre, tapez **Ordinateurs du domaine**, puis cliquez sur **"Vérifier les noms"** et **OK**.
9. Sélectionnez le groupe Ordinateurs du domaine que vous venez d'ajouter et assurez-vous que seule la permission **"Lecture"** est cochée.
10. Tapez **Admins du domaine** et cliquez sur **"Vérifier les noms"** puis **OK**.
11. Sélectionnez le groupe Administrateurs du domaine et donnez-lui le **Contrôle total**. Cela permettra aux administrateurs de lire, écrire et modifier les fichiers du partage.
12. Sélectionnez le groupe Tout le monde et cliquez sur **Supprimer**.
13. Cliquez sur **OK**, puis de nouveau sur **OK**.

**Étape B : Configuration des permissions NTFS**

1. Revenez à la fenêtre des propriétés du dossier Deploy et allez dans l'onglet **"Sécurité"**.
2. Cliquez sur **Modifier...** puis sur **Ajouter...**.
3. Comme précédemment, ajoutez le groupe **Ordinateurs du domaine**.
4. Sélectionnez le groupe Ordinateurs du domaine et assurez-vous que les permissions suivantes sont bien cochées :
    - **Lecture et exécution**
    - **Affichage du contenu du dossier**
    - **Lecture**
        
        ![image.png](image%2012.png)
        
5. Ajoutez ensuite le groupe **Admins du domaine**.
6. Sélectionnez Administrateurs du domaine et assurez-vous qu'il a le **Contrôle total**.
7. Cliquez sur **OK**, puis sur **Fermer**.

Notre point de distribution est maintenant prêt et sécurisé. Son chemin réseau (chemin UNC) est **\\SRV-AD\Deploy**. C'est ce chemin que nous utiliserons dans la GPO pour indiquer aux clients où trouver les paquets d'installation.

## 4.3. Préparation des paquets MSI

Maintenant que notre point de distribution est prêt, nous devons y placer les paquets d'installation que nous souhaitons déployer. Pour cet exemple, nous allons utiliser l'archiveur de fichiers **7-Zip**, qui est disponible au format .msi.

### 4.3.1. Téléchargement du paquet MSI (Exemple : 7-Zip)

1. Depuis le serveur SRV-AD (ou un poste ayant accès à Internet), ouvrez un navigateur web.
2. Rendez-vous sur le site officiel de 7-Zip : [https://www.7-zip.org/download.html](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.7-zip.org%2Fdownload.html).
3. Téléchargez la version **MSI** pour Windows 64-bit (x64).
    
    ![image.png](3622cbf4-a0b5-4e54-8de1-80917f30728d.png)
    
4. Enregistrez le fichier (par exemple, 7z2409-x64.msi) dans le dossier Téléchargements de votre serveur.

### 4.3.2. Dépôt du paquet dans le partage Deploy

1. Ouvrez l'**Explorateur de fichiers** sur SRV-AD.
2. Naviguez jusqu'à votre dossier Téléchargements et localisez le fichier .msi de 7-Zip.
3. Copiez ou coupez ce fichier.
4. Naviguez maintenant vers le dossier de notre point de distribution, C:\Deploy.
5. Collez le fichier .msi dans ce dossier.
    
    ![image.png](image%2013.png)
    

Le paquet d'installation est maintenant en place et accessible via le chemin réseau \\SRV-AD\Deploy\7z2405-x64.msi. Il est prêt à être référencé dans notre stratégie de groupe.

> Astuce :
> 
> 
> Pour une meilleure organisation, il est recommandé de créer des sous-dossiers dans C:\Deploy pour chaque application, en y incluant éventuellement la version dans le nom du dossier (ex: C:\Deploy\7-Zip\24.05\). Cela facilite la gestion et les mises à jour futures.
> 

## 4.4. Création de la GPO de déploiement logiciel

La dernière étape consiste à créer un objet de stratégie de groupe (GPO) qui donnera l'ordre aux ordinateurs d'installer le paquet MSI que nous avons préparé.

### 4.4.1. Création de l'objet GPO PARCUS-SOFT-Standard

1. Sur SRV-AD, ouvrez la console **Gestion de stratégie de groupe**.
2. Naviguez jusqu'à l'Unité d'Organisation (OU) où se trouvent les ordinateurs cibles. Dans notre cas, il s'agit de parcus.local > PARCUS_Siege > **Postes_Travail**.
3. Faites un clic droit sur l'OU Postes_Travail et choisissez **"Créer un objet GPO dans ce domaine, et le lier ici..."**.
    
    > À retenir :
    > 
    > 
    > Nous lions la GPO à l'OU des postes de travail et non à la racine du domaine, car nous ne voulons pas que ce logiciel s'installe sur nos serveurs. C'est l'un des principaux avantages de l'utilisation des OU.
    > 
4. Dans la fenêtre qui s'ouvre, nommez la GPO de manière explicite : **PARCUS-SOFT-Standard**.
5. Cliquez sur **OK**.

### 4.4.2. Configuration du déploiement (attribué aux ordinateurs)

Nous allons maintenant éditer cette GPO pour y ajouter notre paquet logiciel.

1. Faites un clic droit sur la nouvelle GPO **PARCUS-SOFT-Standard** et choisissez **Modifier...**.
2. L'Éditeur de gestion de stratégie de groupe s'ouvre. Le déploiement de logiciels se fait au niveau des **ordinateurs**, pour que l'installation ait lieu au démarrage du poste, avant même que l'utilisateur n'ouvre sa session.
3. Naviguez dans l'arborescence suivante :
    
    Configuration ordinateur > Stratégies > Paramètres du logiciel > **Installation de logiciel**.
    
    ![image.png](image%2014.png)
    
4. Faites un clic droit dans le volet droit et choisissez **Nouveau > Paquet...**.
5. Une fenêtre de sélection de fichier s'ouvre. **Il est crucial de ne pas utiliser le chemin local (C:\Deploy\...)**. Vous devez utiliser le chemin réseau (UNC) pour que les clients puissent y accéder.
6. Dans la barre de nom de fichier, tapez le chemin UNC complet de notre partage : **\\SRV-AD\Deploy** et appuyez sur Entrée.
7. Sélectionnez le fichier 7z2405-x64.msi et cliquez sur **Ouvrir**.
8. La fenêtre **"Déployer le logiciel"** s'affiche. Laissez la méthode de déploiement sur **"Attribué"**. Cela signifie que le logiciel sera installé obligatoirement.
9. Cliquez sur **OK**.
    
    Le paquet 7-Zip apparaît maintenant dans la liste des logiciels à déployer.
    
    ![image.png](image%2015.png)
    
10. Fermez l'Éditeur de gestion de stratégie de groupe.

Le déploiement est maintenant entièrement configuré. Au prochain redémarrage, tout ordinateur se trouvant dans l'OU Postes_Travail (comme notre CLIENT-01) contactera le contrôleur de domaine, lira cette GPO, trouvera le chemin du paquet .msi et installera 7-Zip automatiquement et silencieusement.

Pour tester, il suffit de redémarrer le CLIENT-01. Après le redémarrage et l'ouverture de session, vous devriez trouver 7-Zip dans le menu Démarrer.

# **5. Déploiement d'Images avec WDS et Stratégies DHCP**

Le déploiement d'images système via le réseau est une compétence fondamentale pour industrialiser la préparation des postes de travail. Dans cette section, nous mettrons en œuvre les Services de déploiement Windows (WDS).

Cependant, il est crucial de noter que **Microsoft ne supporte plus officiellement le déploiement de Windows 11 via WDS seul**. Cette technologie est considérée comme dépréciée et présente des bugs connus, notamment dans la génération des fichiers de démarrage UEFI. Pour réussir ce déploiement, nous mettrons en œuvre une série de **contournements documentés**, notamment l'utilisation d'une image de démarrage (boot.wim) d'une version plus ancienne de Windows (comme Windows 10 v1709) qui est, elle, pleinement compatible avec les mécanismes de WDS.

Cette démarche, bien que complexe, reflète une réalité du terrain où les administrateurs doivent souvent adapter et combiner des technologies pour répondre à un besoin.

## **5.1. Contexte et Architecture de la Solution de Déploiement**

Pour garantir la stabilité et éviter les conflits, notre architecture WDS reposera sur un serveur dédié (SRV-WDS), tandis que le serveur DHCP restera sur le contrôleur de domaine (SRV-AD). Cette séparation des rôles est une bonne pratique qui simplifie grandement le dépannage.

SRV-AD agira comme le chef d'orchestre, en utilisant des stratégies DHCP pour diriger les clients PXE vers SRV-WDS avec les bons paramètres de démarrage en fonction de leur architecture (BIOS ou UEFI).

## **5.2. Création et Préparation du Serveur Dédié SRV-WDS**

1. **Création de la VM (SRV-WDS) dans Proxmox :**
    - Créez une nouvelle VM Windows Server 2022 nommée SRV-WDS avec les spécifications suivantes : 2 vCPU, 2 Go de RAM, 120 Go de disque (SCSI), et un firmware **OVMF (UEFI)**. La carte réseau doit être sur le bridge du LAN (vmbr1).
2. **Installation et Configuration de base :**
    - Installez Windows Server 2022 (avec Expérience de bureau).
    - Nommez l'ordinateur SRV-WDS et redémarrez.
    - Configurez son adresse IP statique :
        - Adresse IP : 192.168.100.12
        - Masque : 255.255.255.0
        - Passerelle : 192.168.100.10
        - Serveur DNS : 192.168.100.10
3. **Intégration au domaine :**
    - Joignez le serveur SRV-WDS au domaine parcus.local.
    - Après redémarrage, sur SRV-AD, déplacez l'objet ordinateur SRV-WDS dans l'OU PARCUS_Siege\Serveurs.

## 5.3. Installation du rôle WDS sur SRV-WDS

Nous allons installer le rôle WDS sur notre serveur SRV-WDS.

1. Sur le tableau de bord du **Gestionnaire de serveur** de SRV-WDS, cliquez sur “**Gérer”** puis sur **"Ajouter des rôles et des fonctionnalités"**.
2. Passez les premières étapes de l'assistant jusqu'à la page **"Rôles de serveurs"**.
3. Dans la liste des rôles, cochez la case **"Windows Deployment Services"**.
    
    ![image.png](image%2016.png)
    
4. Une fenêtre contextuelle s'ouvre pour ajouter les fonctionnalités requises. Cliquez sur **"Ajouter des fonctionnalités"**.
5. Cliquez sur **Suivant**.
6. Sur la page **"Fonctionnalités"**, n'ajoutez rien et cliquez sur **Suivant**.
7. Une page d'information sur WDS s'affiche. Lisez-la et cliquez sur **Suivant**.
8. **Services de rôle :** Laissez les deux options par défaut cochées :
    - **Serveur de déploiement :** Fournit les fonctions de base de WDS.
    - **Serveur de transport :** Fournit les composants réseau sous-jacents, y compris le démarrage PXE.
        
        ![image.png](image%2017.png)
        
9. Cliquez sur **Suivant**.
10. Sur la page de **Confirmation**, cochez la case “**Redémarrer automatiquement le serveur de destination, si nécessaire”** puis cliquez sur **Installer**.

L'installation des binaires du rôle WDS commence. Une fois terminée, cliquez sur **Fermer**.

Le rôle est maintenant installé, mais il n'est pas encore configuré. Une icône de notification apparaîtra dans le Gestionnaire de serveur pour nous indiquer que des actions de configuration sont nécessaires. Nous aborderons cette configuration dans la section suivante.

## 5.4. Configuration initiale du serveur WDS

Une fois le rôle WDS installé, il doit être configuré pour définir son mode de fonctionnement et l'emplacement de stockage de ses fichiers (images, pilotes, etc.).

1. Sur SRV-AD, ouvrez le **Gestionnaire de serveur**, puis naviguez vers **Outils > Services de déploiement Windows**.
2. La console WDS s'ouvre. Dans le volet de gauche, développez la section **"Serveurs"**. Vous verrez votre serveur SRV-WDS.parcus.local avec une icône d'avertissement jaune, indiquant qu'il n'est pas configuré.
3. Faites un clic droit sur le nom du serveur et choisissez **"Configurer le serveur"**.
    
    ![image.png](image%2018.png)
    
4. L'assistant de configuration WDS se lance. Sur la page **"Avant de commencer"**, vérifiez que les prérequis (AD, DHCP, DNS, partition NTFS) sont remplis. Cliquez sur **Suivant**.
5. **Type d'installation :** Choisissez **"Intégré à Active Directory"**. C'est l'option standard et recommandée lorsque WDS est installé sur un contrôleur de domaine. Cliquez sur **Suivant**.
6. **Emplacement du dossier distant :** WDS a besoin d'un dossier pour stocker ses images. 
7. Utilisez le chemin C:\RemoteInstall par défaut.
    
    > Bonne pratique :
    > 
    > 
    > L'utilisation d'un disque dédié (E:) pour le dossier RemoteInstall isole les données de déploiement du système d'exploitation. Cela prévient la saturation du disque système et facilite les opérations de sauvegarde et de restauration du service WDS.
    > 

![image.png](image%2019.png)

1. Cliquez sur **Suivant**. Si le dossier n'existe pas, un avertissement vous proposera de le créer. Acceptez.
2. **Réponse PXE :** Cette page définit comment le serveur WDS doit répondre aux clients qui démarrent sur le réseau.
    - Sélectionnez **"Répondre à tous les ordinateurs clients (connus et inconnus)"**. Pour une première configuration, c'est le plus simple.
    - **Important :** Cochez la case **"Exiger l'approbation de l'administrateur pour les ordinateurs inconnus"**. C'est une mesure de sécurité essentielle qui empêche n'importe quelle machine de démarrer une installation sans votre accord. Vous devrez approuver manuellement chaque nouveau poste dans la console WDS.
        
        ![image.png](image%2020.png)
        
3. Cliquez sur **Suivant**.

Le serveur commence sa configuration. Une fois l'opération terminée, une page de résumé s'affiche cliquez sur **Terminer**.

Le service WDS est maintenant configuré et démarré. L'icône du serveur dans la console doit maintenant être verte, indiquant qu'il est prêt à accepter des images et à répondre aux clients PXE.
Si ce n’est pas le cas, faite un clic-droit sur **SRV-WDS.parcus.local > Toutes les tâches > Démarrer**.

## **5.5. Configuration Avancée du DHCP sur SRV-AD**

C'est l'étape la plus technique. Nous allons configurer le serveur DHCP pour qu'il reconnaisse les différents types de clients PXE et leur envoie des options personnalisées.

Cette étape est cruciale pour permettre au DHCP de gérer intelligemment les clients BIOS et UEFI.

- Sur SRV-AD, ouvrez PowerShell ISE puis faite CTRL + R pour ouvrir le volet de script et copiez-coller ceci :
    
    ```powershell
    # Nom d'hôte du serveur DHCP
    $DhcpServerName = "SRV-AD"
    # Adresse IP du serveur WDS (PXE)
    $PxeServerIp = "192.168.100.12"
    # Adresse réseau de l'étendue DHCP ciblée
    $Scope = "192.168.100.0"
    
    Add-DhcpServerv4Class -ComputerName $DhcpServerName -Name "PXEClient - UEFI x64" -Type Vendor -Data "PXEClient:Arch:00007" -Description "PXEClient:Arch:00007"
    Add-DhcpServerv4Class -ComputerName $DhcpServerName -Name "PXEClient - UEFI x86" -Type Vendor -Data "PXEClient:Arch:00006" -Description "PXEClient:Arch:00006"
    Add-DhcpServerv4Class -ComputerName $DhcpServerName -Name "PXEClient - BIOS x86 et x64" -Type Vendor -Data "PXEClient:Arch:00000" -Description "PXEClient:Arch:00000"
    ```
    
- Séléctionnez les puis charger le script en faisant F8 ou le bouton :
    
    ![image.png](image%2021.png)
    
- à la suite ajouter ce qui se trouve ci-dessous puis charger-le :
    
    ```powershell
    $PolicyNameBIOS = "PXEClient - BIOS x86 et x64"
    Add-DhcpServerv4Policy -Computername $DhcpServerName -ScopeId $Scope -Name $PolicyNameBIOS -Description "Options DHCP pour boot BIOS x86 et x64" -Condition Or -VendorClass EQ, "PXEClient - BIOS x86 et x64*"
    Set-DhcpServerv4OptionValue -ComputerName $DhcpServerName -ScopeId $Scope -OptionId 066 -Value $PxeServerIp -PolicyName $PolicyNameBIOS
    Set-DhcpServerv4OptionValue -ComputerName $DhcpServerName -ScopeId $Scope -OptionId 067 -Value boot\x64\wdsnbp.com -PolicyName $PolicyNameBIOS
    ```
    
- à la suite ajouter ce qui se trouve ci-dessous puis charger-le :
    
    ```powershell
    $PolicyNameUEFIx86 = "PXEClient - UEFI x86"
    Add-DhcpServerv4Policy -Computername $DhcpServerName -ScopeId $Scope -Name $PolicyNameUEFIx86 -Description "Options DHCP pour boot UEFI x86" -Condition Or -VendorClass EQ, "PXEClient - UEFI x86*"
    Set-DhcpServerv4OptionValue -ComputerName $DhcpServerName -ScopeId $Scope -OptionId 060 -Value PXEClient -PolicyName $PolicyNameUEFIx86
    Set-DhcpServerv4OptionValue -ComputerName $DhcpServerName -ScopeId $Scope -OptionId 066 -Value $PxeServerIp -PolicyName $PolicyNameUEFIx86
    Set-DhcpServerv4OptionValue -ComputerName $DhcpServerName -ScopeId $Scope -OptionId 067 -Value boot\x86\wdsmgfw.efi -PolicyName $PolicyNameUEFIx86
    ```
    
- à la suite ajouter ce qui se trouve ci-dessous puis charger-le :
    
    ```powershell
    $PolicyNameUEFIx64 = "PXEClient - UEFI x64"
    Add-DhcpServerv4Policy -Computername $DhcpServerName -ScopeId $Scope -Name $PolicyNameUEFIx64 -Description "Options DHCP pour boot UEFI x64" -Condition Or -VendorClass EQ, "PXEClient - UEFI x64*"
    Set-DhcpServerv4OptionValue -ComputerName $DhcpServerName -ScopeId $Scope -OptionId 060 -Value PXEClient -PolicyName $PolicyNameUEFIx64
    Set-DhcpServerv4OptionValue -ComputerName $DhcpServerName -ScopeId $Scope -OptionId 066 -Value $PxeServerIp -PolicyName $PolicyNameUEFIx64
    Set-DhcpServerv4OptionValue -ComputerName $DhcpServerName -ScopeId $Scope -OptionId 067 -Value boot\x64\wdsmgfw.efi -PolicyName $PolicyNameUEFIx64
    ```
    

### 5.5.1 Vérification

![image.png](image%2022.png)

![image.png](image%2023.png)

![image.png](image%2024.png)

## 5.6. Ajout des images de démarrage et d'installation

Un serveur WDS a besoin de deux types d'images pour fonctionner :

- **Image de démarrage (boot.wim) :** C'est un mini-système d'exploitation (Windows PE) qui est chargé sur le client via le réseau. Il contient l'environnement nécessaire pour lancer l'installation et communiquer avec le serveur WDS.
- **Image d'installation (install.wim) :** C'est l'image complète du système d'exploitation Windows qui sera installée sur le disque dur du client.

Ces deux fichiers se trouvent dans l'ISO d'installation de Windows.

L'un des principaux défis du déploiement de Windows 11 via WDS est une incompatibilité connue entre l'environnement de démarrage (Windows PE) de Windows 11 et le service WDS. Pour contourner ce problème, nous allons utiliser une approche hybride : une image de démarrage stable et compatible de **Windows 10** pour démarrer le client, qui déploiera ensuite une image d'installation de **Windows 11**.

### **5.6.1. Préparation des Fichiers Images (.wim)**

1. **Création du dossier de travail :** Sur le serveur SRV-WDS, ouvrez l'explorateur de fichiers et créez un dossier C:\WDS_Staging. C'est ici que nous allons centraliser tous nos fichiers sources.
2. **Extraction de l'image d'installation de Windows 11 :**
    - Montez votre ISO de **Windows 11 Professionnel**.
    - Naviguez dans le dossier sources de l'ISO.
    - Copiez le fichier **install.wim** et collez-le dans votre dossier C:\WDS_Staging.
3. **Extraction de l'image de démarrage de Windows 10 (Contournement n°1) :**
    - Téléchargez une image ISO de **Windows 10, version 1709 (x64)** ou une version ultérieure. La version 1709 est connue pour sa grande stabilité avec WDS.
    - Montez cette ISO de Windows 10.
    - Naviguez dans son dossier sources.
    - Copiez le fichier **boot.wim** et collez-le également dans C:\WDS_Staging.
    
    ![image.png](image%2025.png)
    

### 5.6.2. Ajout de l'image de démarrage

1. Ouvrez la console des **Services de déploiement Windows**.
2. Développez votre serveur (SRV-WDS.parcus.local).
3. Faites un clic droit sur le dossier **"Images de démarrage"** et choisissez **"Ajouter une image de démarrage..."**.
    
    ![image.png](image%2026.png)
    
4. L'assistant s'ouvre. Cliquez sur **Parcourir...** et naviguez jusqu'à votre dossier **Staging** sur le bureau.
5. Sélectionnez le fichier **boot.wim** et cliquez sur **Ouvrir**, puis sur **Suivant**.
6. **Métadonnées de l'image :** Laissez les noms par défaut proposés par l'assistant et cliquez sur **Suivant**.
7. **Résumé :** Vérifiez les informations et cliquez sur **Suivant**.
8. L'assistant ajoute l'image au serveur. Une fois l'opération terminée, cliquez sur **Terminer**.

### 5.6.3. Ajout de l'image d'installation

1. Dans la console WDS, faites un clic droit sur le dossier **"Images d'installation"** et choisissez **"Ajouter une image d'installation..."**.
2. **Groupe d'images :** Nous allons créer un nouveau groupe pour organiser nos images. Laissez l'option **"Créer un nouveau groupe d'images"** et nommez-le Windows_11_Pro. Cliquez sur **Suivant**.
3. **Fichier image :** Cliquez sur **Parcourir...** et sélectionnez cette fois le fichier **install.wim** dans votre dossier **Staging**. Cliquez sur **Ouvrir**, puis sur **Suivant**.
4. **Images disponibles :** Le fichier install.wim peut contenir plusieurs éditions de Windows. L'assistant les listera. Cochez uniquement les éditions que vous souhaitez rendre disponibles (par exemple, **Windows 11 Professionnel**). Cliquez sur **Suivant**.
    
    ![image.png](image%2027.png)
    
5. **Résumé :** Vérifiez les sélections et cliquez sur **Suivant**.
6. L'assistant ajoute et traite l'image. Cette opération peut être plus longue que pour l'image de démarrage.
7. Une fois l'opération terminée, cliquez sur **Terminer**.

Votre serveur WDS dispose maintenant des images de base nécessaires pour déployer un poste Windows 11 standard via le réseau.

## 5.7. Création d'une image de capture

Une **image de capture** est une version spéciale de l'image de démarrage. Son rôle n'est pas d'installer Windows, mais de démarrer un ordinateur qui a déjà été préparé (notre poste de référence) afin de "capturer" son état (système, logiciels, configurations) dans un nouveau fichier .wim.

Cette image capturée deviendra ensuite notre nouvelle image d'installation standardisée, nous permettant de déployer des postes pré-configurés pour PARCUS.

### 5.7.1. Création de l'image de capture depuis l'image de démarrage

Nous n'avons pas besoin d'un nouveau fichier. Nous allons simplement créer une copie de notre boot.wim existant et la configurer en mode "capture".

1. Ouvrez la console des **Services de déploiement Windows**.
2. Naviguez jusqu'au dossier **"Images de démarrage"**.
3. Faites un clic droit sur l'image de démarrage que vous avez ajoutée à l'étape précédente (généralement nommée "Microsoft Windows Setup (x64)").
4. Choisissez **"Créer une image de capture..."**.
    
    ![image.png](image%2028.png)
    
5. L'assistant s'ouvre.
    - **Nom et description de l'image :** Capture PARCUS Win11 v1.0.
    - **Emplacement et nom du fichier :** Cliquez sur **Parcourir...** et enregistrez le nouveau fichier .wim dans votre dossier de préparation sur le disque de données : C**:\Staging\capture_win11.wim**.
6. Cliquez sur **Suivant**. L'assistant crée la nouvelle image .wim.
7. Une fois l'opération terminée, l'assistant vous demandera si vous souhaitez ajouter l'image au serveur de déploiement. Cochez la case **"Ajouter une image au serveur de déploiement Windows"**.
8. Cliquez sur **Terminer**.

### 5.7.2. Ajout de l'image de capture au serveur WDS

L'assistant d'ajout d'image de démarrage se lance automatiquement.

1. **Emplacement du fichier :** Le chemin vers votre capture_win11.wim est déjà pré-rempli. Cliquez sur **Suivant**.
2. **Métadonnées de l'image :** Le nom que vous avez choisi (Capture PARCUS Win11 v1.0) est déjà là. Cliquez sur **Suivant**.
3. **Résumé :** Vérifiez les informations et cliquez sur **Suivant**.
4. Une fois l'ajout terminé, cliquez sur **Terminer**.

Votre dossier "Images de démarrage" dans la console WDS contient maintenant deux images :

- L'image d'installation standard (Microsoft Windows Setup).
- Notre nouvelle image de capture (Capture PARCUS Win11 v1.0).
    
    ![image.png](image%2029.png)
    

Cette image de capture est maintenant prête à être utilisée. Lorsque nous démarrerons un client en PXE, nous aurons le choix entre démarrer sur l'installeur classique ou sur l'environnement de capture.

Pour pxe, je ne sais pas pourquoi mais proxmox ne détecte ni les disque, ni les carte réseaux, c’est pourquoi j’ai du passé network device de virtio à intel e1000 et j’ai du ajouter virtio rng.

### **5.7.3. Test et Vérification du Démarrage PXE**

Avant de préparer notre poste de référence, il est primordial de valider que l'environnement de démarrage réseau (PXE) fonctionne correctement. Cette étape de vérification nous assurera que les clients peuvent bien contacter le serveur WDS et charger le menu de démarrage.

**Pré-requis : Configuration de la VM Cliente pour la compatibilité PXE**

Lors des tests, il a été observé que l'environnement de démarrage Windows PE par défaut (même celui de Windows 10) ne contient pas les pilotes paravirtualisés **VirtIO** de Proxmox. Cela se traduit par un échec du démarrage ou par l'impossibilité pour l'assistant d'installation de voir le disque dur ou la carte réseau.

Pour assurer un fonctionnement fiable, chaque VM cliente destinée au déploiement WDS doit être configurée comme suit :

1. **Configuration du Matériel :**
    - Sur Proxmox, sélectionnez votre VM cliente.
    - Allez dans la section **"Matériel"**.
    - **Carte Réseau :** Double-cliquez sur Network Device (net0). Changez le **Modèle** de VirtIO (paravirtualisé) à **Intel E1000**. Le pilote pour ce modèle est inclus nativement dans Windows PE, garantissant la connectivité réseau dès le démarrage.
    - **Disque Dur :** Assurez-vous que le contrôleur est en SCSI et le type SCSI.
2. **Configuration du Firmware (UEFI, Secure Boot, TPM) :**
    - Toujours dans la section **"Matériel"**, double-cliquez sur la ligne **"BIOS (OVMF)"**.
    - **Machine :** Vérifiez que la machine est bien en **q35**
    - **Secure Boot :** **Désactivez** cette option en décochant la case **Pre-Enrolled Keys**. L'environnement de démarrage WDS n'est pas signé numériquement d'une manière compatible avec le Secure Boot. L'activer empêcherait le chargement du fichier de boot et provoquerait un retour immédiat au menu UEFI.
    - Cliquez sur **OK**.
        
        ![image.png](image%2030.png)
        

**Lancement du Test de Démarrage PXE**

1. Créez une nouvelle machine virtuelle vierge (CLIENT-TEST par exemple) avec les paramètres matériels compatibles décrits ci-dessus, et **sans attacher d'ISO**.
2. Démarrez cette VM. Pendant les premières secondes, l'écran affichera le logo Proxmox. Appuyez plusieurs fois sur la touche **Échap** pour entrer dans le menu de démarrage du firmware UEFI.
3. Le menu "Boot Manager" apparaît. Utilisez les flèches pour sélectionner l'option **UEFI PXEv4(...)** et appuyez sur **Entrée**.
    
    [Capture : Menu de démarrage UEFI de la VM avec l'option "UEFI PXEv4" sélectionnée.]
    
4. Le client va maintenant contacter le serveur DHCP, obtenir une IP, puis être redirigé vers le serveur WDS.
5. **Résultat attendu :** Après un court chargement ("Loading files..."), le menu de démarrage des Services de déploiement Windows doit s'afficher. Il doit vous proposer le choix entre les différentes images de démarrage que vous avez ajoutées au serveur.
    
    ![image.png](image%2031.png)
    

Si vous voyez bien cet écran avec vos deux options, cela signifie que :

- Votre serveur DHCP fonctionne et envoie les bonnes options.
- Votre serveur WDS est joignable et sert correctement les fichiers de démarrage.
- La compatibilité des pilotes entre le client et l'environnement de boot est assurée.

Vous pouvez maintenant éteindre cette VM de test et passer en toute confiance à l'étape suivante : la préparation de votre véritable poste de référence CLIENT-01.

## 5.8. Préparation et capture du poste de référence Windows 11

Le "poste de référence" (ou "master") est une installation propre et à jour de Windows 11, sur laquelle nous installons tous les logiciels et appliquons toutes les configurations standards de PARCUS. C'est le modèle que nous allons cloner pour tous les futurs déploiements.

### 5.8.1. Installation du poste de référence

1. Utilisez la machine virtuelle CLIENT-01 que nous avons créée précédemment. Si elle a déjà un système, il est préférable de la réinstaller proprement pour partir d'une base saine.
2. Assurez-vous qu'elle n'est **PAS** jointe au domaine parcus.local. Le poste de référence doit être configuré en groupe de travail (WORKGROUP). La jonction au domaine se fera après le déploiement de l'image.
3. Procédez à une installation standard de Windows 11 Pro. Pour cela : 
4. Sur proxmox les drivers disque ne sont pas installé, ils vous faut donc charger un cd/dvd avec l’iso des pilotes/drivers virtio. 
5. Une fois sur la fenêtre du choix de l’emplacement d’installation de windows 11, cliquez sur “Load Driver” > Parcourir > Virtio > amd64 > w11. Puis faites OK.
6. Séléctionnez Red Hat VirtIO… puis Installer.

### 5.8.2. Mises à jour, installation de logiciels de base et configuration

Une fois Windows 11 installé, nous entrons en **mode Audit**. Ce mode spécial permet de faire des modifications qui seront appliquées à tous les futurs utilisateurs du poste.

1. Sur l'écran de bienvenue de Windows (OOBE), n'allez pas plus loin. Appuyez sur **Ctrl + Maj + F3**.
2. Le système va redémarrer et se connecter automatiquement avec le compte administrateur intégré, en mode Audit. La fenêtre de l'outil de préparation système (**Sysprep**) apparaît. Ne la fermez pas tout de suite, mais déplacez-la.
    
    ![image.png](image%2032.png)
    
3. **Effectuez toutes les personnalisations nécessaires :**
    - **Installez les mises à jour Windows :** Allez dans Paramètres > Windows Update et installez toutes les mises à jour disponibles.
    - **Installez les logiciels de base :** Installez manuellement les applications qui doivent être présentes sur tous les postes (ex: une suite bureautique, un lecteur PDF, etc.). N'installez pas les logiciels qui seront déployés par GPO.
    - **Configurez le profil par défaut :** Personnalisez le menu Démarrer, l'arrière-plan du bureau, les options de l'explorateur, etc. Ces réglages seront appliqués à chaque nouvel utilisateur qui ouvrira une session sur le poste.
    - **Nettoyez le système :** Videz la corbeille, supprimez les fichiers temporaires.

### 5.8.3. Démarrage PXE et capture de l'image

Une fois le poste de référence prêt, nous allons le "généraliser" avec Sysprep et le capturer avec WDS.

1. Reprenez la fenêtre **Sysprep** qui était restée ouverte.
2. Configurez les options suivantes :
    - **Action de nettoyage système :** Choisissez **Entrer en mode OOBE (Out-of-Box Experience)**.
    - Cochez la case **Généraliser**. C'est l'étape la plus importante, elle supprime les identifiants uniques du poste pour qu'il puisse être cloné.
    - **Options d'arrêt :** Choisissez **Arrêter**.
        
        ![image.png](image%2033.png)
        
3. Cliquez sur **OK**. Sysprep prépare l'image et le poste s'éteindra. **Ne le redémarrez pas !**
4. Démarrez la VM CLIENT-01. Elle va démarrer sur le réseau et contacter le serveur WDS.
5. Le menu de démarrage WDS apparaît. Utilisez les flèches pour sélectionner notre image de capture : **Capture PARCUS Win11 v1.0**. Appuyez sur **Entrée**.
    
    ![image.png](image%2034.png)
    
6. L'assistant de capture d'image se lance. Cliquez sur **Suivant**.
7. **Volume à capturer :** Sélectionnez la partition contenant Windows (généralement C:).
8. **Nom et description de l'image :** Donnez un nom à votre nouvelle image, par exemple Windows 11 PARCUS v1.0.

![image.png](image%2035.png)

1. **Emplacement de stockage :** Cochez la case **"Charger l'image sur un serveur WDS"**.
    - **Nom du serveur :** SRV-AD.parcus.local
    - Dans la liste déroulante **"Nom du groupe d'images"**, choisissez le groupe Windows_11_Pro que nous avons créé.
2. Cliquez sur **Suivant**. La capture commence. L'état du poste est copié via le réseau et stocké sur le serveur WDS.
3. Une fois l'opération terminée, cliquez sur **Terminer**.

Vous disposez maintenant d'une image d'installation personnalisée et prête à être déployée, disponible dans le groupe d'images Windows_11_Pro de votre serveur WDS.

## 5.9. Déploiement de l'image capturée sur un nouveau poste

Maintenant que nous avons une image personnalisée et capturée, le but final est de la déployer sur de nouvelles machines virtuelles (ou physiques) "nues". Ce processus simule l'arrivée d'un nouvel ordinateur dans l'entreprise, qui doit être préparé pour un collaborateur.

1. **Création d'une nouvelle VM cliente :**
    - Créez une nouvelle machine virtuelle dans Proxmox (par exemple, CLIENT-02).
    - Utilisez exactement les mêmes paramètres que pour CLIENT-01 (UEFI, 2 cœurs, 4Go RAM, disque de 64Go, réseau sur vmbr1).
    - **Ne montez aucune image ISO**. Le lecteur de CD/DVD doit être vide.
2. **Configuration du démarrage PXE :**
    - Dans les options de la VM CLIENT-02, assurez-vous que le **démarrage réseau (PXE)** est en première position dans l'ordre de démarrage.
3. **Approbation du client dans WDS :**
    - Démarrez la VM CLIENT-02. Elle va tenter de démarrer sur le réseau.
    - Le démarrage va se mettre en pause. Dans la console WDS sur SRV-AD, naviguez jusqu'au dossier **"Périphériques en attente"**. Vous devriez voir une nouvelle entrée correspondant à votre CLIENT-02.
    - Faites un clic droit sur ce périphérique en attente et choisissez **"Approuver"**.
        
        [Capture : Console WDS, dossier "Périphériques en attente" avec un client à approuver.]
        
4. **Démarrage de l'installation réseau :**
    - Sur CLIENT-02, le démarrage va maintenant se poursuivre. Appuyez sur **F12** lorsque le message "Press F12 for network service boot" apparaît.
    - Le menu de démarrage WDS se charge. Cette fois, sélectionnez l'image de démarrage standard (Microsoft Windows Setup (x64)) et non l'image de capture. Appuyez sur **Entrée**.
5. **Assistant d'installation WDS :**
    - L'assistant d'installation Windows se lance. Choisissez la langue et le clavier, puis cliquez sur **Suivant**.
    - Sur l'écran suivant, vous devrez vous authentifier avec un compte ayant les droits sur le domaine. Utilisez le compte **PARCUS\Administrateur** et son mot de passe.
    - La liste des images d'installation disponibles apparaît. Vous devriez voir :
        - L'image Windows 11 Professionnel de base.
        - Notre nouvelle image capturée : **Windows 11 PARCUS v1.0**.
    - Sélectionnez notre image personnalisée **Windows 11 PARCUS v1.0** et cliquez sur **Suivant**.
        
        [Capture : Écran de sélection de l'image à déployer, montrant l'image personnalisée.]
        
6. **Partitionnement et installation :**
    - Sur l'écran de partitionnement, sélectionnez l'espace non alloué du disque dur et cliquez sur **Suivant**.
    - WDS va maintenant copier et installer l'image personnalisée sur le disque dur du client.
7. **Finalisation (OOBE) :**
    - Une fois l'installation des fichiers terminée, la machine redémarrera.
    - Elle démarrera sur l'écran de bienvenue de Windows (OOBE), comme une machine neuve. Vous pouvez alors créer un compte local pour l'utilisateur final.
    - Plus important encore, une fois la session ouverte, vous pouvez joindre cet ordinateur au domaine parcus.local. Il héritera alors automatiquement des GPO que nous avons configurées (sécurité, déploiement logiciel, etc.).

Le cycle est complet. Nous avons créé, personnalisé, capturé et redéployé une image système standardisée, prête à l'emploi pour les collaborateurs de PARCUS.

## 5.10. ⚠️ Attention : Bilan du Déploiement WDS et Justification des Contournements

La mise en œuvre du déploiement de **Windows 11** via les **Services de déploiement Windows (WDS)** sur **Windows Server 2022** a mis en évidence une série de **problèmes de compatibilité et de bugs logiciels documentés** qui ont nécessité l'application de plusieurs contournements techniques pour parvenir à une solution fonctionnelle.

Il est essentiel de comprendre que ces difficultés ne proviennent pas d'une erreur de configuration de l'infrastructure (DHCP, DNS, réseau), mais de **limitations inhérentes à la technologie WDS elle-même**, qui est aujourd'hui considérée comme dépréciée par Microsoft au profit de solutions plus modernes comme Microsoft Endpoint Configuration Manager (MECM) ou MDT.

**Synthèse des problèmes critiques rencontrés et des solutions appliquées :**

1. **Échec de la Création des Fichiers de Démarrage UEFI :**
    - **Problème :** Le service WDS n'a pas réussi à générer le chargeur de démarrage essentiel wdsmgfw.efi, rendant tout démarrage PXE en mode UEFI impossible.
    - **Contournement :** Utilisation d'une image de démarrage boot.wim d'une version antérieure de Windows (Windows 10) et copie manuelle du fichier wdsmgfw.efi manquant depuis les fichiers système du serveur.
2. **Absence de Détection des Périphériques Virtuels :**
    - **Problème :** L'environnement de démarrage Windows PE (WinPE) ne contenait pas les pilotes paravirtualisés **VirtIO** de l'hyperviseur Proxmox, rendant le disque dur et la carte réseau invisibles lors du processus de capture.
    - **Contournement :** Modification de la configuration matérielle des machines virtuelles clientes pour utiliser des périphériques émulés plus standards (**Disque SATA**, **Carte réseau Intel E1000**), dont les pilotes sont plus couramment inclus dans WinPE.
3. **Conflit entre Sysprep et le Pré-provisionnement BitLocker :**
    - **Problème :** L'outil de généralisation d'image Sysprep a échoué, car il détectait le disque comme étant "en attente d'activation BitLocker", une fonctionnalité par défaut sur les installations de Windows 11.
    - **Contournement :** Désactivation complète et forcée de toutes les métadonnées BitLocker sur le disque de référence via la commande manage-bde -off C: avant l'exécution de Sysprep.
    
    **Conclusion Technique :**
    
    La réussite de ce déploiement n'a été possible qu'en combinant ces différentes solutions de contournement. Cela démontre que si le déploiement de Windows 11 avec WDS est techniquement réalisable, il n'est **ni fiable, ni recommandé en environnement de production** sans une expertise très pointue et une maintenance constante des images et des pilotes. Pour des déploiements futurs, il serait stratégiquement plus judicieux d'adopter des outils plus modernes comme **FOG Project** ou **MDT**, qui sont conçus pour gérer nativement ces complexités.
    

# 6. Mise en Place de la Gestion de Parc et de Tickets (SRV-GLPI)

Pour répondre aux besoins de cartographie du parc, d'inventaire automatisé et de gestion des demandes d'assistance, nous allons déployer la solution open-source **GLPI**, couplée à **OCS Inventory NG**.

- **GLPI** (Gestionnaire Libre de Parc Informatique) sera notre interface centrale de gestion (helpdesk, inventaire, licences, etc.).
- **OCS Inventory NG** est l'agent que nous déploierons sur les postes pour faire remonter automatiquement les informations matérielles et logicielles vers GLPI.

Ce service sera hébergé sur une machine virtuelle dédiée sous Debian 12.

## 6.1. Création de la machine virtuelle Debian 12

1. Dans l'interface Proxmox, cliquez sur **"Créer VM"**.
    
    **Onglet Général :**
    
2. **Nom :** SRV-GLPI.
3. Cliquez sur **Suivant**.
    
    **Onglet OS :**
    
4. Sélectionnez **"Utiliser une image CD/DVD (iso)"** et choisissez votre image ISO **Debian 12 (net-install)**.
5. **Type d'OS :** Linux.
6. **Version :** 6.x - 2.6 Kernel.
7. Cliquez sur **Suivant**.
    
    **Onglet Système :**
    
8. **Machine :** q35.
9. **BIOS :** Laissez **SeaBIOS** par défaut.
10. Cochez **"Agent QEMU"**.
11. Cliquez sur **Suivant**.
    
    **Onglet Disques :**
    
12. **Bus/Device :** SCSI.
13. **Taille du disque (Go) :** 60 Go. Cela laisse de la place pour le système, les applications et la base de données.
14. Cliquez sur **Suivant**.
    
    **Onglet CPU :**
    
15. **Cœurs :** 2.
16. Cliquez sur **Suivant**.
    
    **Onglet Mémoire :**
    
17. **Mémoire (Mo) :** 4096 Mo (4 Go). GLPI et sa base de données peuvent être gourmands en mémoire.
18. Cliquez sur **Suivant**.
    
    **Onglet Réseau :**
    
19. **Réseau :** **vmbr1** (notre LAN isolé).
20. **Modèle :** VirtIO (paravirtualisé).
21. Cliquez sur **Suivant**.
    
    **Onglet Confirmer :**
    
22. Vérifiez le résumé et cliquez sur **Terminer**.
23. Démarrez la VM SRV-GLPI et ouvrez la console pour commencer l'installation de Debian.
    - Choisissez **"Graphical install"**.
    - Suivez l'assistant d'installation (langue, clavier, etc.).
    - Lors de l'étape **"Configuration du réseau"**, l'assistant ne trouvera pas de serveur DHCP. C'est normal. Choisissez de **configurer le réseau manuellement** (voir section suivante).
    - Lors de l'étape de **sélection des logiciels**, décochez "Environnement de bureau Debian". Cochez uniquement :
        - **Serveur SSH**
        - **Utilitaires usuels du système**
    - Terminez l'installation et redémarrez la machine (en retirant l'ISO).

Notre machine virtuelle est maintenant prête pour la configuration post-installation.

## 6.2. Configuration post-installation (IP fixe, nommage)

Une fois Debian 12 installé, nous devons, comme pour le serveur Windows, lui assigner un nom d'hôte permanent et une adresse IP statique. Ces opérations se font en ligne de commande.

Connectez-vous à la console de la VM SRV-GLPI avec le compte root et le mot de passe que vous avez définis lors de l'installation.

Modification du nom d'hôte

1. Nous allons utiliser la commande hostnamectl pour définir le nom de la machine.
    
    `hostnamectl set-hostname srv-glpi.parcus.local`
    
2. Ensuite, nous devons mettre à jour le fichier /etc/hosts pour que le système puisse résoudre son propre nom en local. Ouvrez le fichier avec un éditeur de texte comme nano :
    
    `nano /etc/hosts`
    
3. Modifiez la ligne qui commence par 127.0.1.1 pour qu'elle ressemble à ceci :
    
    `127.0.1.1   srv-glpi.parcus.local   srv-glpi`
    
    ![image.png](image%2036.png)
    
4. Sauvegardez le fichier et quittez (Ctrl+O, Entrée, Ctrl+X).

Configuration de l'adresse IP fixe

Debian 12 utilise systemd-networkd ou NetworkManager pour gérer le réseau. La méthode la plus simple est d'éditer le fichier de configuration des interfaces.

1. Ouvrez le fichier de configuration principal du réseau :
    
    `nano /etc/network/interfaces`
    
2. Commentez ou supprimez les lignes relatives au DHCP (celles contenant dhcp).
3. Ajoutez le bloc suivant pour configurer l'IP statique. Remplacez ens18 par le nom réel de votre interface réseau (vous pouvez le trouver avec la commande ip a).
    
    ```bash
    # The primary network interface
    auto ens18
    iface ens18 inet static
        address 192.168.100.11
        netmask 255.255.255.0
        gateway 192.168.100.10
        dns-nameservers 192.168.100.10
    ```
    
    > À retenir :
    > 
    > - **address :** L'IP statique de notre serveur GLPI.
    > - **gateway :** L'adresse de notre contrôleur de domaine, qui agira comme passerelle interne.
    > - **dns-nameservers :** L'adresse de notre serveur DNS principal, le contrôleur de domaine.
    
    ![image.png](image%2037.png)
    
4. Sauvegardez et quittez (Ctrl+O, Entrée, Ctrl+X).
5. Redémarrez le service réseau pour appliquer les changements :
    
    `systemctl restart networking.service`
    
6. Vérifiez que la configuration est correcte avec la commande ip a. Vous devriez voir l'adresse 192.168.100.11 sur votre interface.
7. Testez la connectivité et la résolution DNS en envoyant un ping à votre contrôleur de domaine :
    
    `ping srv-ad.parcus.local`
    
    Vous devriez recevoir une réponse, confirmant que le réseau et le DNS sont fonctionnels.
    

Le serveur SRV-GLPI est maintenant correctement configuré sur le réseau et prêt pour l'installation de la pile logicielle.

## 6.3. Installation de la pile LAMP (Apache, MariaDB, PHP)

GLPI est une application web qui nécessite un environnement spécifique pour fonctionner. Nous allons installer une pile "LAMP", acronyme de :

- **L**inux : Notre système d'exploitation Debian 12.
- **A**pache : Le serveur web qui hébergera les fichiers de GLPI.
- **M**ariaDB : Le système de gestion de base de données (un fork de MySQL) qui stockera toutes les données de GLPI.
- **P**HP : Le langage de script dans lequel GLPI est écrit.

Nous allons installer tous ces composants et les modules PHP requis par GLPI en une seule série de commandes.

1. **Mettre à jour les dépôts de paquets :**
    
    Avant toute installation, il est essentiel de s'assurer que notre liste de paquets est à jour.
    
    ```bash
    apt update && apt upgrade -y
    ```
    
2. **Installer Apache et MariaDB :**
    
    ```bash
    apt install apache2 mariadb-server -y
    ```
    
3. **Installer PHP et les extensions nécessaires :**
    
    GLPI a besoin de plusieurs extensions PHP pour fonctionner correctement (gestion des bases de données, manipulation d'images, XML, etc.).
    
    ```bash
    apt install apache2 mariadb-server php php-cli php-common php-mysql php-ldap php-gd php-xml php-curl php-mbstring php-intl php-zip php-bz2 php-imap php-apcu php-xmlrpc libapache2-mod-php -y
    ```
    
4. **Vérifier le statut des services :**
    
    Une fois l'installation terminée, vérifions que les services Apache et MariaDB sont bien démarrés et activés pour se lancer au démarrage du système.
    
    `systemctl status apache2
     systemctl status mariadb`
    
    Les deux commandes devraient afficher un statut active (running).
    
    ![image.png](image%2038.png)
    
5. **Sécuriser l'installation de MariaDB :**
    
    Par défaut, l'installation de MariaDB n'est pas sécurisée. Nous allons lancer un script interactif pour définir un mot de passe root et supprimer les paramètres dangereux.
    
          `mysql_secure_installation`
    
    Suivez les instructions à l'écran :
    
    - *Enter current password for root (enter for none):* Appuyez sur **Entrée** (il n'y a pas encore de mot de passe).
    - *Switch to unix_socket authentication [Y/n]?* Tapez **n** et Entrée.
    - *Set root password? [Y/n]?* Tapez **Y** et Entrée.
    - *New password:* Saisissez un mot de passe **robuste** pour l'utilisateur root de MariaDB. Notez-le précieusement.
    - *Re-enter new password:* Confirmez le mot de passe.
    - *Remove anonymous users? [Y/n]?* Tapez **Y** et Entrée.
    - *Disallow root login remotely? [Y/n]?* Tapez **Y** et Entrée.
    - *Remove test database and access to it? [Y/n]?* Tapez **Y** et Entrée.
    - *Reload privilege tables now? [Y/n]?* Tapez **Y** et Entrée.

Notre environnement LAMP est maintenant installé et sécurisé. Le serveur web est actif et la base de données est prête à accueillir la base de données de GLPI que nous créerons à la prochaine étape.

## 6.4. Installation de GLPI

Maintenant que l'environnement LAMP est prêt, nous pouvons procéder à l'installation de l'application GLPI. Cela implique la création d'une base de données, le téléchargement des fichiers de l'application et l'exécution de l'assistant d'installation web.

### 6.4.1. Création de la base de données et de l'utilisateur

Nous devons créer une base de données dédiée à GLPI et un utilisateur spécifique qui aura les droits sur cette base.

1. Connectez-vous à MariaDB en tant qu'utilisateur root :
    
          `mysql -u root -p`
    
    Saisissez le mot de passe root de MariaDB que vous avez défini à l'étape précédente.
    
2. Une fois dans le shell MariaDB, exécutez les commandes suivantes pour créer la base de données et l'utilisateur. Remplacez mot_de_passe_glpi par un mot de passe fort et unique.Generated sql
    
    ```sql
    -- Création de la base de données pour GLPI
    CREATE DATABASE glpidb CHARACTER SET UTF8MB4 COLLATE utf8mb4_unicode_ci;
    
    -- Création de l'utilisateur 'glpiuser' et attribution d'un mot de passe
    CREATE USER 'glpiuser'@'localhost' IDENTIFIED BY 'mot_de_passe_glpi';
    
    -- Attribution de tous les privilèges sur la base 'glpidb' à l'utilisateur 'glpiuser'
    GRANT ALL PRIVILEGES ON glpidb.* TO 'glpiuser'@'localhost';
    
    -- Application des changements
    FLUSH PRIVILEGES;
    
    -- Quitter le shell MariaDB
    EXIT;
    ```
    
    > Astuce : Copiez ces commandes dans un fichier texte, remplacez le mot de passe, puis collez-les dans le terminal pour éviter les erreurs de saisie.
    > 

### 6.4.2. Téléchargement et décompression de l'archive GLPI

1. Naviguez dans le répertoire /tmp pour télécharger l'archive GLPI.
    
          `cd /tmp`
    
2. Utilisez wget pour télécharger la dernière version stable de GLPI (vérifiez le lien sur le site officiel si nécessaire).
    
          `wget https://github.com/glpi-project/glpi/releases/download/10.0.18/glpi-10.0.18.tgz`
    
    ![image.png](image%2039.png)
    
3. Décompressez l'archive téléchargée :
    
          `tar -xzf glpi-10.0.18.tgz`
    
4. Déplacez le dossier décompressé vers le répertoire racine du serveur web Apache, /var/www/html/, et renommez-le glpi pour un accès plus simple.
    
          `mv glpi /var/www/html/glpi`
    
5. Attribuez les bonnes permissions au dossier pour que le serveur web (utilisateur www-data) puisse lire et écrire dedans.
    
          `chown -R www-data:www-data /var/www/html/glpi`
    
    ![image.png](image%2040.png)
    

### 6.4.3. Assistant d'installation web de GLPI

1. Depuis un poste client qui a accès au réseau (CLIENT-01 par exemple), ouvrez un navigateur web.
2. Naviguez vers l'adresse de votre serveur GLPI suivie de /glpi : **http://192.168.100.11/glpi**
3. L'assistant d'installation de GLPI se lance. Choisissez votre langue et cliquez sur **OK**.
4. Acceptez les termes de la licence et cliquez sur **Continuer**.
5. Cliquez sur **Installer**. GLPI va vérifier que tous les prérequis PHP sont satisfaits. Si tout est vert, cliquez sur **Continuer**.
    
    ![image.png](image%2041.png)
    
6. **Configuration de la base de données :** Remplissez les champs avec les informations que nous avons créées précédemment.
    - **Serveur SQL :** localhost
    - **Utilisateur SQL :** glpiuser
    - **Mot de passe SQL :** Le mot de passe que vous avez défini (mot_de_passe_glpi).
    - Cliquez sur **Continuer**.
7. **Sélection de la base de données :** Choisissez la base de données glpidb dans la liste et cliquez sur **Continuer**.
8. L'assistant initialise la base de données. Cela peut prendre un moment.
9. La configuration est terminée. Cliquez sur **Continuer**.
10. La dernière page vous affiche les identifiants par défaut pour vous connecter à GLPI. Notez-les bien. Il y a plusieurs comptes avec différents niveaux de privilèges. (login / mot de passe)
    - **glpi / glpi** (administrateur)
    - **tech / tech** (technicien)
    - **normal / normal** (utilisateur normal)
    - **post-only / postonly** (utilisateur simple)
11. Cliquez sur **Utiliser GLPI**.

> Important :
> 
> 
> Par mesure de sécurité, la première chose à faire après vous être connecté est de **changer les mots de passe de ces quatre comptes par défaut**. GLPI vous le rappellera avec un avertissement de sécurité.
> 
> De plus, supprimez le fichier d'installation pour des raisons de sécurité :
> 
> `rm /var/www/html/glpi/install/install.php`
> 

### **6.5 Sécurisation Post-Installation de GLPI**

**Avertissement 1 : Configuration du dossier racine du serveur web**

- **Cause :** La configuration par défaut d'Apache pointe vers /var/www/html. Quand on accède à /glpi, on accède à la racine du projet GLPI, ce qui expose potentiellement des dossiers non publics. La bonne pratique avec GLPI 10 est de faire en sorte que la seule porte d'entrée web soit le dossier /var/www/html/glpi/public.
- **Solution :** Nous allons créer un fichier de configuration Virtual Host dédié à GLPI.
    1. **Connectez-vous en SSH à votre serveur SRV-GLPI**.
    2. **Désactivez le site par défaut d'Apache.** Il peut entrer en conflit avec notre nouvelle configuration.
        
        `sudo a2dissite 000-default.conf`
        
    3. **Créez un nouveau fichier de configuration pour GLPI** dans le répertoire des sites disponibles d'Apache :
        
        `sudo nano /etc/apache2/sites-available/glpi.conf`
        
    4. **Copiez et collez l'intégralité du contenu suivant** dans ce fichier. C'est la configuration recommandée :Generated apache
        
        ```bash
        <VirtualHost *:80>
            DocumentRoot /var/www/html/glpi/public
        
            <Directory /var/www/html/glpi/public>
                Require all granted
        
                RewriteEngine On
        
                # Ensure authorization headers are passed to PHP
                RewriteCond %{HTTP:Authorization} ^(.+)$
                RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
        
                # Redirect all requests to GLPI router, unless file exists
                RewriteCond %{REQUEST_FILENAME} !-f
                RewriteRule ^(.*)$ index.php [QSA,L]
            </Directory>
        
            # Log files
            ErrorLog ${APACHE_LOG_DIR}/glpi-error.log
            CustomLog ${APACHE_LOG_DIR}/glpi-access.log combined
        </VirtualHost>
        ```
        
    5. Sauvegardez le fichier et quittez (Ctrl+O, Entrée, Ctrl+X).
    6. **Activez le nouveau site GLPI et le module rewrite d'Apache** (nécessaire pour le bon fonctionnement des URL) :
        
        `sudo a2ensite glpi.conf
        sudo a2enmod rewrite`
        
    7. **Testez la nouvelle configuration Apache** pour vous assurer qu'il n'y a pas d'erreurs de syntaxe :
        
              `sudo apache2ctl configtest`
        
        Le résultat doit être Syntax OK.
        
    8. **Redémarrez Apache** pour appliquer tous les changements :
        
              `sudo systemctl restart apache2`
        

**Conséquence de ce changement :**

Maintenant, l'URL pour accéder à GLPI n'est plus http://192.168.100.11/glpi, mais directement **http://192.168.100.11**. Apache sert directement le contenu du dossier /public comme s'il était la racine du site.

**Avertissement 2 : Sécurisation des cookies de session PHP**

- **Solution :** Modifier le fichier de configuration de PHP (php.ini).
    1. **Connectez-vous en SSH à votre serveur SRV-GLPI**.
    2. Trouvez et ouvrez le bon fichier php.ini :
        
              `sudo nano /etc/php/8.2/apache2/php.ini`  
        
    3. Utilisez Ctrl+W pour rechercher session.cookie_httponly.
    4. Modifiez la ligne pour qu'elle soit :
        
              `session.cookie_httponly = On`
        
    5. Sauvegardez et quittez.
    6. Redémarrez Apache pour que PHP prenne en compte la modification :
        
              `sudo systemctl restart apache2`
        

Après avoir appliqué ces deux corrections, déconnectez-vous, videz le cache de votre navigateur (important !), pour celareconnectez-vous à GLPI via la nouvelle URL **http://192.168.100.11** en faisant ensuite **CTRL + F5**. Tous les avertissements auront disparu.

Votre instance GLPI est maintenant installée et fonctionnelle.

## **6.6. Liaison avec l'Annuaire Active Directory (LDAP)**

Pour centraliser l'authentification et éviter de gérer des mots de passe multiples, nous allons connecter GLPI à notre annuaire Active Directory. Les utilisateurs pourront ainsi se connecter à GLPI avec leurs identifiants de session Windows.

### **6.6.1. Prérequis : Création d'un Compte de Service dans l'AD**

Par principe de moindre privilège, nous n'utiliserons pas un compte administrateur pour la liaison. Nous allons créer un compte de service dédié, avec un mot de passe qui n'expire jamais, dont le seul rôle sera de lire l'annuaire pour GLPI.

1. Sur **SRV-AD**, ouvrez **"Utilisateurs et ordinateurs Active Directory"**.
2. Dans votre OU PARCUS_Siege, créez une nouvelle sous-OU nommée Comptes_Service.
3. Dans cette nouvelle OU, créez un nouvel utilisateur :
    - **Prénom :** Service
    - **Nom :** GLPI Sync
    - **Nom d'ouverture de session :** glpisync
4. À l'étape du mot de passe :
    - Définissez un mot de passe **très fort**.
    - Décochez "L'utilisateur doit changer le mot de passe...".
    - Cochez **"L'utilisateur ne peut pas changer le mot de passe"** et **"Le mot de passe n'expire jamais"**.
5. Terminez la création. Ce compte est un utilisateur standard sans aucun droit particulier.

### **6.6.2. Configuration de l'Annuaire LDAP dans GLPI**

1. **Accéder à la configuration des annuaires :**
    - Dans l'interface GLPI, naviguez vers **Configuration > Authentification**.
    - Cliquez sur **Annuaires LDAP**.
        
        ![image.png](image%2042.png)
        
2. **Ajouter un nouvel annuaire :**
    - Cliquez sur le bouton + pour créer une nouvelle liaison.
3. **Remplir l'onglet Annuaire LDAP :**
    - **Nom :** Annuaire PARCUS
    - **Serveur par défaut :** Oui
    - **Actif :** Oui
    - **Serveur :** 192.168.100.10
    - **Port :** 389
    - **Filtre de connexion :** (&(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))
        
        *(Ce filtre recherche les objets qui sont des utilisateurs, de catégorie "personne", et qui ne sont pas désactivés).*
        
    - **BaseDN :** Pour cibler uniquement les utilisateurs de notre OU Utilisateurs, nous serons plus précis : OU=Utilisateurs,OU=PARCUS_Siege,DC=parcus,DC=local.
    - **DN du compte (pour la liaison) :** PARCUS\glpisync
    - **Mot de passe du compte :** Le mot de passe fort que vous avez défini pour le compte glpisync.
    - **Champ de l'identifiant :** samaccountname (pour une connexion avec le login simple, ex: a.terrieur).
        
        ![image.png](image%2043.png)
        

### **6.6.3. Importer les utilisateurs**

- Une fois l'annuaire ajouté, allez dans **Administration > Utilisateurs**.
- Cliquez sur le bouton **Liaison annuaire LDAP**.
    
    ![image.png](image%2044.png)
    
- Dans la nouvelle page, cliquez sur **Importation de nouveaux utilisateurs** puis sur **Rechercher**
    
    ![image.png](image%2045.png)
    
- GLPI va scanner votre Active Directory et lister les comptes trouvés. Cochez les utilisateurs que vous souhaitez importer.
    
    ![image.png](image%2046.png)
    
- Cliquez sur **Actions > Importer** et validez.

Les utilisateurs de votre domaine peuvent désormais se connecter à GLPI avec leur propre mot de passe.

## **6.7. Configuration de l'Inventaire Natif et Déploiement de l'Agent GLPI**

Nous abandonnons le couple OCS/GLPI au profit de l'inventaire natif, plus moderne et entièrement intégré.

### **6.7.1. Activation de la Fonctionnalité d'Inventaire**

1. Dans GLPI, naviguez vers **Administration > Inventaire**.
2. Mettez l'option **Activer l'inventaire** sur **Oui**.
3. Cliquez sur **Sauvegarder**.

### **6.7.2. Déploiement de l'Agent GLPI par GPO**

1. **Téléchargement de l'agent :**
    - Téléchargez la dernière version de l'**Agent GLPI pour Windows (x64)** depuis le [dépôt GitHub officiel](https://www.google.com/url?sa=E&q=https%3A%2F%2Fgithub.com%2Fglpi-project%2Fglpi-agent%2Freleases). Prenez le fichier au format **.msi**.
2. **Dépôt de l'agent :**
    - Placez le fichier .msi téléchargé dans votre partage de déploiement sur le serveur SRV-AD : \\SRV-AD\Deploy\.
3. **Création de la GPO de déploiement :**
    - Sur SRV-AD, ouvrez la **Gestion de stratégie de groupe**.
    - Créez une nouvelle GPO nommée **PARCUS - Deploy GLPI Agent** et liez-la à l'OU **Postes_Travail**.
4. **Configuration du déploiement logiciel :**
    - Modifiez cette nouvelle GPO.
    - Naviguez vers Configuration ordinateur > Stratégies > Paramètres du logiciel > **Installation de logiciel**.
    - Faites un clic droit > **Nouveau > Paquet...**.
    - Naviguez via le chemin réseau \\SRV-AD\Deploy\ et sélectionnez votre fichier .msi de l'agent GLPI.
    - Choisissez la méthode de déploiement **Attribué**.
5. **Configuration de l'agent par le registre (via GPO) :**
    - L'agent a besoin de connaître l'URL du serveur GLPI. Nous allons la lui fournir via une clé de registre poussée par la même GPO.
    - Dans l'éditeur de la GPO, naviguez vers Configuration ordinateur > Préférences > Paramètres Windows > **Registre**.
    - Faites un clic droit > **Nouveau > Élément de Registre**.
    - Configurez les champs comme suit :
        - **Action :** Mettre à jour
        - **Ruche :** HKEY_LOCAL_MACHINE
        - **Chemin d'accès de la clé :** SOFTWARE\GLPI-Agent
        - **Nom de la valeur :** server
        - **Type de valeur :** REG_SZ
        - **Données de la valeur :** **http://192.168.100.11/front/inventory.php**
    - Cliquez sur **OK**.
        
        ![image.png](image%2047.png)
        

### **6.7.3. Vérification du Déploiement et de la Remontée d'Inventaire**

1. Sur le poste CLIENT-01, ouvrez une invite de commandes en administrateur et forcez la mise à jour des GPO :Generated cmd
    
          `gpupdate /force`
    
2. Redémarrez le CLIENT-01.
3. Au redémarrage, l'agent GLPI sera installé silencieusement. Il lancera son premier inventaire peu de temps après.
4. Dans l'interface de GLPI, naviguez vers **Parc > Ordinateurs**. Votre CLIENT-01 devrait apparaître dans la liste avec toutes les informations collectées.
5. Si rien n’apparait après 5 minutes rendez-vous à l’adresse `127.0.0.1:62354` depuis **CLIENT-01** puis cliquez sur **Force an inventory**.
    
    ![image.png](image%2048.png)
    

Votre plateforme GLPI est maintenant entièrement configurée pour la gestion de parc, l'inventaire automatisé et l'authentification centralisée.

## **6.8. Configuration des Notifications et du Collecteur de Tickets**

Une fonctionnalité essentielle d'un outil de helpdesk est sa capacité à communiquer par email. GLPI peut envoyer des notifications (par exemple, quand un ticket est ouvert ou résolu) et, plus important encore, il peut **créer des tickets automatiquement** à partir des emails envoyés à une adresse de support dédiée.

Puisque nous n'avons pas de serveur de messagerie interne, nous allons configurer GLPI pour qu'il utilise un compte Gmail externe pour ces deux fonctions.

### **6.8.1. Prérequis : Configuration du Compte Gmail**

Pour que GLPI puisse se connecter à un compte Gmail, il faut autoriser les "applications moins sécurisées" ou, mieux, générer un **"Mot de passe d'application"**.

1. Connectez-vous au compte Gmail que vous avez créé pour le projet.
2. Allez dans les **Paramètres du compte Google > Sécurité**.
3. Activez la **validation en deux étapes**. C'est un prérequis obligatoire.
4. Une fois la validation en deux étapes active, une nouvelle option apparaît : **"Mots de passe des applications"**.
5. Cliquez dessus. Sélectionnez "Messagerie" comme application et "Autre (nom personnalisé)" comme appareil. Donnez-lui un nom explicite comme Serveur GLPI PARCUS.
6. Cliquez sur **Générer**. Google va vous donner un mot de passe unique de 16 caractères. **Copiez et conservez ce mot de passe. C'est celui que vous utiliserez dans GLPI, et non le mot de passe principal de votre compte Gmail.**

### **6.8.2. Configuration des Notifications par Email (Sortant)**

1. Dans GLPI, naviguez vers **Configuration > Notifications**.
2. Cliquez sur **Configuration des notifications par courriels**.
3. Cochez l'option **Activer le suivi par courriels**.
    
    ![image.png](image%2049.png)
    
4. Pour le **Mode d'envoi des courriels**, sélectionnez **SMTP**.
5. Remplissez les informations du serveur SMTP de Google :
    - **Hôte SMTP :** smtp.gmail.com
    - **Port :** 587
    - **Login SMTP :** Votre adresse Gmail complète (ex: support.parcus@gmail.com).
    - **Mot de passe SMTP :** Le **mot de passe d'application** de 16 caractères que vous avez généré.
    - **Utiliser une connexion TLS :** Oui.
6. Sauvegardez la configuration et envoyez un email de test à votre adresse personnelle.

![image.png](image%2050.png)

### **6.8.3 Configuration du Collecteur de Tickets par Email**

Une fonctionnalité essentielle de GLPI est sa capacité à créer automatiquement des tickets à partir des emails envoyés à une adresse de support. Nous allons configurer cette fonctionnalité en utilisant une boîte mail Gmail dédiée.

**Prérequis : Configuration du Compte Gmail**

Pour que GLPI puisse se connecter à un compte Gmail de manière sécurisée, l'utilisation d'un simple mot de passe ne suffit plus. Il est impératif de générer un **"Mot de passe d'application"**.

1. Connectez-vous au compte Gmail créé pour le projet.
2. Accédez à **Gérer votre compte Google > Sécurité**.
3. Activez la **Validation en deux étapes**. C'est un prérequis obligatoire.
4. Une fois la validation active, dans la même section, cliquez sur **"Mots de passe des applications"**.
5. Générez un nouveau mot de passe :
    - **Sélectionner une application :** Messagerie
    - **Sélectionner un appareil :** Autre (nom personnalisé) et nommez-le Serveur GLPI PARCUS.
6. Google affichera un **mot de passe unique de 16 caractères**. Copiez-le et conservez-le précieusement. C'est ce mot de passe, et non celui de votre compte, qui sera utilisé dans GLPI.

**Configuration du Collecteur dans GLPI**

1. Dans l'interface de GLPI, naviguez vers **Configuration > Collecteurs**.
2. Cliquez sur le bouton + pour créer un nouveau collecteur.
3. Remplissez le formulaire avec les informations suivantes :
    - **Nom :** Support PARCUS (Gmail)
    - **Actif :** Oui
    - **Serveur :** imap.gmail.com
    - **Options de connexion :** Sélectionnez **IMAP**, **SSL**, et **NO-VALIDATE-CERT**. La non-validation du certificat est une précaution pour éviter les erreurs de connexion depuis notre réseau local isolé.
    - **Port :** 993
    - **Identifiant :** Votre adresse Gmail complète (ex: glpitestparcus@gmail.com).
    - **Mot de passe :** Collez ici le **mot de passe d'application** de 16 caractères.
4. Cliquez sur **Ajouter** pour sauvegarder.

**Comprendre et Gérer la Création de Tickets**

Par défaut, pour des raisons de sécurité, GLPI refuse de créer des tickets si l'expéditeur de l'email est inconnu de sa base de données. Le message d'information refusés=1 lors de la récupération des courriels est le symptôme de ce comportement.

La solution consiste à s'assurer que GLPI connaisse l'adresse email de l'expéditeur avant de traiter le message.

**Méthode de validation :**

1. **Associer une adresse email à un utilisateur GLPI :**
    - Allez dans **Administration > Utilisateurs**.
    - Choisissez un utilisateur existant (par exemple, l'utilisateur par défaut **normal**) et modifiez-le.
    - Dans le champ **Courriel**, saisissez l'adresse email depuis laquelle vous enverrez les emails de test (par exemple, votre adresse personnelle ou professionnelle).
    - Sauvegardez l'utilisateur.
2. **Lancer le test final :**
    - **Envoyez un email** depuis l'adresse que vous venez d'enregistrer vers votre boîte de collecte (glpitestparcus@gmail.com).
    - Retournez dans GLPI, dans **Configuration > Collecteurs**, et cliquez sur **Récupérer les courriels maintenant**.
3. **Vérification :**
    - Le message d'information doit maintenant indiquer récupérés=1 et refusés=0.
    - Rendez-vous dans **Assistance > Tickets**. Un nouveau ticket, créé à partir de votre email et automatiquement associé à l'utilisateur normal, est maintenant visible.

Votre système de création de tickets par email est désormais pleinement opérationnel.

# 7. Déploiement de la Solution d'Assistance à Distance (SRV-RD)

Pour répondre au besoin d'assistance à distance tout en respectant les contraintes de sécurité (pas de flux sortants non maîtrisés, conformité RGPD), nous allons déployer notre propre serveur relais auto-hébergé pour la solution open-source **RustDesk**.

Cela garantit que toutes les communications de prise en main à distance restent au sein de notre réseau interne, sans passer par les serveurs publics du fournisseur.

## 7.1. Création de la machine virtuelle Debian 12

Comme pour le serveur GLPI, nous allons utiliser une machine virtuelle dédiée sous Debian 12. Cette VM sera très légère, car le serveur RustDesk est peu gourmand en ressources.

1. Dans l'interface Proxmox, cliquez sur **"Créer VM"**.
    
    **Onglet Général :**
    
2. **Nom :** SRV-RD.
3. Cliquez sur **Suivant**.
    
    **Onglet OS :**
    
4. Sélectionnez **"Utiliser une image CD/DVD (iso)"** et choisissez votre image ISO **Debian 12 (net-install)**.
5. **Type d'OS :** Linux.
6. **Version :** 6.x - 2.6 Kernel.
7. Cliquez sur **Suivant**.
    
    **Onglet Système :**
    
8. **BIOS :** Laissez **SeaBIOS** par défaut.
9. Cochez **"Agent QEMU"**.
10. Cliquez sur **Suivant**.
    
    **Onglet Disques :**
    
11. **Bus/Device :** SCSI.
12. **Taille du disque (Go) :** 40 Go est largement suffisant.
13. Cliquez sur **Suivant**.
    
    **Onglet CPU :**
    
14. **Cœurs :** 1.
15. Cliquez sur **Suivant**.
    
    **Onglet Mémoire :**
    
16. **Mémoire (Mo) :** 2048 Mo (2 Go).
17. Cliquez sur **Suivant**.
    
    **Onglet Réseau :**
    
18. **Réseau :** **vmbr1** (notre LAN isolé).
19. **Modèle :** VirtIO (paravirtualisé).
20. Cliquez sur **Suivant**.
    
    **Onglet Confirmer :**
    
21. Vérifiez le résumé et cliquez sur **Terminer**.
22. Procédez à l'installation de Debian 12 comme pour le serveur SRV-GLPI.
    - Configurez une adresse IP statique : **192.168.100.14**.
    - Définissez le nom d'hôte : **srv-rd.parcus.local**.
    - Lors de la sélection des logiciels, cochez uniquement **"Serveur SSH"** et **"Utilitaires usuels du système"**.

Une fois l'installation terminée, la machine virtuelle SRV-RD est prête pour l'installation du logiciel serveur RustDesk.

## 7.2. Installation du serveur RustDesk **via les Paquets Debian**

L'infrastructure auto-hébergée de RustDesk se compose de deux services principaux :

- **hbbs (RustDesk ID/Rendezvous Server) :** Le service de "rendez-vous" qui permet aux clients de se trouver mutuellement. Il gère les ID et les connexions initiales.
- **hbbr (RustDesk Relay Server) :** Le service relais qui transmet le trafic crypté de la session de bureau à distance entre les deux clients une fois la connexion établie.

La méthode la plus simple et la plus propre pour installer ces services sur un système Debian est d'utiliser les paquets .deb officiels fournis par les développeurs de RustDesk. Cette méthode garantit que les services seront correctement installés, configurés pour démarrer automatiquement, et placés dans les bons répertoires système.

### **7.2.1. Téléchargement des Paquets Serveur**

1. **Connectez-vous en SSH à votre serveur SRV-RD**.
2. **Mettez à jour le système :**
    
          `sudo apt update && sudo apt upgrade -y`
    
3. **Naviguez vers un répertoire temporaire** pour le téléchargement :
    
          `cd /tmp`
    
4. **Téléchargez les deux paquets .deb** depuis la page des "releases" de RustDesk sur GitHub. Nous utilisons wget pour récupérer les fichiers correspondant à notre architecture (amd64).
    - Téléchargement du paquet hbbs :
        
              `wget https://github.com/rustdesk/rustdesk-server/releases/download/1.1.14/rustdesk-server-hbbs_1.1.14_amd64.deb`
        
    - Téléchargement du paquet hbbr :
        
              `wget https://github.com/rustdesk/rustdesk-server/releases/download/1.1.14/rustdesk-server-hbbr_1.1.14_amd64.deb`
        

### **7.2.2. Installation des Paquets**

1. Maintenant que les fichiers sont téléchargés, nous allons les installer en utilisant dpkg, le gestionnaire de paquets de bas niveau de Debian.
    - Installation de hbbs :
        
              `sudo dpkg -i rustdesk-server-hbbs_1.1.14_amd64.deb`
        
    - Installation de hbbr :
        
              `sudo dpkg -i rustdesk-server-hbbr_1.1.14_amd64.deb`
        
2. L'installation via dpkg peut parfois révéler des dépendances manquantes. Pour corriger cela et finaliser l'installation, exécutez la commande suivante :
    
          `sudo apt-get install -f -y`
    
    Cette commande va automatiquement trouver, télécharger et installer toutes les dépendances nécessaires aux paquets que vous venez d'installer.
    

### **7.2.3. Vérification des Services**

L'avantage d'utiliser les paquets .deb est que les services systemd sont automatiquement créés et activés.

1. Vérifiez que les deux services sont bien en cours d'exécution (active (running)) :
    
          `sudo systemctl status rustdesk-hbbs
    sudo systemctl status rustdesk-hbbr`
    
2. Si, pour une raison quelconque, ils ne sont pas actifs, démarrez-les et activez-les manuellement :
    
          `sudo systemctl start rustdesk-hbbs rustdesk-hbbr
    sudo systemctl enable rustdesk-hbbs rustdesk-hbbr`
    

## **7.3. Configuration de la Sécurité et des Clients**

Pour que les clients puissent se connecter de manière sécurisée à notre serveur privé, ils ont besoin de connaître son adresse IP et sa clé publique.

### **7.3.1. Récupération de la Clé Publique**

Lors de la première exécution, le service hbbs a automatiquement généré une paire de clés. La clé publique est stockée dans un fichier.

1. **Affichez le contenu de la clé publique** avec la commande cat. Le paquet l'installe dans le répertoire /var/lib/rustdesk-server/.
    
          `sudo cat /var/lib/rustdesk-server/id_ed25519.pub`
    
    ![image.png](image%2051.png)
    
2. Le terminal affichera une longue chaîne de caractères (par exemple : nS5a1...xZy89). **Copiez cette clé et conservez-la précieusement.** Elle est essentielle pour la configuration des clients.

### **7.3.2. Configuration du Pare-feu (UFW)**

Pour que les clients puissent joindre le serveur, nous devons ouvrir les ports nécessaires sur le pare-feu de SRV-RD.

1. **Installez UFW** s'il n'est pas déjà présent :
    
          `sudo apt install ufw -y`
    
2. **Autorisez les ports requis par RustDesk** et le port SSH :
    
          `sudo ufw allow 22/tcp                      # Pour le SSH
    sudo ufw allow 21115:21119/tcp             # Ports de communication RustDesk
    sudo ufw allow 21116/udp                   # Port de relais RustDesk`
    
3. **Activez le pare-feu :**
    
          `sudo ufw enable`
    
    ![image.png](image%2052.png)
    

### **7.3.3. Configuration du Client RustDesk**

La dernière étape consiste à configurer le client RustDesk sur les postes de travail (comme CLIENT-01) pour qu'il utilise notre serveur privé.

1. Installez le client RustDesk sur CLIENT-01.
2. Cliquez sur le menu ⋮ à côté de votre ID, puis choisissez **Serveur ID/Relais**.
3. Remplissez les informations suivantes :
    - **Serveur ID :** L'adresse IP de votre serveur RustDesk, soit **192.168.100.14**.
    - **Serveur Relais :** Laissez ce champ vide (il utilisera la même adresse que le serveur ID).
    - **Key :** Collez ici la **clé publique** que vous avez récupérée sur le serveur.
4. Cliquez sur **OK**.

**La Solution Hybride (Le Meilleur des Deux Mondes)**

Nous allons combiner la simplicité du déploiement MSI avec la puissance d'un script de configuration. C'est la méthode la plus propre et la plus robuste.

**Configurer l'Agent via un Script de Démarrage GPO**

Maintenant que nous sommes sûrs que le logiciel est installé, nous allons utiliser un petit script pour le configurer.

1. Créez un nouveau fichier ConfigureRustDesk.ps1 (vous pouvez le mettre dans le même dossier Deploy ou dans le dossier Scripts de la GPO).
2. Mettez ce contenu très simple à l'intérieur :Generated batch
    
    ```powershell
    # --- Script de configuration intelligent pour RustDesk ---
    # À déployer en tant que script de démarrage par GPO.
    
    # --- Variables à configurer ---
    $Key = 'yrJ9DMPVjVFOnVWIRlq24gxqydjlp6BttEt0bYD3FSA=' # Mettez votre clé publique ici, SANS guillemets simples ou doubles autour.
    $Server = '192.168.100.14' # Mettez l'IP de votre serveur, SANS guillemets.
    
    # --- Chemin cible (ne pas modifier) ---
    $ConfigFile = "C:\Users\Administrateur\AppData\Roaming\RustDesk\config\RustDesk2.toml"
    $ConfigDir = "C:\Users\Administrateur\AppData\Roaming\RustDesk\config"
    
    # --- Logique du script ---
    
    try {
        # Étape 1: S'assurer que le répertoire de configuration existe
        if (-not (Test-Path $ConfigDir)) {
            Write-Host "Le répertoire de configuration n'existe pas. Création de $ConfigDir..."
            New-Item -Path $ConfigDir -ItemType Directory -Force | Out-Null
        }
    
        # Étape 2: Lire le fichier de configuration existant ou le créer en mémoire s'il n'existe pas
        $content = ""
        if (Test-Path $ConfigFile) {
            $content = Get-Content $ConfigFile -Raw
        }
    
        # Étape 3: Définir les clés et valeurs à configurer sous [options]
        $optionsToSet = @{
            "key"                          = "'$Key'"
            "custom-rendezvous-server"     = "'$Server'"
            # Vous pouvez ajouter d'autres options ici si besoin
            # "another-option"             = "'value'"
        }
    
        # Étape 4: S'assurer que la section [options] existe
        if ($content -notmatch '\[options\]') {
            $content += "`r`n[options]"
        }
    
        # Étape 5: Mettre à jour chaque clé
        foreach ($option in $optionsToSet.Keys) {
            $value = $optionsToSet[$option]
            $pattern = "(?sm)($option\s*=\s*.*?)(?:\r?\n)"
    
            # Si la clé existe, on la remplace
            if ($content -match $pattern) {
                $content = $content -replace $pattern, "$option = $value`r`n"
            }
            # Sinon, on l'ajoute juste après la ligne [options]
            else {
                $content = $content -replace '(\[options\])', "`$1`r`n$option = $value"
            }
        }
    
        # Étape 6: Écrire le contenu mis à jour dans le fichier
        Write-Host "Mise à jour du fichier de configuration: $ConfigFile"
        Set-Content -Path $ConfigFile -Value $content -Encoding UTF8 -Force
    
        # Étape 7: Redémarrer le service RustDesk pour appliquer les changements
        Write-Host "Redémarrage du service RustDesk..."
        $service = Get-Service -Name "RustDesk" -ErrorAction SilentlyContinue
        if ($service) {
            Stop-Service -Name "RustDesk" -Force
            Start-Sleep -Seconds 5
            Start-Service -Name "RustDesk"
            Write-Host "Service RustDesk redémarré."
        } else {
            Write-Host "Le service RustDesk n'est pas installé ou n'a pas pu être trouvé."
        }
    
        Write-Host "Configuration de RustDesk terminée avec succès."
        exit 0
    
    } catch {
        Write-Error "Une erreur est survenue: $_"
        exit 1
    }
    ```
    
3. **Personnalisez** la ligne SET RUSTDESK_CONFIG_STRING avec votre clé publique.
4. Dans la même GPO (PARCUS - Deploy RustDesk), allez dans Configuration ordinateur > Paramètres Windows > **Scripts (Démarrage/Arrêt)**.
5. Double-cliquez sur **Démarrage** et ajoutez votre script ConfigureRustDesk.bat.

### **7.3.4. Déploiement et Configuration du Client RustDesk par Stratégies de Groupe**

Pour assurer que tous les postes de travail du parc utilisent notre serveur RustDesk privé, nous allons entièrement automatiser l'installation et la configuration de l'agent via les Stratégies de Groupe (GPO). Cette méthode garantit une configuration homogène et centralisée.

Nous allons utiliser trois GPO distinctes, appliquées dans un ordre précis, pour séparer les tâches d'installation, d'activation des politiques et de configuration par script.

**Étape 1 : Ajout du Paquet d'Installation à la GPO PARCUS-SOFT-Standard**

1. **Préparation :** Téléchargez le fichier d'installation **.msi** de RustDesk et placez-le dans le partage \\SRV-AD\Deploy\.
2. **Modification de la GPO :**
    - Sur SRV-AD, ouvrez la **Gestion de stratégie de groupe**.
    - Modifiez la GPO **PARCUS-SOFT-Standard** (qui contient déjà 7-Zip).
    - Naviguez vers Configuration ordinateur > Paramètres du logiciel > **Installation de logiciel**.
    - Faites un clic droit > **Nouveau > Paquet...** et ajoutez le .msi de RustDesk en utilisant son chemin réseau.
    - Choisissez la méthode de déploiement **Attribué**.

**Étape 2 : Création de la GPO de Configuration PARCUS - Configure Scripts and Policies**

Cette GPO aura trois rôles : autoriser l'exécution des scripts, exécuter notre script de configuration, et s'assurer qu'il a le temps de s'exécuter après l'installation.

1. **Création du Script de Configuration :**
    - Créez le script PowerShell **ConfigureRustDesk.ps1** (avec le code robuste que vous avez validé) et placez-le dans le partage \\SRV-AD\Deploy\RustDesk\.
2. **Création de la GPO :**
    - Créez une nouvelle GPO nommée **PARCUS - Configure Scripts and Policies** et liez-la à l'OU **Postes_Travail**.
3. **Configuration des paramètres dans la GPO :**
    - Modifiez cette nouvelle GPO.
    - **PARTIE A : Autoriser l'exécution des scripts**
        - Naviguez vers Configuration ordinateur > Modèles d'administration > Composants Windows > **Windows PowerShell**.
        - Activez la stratégie **Activer l'exécution des scripts** et réglez la "Stratégie d'exécution" sur **Autoriser tous les scripts**.
        
        ![image.png](image%2053.png)
        
    - **PARTIE B : Définir un délai d'attente**
        - Naviguez vers Configuration ordinateur > Modèles d'administration > Système > **Stratégie de groupe**.
        - Activez la stratégie **Spécifier le temps d'attente du traitement des scripts de démarrage** et définissez la valeur à **120** secondes.
    - **PARTIE C : Ajouter le script de démarrage**
        - Naviguez vers Configuration ordinateur > Paramètres Windows > **Scripts (Démarrage/Arrêt)**.
        - Double-cliquez sur **Démarrage**, allez dans l'onglet **Scripts PowerShell** et ajoutez votre script ConfigureRustDesk.ps1 via son chemin réseau.
            
            ![image.png](image%2054.png)
            

**Étape 3 : Gérer l'Ordre de Liaison des GPO**

C'est l'étape qui garantit le bon déroulement du processus.

1. Dans la console de **Gestion de stratégie de groupe**, sélectionnez l'OU **Postes_Travail**.
2. Dans le volet de droite, allez dans l'onglet **"Objets de stratégie de groupe liés"**.
3. Utilisez les flèches pour définir l'ordre de traitement. L'ordre doit être le suivant (le plus petit chiffre est appliqué en dernier) :
    - **Ordre 1 : PARCUS-SOFT-Standard** (Contient l'installation de 7-Zip et RustDesk).
    - **Ordre 2 : PARCUS - Deploy GLPI Agent** (Installe l'agent GLPI).
    - **Ordre 3 : PARCUS - Configure Scripts and Policies** (Active les politiques et lance le script de configuration).
        
        ![image.png](image%2055.png)
        

**Logique d'exécution finale :**

Au démarrage d'un nouveau poste dans cette OU, les GPO sont lues. Les installations logicielles (ordre 1 et 2) sont initiées. La GPO de configuration (ordre 3) est également lue, elle active la politique d'exécution des scripts et impose un délai de 120 secondes avant de lancer le script de démarrage. Ce délai laisse amplement le temps aux installations MSI de se terminer. Passé ce délai, le script PowerShell s'exécute sur un système où RustDesk est déjà installé, et il peut donc trouver et modifier le fichier de configuration avec succès.

**Pourquoi cette méthode est la meilleure ?**

1. **Installation Propre :** Vous utilisez la méthode MSI, qui est la plus propre pour déployer un logiciel via GPO. Elle gère correctement les installations, les mises à jour et les désinstallations.
2. **Configuration Robuste :** Le script de démarrage s'assure que la configuration est appliquée à chaque démarrage de la machine. Si un utilisateur modifie les paramètres, ils seront corrigés au prochain redémarrage.
3. **Séparation des Rôles :** Vous séparez bien la tâche d'**installation** (gérée par le MSI) de la tâche de **configuration** (gérée par le script), ce qui est une excellente pratique.

C'est la méthode que je vous recommande. Elle est plus simple que la création d'un fichier .mst et plus robuste que de tout faire dans un seul script.

### 7.3.5. ⚠️ Attention : Limitation de la Version Communautaire de RustDesk

Lors de la phase de test du déploiement automatisé, un comportement bloquant a été identifié : bien que le script PowerShell déploie et modifie avec succès le fichier de configuration RustDesk2.toml, les paramètres personnalisés (serveur et clé) sont **systématiquement réinitialisés** à leurs valeurs par défaut dès que le service ou l'interface graphique de RustDesk est redémarré.

**Cause Racine Identifiée :**

Après une analyse approfondie, il a été déterminé que ce comportement est une **limitation intentionnelle de la version communautaire (gratuite) de RustDesk**. La modification programmatique du fichier de configuration pour pointer vers un serveur auto-hébergé est une fonctionnalité considérée comme "professionnelle". Elle est verrouillée et pleinement fonctionnelle uniquement avec les **versions sous licence de RustDesk Pro**.

**Conclusion pour le Projet :**

L'automatisation complète de la configuration du client RustDesk via GPO n'est donc **pas réalisable avec la version gratuite utilisée dans le cadre de cette AP**. La procédure de déploiement par GPO du MSI reste valide pour installer le logiciel, mais la configuration pour se connecter au serveur SRV-RD doit être effectuée **manuellement** sur chaque poste par un technicien via l'interface graphique du client. Ce point sera à prendre en compte dans le calcul du temps de préparation d'un nouveau poste.

# 8. Configuration et Intégration du Poste Client Windows 11

Cette étape est cruciale car elle soumet le poste de travail à la gestion centralisée de notre DSI. Une fois joint au domaine, le poste appliquera les stratégies de groupe, pourra être inventorié et bénéficiera de l'authentification centralisée.

## **8.1. Déploiement et Gestion Centralisée de BitLocker par GPO**

Pour répondre à l'exigence de sécurité des données sur les postes de travail, nous allons déployer et gérer le chiffrement de lecteur BitLocker de manière entièrement centralisée et automatisée. L'objectif est double : forcer le chiffrement des disques système et centraliser les clés de récupération dans Active Directory pour en garantir l'accès par les administrateurs en cas de besoin.

### **8.1.1. Ajout des Outils de Gestion BitLocker sur SRV-AD**

Pour pouvoir gérer BitLocker via les GPO et consulter les clés de récupération, nous devons d'abord installer les outils d'administration nécessaires sur notre contrôleur de domaine.

1. Sur SRV-AD, ouvrez le **Gestionnaire de serveur** et lancez l'**Assistant Ajout de rôles et de fonctionnalités**.
2. Avancez jusqu'à l'onglet **"Fonctionnalités"**.
3. Dans la liste, trouvez et cochez la case **"Chiffrement de lecteur BitLocker"**.
4. Une fenêtre contextuelle vous proposera d'ajouter les outils de gestion dépendants (Utilitaires d'administration de Chiffrement de lecteur BitLocker). Acceptez en cliquant sur **"Ajouter des fonctionnalités"**.
    
    ![image.png](image%2056.png)
    
5. Terminez l'assistant pour installer les fonctionnalités. Un redémarrage peut être nécessaire.

### **8.1.2. Création de la GPO de Configuration BitLocker**

Cette GPO va définir toutes les règles que les postes clients devront appliquer pour le chiffrement.

1. Ouvrez la **Gestion de stratégie de groupe**.
2. Dans l'OU **Postes_Travail**, créez une nouvelle GPO et nommez-la **PARCUS - SEC - BitLocker Policy**.
3. Modifiez cette GPO.
4. Naviguez vers Configuration ordinateur > Stratégies > Modèles d'administration > Composants Windows > **Chiffrement de lecteur BitLocker**.
5. **Configurez la sauvegarde des clés dans l'AD :**
    - Allez dans Lecteurs du système d'exploitation.
    - Activez la stratégie **Choisir le mode de stockage des informations de récupération BitLocker...**.
    - Dans les options, assurez-vous que **Enregistrer les mots de passe de récupération et les packages de clés** est sélectionné.
    - Cochez la case cruciale : **Ne pas activer BitLocker tant que les informations de récupération ne sont pas stockées dans AD DS**.
6. **Configurez les paramètres d'authentification :**
    - Toujours dans Lecteurs du système d'exploitation, activez la stratégie **Exiger une authentification supplémentaire au démarrage**.
    - Laissez la case **Autoriser BitLocker sans un module de plateforme sécurisée compatible** décochée (car nos VM ont un TPM virtuel).
    - Assurez-vous que les options pour le TPM sont sur **Autoriser** (ou Exiger).

## **8.2. Création et Déploiement du Script d'Activation**

C'est le cœur de l'automatisation. Nous allons créer un script PowerShell qui active BitLocker, puis une GPO qui le déploie en tant que tâche planifiée.

1. **Création du Script PowerShell :**
    - Sur SRV-AD, ouvrez **PowerShell ISE en administrateur**.
    - Collez le script suivant, qui vérifie si le TPM est prêt et si le disque n'est pas déjà chiffré avant de lancer l'activation :Generated powershell
        
        ```powershell
        # Script d'activation de BitLocker avec TPM
        if (((Get-Tpm).TpmReady -eq $true) -and ((Get-BitLockerVolume -MountPoint $env:SystemDrive).VolumeStatus -eq "FullyDecrypted")) {
            Add-BitLockerKeyProtector -MountPoint $env:SystemDrive -TpmProtector
            Enable-BitLocker -MountPoint $env:SystemDrive -TpmProtector -SkipHardwareTest
        }
        ```
        
    - Enregistrez ce script sous le nom Activate-BitLocker.ps1 dans un partage réseau accessible par les postes clients, par exemple \\SRV-AD\Deploy\Scripts\.
2. **Création de la Tâche Planifiée par GPO :**
    - Modifiez à nouveau votre GPO **PARCUS - SEC - BitLocker Policy**.
    - Naviguez vers Configuration ordinateur > Préférences > Paramètres du Panneau de configuration > **Tâches planifiées**.
    - Faites un clic droit > **Nouveau > Tâche immédiate (au minimum Windows 7)**.
    - **Onglet Général :**
        - **Nom :** Activation de BitLocker au démarrage
        - **Compte d'utilisateur :** Cliquez sur "Modifier..." et entrez **NT AUTHORITY\SYSTEM**. Ce compte a les privilèges les plus élevés, nécessaires pour l'opération.
        - Cochez **Exécuter avec les autorisations maximales**.
    - **Onglet Actions :**
        - Cliquez sur **Nouveau...**.
        - **Action :** Démarrer un programme.
        - **Programme/script :** powershell.exe
        - **Ajouter des arguments (facult.) :** -ExecutionPolicy Bypass -File "\\SRV-AD\Deploy\Scripts\Activate-BitLocker.ps1"
    - Cliquez sur **OK** pour sauvegarder la tâche et la GPO.

## **8.3 : Vérification du Déploiement**

1. Sur un poste client comme CLIENT-01 ou CLIENT-02, forcez la mise à jour de la GPO et redémarrez : gpupdate /force puis shutdown /r /t 0.
2. Après le redémarrage, le chiffrement BitLocker devrait démarrer automatiquement en arrière-plan. Vous pouvez vérifier sa progression dans le Panneau de configuration.
3. Sur SRV-AD, ouvrez **Utilisateurs et ordinateurs Active Directory**, trouvez l'objet ordinateur du client, allez dans ses propriétés et vérifiez que l'onglet **Récupération BitLocker** contient bien la clé de récupération.

Cette méthode est complète, automatisée, et démontre une maîtrise avancée de la gestion de parc via les GPO.

😀 **L'infrastructure PARCUS est désormais validée et opérationnelle.**

# 9. Dépannage (Troubleshooting)

Cette section a pour but de fournir des solutions aux problèmes les plus fréquemment rencontrés lors du déploiement ou de la gestion d'une infrastructure comme celle de PARCUS.

## 9.1. Problèmes liés à l'Active Directory

**Problème 1 : Impossible de joindre un poste au domaine**

- **Symptôme :** Un message d'erreur s'affiche lors de la tentative de jonction, indiquant "Le contrôleur de domaine pour le domaine [...] est introuvable" ou "Une erreur s'est produite lors de la tentative de jonction au domaine [...]".
- **Cause probable 1 : Problème de résolution DNS.** Le poste client n'arrive pas à traduire le nom parcus.local en l'adresse IP de SRV-AD.
    - **Solution :**
        1. Sur le poste client, ouvrez une invite de commande.
        2. Exécutez ipconfig /all. Vérifiez que le serveur DNS configuré est bien l'adresse de votre contrôleur de domaine (192.168.100.10).
        3. Si l'adresse est incorrecte, vérifiez la configuration de votre serveur DHCP. Si le client est en IP fixe, corrigez manuellement sa configuration DNS.
        4. Exécutez nslookup srv-ad.parcus.local. Cette commande doit retourner l'adresse 192.168.100.10.
        5. Exécutez ping 192.168.100.10. Si le ping ne répond pas, il y a un problème de connectivité réseau (pare-feu, mauvais bridge Proxmox).
- **Cause probable 2 : Pare-feu.** Le pare-feu Windows sur le serveur SRV-AD bloque les requêtes nécessaires.
    - **Solution :**
        1. Lors de l'installation du rôle AD DS, les règles de pare-feu nécessaires sont normalement créées et activées automatiquement.
        2. Vérifiez l'état du Pare-feu Windows Defender sur SRV-AD. Assurez-vous qu'il est bien actif pour le profil "Domaine".
        3. Dans les règles de trafic entrant, vérifiez la présence et l'activation des règles liées à "Active Directory", "DNS" et "Partage de fichiers et d'imprimantes".

**Problème 2 : Un utilisateur ne peut pas ouvrir de session**

- **Symptôme :** Après avoir saisi son identifiant et son mot de passe, l'utilisateur reçoit le message "Le nom d'utilisateur ou le mot de passe est incorrect" ou "La relation d'approbation entre cette station de travail et le domaine principal a échoué".
- **Cause probable 1 : Mot de passe incorrect ou compte verrouillé.**
    - **Solution :**
        1. Vérifiez que l'utilisateur tape le bon mot de passe.
        2. Sur SRV-AD, dans **Utilisateurs et ordinateurs Active Directory**, trouvez le compte de l'utilisateur.
        3. Faites un clic droit > **Propriétés** > onglet **"Compte"**.
        4. Vérifiez si la case "Le compte est verrouillé" est cochée. Si oui, décochez-la et demandez à l'utilisateur de réessayer.
        5. En dernier recours, réinitialisez son mot de passe (clic droit > **Réinitialiser le mot de passe**).
- **Cause probable 2 : Relation d'approbation rompue.** Cela arrive parfois si le compte ordinateur a été supprimé ou s'il y a un décalage de temps important.
    - **Solution :**
        1. Ouvrez une session sur le poste client avec un compte administrateur local.
        2. Faites-le sortir du domaine en le remettant dans un groupe de travail (WORKGROUP). Redémarrez.
        3. Sur SRV-AD, vérifiez que le compte ordinateur existe bien dans la bonne OU. S'il n'existe pas, ou si vous suspectez un problème, supprimez-le.
        4. Rejoignez à nouveau le poste au domaine.

## 9.2. Problèmes liés au déploiement WDS

**Problème 1 : Un client ne démarre pas sur le réseau (PXE boot failed)**

- **Symptôme :** Le poste client affiche un message d'erreur comme "PXE-E53: No boot filename received" ou "PXE-M0F: Exiting PXE ROM" et démarre sur son disque dur (ou ne démarre pas du tout).
- **Cause probable 1 : Le client n'est pas sur le bon réseau/VLAN.**
    - **Solution :**
        1. Dans Proxmox, vérifiez que la carte réseau de la VM cliente est bien connectée au bridge **vmbr1**, le même que celui du serveur SRV-AD.
- **Cause probable 2 : Le serveur DHCP n'envoie pas les bonnes options PXE.**
    - **Solution :**
        1. Sur SRV-AD, ouvrez la console **DHCP**.
        2. Vérifiez que votre étendue est bien active.
        3. Allez dans les **"Options du serveur"**. Assurez-vous que l'**option 60 (PXEClient)** n'est **PAS** configurée ici. Elle doit être gérée par WDS directement.
        4. Vérifiez les **"Options d'étendue"** pour le LAN-PARCUS-Siege. Les options **66 (Nom d'hôte du serveur de démarrage)** et **67 (Nom du fichier de démarrage)** ne doivent pas être configurées manuellement. WDS s'en charge.
        5. Dans la console **WDS**, faites un clic droit sur le serveur SRV-AD > **Propriétés**. Allez dans l'onglet **"DHCP"** et vérifiez que la case **"Configurer l'option 60 de DHCP sur 'PXEClient'"** est bien cochée.
- **Cause probable 3 : Le client n'est pas approuvé.**
    - **Solution :**
        1. Dans la console WDS, allez dans le dossier **"Périphériques en attente"**.
        2. Vérifiez si la machine cliente s'y trouve. Si oui, faites un clic droit dessus et choisissez **"Approuver"**.

**Problème 2 : L'installation échoue avec une erreur "Pilote manquant"**

- **Symptôme :** Après avoir démarré sur l'environnement Windows PE, l'installation s'arrête en affichant un message indiquant qu'un pilote requis est manquant, souvent le pilote de stockage ou réseau.
- **Cause probable : L'image de démarrage (boot.wim) ne contient pas les pilotes nécessaires pour le matériel du client.** C'est un problème courant avec les pilotes de stockage ou réseau paravirtualisés VirtIO de Proxmox.
    - **Solution : Intégrer les pilotes VirtIO dans l'image de démarrage.**
        1. Téléchargez les derniers **"VirtIO-win drivers"** (souvent sous forme d'une ISO). Montez cette ISO.
        2. Sur SRV-AD, ouvrez la console **WDS**.
        3. Allez dans le dossier **"Pilotes"**. Faites un clic droit et choisissez **"Ajouter un package de pilotes..."**.
        4. Suivez l'assistant pour importer tous les pilotes (.inf) du dossier NetKVM (pour le réseau) et viostor (pour le stockage) de l'ISO VirtIO.
        5. Une fois les pilotes ajoutés, allez dans **"Images de démarrage"**.
        6. Faites un clic droit sur votre image de démarrage (boot.wim) et choisissez **"Ajouter des packages de pilotes à l'image..."**.
        7. Suivez l'assistant pour rechercher et ajouter les pilotes réseau et stockage que vous venez d'importer.
        8. L'assistant va créer une nouvelle version de votre boot.wim avec les pilotes intégrés.

## 9.3. Problèmes liés à l'application des GPO

**Problème 1 : Une stratégie de groupe ne s'applique pas sur un poste client**

- **Symptôme :** Vous avez configuré une GPO (par exemple, pour déployer un logiciel ou changer un paramètre), mais les modifications n'apparaissent pas sur le CLIENT-01, même après un redémarrage.
- **Cause probable 1 : Le client ou l'utilisateur n'est pas dans la bonne OU.**
    - **Solution :**
        1. Dans la console **Gestion de stratégie de groupe**, vérifiez à quelle OU la GPO est liée.
        2. Dans la console **Utilisateurs et ordinateurs Active Directory**, vérifiez que l'objet ordinateur (CLIENT-01) ou l'objet utilisateur (a.terrieur) se trouve bien dans cette OU (ou une sous-OU).
        3. Si un objet est dans le conteneur par défaut "Computers" ou "Users", la GPO ne s'appliquera pas. Déplacez-le dans l'OU appropriée.
- **Cause probable 2 : La GPO est désactivée ou mal filtrée.**
    - **Solution :**
        1. Dans la console **Gestion de stratégie de groupe**, sélectionnez la GPO.
        2. Dans l'onglet **"Détails"**, vérifiez que l'**"État de l'objet GPO"** est bien sur **"Activé"**.
        3. Dans l'onglet **"Étendue"**, vérifiez la section **"Filtrage de sécurité"**. Par défaut, le groupe Utilisateurs authentifiés doit y figurer. S'il a été modifié, assurez-vous que le groupe contenant votre client ou utilisateur (par exemple, Ordinateurs du domaine) a bien les permissions de "Lire" et "Appliquer la stratégie".
- **Cause probable 3 : Problème de réplication ou de communication avec le contrôleur de domaine.**
    - **Solution :**
        1. Sur le CLIENT-01, ouvrez une invite de commandes en tant qu'administrateur.
        2. Exécutez gpupdate /force pour forcer la synchronisation. Regardez s'il y a des messages d'erreur.
        3. Utilisez l'outil de diagnostic **"Jeu de stratégie résultant" (RSoP)** pour voir quelles stratégies sont réellement appliquées et pourquoi.
            - Tapez rsop.msc dans l'invite de commande. Une console s'ouvrira, montrant un résumé des paramètres de stratégie appliqués à la machine et à l'utilisateur courant. C'est un outil très puissant pour comprendre les conflits ou les erreurs d'application.

**Problème 2 : Un paramètre ne change pas car une autre GPO a la priorité**

- **Symptôme :** Vous avez configuré un paramètre dans une GPO, mais c'est le paramètre d'une autre GPO qui est appliqué sur le client.
- **Cause probable : Conflit de GPO et ordre de priorité.**
    - **Solution :**
        1. Rappelez-vous de l'ordre d'application : **LSDOU** (Local, Site, Domaine, Unité d'Organisation). La GPO la plus proche de l'objet (la plus "basse" dans l'arborescence) l'emporte.
        2. Dans la console **Gestion de stratégie de groupe**, sélectionnez l'OU où se trouve l'objet. Allez dans l'onglet **"Héritage de stratégie de groupe"**. Cette vue vous montre toutes les GPO qui s'appliquent et leur ordre de priorité (le chiffre le plus bas a la plus haute priorité).
        3. Vous pouvez changer l'ordre de priorité des GPO qui sont liées à la même OU en utilisant les flèches haut/bas.
        4. Si vous voulez qu'un paramètre d'une GPO "haute" (ex: au niveau du domaine) ne soit jamais écrasé par une GPO "basse", vous pouvez activer l'option **"Appliqué"** (clic droit sur la GPO > Appliqué).

## 10.4. Problèmes liés à GLPI / OCS

**Problème 1 : L'agent OCS n'apparaît pas dans l'inventaire du serveur OCS**

- **Symptôme :** Après avoir installé l'agent sur CLIENT-01, la machine n'apparaît pas dans l'interface web d'OCS (http://192.168.100.11/ocsreports).
- **Cause probable 1 : Erreur dans l'URL du serveur lors de l'installation de l'agent.**
    - **Solution :**
        1. Sur CLIENT-01, ouvrez l'Éditeur du Registre (regedit).
        2. Naviguez jusqu'à la clé : HKEY_LOCAL_MACHINE\SOFTWARE\OCS Inventory NG\Agent.
        3. Vérifiez la valeur de la chaîne Server. Elle doit correspondre exactement à http://192.168.100.11/ocsreports. Corrigez-la si nécessaire.
- **Cause probable 2 : Le pare-feu sur le serveur SRV-GLPI bloque la connexion.**
    - **Solution :**
        1. Le serveur web Apache écoute sur le port 80 (HTTP). Assurez-vous que ce port est ouvert pour le trafic entrant sur SRV-GLPI.
        2. Si vous avez configuré un pare-feu sur Debian (comme ufw), exécutez la commande suivante sur SRV-GLPI pour autoriser le trafic web :
            
                  `sudo ufw allow 'Apache Full'`
            
- **Cause probable 3 : Le service de l'agent ne fonctionne pas sur le client.**
    - **Solution :**
        1. Sur CLIENT-01, ouvrez la console des Services (services.msc).
        2. Trouvez le service **"OCS Inventory NG Agent"**. Assurez-vous que son statut est "En cours d'exécution". S'il est arrêté, démarrez-le et configurez son type de démarrage sur "Automatique (début différé)".

**Problème 2 : Les ordinateurs d'OCS ne sont pas importés dans GLPI**

- **Symptôme :** Les ordinateurs sont bien visibles dans l'interface d'OCS, mais ils n'apparaissent pas dans l'inventaire de GLPI, même après une synchronisation.
- **Cause probable 1 : Mauvaises informations de connexion à la base de données.**
    - **Solution :**
        1. Dans l'interface de GLPI, allez dans **Configuration > OCS Inventory NG**.
        2. Cliquez sur votre serveur (Serveur OCS Local).
        3. Vérifiez attentivement l'hôte (localhost), le nom de la base de données (ocsweb), l'utilisateur (ocs) et surtout le mot de passe.
        4. Ré-entrez le mot de passe de l'utilisateur ocs de la base de données et sauvegardez.
- **Cause probable 2 : Le plugin OCS n'est pas activé ou à jour.**
    - **Solution :**
        1. Dans GLPI, allez dans **Configuration > Plugins**.
        2. Vérifiez que le plugin "OCS Inventory NG" est bien **installé ET activé**.
- **Cause probable 3 : Problème de règles d'importation dans GLPI.**
    - **Solution :**
        1. Dans GLPI, allez dans **Administration > Règles > Règles d'import et de liaison de matériels**.
        2. Vérifiez les règles existantes. Par défaut, la règle "Computer update (by serial)" est active. Assurez-vous qu'aucune règle n'empêche l'importation.
        3. Allez dans **Administration > Règles > Règles de moteur OCS Inventory NG**. Vérifiez si des règles spécifiques (comme l'ignorance d'import) ont été créées.

**Problème 3 : L'interface web de GLPI ou OCS est inaccessible (erreur 404 ou 500)**

- **Symptôme :** Le navigateur affiche une erreur "Not Found" ou "Internal Server Error" en essayant d'accéder à http://192.168.100.11/glpi.
- **Cause probable : Problème avec le serveur web Apache.**
    - **Solution :**
        1. Connectez-vous à SRV-GLPI.
        2. Vérifiez le statut du service Apache : systemctl status apache2. S'il n'est pas actif, essayez de le redémarrer : systemctl restart apache2.
        3. Consultez les journaux d'erreurs d'Apache pour des indices plus précis :
            
                  `tail -f /var/log/apache2/error.log`
            
            Cette commande affichera les dernières erreurs en temps réel pendant que vous essayez de rafraîchir la page dans votre navigateur.
            

# 10. Annexes

Cette section regroupe des scripts et des commandes qui peuvent être utiles pour l'administration et l'automatisation de l'infrastructure PARCUS.

## 10.1. Scripts PowerShell utiles

Ces scripts sont destinés à être exécutés sur les serveurs Windows (comme SRV-AD) ou sur les postes clients pour effectuer des tâches d'administration courantes.

### 10.1.1. Script 1 : Forcer la mise à jour des GPO sur une OU

Ce script est utile pour forcer la mise à jour des stratégies de groupe sur tous les ordinateurs d'une unité d'organisation spécifique, sans avoir à se connecter à chaque machine.

- **À exécuter sur :** SRV-AD
- **Prérequis :** Le module PowerShell pour Active Directory doit être disponible.

```powershell
      <#
.SYNOPSIS
    Force la mise à jour des stratégies de groupe (gpupdate /force) sur tous les ordinateurs actifs d'une OU spécifiée.

.DESCRIPTION
    Ce script récupère tous les objets ordinateur d'une OU, vérifie s'ils sont joignables sur le réseau (ping),
    puis exécute à distance la commande 'gpupdate /force'.

.PARAMETER OUPath
    Le chemin distinguishedName de l'Unité d'Organisation cible.
    Exemple: "OU=Postes_Travail,OU=PARCUS_Siege,DC=parcus,DC=local"
#>
param (
    [Parameter(Mandatory=$true)]
    [string]$OUPath
)

# Importe le module Active Directory
Import-Module ActiveDirectory

# Récupère les ordinateurs de l'OU
$computers = Get-ADComputer -Filter * -SearchBase $OUPath

Write-Host "Recherche d'ordinateurs dans l'OU : $OUPath" -ForegroundColor Yellow

foreach ($computer in $computers) {
    $computerName = $computer.Name
    Write-Host "Traitement de l'ordinateur : $computerName" -ForegroundColor Cyan

    # Teste si l'ordinateur est en ligne
    if (Test-Connection -ComputerName $computerName -Count 1 -Quiet) {
        Write-Host "  -> $computerName est en ligne. Lancement de gpupdate..." -ForegroundColor Green
        try {
            # Invoque la commande à distance
            Invoke-GPUpdate -Computer $computerName -Force -RandomDelayInMinutes 0 -ErrorAction Stop
            Write-Host "  -> Commande gpupdate envoyée avec succès." -ForegroundColor Green
        }
        catch {
            Write-Host "  -> ERREUR lors de l'envoi de la commande gpupdate à $computerName." -ForegroundColor Red
            Write-Host "     $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "  -> $computerName est hors ligne ou injoignable." -ForegroundColor Gray
    }
}

Write-Host "Script terminé." -ForegroundColor Yellow
```

**Comment l'utiliser :**

1. Enregistrez le code ci-dessus dans un fichier nommé Invoke-OUGpupdate.ps1 sur SRV-AD.
2. Ouvrez une console PowerShell en tant qu'administrateur.
3. Exécutez le script en spécifiant le chemin de votre OU :
    
    ```powershell
    .\Invoke-OUGpupdate.ps1 -OUPath "OU=Postes_Travail,OU=PARCUS_Siege,DC=parcus,DC=local"
    ```
    

### 10.1.2. Script 2 : Obtenir un rapport rapide sur les ordinateurs du domaine

Ce script génère un rapport simple listant tous les ordinateurs du domaine, leur système d'exploitation et la date de leur dernière ouverture de session.

- **À exécuter sur :** SRV-AD

```powershell
      <#
.SYNOPSIS
    Exporte un rapport CSV des ordinateurs du domaine avec des informations clés.
#>

# Importe le module Active Directory
Import-Module ActiveDirectory

# Chemin où sera sauvegardé le rapport
$reportPath = "C:\Reports\AD_Computers_Report.csv"

# Crée le dossier de rapport s'il n'existe pas
if (-not (Test-Path (Split-Path $reportPath))) {
    New-Item -ItemType Directory -Path (Split-Path $reportPath)
}

# Récupère les informations des ordinateurs et les sélectionne
Get-ADComputer -Filter * -Properties Name, OperatingSystem, LastLogonDate | 
    Select-Object -Property Name, OperatingSystem, LastLogonDate |
    # Exporte le résultat dans un fichier CSV
    Export-Csv -Path $reportPath -NoTypeInformation -Encoding UTF8

Write-Host "Rapport généré avec succès : $reportPath" -ForegroundColor Green
```

**Comment l'utiliser :**

1. Exécutez ce script dans une console PowerShell sur SRV-AD.
2. Un fichier AD_Computers_Report.csv sera créé dans le dossier C:\Reports, que vous pourrez ouvrir avec Excel ou un autre tableur.

## 10.2. Commandes Linux utiles

Cette liste regroupe des commandes essentielles pour la gestion et le dépannage de nos serveurs Debian SRV-GLPI et SRV-RD.

### 10.2.1. **Gestion des services (systemctl)**

systemctl est l'outil central pour gérer les services (démons) sur les systèmes Linux modernes.

- **Vérifier le statut d'un service :**
    
          `# Exemple pour Apache
    systemctl status apache2.service`
    
- **Démarrer un service :**
    
          `systemctl start apache2.service`
    
- **Arrêter un service :**
    
          `systemctl stop apache2.service`
    
- **Redémarrer un service (applique les changements de configuration) :**
    
          `systemctl restart apache2.service`
    
- **Activer un service pour qu'il démarre automatiquement au lancement du système :**
    
          `systemctl enable apache2.service`
    
- **Désactiver le démarrage automatique d'un service :**
    
          `systemctl disable apache2.service`
    

### 10.2.2. Gestion des paquets (apt)

apt (Advanced Package Tool) est le gestionnaire de paquets de Debian.

- **Mettre à jour la liste des paquets disponibles :**
    
          `sudo apt update`
    
- **Mettre à jour tous les paquets installés vers leur dernière version :**
    
          `sudo apt upgrade -y`
    
- **Installer un nouveau paquet :**
    
          `# Exemple pour l'utilitaire 'htop'
    sudo apt install htop -y`
    
- **Supprimer un paquet :**
    
          `sudo apt remove htop -y`
    
- **Supprimer un paquet et ses fichiers de configuration :**
    
          `sudo apt purge htop -y`
    

### 10.2.3. Dépannage réseau

- **Afficher la configuration IP de toutes les interfaces :**
    
          `ip a
    # ou
    ifconfig`
    
- **Tester la connectivité avec une autre machine :**
    
          `ping 192.168.100.10`
    
- **Afficher les ports ouverts et les services en écoute :**
    
          `ss -tuln
    # -t: TCP, -u: UDP, -l: listening, -n: numeric`
    
- **Afficher la table de routage :**
    
          `ip route`
    

### 10.2.4. Gestion des fichiers et permissions

- **Lister les fichiers d'un répertoire avec les détails (permissions, propriétaire, taille) :**
    
          `ls -l /var/www/html/`
    
- **Changer le propriétaire d'un fichier ou d'un dossier :**
    
          `# Change le propriétaire en 'www-data'
    sudo chown www-data /var/www/html/glpi/`
    
- **Changer le propriétaire et le groupe récursivement (-R) :**
    
          `sudo chown -R www-data:www-data /var/www/html/glpi/`
    
- **Changer les permissions d'un fichier :**
    
          `# Donne les droits de lecture/écriture au propriétaire, et lecture seule aux autres
    sudo chmod 644 /etc/rustdesk/id_ed25519.pub`
    

### 10.2.5. Consultation des journaux (logs)

- **Afficher les derniers messages du journal système en temps réel :**
    
          `sudo journalctl -f`
    
- **Afficher les journaux d'un service spécifique :**
    
          `sudo journalctl -u apache2.service`
    
- **Afficher la fin d'un fichier de log en temps réel :**
    
          `sudo tail -f /var/log/apache2/error.log`
    

[Problème rencontrés](https://www.notion.so/Probl-me-rencontr-s-216dbb723a28800eaa9dd5e416d07af4?pvs=21)