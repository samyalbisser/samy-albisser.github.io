# 🌐 LOT 1 - Configuration Réseau et VPN Site-à-Site

[⬅️ Retour au Menu Livrable 2](../%F0%9F%A7%B0%20LIVRABLE%202%20%E2%80%93%20Documentation%20Technique%202dadbb723a28805eb87fca5c5941ed36.md) ***|*** [🏡 Retour à l'accueil](../../AP3%20Groupe%202%20-%20Samy%20ALBISSER%20&%20Emre%20ALBAYRAK%20265dbb723a28805eaba8c7aa4849492d.md)

***Le Socle de l'Infrastructure : Interconnexion et Réseau |***

> Ce premier lot constitue la fondation technique du projet. Avant de déployer les services utilisateurs, nous avons construit une **infrastructure réseau robuste et sécurisée** reliant les sites distants de Strasbourg Vauban et Somme. En s'appuyant sur la solution open-source **pfSense** et le protocole standard **IPsec**, nous avons établi un tunnel VPN chiffré permanent, transformant deux réseaux physiques distincts en une entité logique unique. Cette architecture garantit non seulement la communication transparente entre les serveurs, mais prépare également le terrain pour la réplication des données et la haute disponibilité visée par le cahier des charges.
> 

---

---

## 0. Plan d'Adressage Global

| Site | Interface | Réseau | IP pfSense | Description |
| --- | --- | --- | --- | --- |
| **Site A** | WAN | 192.168.42.0/24 | 192.168.42.40 | Connexion Internet |
| **Site A** | LAN | 192.168.100.0/24 | 192.168.100.1 | Réseau clients/serveurs |
| **Site A** | SAN | 172.16.10.0/24 | 172.16.10.1 | Réseau stockage iSCSI |
| **Site B** | WAN | 192.168.42.0/24 | 192.168.42.41 | Connexion Internet |
| **Site B** | LAN | 192.168.200.0/24 | 192.168.200.1 | Réseau clients/serveurs |
| **Site B** | SAN | 172.16.20.0/24 | 172.16.20.1 | Réseau stockage iSCSI |

> **Note importante** : Le DNS de l'école (10.10.10.1) est configuré dans le DHCP Server. Cette configuration est temporaire pour le LOT 1. Au LOT 2, le DHCP sera géré par Windows Server et les clients recevront les adresses des contrôleurs de domaine Active Directory comme serveurs DNS.
> 

---

## 1. Configuration pfSense Site A

**Objectif**: Déployer et configurer le routeur/pare-feu pfSense RTE-STG01 du site principal de Strasbourg Vauban avec trois interfaces réseau distinctes (WAN 192.168.42.0/24, LAN 192.168.100.0/24, SAN 172.16.10.0/24) pour assurer la segmentation réseau, la sécurité périmétrique et servir de point de terminaison VPN IPsec inter-sites. Cette configuration permet d'isoler les flux de données utilisateurs (LAN), les flux de stockage iSCSI (SAN) et les connexions Internet (WAN), conformément aux exigences du cahier des charges visant la création d'un système d'information hautement disponible. Le service DHCP temporaire (plage 192.168.100.20 à .200) et le DNS forwarding vers le serveur de l'école (10.10.10.1) permettent aux clients d'accéder immédiatement à Internet en attendant le déploiement de l'Active Directory au LOT 

![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image.png)

### 1.1. Configuration réseau initiale (console)

1. Appuyez sur **2** pour configurer les interfaces
2. Sélectionnez l'interface **LAN (2)**
3. Configure IPv4 address LAN interface via DHCP ? → **n**
4. Entrez l'adresse IP : **192.168.100.1**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%201.png)
    
5. Masque : **24**
6. Appuyez sur Entrée
7. Configurer IPv6 avec DHCP6 (selon besoins)
8. Enable DHCP server on LAN ? → **Oui**
9. Plage DHCP :
    - Début : **192.168.100.20**
    - Fin : **192.168.100.200**
10. Validez la configuration
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%202.png)
    
    L'interface WAN obtient automatiquement l'IP 192.168.42.11
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%203.png)
    

### 1.2. Assignation interface SAN (console)

1. Appuyez sur **1** (Assign Interfaces)
2. Do VLANs need to be set up first ? → **n**
3. Should VLANs be set up now ? → **n**
4. Enter the WAN interface name → **vtnet0**
5. Enter the LAN interface name → **vtnet1**
6. Enter the Optional 1 interface name → **vtnet2**
7. Enter the Optional 2 interface name → **Entrée** (vide)
8. Do you want to proceed ? → **y**

### 1.3. Configuration interface SAN (console)

1. Appuyez sur **2** (Set interface IP address)
2. Sélectionnez **3** (OPT1)
3. Configure IPv4 address via DHCP ? → **n**
4. Enter the new IPv4 address → **172.16.10.1**
5. Enter the new subnet bit count → **24**
6. Appuyez sur Entrée pour les autres options
7. Configure IPv6 via DHCP6 ? → **n**
8. Enable DHCP server on OPT1 ? → **n**
9. Revert to HTTP ? → **n**

> Note : L'interface WAN obtient automatiquement l'IP 192.168.42.40
> 

### 1.4. Accès interface web

1. Sur une machine cliente du réseau LAN, ouvrez un navigateur
2. Accédez à : [**http://192.168.100.1**](http://192.168.100.1/)
3. Identifiants par défaut :
    - Username : **admin**
    - Password : **pfsense**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%204.png)
    

### 1.5. Renommage interface SAN (Interface Web)

1. Allez dans **Interfaces → OPT1**
2. Cochez **Enable interface**
3. Description : **SAN**
4. Configuration IPv4 Type : **Static IPv4**
5. IPv4 Address : **172.16.10.1 / 24**
6. **Save** puis **Apply Changes**

### 1.6. Configuration DNS dans le DHCP Server

1. Allez dans **Services → DHCP Server**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%205.png)
    

Onglet **LAN**

1. Scrollez jusqu'à la section **Servers**
2. Dans le champ **DNS Servers** :
    - DNS Server 1 : **192.168.100.1** (pfSense - temporaire pour LOT 1)
    - DNS Server 2 : **10.10.10.1** (DNS de l'école - fallback)
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%206.png)
        
3. **Save**
4. **Apply Changes**

> **Note importante :** Cette configuration DNS est temporaire pour le LOT 1. pfSense agit comme relais DNS vers l'école (10.10.10.1). Au LOT 2, les clients DHCP seront gérés par Windows Server et recevront directement les adresses des contrôleurs de domaine comme serveurs DNS (ex: 192.168.100.10, 192.168.100.11).
> 

### 1.7. Configuration DNS Resolver

Allez dans **Services → DNS Resolver**

![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%207.png)

1. **Enable DNS Resolver** : ✓ (coché)
2. **Listen Port** : 53
3. **Network Interfaces** : Sélectionnez **LAN** et **localhost**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%208.png)
    
4. **Outgoing Network Interfaces** : Sélectionnez **WAN**
5. **DNSSEC** : ✓ (coché - recommandé)
6. **DNS Query Forwarding** : ✓ (coché)
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%209.png)
    
7. **Save**
8. **Apply Changes**

---

## 2. Configuration pfSense Site B

**Objectif**: Mettre en place le routeur/pare-feu pfSense RTE2-STG01 du site secondaire de Strasbourg Somme avec une architecture réseau miroir du Site A mais adaptée au plan d'adressage du second site (WAN 192.168.42.0/24, LAN 192.168.200.0/24, SAN 172.16.20.0/24). Cette configuration identique garantit l'harmonisation du plan d'adressage et de nommage sur l'ensemble des sites, objectif stratégique du projet permettant la facilité d'administration par la DSI et la préparation de la redondance des services. Le DHCP (plage 192.168.200.20 à .200) et le DNS forwarding assurent la connectivité Internet temporaire avant l'intégration au domaine Active Directory IEF.LOCAL qui sera déployé au LOT 2.

### 2.1. Configuration réseau initiale (console)

1. Appuyez sur **2**
2. Sélectionnez **LAN (2)**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2010.png)
    
3. Configure IPv4 via DHCP ? → **n**
4. Adresse IP : **192.168.200.1**
5. Masque : **24**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2011.png)
    
6. Enable DHCP server → **Oui**
7. Plage DHCP :
    - Début : **192.168.200.20**
    - Fin : **192.168.200.200**
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2012.png)
        
        **Note :** L'interface WAN obtient l'IP 192.168.42.41
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2013.png)
        

### 2.2. Assignation interface SAN (console)

1. Appuyez sur **1**
2. Do VLANs need to be set up first ? → **n**
3. Should VLANs be set up now ? → **n**
4. Enter the WAN interface name → **vtnet0**
5. Enter the LAN interface name → **vtnet1**
6. Enter the Optional 1 interface name → **vtnet2**
7. Enter the Optional 2 interface name → **Entrée**
8. Do you want to proceed ? → **y**

### 2.3. Configuration interface SAN (console)

1. Appuyez sur **2**
2. Sélectionnez **3** (OPT1)
3. Configure IPv4 via DHCP ? → **n**
4. Adresse IP : **172.16.20.1**
5. Masque : **24**
6. Enable DHCP server on OPT1 ? → **n**
7. Validez

> Note : L'interface WAN obtient l'IP 192.168.42.41
> 

### 2.4. Accès interface web

1. Sur une machine cliente du réseau LAN, ouvrez un navigateur
2. Accédez à : [http://192.168.200.1](http://192.168.200.1/)
3. Identifiants par défaut :
    - Username : **admin**
    - Password : **pfsense**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2014.png)
    

### 2.5. Renommage interface SAN (Interface Web)

1. **Interfaces → OPT1**
2. Enable interface + Description : **SAN**
3. IPv4 : **172.16.20.1 / 24**
4. **Save** et **Apply Changes**

![image.png]

### 2.6. Configuration DNS dans le DHCP Server

1. **Services → DHCP Server**
2. Onglet **LAN**
3. **DNS Servers** :
    - DNS Server 1 : **192.168.200.1** (pfSense - temporaire pour LOT 1)
    - DNS Server 2 : **10.10.10.1** (DNS de l'école - fallback)
4. **Save** et **Apply Changes**

### 2.7. Configuration DNS Resolver

1. Allez dans **Services → DNS Resolver**
2. **Enable DNS Resolver** : ✓ (coché)
3. **Listen Port** : 53
4. **Network Interfaces** : Sélectionnez **LAN** et **localhost**
5. **Outgoing Network Interfaces** : Sélectionnez **WAN**
6. **DNSSEC** : ✓ (coché - recommandé)
7. **DNS Query Forwarding** : ✓ (coché)
8. **Save**
9. **Apply Changes**

---

## 3. Configuration Tunnel IPsec

**Objectif**: Établir une liaison WAN inter-sites chiffrée via un tunnel VPN IPsec entre les deux sites distants de Strasbourg (Vauban et Somme) pour créer un réseau étendu sécurisé permettant la communication transparente entre les réseaux locaux comme s'ils étaient sur un même site. Cette connexion inter-sites répond directement à l'objectif n°2 du cahier des charges et respecte les recommandations de sécurité de l'ANSSI (AES-256-GCM pour le chiffrement, SHA256 pour l'intégrité, Diffie-Hellman groupe 14 minimum). Les deux Phase 2 configurées permettent le passage des flux LAN (192.168.100.0/24 vers 192.168.200.0/24) pour la communication inter-utilisateurs et des flux SAN (172.16.10.0/24 vers 172.16.20.0/24) pour la réplication des données de stockage iSCSI entre STG-SAN01 et STG2-SAN01, essentielle à la haute disponibilité et au plan de continuité d'activité (PCA).

### 3.1. Phase 1 - Site A

1. Allez dans **VPN → IPsec**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2015.png)
    
2. Cliquez **Add P1**
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2016.png)
    
3. Configurez :
    - **Key Exchange version** : IKEv2
    - **Remote Gateway** : 192.168.42.41
    - **Authentication Method** : Mutual PSK
    - **Pre-Shared Key** : P@ssw0rd
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2017.png)
        
    - **Encryption Algorithm** : AES (256 bits)
    - **Hash Algorithm** : SHA256
    - **DH Group** : 14 (2048 bits)
    - **Lifetime** : 28800
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2018.png)
        
4. **Save**

### 3.2. Phase 1 - Site B

1. **VPN → IPsec → Add P1**
2. Configurez (identique au Site A sauf Remote Gateway) :
    - **Key Exchange version** : IKEv2
    - **Remote Gateway** : 192.168.42.40
    - **Authentication Method** : Mutual PSK
    - **Pre-Shared Key** : P@ssw0rd
    - **Encryption Algorithm** : AES (256 bits)
    - **Hash Algorithm** : SHA256
    - **DH Group** : 14 (2048 bits)
    - **Lifetime** : 28800
3. **Save**

### 3.3. Phase 2 - Site A

1. Cliquez **Add P2** sous la Phase 1 créée
    
    ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2019.png)
    
2. Configurez :
    - Description : Site A
    - **Mode** : Tunnel IPv4
    - **Local Network** : LAN subnet (192.168.100.0/24)
    - **Remote Network** : 192.168.200.0/24
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2020.png)
        
    - **Protocol** : ESP
    - **Encryption Algorithms** : AES (256 bits)
    - **Hash Algorithms** : SHA256
    - **PFS key group** : 14 (2048 bits)
    - **Lifetime** : 28800
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2021.png)
        
    - **Automatically ping host** : 192.168.200.1
    - Cocher l'option **Keep alive**
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2022.png)
        
3. **Save**

### 3.4. Phase 2 - Site B

1. **Add P2** sous la Phase 1
2. Configurez (réseaux inversés par rapport à Site A) :
    - **Description** : Tunnel Site B vers Site A
    - **Mode** : Tunnel IPv4
    - **Local Network** : LAN subnet (192.168.200.0/24)
    - **Remote Network** : 192.168.100.0/24
    - **Protocol** : ESP
    - **Encryption Algorithms** : AES (256 bits)
    - **Hash Algorithms** : SHA256
    - **PFS key group** : 14 (2048 bits)
    - **Lifetime** : 28800
    - **Automatically ping host** : 192.168.100.1
    - Cocher l'option **Keep alive**
3. **Save**

### 3.5. Phase 2 (SAN) - Site A (OPTIONNEL)

> Note importante : Cette Phase 2 supplémentaire est optionnelle mais recommandée si vous souhaitez permettre la réplication iSCSI inter-sites via le VPN (utile pour la haute disponibilité au LOT 3).
> 
1. Dans **VPN → IPsec**, sous la Phase 1 existante, cliquez **Show Phase 2 Entries**
2. Cliquez **Add P2** (création d'une deuxième Phase 2)
3. Configurez :
    - **Description** : Tunnel SAN Site A vers Site B
    - **Mode** : Tunnel IPv4
    - **Local Network** : Network → **172.16.10.0 / 24**
    - **Remote Network** : Network → **172.16.20.0 / 24**
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2023.png)
        
    - **Protocol** : ESP
    - **Encryption Algorithms** : AES (256 bits)
    - **Hash Algorithms** : SHA256
    - **PFS key group** : 14 (2048 bits)
    - **Lifetime** : 3600
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2024.png)
        
    - **Automatically ping host** : **172.16.20.1**
    - Cocher l'option **Keep alive**
        
        ![image.png](%F0%9F%8C%90%20LOT%201%20-%20Configuration%20R%C3%A9seau%20et%20VPN%20Site-%C3%A0-Site/image%2025.png)
        
4. **Save**

### 3.6. Phase 2 (SAN) - Site B (OPTIONNEL)

1. **Add P2** sous la Phase 1
2. Configurez (réseaux inversés) :
    - **Description** : Tunnel SAN Site B vers Site A
    - **Mode** : Tunnel IPv4
    - **Local Network** : Network → **172.16.20.0 / 24**
    - **Remote Network** : Network → **172.16.10.0 / 24**
    - **Protocol** : ESP
    - **Encryption Algorithms** : AES (256 bits)
    - **Hash Algorithms** : SHA256
    - **PFS key group** : 14 (2048 bits)
    - **Lifetime** : 3600
    - **Automatically ping host** : **172.16.10.1**
    - Cocher l'option **Keep alive**
3. **Save**

---

## 4. Configuration Règles de Pare-feu

**Vue d'ensemble stratégique**

Les règles firewall ont été analysées interface par interface pour anticiper l'ensemble des besoins des LOT 1 à 4. Conformément à l'exigence du LOT 4 "Règles de pare-feu configurées WAN, LAN, VPN et SAN" (CdC page 8), voici la répartition :

**Tableau d'analyse par interface :**

| Interface | Rôle | Règles LOT 1 | Ajouts LOT 2-4 | Justification |
| --- | --- | --- | --- | --- |
| **WAN** | Accès Internet + VPN IPsec | UDP 500, 4500, ESP | ❌ Aucun | Pas de VPN nomade ni accès externe dans CdC |
| **LAN** | Réseau clients/serveurs | HTTP, HTTPS, DNS, ICMP, NTP, iSCSI | ✅ AD, SMB, RPC, RDP, etc. | Services LOT 2-3-4 nécessitent ports supplémentaires |
| **SAN** | Réseau stockage iSCSI | iSCSI (3260), ICMP | ❌ Aucun | Réseau dédié exclusivement au stockage |
| **IPsec** | Tunnel VPN inter-sites | any/any | ❌ Aucun | Règle couvre tous les protocoles LOT 1-4 |

**Approche stratégique :**

Les règles firewall ont été configurées dès le LOT 1 pour anticiper l'ensemble des besoins des LOT 2 à 4 (Active Directory, DFS, GPO, RDP). Cette approche proactive permet de :

1. **Respecter l'exigence LOT 4** "Règles configurées WAN, LAN, VPN et SAN" (CdC page 8)
2. **Optimiser le temps de configuration** des LOT suivants (gain estimé : 3-4 heures)
3. **Garantir la disponibilité immédiate** des services lors de leur déploiement
4. **Éviter les oublis** de ports critiques (LDAP, SMB, RPC, etc.)
5. **Faciliter les tests** avec une configuration complète et documentée

Seule l'interface **LAN** nécessite des règles supplémentaires pour anticiper les LOT 2-4. Les interfaces WAN, SAN et IPsec sont complètes dès le LOT 1.

---

### 4.1. Règles WAN (complètes pour LOT 1-4)

**Objectif :** Autoriser l'établissement et le maintien du tunnel VPN IPsec site-à-site.

**Tableau récapitulatif WAN :**

| # | Description | Action | Proto | Port | LOT | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | IKE/ISAKMP | Pass | UDP | 500 | 1-4 | ✅ Complet |
| 2 | NAT Traversal | Pass | UDP | 4500 | 1-4 | ✅ Complet |
| 3 | ESP Encapsulation | Pass | ESP | - | 1-4 | ✅ Complet |

[capture d’écran de toutes les règles]

> Note importante : Ces règles couvrent intégralement les besoins du projet AP3 (LOT 1 à 4). Le cahier des charges ne prévoit pas de VPN nomade, d'accès RDP externe ou de services publics. Aucune règle WAN supplémentaire n'est nécessaire.
> 

---

### 4.2. Règles LAN (complétées pour LOT 1-4)

**Objectif :** Autoriser les flux métier nécessaires pour les services LOT 1 à 4 (navigation web, Active Directory, DFS, GPO, RDP).

**Configuration dans pfSense :**

1. Allez dans **Firewall → Rules → LAN**
2. Configurez les règles selon le tableau ci-dessous (ordre important : top → bottom)

**Tableau récapitulatif des règles LAN :**

| # | Description | Action | Proto | Src | Dst | Port(s) | LOT | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Résolution DNS | Pass | TCP/UDP | LAN net | any | 53 | 1 | ✅ Actif |
| 2 | Navigation HTTP | Pass | TCP | LAN net | any | 80 | 1 | ✅ Actif |
| 3 | Navigation HTTPS | Pass | TCP | LAN net | any | 443 | 1 | ✅ Actif |
| 4 | Diagnostics ICMP | Pass | ICMP | LAN net | any | - | 1 | ✅ Actif |
| 5 | Sync temps NTP | Pass | UDP | LAN net | any | 123 | 1 | ✅ Actif |
| 6 | Stockage iSCSI | Pass | TCP | LAN net | SAN net | 3260 | 1-3 | ✅ Actif |
| 7 | Trafic VPN inter-sites | Pass | any | LAN net | Remote LAN | - | 1-4 | ✅ Actif |
| 8 | Communication intra-LAN | Pass | any | LAN net | LAN net | - | 2-4 | 🔵 Anticipé |
| 9 | Active Directory LDAP | Pass | TCP/UDP | LAN net | any | 389 | 2 | 🔵 Anticipé |
| 10 | AD LDAPS sécurisé | Pass | TCP | LAN net | any | 636 | 2 | 🔵 Anticipé |
| 11 | Authentification Kerberos | Pass | TCP/UDP | LAN net | any | 88 | 2 | 🔵 Anticipé |
| 12 | Partages fichiers SMB | Pass | TCP | LAN net | any | 445 | 2-3 | 🔵 Anticipé |
| 13 | Services Windows RPC | Pass | TCP | LAN net | any | 135 | 2 | 🔵 Anticipé |
| 14 | RPC ports dynamiques | Pass | TCP | LAN net | any | 49152-65535 | 2 | 🔵 Anticipé |
| 15 | Global Catalog AD | Pass | TCP | LAN net | any | 3268-3269 | 2 | 🔵 Anticipé |
| 16 | Administration RDP | Pass | TCP | LAN net | any | 3389 | 4 | 🔵 Anticipé |
| 17 | WinRM PowerShell | Pass | TCP | LAN net | any | 5985-5986 | 4 | 🔵 Optionnel |

**Légende :**

- ✅ **Actif** : Règle nécessaire dès le LOT 1, tests effectués
- 🔵 **Anticipé** : Règle configurée pour LOT 2-4, tests prévus au déploiement
- 🔵 **Optionnel** : Règle non essentielle, peut être activée selon besoins

[capture d’écran de toutes les règles]

---

### 4.3. Règles SAN (complètes pour LOT 1-4)

**Objectif :** Isoler le trafic de stockage iSCSI sur un réseau dédié.

**Tableau récapitulatif SAN :**

| # | Description | Action | Proto | Src | Dst | Port | LOT | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Stockage iSCSI | Pass | TCP | SAN net | SAN net | 3260 | 1-3 | ✅ Complet |
| 2 | Diagnostics ICMP | Pass | ICMP | any | any | - | 1-4 | ✅ Complet |

[capture d’écran de toutes les règles]

---

### 4.4. Règles IPsec (complètes pour LOT 1-4)

**Objectif :** Autoriser le trafic inter-sites via le tunnel VPN chiffré.

**Tableau récapitulatif IPsec :**

| # | Description | Action | Proto | Src | Dst | LOT | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Trafic inter-sites | Pass | any | any | any | 1-4 | ✅ Complet |

[capture d’écran de toutes les règles]

---

### Résumé Configuration Firewall Complète

**Statistiques par interface :**

| Interface | Règles configurées | Règles actives LOT 1 | Règles anticipées LOT 2-4 |
| --- | --- | --- | --- |
| **WAN** | 3 | 3 | 0 |
| **LAN** | 17 | 7 | 10 |
| **SAN** | 2 | 2 | 0 |
| **IPsec** | 1 | 1 | 0 |
| **TOTAL** | **23** | **13** | **10** |

## 5. Sauvegarde Configuration

**Objectif :** Assurer la pérennité et la restaurabilité de la configuration pfSense en exportant les fichiers XML contenant l'intégralité des paramètres (interfaces, VPN, règles firewall, DHCP, DNS, NAT) pour permettre une remise en service rapide en cas de défaillance matérielle ou d'erreur de manipulation. Cette pratique répond directement aux exigences du cahier des charges concernant la documentation complète d'installation, configuration et exploitation, ainsi qu'à la démarche ITIL initiée par la DSI visant la certification ISO 20000 et ISO 27000. Les sauvegardes des configurations RTE-STG01 et RTE2-STG01 constituent des éléments essentiels du plan de reprise d'activité (PRA) et permettent d'identifier des indicateurs précis quant au bon fonctionnement des équipements, conformément aux objectifs de gestion des configurations.

### 5.1. Sauvegarde pfSense

**Sur les deux pfSense :**

1. **Diagnostics → Backup & Restore**

[capture d’écran]

1. Backup area : **All**
2. Cochez **Skip packages**
3. Cochez **Skip RRD data**
4. Cliquez **Download configuration as XML**
5. Enregistrez :
    - `RTE-STG01_backup_20251027.xml` (Site A)
    - `RTE2-STG01_backup_20251027.xml` (Site B)
    
    [capture d’écran]
    

---

## 6. Résumé de la Configuration

**Objectif :** Fournir une documentation de synthèse consolidant tous les paramètres techniques critiques de l'infrastructure réseau du LOT 1 dans des tableaux récapitulatifs (plan d'adressage global, paramètres DHCP, configuration VPN IPsec, règles firewall, conformité ANSSI) pour faciliter l'exploitation, le dépannage et le transfert de compétences. Cette section répond à l'exigence de mémoire technique fonctionnel rédigé en français devant être remis pour chaque élément technique de la solution mis en place. Les tableaux permettent une consultation rapide sans parcourir l'ensemble de la documentation détaillée, améliorant ainsi le service aux utilisateurs et facilitant l'administration par la DSI, premiers axes stratégiques du projet. Le tableau de conformité ANSSI documente explicitement le respect des recommandations de sécurité relatives à IPsec (ANNEXE 5) et aux pare-feu (ANNEXE 6), démontrant la robustesse de la solution face aux menaces.

### 6.1. Interfaces Configurées

| Site | LAN | WAN | SAN |
| --- | --- | --- | --- |
| **Site A** | 192.168.100.1/24 | 192.168.42.40 | 172.16.10.1/24 |
| **Site B** | 192.168.200.1/24 | 192.168.42.41 | 172.16.20.1/24 |

### 6.2. Plages DHCP

| Site | Plage DHCP | DNS Distribué |
| --- | --- | --- |
| **Site A** | 192.168.100.20 - 192.168.100.200 | 192.168.100.1, 10.10.10.1 |
| **Site B** | 192.168.200.20 - 192.168.200.200 | 192.168.200.1, 10.10.10.1 |

### 6.3. Paramètres DNS

| Configuration | Valeur |
| --- | --- |
| **DNS Serveur École** | 10.10.10.1 |
| **DNS Resolver pfSense** | Activé avec forwarding |
| **Distribution via** | DHCP Server (temporaire LOT 1) |
| **Evolution LOT 2** | DHCP Windows Server avec AD DNS |

### 6.4. Paramètres VPN IPsec

| Paramètre | Valeur | Conformité ANSSI |
| --- | --- | --- |
| **Version IKE** | IKEv2 | ✓ |
| **Chiffrement** | AES-256 | ✓ |
| **Hash** | SHA256 | ✓ |
| **DH Group** | 14 (2048 bits) | ✓ |
| **Lifetime P1** | 28800 s (8h) | Standard |
| **Lifetime P2** | 3600 s (1h) | Standard |
| **Pre-Shared Key** | P@ssw0rd | À renforcer en production |

### 6.5. Règles de Pare-feu Configurées

**Interface WAN :**

- ✅ UDP 500 (IKE)
- ✅ UDP 4500 (NAT-T)
- ✅ ESP (Protocol 50)

**Interface LAN :**

- ✅ HTTP (80)
- ✅ HTTPS (443)
- ✅ ICMP (ping)
- ✅ DNS (53 UDP)
- ✅ iSCSI vers SAN (3260)

**Interface SAN :**

- ✅ iSCSI (3260 TCP)
- ✅ ICMP (ping)

**Interface IPsec :**

- ✅ Any/Any (tout le trafic inter-sites)

---

## 7. Évolutions prévues pour le LOT 2

**Objectif :** Anticiper et documenter la transition vers l'infrastructure définitive du LOT 2 en identifiant les modifications nécessaires lors du déploiement des 4 serveurs Windows Server 2022 Standard avec les rôles AD DS, DNS et DHCP sur les deux sites. Cette section prépare le transfert du service DHCP des pare-feu pfSense vers les contrôleurs de domaine (STG-SRVW01/02 et STG2-SRVW01/02) avec DHCP de basculement pour la haute disponibilité, le changement de configuration DNS pointant vers les serveurs AD du domaine IEF.LOCAL au lieu du forwarding école (10.10.10.1), et valide que l'architecture réseau actuelle est compatible avec l'intégration au domaine Active Directory comportant 1 forêt et 4 contrôleurs de domaine (1 principal au Site A, 3 supplémentaires). La checklist de validation garantit que tous les prérequis du LOT 1 sont remplis avant de passer au LOT 2, évitant ainsi les dépendances bloquantes et assurant le respect du planning prévisionnel du projet avec livraison du LIVRABLE 1 le 20 octobre 2025.

### 7.1. Désactivation DHCP pfSense

Au LOT 2, après installation des serveurs Windows AD/DHCP :

1. **Services → DHCP Server → LAN**
2. **Décocher** "Enable DHCP server on LAN interface"
3. **Save** + **Apply Changes**

### 7.2. Configuration DNS pour Active Directory

Les clients devront pointer vers les contrôleurs de domaine :

| Site | DNS Primaire | DNS Secondaire |
| --- | --- | --- |
| Site A | 192.168.100.10 (STG-SRVW01) | 192.168.100.11 (STG-SRVW02) |
| Site B | 192.168.200.10 (STG2-SRVW01) | 192.168.200.11 (STG2-SRVW02) |

Les serveurs Windows AD/DNS feront le forwarding vers 10.10.10.1 pour les requêtes Internet.

---

## 7.3. Checklist de validation LOT 1

- [✓] pfSense Site A opérationnel (WAN, LAN, SAN configurés)
- [✓] pfSense Site B opérationnel (WAN, LAN, SAN configurés)
- [✓] Tunnel VPN IPsec établi (Phase 1 + Phase 2 LAN)
- [✓] Phase 2 SAN configurée (optionnel)
- [✓] Conformité ANSSI (IKEv2, AES-256, SHA256, DH14)
- [✓] Règles firewall WAN (UDP 500, 4500, ESP)
- [✓] Règles firewall LAN (HTTP, HTTPS, DNS, ICMP, accès SAN)
- [✓] Règles firewall SAN (iSCSI port 3260)
- [✓] Règles firewall IPsec (trafic inter-sites)
- [✓] DHCP temporaire fonctionnel (plages .20-.200)
- [✓] DNS forwarding vers 10.10.10.1 opérationnel
- [✓] Sauvegarde configuration pfSense réalisée
- [✓] Documentation complète rédigée

---

**FIN DU LOT 1**

[📂 Menu Livrable 2](../%F0%9F%A7%B0%20LIVRABLE%202%20%E2%80%93%20Documentation%20Technique%202dadbb723a28805eb87fca5c5941ed36.md) | [➡️ LOT suivant](%F0%9F%86%94%20LOT%202%20-%20D%C3%A9ploiement%20Active%20Directory,%20DNS%20et%20DHC%202b5dbb723a2880f5889dfa45e27cdd81.md)