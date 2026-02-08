# 🆔 LOT 2 - Déploiement Active Directory, DNS et DHCP

[⬅️ Retour au Menu Livrable 2](../%F0%9F%A7%B0%20LIVRABLE%202%20%E2%80%93%20Documentation%20Technique%202dadbb723a28805eb87fca5c5941ed36.md) ***|*** [🏡 Retour à l'accueil](../../AP3%20Groupe%202%20-%20Samy%20ALBISSER%20&%20Emre%20ALBAYRAK%20265dbb723a28805eaba8c7aa4849492d.md)

***Le Cœur du Système : Identité Centralisée et Services Réseau***

> Avec le réseau en place, ce lot déploie l'intelligence du système d'information : l'annuaire **Active Directory**. Nous avons conçu une architecture distribuée reposant sur **4 contrôleurs de domaine Windows Server 2022**, assurant une redondance totale des services d'authentification (SSO) et de résolution de noms (DNS). L'objectif est double : offrir une expérience utilisateur unifiée (un seul compte pour accéder à tout) et garantir la continuité de service grâce à la mise en place de clusters DHCP autonomes sur chaque site. C'est ici que l'infrastructure devient un véritable environnement de travail professionnel.
> 

---

---

## 0. Plan d'Adressage des Serveurs (LOT 2)

Ce plan détaille les adresses IP statiques qui seront configurées sur les serveurs Windows pour ce lot, en complément du plan d'adressage réseau défini au LOT 1.

| **Site** | **Hôte** | **Rôle** | **OS** | **Interface LAN** | **Interface SAN** |
| --- | --- | --- | --- | --- | --- |
| **Site A** | STG-SRVW01 | DC Principal, DNS, DHCP, DFS 1111 | Win 2022 GUI 2 | 192.168.100.10/24 | 172.16.10.10/24 |
| **Site A** | STG-SRVW02 | DC Secondaire, DNS, DFS 3333 | Win 2022 CORE 4 | 192.168.100.11/24 | 172.16.10.11/24 |
| **Site A** | STG-SAN01 | Stockage iSCSI 55 | TrueNAS Core | - | 172.16.10.20/24 |
| **Site B** | STG2-SRVW01 | DC Suppl., DNS, DHCP (Failover), DFS 6666 | Win 2022 GUI 7 | 192.168.200.10/24 | 172.16.20.10/24 |
| **Site B** | STG2-SRVW02 | DC Suppl., DNS, DFS 8888 | Win 2022 CORE 9 | 192.168.200.11/24 | 172.16.20.11/24 |
| **Site B** | STG2-SAN01 | Stockage iSCSI 1010 | TrueNAS Core | - | 172.16.20.20/24 |

> Note importante : Les adresses IP des serveurs DNS (192.168.100.10, .11 et 192.168.200.10, .11) remplaceront les serveurs DNS temporaires configurés au LOT 1 (pfSense et 10.10.10.1). Ce changement sera déployé via le nouveau service DHCP Windows.
> 

---

## 1. Prérequis et Installation des Serveurs

### 1.1. Objectif Stratégique

> **Objectif**: Préparer les quatre serveurs Windows Server 2022 (deux par site) en installant l'OS et en appliquant une configuration IP statique. Cette étape est le prérequis indispensable au déploiement des services d'annuaire (AD DS), de résolution de noms (DNS) et de distribution d'adresses (DHCP). La configuration inclut des interfaces LAN (pour la communication client/serveur) et SAN (pour le futur stockage iSCSI du LOT 3), assurant ainsi la segmentation des flux. Cette préparation assure également que les serveurs sont prêts à être promus en contrôleurs de domaine pour la forêt unique `IEF.`.
> 

### 1.2. Installation de base (Rappel)

1. Installation de **Windows Server 2022 Standard** sur les 4 VM:
    - `STG-SRVW01` : Version **GUI** (Interface graphique)
    - `STG-SRVW02` : Version **CORE**
    - `STG2-SRVW01` : Version **GUI** (Interface graphique)
    - `STG2-SRVW02` : Version **CORE**
2. Configuration du mot de passe Administrateur local : `P@ssword10`
3. Renommage des serveurs (via `sconfig` sur CORE ou Propriétés Système sur GUI) pour correspondre au plan d'adressage.
4. Configuration du fuseau horaire et activation des mises à jour Windows.

### 1.3. Configuration IP - Site A (STG-SRVW01 et 02)

**Sur STG-SRVW01 (GUI) :**

1. Ouvrir `ncpa.cpl`.
2. **Interface LAN :**
    - Adresse IP : **192.168.100.10**
    - Masque : **255.255.255.0**
    - Passerelle : **192.168.100.1** (pfSense Site A)
    - DNS Préféré : **192.168.100.10** (lui-même, en préparation de la promotion)
    - DNS Auxiliaire : **192.168.100.11** (futur 2e DC)
3. **Interface SAN :**
    - Adresse IP : **172.16.10.10**
    - Masque : **255.255.255.0**
    - Passerelle : (vide)
    - DNS : (vide)

**Sur STG-SRVW02 (CORE) - via `sconfig` :**

1. Lancer `sconfig`
2. Choisir l'option **8) Paramètres réseau**.
3. **Interface LAN :**
    - Adresse IP : **192.168.100.11**
    - Masque : **255.255.255.0**
    - Passerelle : **192.168.100.1**
    - DNS Préféré : **192.168.100.11** (DC Principal)
    - DNS Auxiliaire : **192.168.200.10** (DC Site B)
4. **Interface SAN :**
    - Adresse IP : **172.16.10.11**
    - Masque : **255.255.255.0**
    - Passerelle : (vide)
    - DNS : (vide)

### 1.4. Configuration IP - Site B (STG2-SRVW01 et 02)

**Sur STG2-SRVW01 (GUI) :**

1. Ouvrir `ncpa.cpl`.
2. **Interface LAN :**
    - Adresse IP : **192.168.200.10**
    - Masque : **255.255.255.0**
    - Passerelle : **192.168.200.1** (pfSense Site B)
    - DNS Préféré : **192.168.100.10** (DC Principal Site A)
    - DNS Auxiliaire : **192.168.200.11** (futur 2e DC local)
3. **Interface SAN :**
    - Adresse IP : **172.16.20.10**
    - Masque : **255.255.255.0**
    - Passerelle : (vide)
    - DNS : (vide)

**Sur STG2-SRVW02 (CORE) - via `sconfig` :**

1. Lancer `sconfig`
2. Choisir l'option **8) Paramètres réseau**.
3. **Interface LAN :**
    - Adresse IP : **192.168.200.11**
    - Masque : **255.255.255.0**
    - Passerelle : **192.168.200.1**
    - DNS Préféré : **192.168.200.11** (DC Principal Site A)
    - DNS Auxiliaire : **192.168.200.10** (DC local Site B)
4. **Interface SAN :**
    - Adresse IP : **172.16.20.11**
    - Masque : **255.255.255.0**
    - Passerelle : (vide)
    - DNS : (vide)

### 1.5. Désactivation DHCP sur pfSense (Rappel LOT 1)

> Action Requise : Avant d'activer le DHCP Windows, il est impératif de désactiver le service DHCP temporaire sur les deux routeurs pfSense pour éviter les conflits.
> 
1. Connectez-vous à l'interface web de **RTE-STG01 (192.168.100.1)** et **RTE2-STG01 (192.168.200.1)**.
2. Allez dans **Services → DHCP Server → LAN**.
3. **Décochez** la case "Enable DHCP server on LAN interface".
4. Sauvegardez les modifications.

---

## 2. Déploiement Active Directory (Site A)

### 2.1. Objectif

> 
> 
> 
> **Objectif**: Créer le cœur du système d'information en installant le premier contrôleur de domaine (`STG-SRVW01`). Cette action crée la nouvelle forêt Active Directory `IEF.LOCAL` et installe le service DNS intégré. L'ajout du second serveur (`STG-SRVW02`) en tant que contrôleur de domaine secondaire assure la **haute disponibilité locale** sur le Site A pour l'authentification (SSO) et la résolution de noms, conformément à la répartition des rôles.
> 

### 2.2. Installation du rôle AD DS (STG-SRVW01)

1. Ouvrir le **Gestionnaire de serveur**.
2. Cliquer sur **Ajouter des rôles et fonctionnalités**.
3. Type d'installation : **Installation basée sur un rôle ou une fonctionnalité**.
4. Sélectionner le serveur `STG-SRVW01`.
5. Cocher le rôle **Services AD DS** (Active Directory Domain Services).
6. Accepter l'ajout des fonctionnalités requises (Outils de gestion, etc.).
7. Cocher le rôle **Serveur DHCP**.
8. Cocher le rôle **Serveur DNS** (normalement coché automatiquement avec AD DS).
9. Valider et **Installer**.

### 2.3. Promotion de STG-SRVW01 (Contrôleur Principal)

1. Après l'installation, cliquer sur le drapeau de notification dans le Gestionnaire de serveur.
2. Cliquer sur **Promouvoir ce serveur en contrôleur de domaine**.
3. Sélectionner **Ajouter une nouvelle forêt**.
4. Nom de domaine racine : **IEF.LOCAL**
    
    ```powershell
    Name "IEF.LOCAL" -Credential $cred -SafeModeAdministratorPassword $pass -InstallDns:$true -Force
    ```
    
5. Niveau fonctionnel : Laisser **Windows Server 2016** (par défaut pour 2022).
6. Vérifier que **Serveur DNS** et **Catalogue Global (GC)** sont cochés.
7. Entrer le mot de passe de restauration DSRM : **P@ssword10**
8. Ignorer l'avertissement de délégation DNS.
9. Nom NetBIOS : **IEF** (laisser par défaut)
10. Chemins : Laisser par défaut (sur C:).
11. Vérifier les options et lancer l'installation. Le serveur redémarrera automatiquement.

### 2.4. Ajout de STG-SRVW02 (Contrôleur Secondaire - Core)

1. Sur `STG-SRVW02` (session Administrateur), ouvrir **PowerShell**.
2. Installer le rôle AD DS :
    
    ```powershell
    Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools
    ```
    
    ### Étape 3 : Préparer les identifiants (La méthode propre)
    
    On va stocker ton login et ton mot de passe de secours dans des "variables" pour ne pas alourdir la commande finale.
    
    1. Tape cette ligne et valide :
        
        ```powershell
        $cred = Get-Credential
        ```
        
        *Une fenêtre s'ouvre : tape `IEF\Administrateur` et ton mot de passe.*
        
    2. Tape cette ligne et valide :
        
        ```powershell
        $pass = ConvertTo-SecureString "P@ssword10" -AsPlainText -Force
        ```
        
        *(Ça stocke le mot de passe de restauration DSRM).*
        
3. Promouvoir le serveur (adapter les identifiants si nécessaire) :
    
    ```powershell
    Install-ADDSDomainController -DomainName "IEF.LOCAL" -Credential $cred -SafeModeAdministratorPassword $pass -InstallDns:$true -Force
    ```
    
    > Note : Le mot de passe DSRM doit être entré manuellement (P@ssword10). Le serveur redémarrera automatiquement.
    > 

---

## 3. Déploiement Active Directory (Site B)

### 3.1. Objectif

> 
> 
> 
> **Objectif**: Étendre la forêt `IEF.LOCAL` au site distant (Strasbourg Somme) en ajoutant deux contrôleurs de domaine supplémentaires (`STG2-SRVW01` et `STG2-SRVW02`). Cette action crée un **système d'information unifié et hautement disponible**. Les utilisateurs du Site B pourront s'authentifier localement même en cas de coupure du VPN IPsec (LOT 1), garantissant ainsi la continuité d'activité et la redondance des services, objectifs clés du projet.
> 

### 3.2. Configuration des Sites AD

Avant de promouvoir les serveurs du Site B, il est crucial de définir les sites et sous-réseaux pour optimiser la réplication.

1. Sur `STG-SRVW01` (Site A), ouvrir **Sites et services Active Directory**.
2. Renommer `Default-First-Site-Name` en **VAUBAN**.
3. Clic droit sur Sites → **Nouveau site...**
    - Nom : **SOMME**
    - Lien : `DEFAULTIPSITELINK`
4. Clic droit sur Subnets → **Nouveau sous-réseau...**
    - Préfixe : **192.168.100.0/24**
    - Site : **VAUBAN**
5. Clic droit sur Subnets → **Nouveau sous-réseau...**
    - Préfixe : **192.168.200.0/24**
    - Site : **SOMME**

### 3.3. Ajout de STG2-SRVW01 (Contrôleur Supplémentaire - GUI)

1. Sur `STG2-SRVW01`, installer le rôle **Services AD DS** (cf. étape 2.2).
2. **Promouvoir** le serveur en contrôleur de domaine.
3. Sélectionner **Ajouter un contrôleur de domaine à un domaine existant**.
4. Domaine : **IEF.LOCAL**
5. Fournir les identifiants d'un administrateur du domaine (ex: `IEF\Administrateur`).
6. Vérifier que **DNS** et **Catalogue Global (GC)** sont cochés.
7. Sélectionner le nom de site : **SOMME**.
8. Mot de passe DSRM : **P@ssword**
9. Installer depuis : `STG-SRVW01.ief.local` (ou `Any domain controller`).
10. Valider et installer. Le serveur redémarrera.

### 3.4. Ajout de STG2-SRVW02 (Contrôleur Supplémentaire - Core)

1. Sur `STG2-SRVW02`, ouvrir **PowerShell** et installer le rôle AD DS.
2. Promouvoir le serveur :
    
    ```powershell
    $cred = Get-Credential
    $pass = ConvertTo-SecureString "P@ssword10" -AsPlainText -Force
    Install-ADDSDomainController -DomainName "IEF.LOCAL" -Credential $cred -SafeModeAdministratorPassword $pass -SiteName "SOMME" -InstallDns:$true -Force
    ```
    
3. Le serveur redémarrera.

### 3.5 Difficultés Rencontrées et Résolution

**Incidence Majeure : Échec de la promotion du Contrôleur de Domaine Site B**

- **Impact :** Arrêt de la production pendant 24 heures.
- **Symptôme :** Impossibilité pour le serveur `STG2-SRVW01` (Site B) de rejoindre le domaine `IEF.LOCAL` ou d'être promu Contrôleur de Domaine à travers le VPN IPsec.
- **Erreurs rencontrées :**
    - *Code 1722 : Le serveur RPC n'est pas disponible.*
    - *Code 50 : La demande n'est pas prise en charge (The request is not supported).*
    - *Échec de la relation d'approbation (Trust Relationship).*

Démarche de Diagnostic et Actions Entreprises :

Face à ces erreurs indiquant des problèmes de communication réseau à travers le tunnel VPN, une procédure de dépannage exhaustive a été menée pour isoler la cause (Réseau vs Système) :

1. **Validation de la connectivité Réseau (Couche 3 & 4) :**
    - Tests Ping et résolution DNS : **Succès**.
    - Tests de port (`Test-NetConnection`) sur les ports critiques AD (88, 389, 445, 135) : **Succès (True)**.
    - Cela a permis d'écarter un blocage "simple" de pare-feu.
2. **Hypothèse de la fragmentation (MTU/VPN) :**
    - Suspicion de paquets UDP Kerberos trop volumineux pour le tunnel IPsec (problème classique de fragmentation).
    - **Actions :** Activation du *MSS Clamping* (1300 puis 1200) sur les pare-feux pfSense, désactivation du *Hardware Checksum Offloading* sur les interfaces virtuelles pfSense, et tentatives de forçage du protocole Kerberos sur TCP via le registre Windows (`MaxPacketSize`).
3. **Hypothèse de l'identité Active Directory :**
    - Nettoyage complet des métadonnées (Metadata Cleanup) sur le Contrôleur Principal (Site A).
    - Multiples tentatives de "Reset" de l'identité du serveur (Workgroup > Reboot > Domain).
    - Renommage du serveur (`STG2-TEMP`) pour forcer une nouvelle identification SID.
4. **Hypothèse de l'environnement Virtuel (Proxmox/VirtIO) :**
    - Désactivation des options de délestage matériel (*Hardware Offloading*) sur les cartes réseaux virtuelles Windows.
    - Désactivation de l'IPv6 pour éviter les conflits de résolution DNS sur le tunnel IPv4.

**Résolution Finale et Cause Racine :**

Malgré la validation de tous les prérequis réseau et l'application des correctifs recommandés par Microsoft et Netgate, l'erreur persistait sur cette machine spécifique.

La décision a été prise de **reconstruire intégralement la machine virtuelle** (Clean Install) en appliquant uniquement les bonnes pratiques réseau de base (IP fixe, DNS correct, IPv6 désactivé).

- **Résultat :** La nouvelle VM a rejoint le domaine et a été promue Contrôleur de Domaine **immédiatement et sans erreur**, sans nécessiter les modifications avancées (Registre/Offloading) tentées précédemment.
- **Conclusion :** L'incident a été causé par une **corruption irréversible de la pile réseau ou du système d'exploitation de la VM initiale**, rendant le débogage inopérant. L'infrastructure réseau (pfSense/VPN), une fois corrigée (Checksum Offload), était fonctionnelle.

---

## 4. Configuration des Objets Active Directory

### 4.1. Objectif

> 
> 
> 
> **Objectif**: Structurer l'annuaire Active Directory en créant les Unités d'Organisation (UO), les groupes et les utilisateurs spécifiés dans l'**Annexe 2** du cahier des charges. Cette structure permet une gestion centralisée des permissions, une délégation d'administration et la future application des stratégies de groupe (GPO) du LOT 4.
> 

### 4.2. Création des Unités d'Organisation (UO)

1. Sur `STG-SRVW01`, ouvrir **Utilisateurs et ordinateurs Active Directory**.
2. Clic droit sur `IEF.LOCAL` → Nouveau → **Unité d'organisation**.
3. Nom : **VAUBAN**
4. Clic droit sur `IEF.LOCAL` → Nouveau → **Unité d'organisation**.
5. Nom : **SOMME**

### 4.3. Création des Groupes et Utilisateurs

1. **Créer les utilisateurs :**
    - Clic droit sur l'UO **VAUBAN** → Nouveau → **Utilisateur**
        - Prénom : `Paul` (Login : `paul`)
        - Prénom : `Pierre` (Login : `pierre`)
    - Clic droit sur l'UO **SOMME** → Nouveau → **Utilisateur**
        - Prénom : `Isabelle` (Login : `isabelle`)
        - Prénom : `Nathalie`  (Login : `nathalie`)
    - Clic droit sur `Users` (ou une UO d'administration) → Nouveau → **Utilisateur**
        - Nom : `ADMIN` (Admin de secours)
    - 
        
        Note : Définir un mot de passe temporaire (ex: `P@ssword10`) et cocher "L'utilisateur doit changer le mot de passe à la prochaine connexion".
        
2. **Créer les groupes :**
    - Clic droit sur l'UO **VAUBAN** → Nouveau → **Groupe**
        - Nom du groupe : **GRP1** (Étendue : Globale, Type : Sécurité)
    - Clic droit sur l'UO **SOMME** → Nouveau → **Groupe**
        - Nom du groupe : **GRP2** (Étendue : Globale, Type : Sécurité)
3. **Ajouter les membres :**
    - Ouvrir les propriétés de **GRP1** → onglet Membres → Ajouter `Paul` et `Pierre`.
    - Ouvrir les propriétés de **GRP2** → onglet Membres → Ajouter `Isabelle` et `Nathalie`.
    - Ajouter l'utilisateur `ADMIN` au groupe **Administrateurs du Domaine**.

### 4.4. Vérification de la Réplication AD

1. Attendre quelques minutes que la réplication initiale se termine.
2. Sur n'importe quel DC (ex: `STG2-SRVW01`), ouvrir **Utilisateurs et ordinateurs Active Directory** et vérifier que les UO `VAUBAN` et `SOMME` ainsi que tous les utilisateurs sont présents.
3. Sur `STG-SRVW01`, ouvrir une invite de commande et exécuter :
    
    ```powershell
    repadmin /showrepl
    ```
    
4. Vérifier que les réplications entrantes et sortantes avec les 3 autres DC sont "réussies" et sans erreur.

### 4.5 Difficultés Rencontrées et Résolution

**1. Latence de Réplication Inter-Sites**

- **Problème :** Après la promotion, les objets Active Directory (UO, Utilisateurs) n'apparaissaient pas immédiatement sur le nouveau contrôleur de domaine, et la commande `repadmin /showrepl` ne montrait pas les partenaires de réplication distants.
- **Analyse :** Ce comportement est nominal. La réplication Active Directory entre deux sites distincts (liens IPsec) obéit à une planification par défaut de 15 minutes, contrairement à la réplication intra-site qui est quasi-instantanée. De plus, le processus KCC (*Knowledge Consistency Checker*) n'avait pas encore recalculé la topologie de réplication incluant le nouveau serveur.
- **Résolution :** Force du recalcul de la topologie et de la synchronisation pour valider le fonctionnement immédiat via les commandes :
    - `repadmin /kcc` (Recalcul de la topologie).
    - `repadmin /syncall /AdeP` (Synchronisation forcée de toutes les partitions).
    - **Validation :** La réplication est désormais fonctionnelle et bidirectionnelle entre les sites VAUBAN et SOMME.

---

## 5. Configuration du service DHCP et Basculement

### 5.1. Objectif (Révisé)

> Objectif: Mettre en place un service DHCP centralisé et hautement disponible. Suite à la revue de projet, l'architecture a été modifiée pour adopter une Haute Disponibilité Intra-Site. Chaque site dispose d'un cluster DHCP autonome composé du serveur GUI (Principal) et du serveur CORE (Secondaire) en répartition de charge (Load Balancing 50/50). Cette configuration garantit que la distribution d'IP reste fonctionnelle localement même en cas de coupure du lien VPN inter-sites.
> 

### 5.2. Installation du Rôle DHCP

1. Installer le rôle **Serveur DHCP** sur les **4 serveurs** (y compris les CORE `STG-SRVW02` et `STG2-SRVW02`).
    - Commande PowerShell pour les Core : `Install-WindowsFeature DHCP -IncludeManagementTools`
2. Sur chaque serveur, **Autoriser** le DHCP dans l'Active Directory.
    - Commande PowerShell : `Add-DhcpServerInDC -DnsName "NOM_DU_SERVEUR" -IPAddress IP_DU_SERVEUR`

### 5.3. Configuration Site A (Vauban)

**Sur STG-SRVW01 (GUI) :**

1. Ouvrir la console DHCP.
2. Créer l'étendue :
    - Nom : `LAN_SiteA_Vauban`
    - Plage : **192.168.100.100** à **192.168.100.200**
    - Masque : **255.255.255.0**
    - Options : Routeur `192.168.100.1`, DNS `192.168.100.10`, `192.168.100.11`.
3. Configurer le basculement (Failover) :
    - Clic droit sur l'étendue → **Configurer le basculement**.
    - Serveur partenaire : **`STG-SRVW02.IEF.LOCAL`** (Le Core du même site).
    - Mode : **Équilibrage de charge (50% / 50%)**.
    - Secret : `P@ssword10`.

### 5.4. Configuration Site B (Somme)

**Sur STG2-SRVW01 (GUI) :**

1. Ouvrir la console DHCP.
2. Créer l'étendue :
    - Nom : `LAN_SiteB_Somme`
    - Plage : **192.168.200.100** à **192.168.200.200**
    - Masque : **255.255.255.0**
    - Options : Routeur `192.168.200.1`, DNS `192.168.200.10`, `192.168.200.11`.
3. Configurer le basculement (Failover) :
    - Clic droit sur l'étendue → **Configurer le basculement**.
    - Serveur partenaire : **`STG2-SRVW02.IEF.LOCAL`** (Le Core du même site).
    - Mode : **Équilibrage de charge (50% / 50%)**.
    - Secret : `P@ssword10`.

### 5.5. Vérification Finale

Sur les serveurs CORE (`STG-SRVW02` et `STG2-SRVW02`), exécuter la commande :

PowerShell

`Get-DhcpServerv4Failover`

- Résultat attendu : `State : Normal`.

---

## 6. Résumé de la Configuration (LOT 2)

### 6.1. État des Contrôleurs de Domaine

| **Hôte** | **Site** | **Rôles** | **OS** | **État** |
| --- | --- | --- | --- | --- |
| **STG-SRVW01** | VAUBAN | DC Principal, DNS, DHCP, GC | GUI | ✅ Opérationnel |
| **STG-SRVW02** | VAUBAN | DC Secondaire, DNS, GC | CORE | ✅ Opérationnel |
| **STG2-SRVW01** | SOMME | DC Supplémentaire, DNS, DHCP (Failover), GC | GUI | ✅ Opérationnel |
| **STG2-SRVW02** | SOMME | DC Supplémentaire, DNS, GC | CORE | ✅ Opérationnel |

### 6.2. Configuration DHCP (Site A)

| **Paramètre** | **Valeur** |
| --- | --- |
| Étendue | 192.168.100.100 - 192.168.100.200 |
| Passerelle | 192.168.100.1 |
| Serveurs DNS | 192.168.100.10, 192.168.100.11 |
| Domaine | IEF.LOCAL |
| Basculement | Actif (Load Balance 50% vers STG2-SRVW01) |

### 6.3. Configuration DHCP (Site B)

| **Paramètre** | **Valeur** |
| --- | --- |
| Étendue | 192.168.200.100 - 192.168.200.200 |
| Passerelle | 192.168.200.1 |
| Serveurs DNS | 192.168.200.10, 192.168.200.11 |
| Domaine | IEF.LOCAL |
| Basculement | Actif (Load Balance 50% vers STG2-SRVW01) |

### 6.4. Revue Critique de l'Architecture et Corrections (Feedback Oral 1)

Suite à la présentation intermédiaire et aux tests de charge, deux erreurs de conception majeures ont été identifiées dans la configuration initiale. Ces points bloquants ont nécessité une refonte partielle de l'architecture pour garantir la conformité avec les bonnes pratiques Microsoft et la résilience du réseau.

### 1. Configuration DNS des Contrôleurs de Domaine (Loopback)

- Erreur Initiale :
    
    La configuration DNS des cartes réseaux des serveurs STG-SRVW01 et STG2-SRVW01 pointait vers l'adresse de bouclage 127.0.0.1 en tant que DNS préféré.
    
- Impact Technique (Point Bloquant) :
    
    Bien que fonctionnelle pour des tests isolés, cette configuration posait des problèmes critiques lors du démarrage des services et de la réplication Active Directory. Le service Netlogon tentait de s'enregistrer avant que la zone DNS locale ne soit complètement chargée, créant des "îlots" de réplication et des erreurs dans les journaux d'événements. De plus, cela complexifiait la résolution de nom lors des communications initiales via le VPN.
    
- Correction Appliquée :
    
    Nous avons remplacé l'adresse 127.0.0.1 par l'adresse IP LAN statique réelle du serveur (ex: 192.168.100.10 pour le Site A).
    
    - **DNS Préféré :** Adresse IP réelle du serveur lui-même.
    - DNS Auxiliaire : Adresse IP du second contrôleur de domaine (pour la redondance).
        
        Cette modification a stabilisé la réplication et supprimé les avertissements DNS au démarrage.
        

### 2. Architecture du Basculement DHCP (Failover)

- Erreur Initiale :
    
    L'architecture initiale prévoyait un basculement DHCP Inter-Sites (le serveur du Site A secourait le Site B, et inversement) à travers le tunnel VPN IPsec.
    
- Impact Technique (Point Bloquant) :
    
    Cette conception créait une dépendance forte et dangereuse au lien WAN (VPN).
    
    - En cas de coupure du VPN (panne routeur ou internet), les requêtes DHCP de secours ne pouvaient pas traverser le réseau (le broadcast DHCP ne passe pas les routeurs sans relais complexe).
    - Le Site B risquait de se retrouver sans distribution d'IP, paralysant l'activité locale alors que les serveurs locaux étaient pourtant allumés.
- Correction Appliquée :
    
    Nous avons migré vers une architecture de Haute Disponibilité Intra-Site (Locale).
    
    - **Action :** Installation du rôle DHCP sur les serveurs **CORE** (`STG-SRVW02` et `STG2-SRVW02`), ce qui n'était pas prévu initialement.
    - **Résultat :** Le basculement se fait désormais entre le serveur GUI et le serveur CORE **du même site**.
    - **Bénéfice :** Chaque site est désormais **totalement autonome**. Même en cas de coupure totale d'Internet ou du VPN, les clients de Strasbourg Somme continuent de recevoir des IP grâce à leur cluster DHCP local.

---

## 7. Évolutions prévues pour le LOT 3

### 7.1. Objectif

> 
> 
> 
> **Objectif**: Le LOT 3 se concentrera sur le déploiement des services de fichiers et de sauvegarde, s'appuyant sur l'infrastructure AD et réseau des LOT 1 et 2. Les prochaines étapes incluront l'installation des serveurs **TrueNAS Core** (`STG-SAN01` et `STG2-SAN01`), la configuration des **cibles iSCSI**, et le montage de ces cibles sur les serveurs Windows. Par la suite, nous déploierons le **DFS (Système de fichiers distribués)** avec l'espace de noms `\\IEF.LOCAL\INTRANET` et la **réplication DFSR en maille pleine**  entre les 4 serveurs. Enfin, nous configurerons la **sauvegarde** et les **clichés instantanés (Shadow Copy)**.
> 

### 7.2. Checklist de validation LOT 2

- [✓] 4 serveurs Windows Server 2022 installés (2 GUI, 2 CORE)
- [✓] Adressage IP statique configuré (DNS pointant sur contrôleurs locaux)
- [✓] Forêt `IEF.LOCAL` créée et fonctionnelle
- [✓] Sites AD (VAUBAN, SOMME) configurés et réplication validée
- [✓] Objets AD (UO, Utilisateurs, Groupes) créés selon l'Annexe 2
- [✓] Rôles DHCP installés sur les 4 serveurs (GUI + Core)
- [✓] Étendues DHCP créées et configurées en Failover Intra-Site (Load Balance)
- [✓] Résolution des incidents majeurs (VM Site B, VPN) documentée

---

**FIN DU LOT 2**

[⬅️ LOT précédent](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site%20265dbb723a288029aa20c559195d8225.md) | [📂 Menu Livrable 2](../%F0%9F%A7%B0%20LIVRABLE%202%20%E2%80%93%20Documentation%20Technique%202dadbb723a28805eb87fca5c5941ed36.md) | [➡️ LOT suivant](%F0%9F%92%BE%20LOT%203%20-%20Configuration%20du%20Stockage%20(SAN%20NAS)%20et%20S%202c0dbb723a288006830ed1d4babe9b74.md)