# 🛡️ LOT 4 - Sécurisation, Stratégies de Groupe (GPO) et Pare-feu

[⬅️ Retour au Menu Livrable 2](../%F0%9F%A7%B0%20LIVRABLE%202%20%E2%80%93%20Documentation%20Technique%202dadbb723a28805eb87fca5c5941ed36.md) ***|*** [🏡 Retour à l'accueil](../../AP3%20Groupe%202%20-%20Samy%20ALBISSER%20&%20Emre%20ALBAYRAK%20265dbb723a28805eaba8c7aa4849492d.md)

***La Forteresse Numérique : Sécurisation et Conformité***

> Ultime étape du projet, ce lot verrouille l'infrastructure et définit les règles de vie numérique. Nous passons d'une configuration fonctionnelle à une configuration sécurisée (Hardening) en appliquant une politique de moindre privilège. Via des **Stratégies de Groupe (GPO)** strictes, nous déployons un environnement utilisateur standardisé et protégé contre les mauvaises manipulations (blocage USB, restrictions système). En parallèle, le filtrage réseau est durci sur les pare-feu pfSense pour ne laisser passer que les flux légitimes, garantissant ainsi la conformité aux exigences de l'ANSSI et la protection des actifs critiques de l'ECP.
> 

---

---

## 1. Structure Active Directory et Préparation (Rappel LOT 2)

Avant d'appliquer les GPO, nous validons que la structure créée au LOT 2 est conforme pour recevoir les politiques.

**Sur STG-SRVW01 (Site A) :**

1. **Unités d'Organisation (UO)** :
    - `IEF.LOCAL` (Racine)
        - `VAUBAN` (Contient : Paul, Pierre, GRP1, Ordinateurs du site A)
        - `SOMME` (Contient : Isabelle, Nathalie, GRP2, Ordinateurs du site B)
        - `ADMINS` ou `Users` (Contient : Compte de secours ADMIN - **Hors des UO Vauban/Somme pour éviter les restrictions**)
2. **Dossier NETLOGON** :
    - Déposer l'image `wallpaper_ief.jpg` dans `\\IEF.LOCAL\NETLOGON\`.
    - *Justification :* Ce dossier est automatiquement répliqué sur tous les contrôleurs de domaine (Site A et B), garantissant la disponibilité de l'image partout.

---

## 2. Stratégie de Mots de Passe (Default Domain Policy)

**Contexte** : Cette stratégie s'applique à **tous** les comptes du domaine sans exception.

Configuration sur la "Default Domain Policy" :

Chemin : Configuration ordinateur > Stratégies > Paramètres Windows > Paramètres de sécurité > Stratégies de comptes

| **Paramètre** | **Valeur** | **Justification Annexe 2** |
| --- | --- | --- |
| **Longueur minimale** | **12 caractères** | "12 caractères minimum" |
| **Complexité** | **Activé** | "1 chiffre, 1 spécial, 1 majuscule" |
| **Verrouillage compte** | **3 tentatives** | "3 tentatives erronées" |
| **Durée verrouillage** | **30 minutes** | "Pendant 30 minutes" |
| **Historique** | 5 mots de passe | Empêcher la réutilisation |

### 2.1. : Accéder à la console de gestion

1. Connectez-vous sur **STG-SRVW01** en tant qu'Administrateur.
2. Appuyez sur les touches `Windows + R` de votre clavier.
3. Tapez **`gpmc.msc`** et appuyez sur **Entrée**.
    - *(Ou cherchez "Gestion de stratégie de groupe" dans le menu Démarrer).*

### 2.2. : Trouver la "Default Domain Policy"

1. Dans la colonne de gauche, déployez l'arborescence en cliquant sur les petites flèches `>` :
    - **Forêt : IEF.LOCAL**
    - **Domaines**
    - **ief.local**
2. Vous verrez une GPO nommée **Default Domain Policy** (souvent avec une petite icône de parchemin).
3. Faites un **Clic droit** dessus et choisissez **Modifier...**.
    - *Une nouvelle fenêtre "Éditeur de gestion des stratégies de groupe" s'ouvre.*

### 2.3. : Naviguer vers les Stratégies de Comptes

Dans la fenêtre d'édition, suivez ce chemin précis dans le volet de gauche :

1. **Configuration ordinateur**
2. **Stratégies**
3. **Paramètres Windows**
4. **Paramètres de sécurité**
5. **Stratégies de comptes**

Ici, vous verrez deux sous-dossiers qui nous intéressent :

- `Stratégie de mot de passe`
- `Stratégie de verrouillage du compte`

---

### 2.4. : Configurer les Mots de Passe

Cliquez sur le dossier **Stratégie de mot de passe**. Dans le volet de droite, double-cliquez sur chaque ligne pour la modifier :

1. **Conserver l'historique des mots de passe**
    - Double-cliquez.
    - Cochez "Définir ce paramètre...".
    - Mettez : **5** mots de passe mémorisés.
    - *OK*.
2. **Le mot de passe doit respecter des exigences de complexité**
    - Double-cliquez.
    - Cochez : **Activé**.
    - *OK*.
3. **Longueur minimale du mot de passe**
    - Double-cliquez.
    - Mettez : **12** caractères.
    - *OK*.

*(Les autres paramètres comme "Durée de vie maximale" peuvent rester par défaut, souvent 42 jours).*

---

### 2.5. : Configurer le Verrouillage (Anti-Bruteforce)

Revenez dans le volet de gauche et cliquez sur le dossier juste en dessous : **Stratégie de verrouillage du compte**.

1. **Seuil de verrouillage du compte**
    - Double-cliquez.
    - Mettez : **3** tentatives d'ouverture de session non valides.
    - Cliquez sur *OK*.
    - *Windows va ouvrir une fenêtre "Valeurs suggérées" pour les deux autres paramètres (30 minutes).*
    - Cliquez sur **OK** pour accepter la suggestion automatique.
2. **Vérification des valeurs**
    - Vérifiez simplement que les trois lignes affichent bien les valeurs demandées :
        - Durée de verrouillage des comptes : **30 minutes**.
        - Réinitialiser le compteur... après : **30 minutes**.
        - Seuil de verrouillage : **3 tentatives**.

---

### 2.6. : Valider et Tester

Fermez toutes les fenêtres pour revenir sur le bureau.

1. Ouvrez une invite de commande (Clic droit sur Démarrer > **Windows PowerShell** ou **CMD**).
2. Forcez la mise à jour immédiate pour ne pas attendre :
    
    `gpupdate /force`
    
3. Vérifiez que le serveur a bien pris en compte vos réglages en tapant :DOS
    
    `net accounts`
    
    - Regardez les lignes :
        - *Longueur minimale : 12*
        - *Seuil de verrouillage : 3*

C'est terminé ! La politique est active pour tout le monde.

---

## 3. GPO : Environnement Utilisateur (Profils)

### 3.1 : Préparation du fond d'écran

*Avant de configurer la GPO, l'image doit être accessible.*

1. Sur le serveur, copiez votre image `wallpaper_ief.jpg`.
2. Ouvrez l'Explorateur de fichiers et dans la barre d'adresse, tapez : `\\IEF.LOCAL\NETLOGON`.
3. **Collez** l'image dans ce dossier.
    - *Pourquoi ?* Ce dossier est automatiquement synchronisé sur tous les contrôleurs de domaine. L'image sera disponible partout.

---

### 3.2 : Création et Liaison de la GPO

1. Ouvrez **Gestion de stratégie de groupe** (`gpmc.msc`).
2. Dans la colonne de gauche, faites un **Clic droit** sur l'UO **VAUBAN**.
3. Choisissez **"Créer un objet GPO dans ce domaine, et le lier ici..."**.
4. Nom : **`GPO_Environnement_Utilisateur`**.
5. Cliquez sur **OK**.
6. Maintenant, faites un **Clic droit** sur l'UO **SOMME**.
7. Choisissez **"Lier un objet de stratégie de groupe existant..."**.
8. Sélectionnez votre `GPO_Environnement_Utilisateur` et validez.
    - *La GPO est maintenant active pour les deux sites.*

---

### 3.3 : Configurer les Lecteurs Réseaux (U: et T:)

1. Faites un **Clic droit** sur la GPO `GPO_Environnement_Utilisateur` (dans le volet gauche) > **Modifier...**.
2. Allez dans : **Configuration utilisateur** > **Préférences** > **Paramètres Windows** > **Mappages de lecteurs**.

**A. Le Lecteur Personnel (U:)**

1. Dans la zone blanche à droite, **Clic droit** > **Nouveau** > **Lecteur mappé**.
2. **Action** : Choisissez **Mettre à jour** (Update).
3. **Emplacement** : Tapez `\\IEF.LOCAL\INTRANET\Users\%USERNAME%`
    - *(Attention à bien écrire `%USERNAME%` avec les pourcentages).*
4. **Reconnecter** : Cochez la case.
5. **Libellé** : Écrivez `Espace Personnel`.
6. **Lettre de lecteur** : Choisissez **U:**.
7. Cliquez sur **OK**.

**B. Le Lecteur Transfert (T:)**

1. **Clic droit** > **Nouveau** > **Lecteur mappé**.
2. **Action** : Choisissez **Mettre à jour**.
3. **Emplacement** : Tapez `\\IEF.LOCAL\INTRANET\TRANSFERT`
4. **Reconnecter** : Cochez la case.
5. **Libellé** : Écrivez `Espace Transfert`.
6. **Lettre de lecteur** : Choisissez **T:**.
7. Cliquez sur **OK**.

---

### 3.4. : Redirection des Dossiers (Sauvegarde auto)

1. Dans la même fenêtre, remontez vers : **Configuration utilisateur** > **Stratégies** > **Paramètres Windows** > **Redirection de dossiers**.

**A. Dossier Documents**

1. Faites un **Clic droit** sur **Documents** > **Propriétés**.
2. **Paramètre** : Choisissez **De base - Rediriger les dossiers de tout le monde vers le même emplacement**.
3. **Emplacement du dossier cible** : Vérifiez que c'est bien "Créer un dossier pour chaque utilisateur sous le chemin d'accès racine".
4. **Chemin d'accès racine** : Tapez `\\IEF.LOCAL\INTRANET\Users`
    - *⚠️ Attention : Ne mettez PAS `%username%` ici ! Windows l'ajoute tout seul.*
5. Allez dans l'onglet **Paramètres** (en haut).
    - Décochez "Accorder à l'utilisateur des droits exclusifs..." si vous (Admin) voulez pouvoir entrer dedans pour dépanner. Sinon, laissez coché.
6. Cliquez sur **OK**. (Dites Oui à l'avertissement de compatibilité).

**B. Dossier Bureau**

1. Faites un **Clic droit** sur **Bureau** > **Propriétés**.
2. Refaites exactement la même chose que pour Documents.
    - Paramètre : De base.
    - Chemin racine : `\\IEF.LOCAL\INTRANET\Users`
3. Cliquez sur **OK**.

---

### 3.5. : Fond d'écran Unifié et Verrouillé

1. Allez dans : **Configuration utilisateur** > **Stratégies** > **Modèles d'administration** > **Bureau** > **Bureau**.

**A. Mettre l'image**

1. Dans la liste de droite, double-cliquez sur **Papier peint du Bureau**.
2. Cochez **Activé**.
3. **Nom du papier peint** : Tapez `\\IEF.LOCAL\NETLOGON\wallpaper_ief.jpg`
4. **Style** : Choisissez **Remplir**.
5. Cliquez sur **OK**.

**B. Interdire le changement**

1. Allez dans : **Configuration utilisateur** > **Stratégies** > **Modèles d'administration** > **Panneau de configuration** > **Personnalisation**.
2. Double-cliquez sur **Empêcher la modification du papier peint**.
3. Cochez **Activé**.
4. Cliquez sur **OK**.

---

### 3.6. : Validation

1. Fermez l'éditeur de GPO.
2. Sur un **poste client** (Windows 10/11), connectez-vous avec **Paul** ou **Isabelle**.
3. Ouvrez une invite de commande (`cmd`) et tapez `gpupdate /force`.
4. Fermez la session et rouvrez-la.
5. **Vérifiez :**
    - Le fond d'écran est-il là ?
    - Dans "Ce PC", voyez-vous les lecteurs **U:** et **T:** ?
    - Créez un fichier sur le Bureau. Allez voir sur le serveur dans `E:\DATAS01\Users\Paul\Desktop`. Le fichier est-il là ? (Si oui, la redirection marche !).

---

## 4. GPO : Restrictions de Sécurité (Kiosk Mode)

⚠️ **ATTENTION :** C'est la GPO la plus critique. Si vous vous trompez dans le filtrage (Étape 2), vous risquez de bloquer l'administrateur. Suivez bien les instructions.

### 4.1. : Création et Liaison de la GPO

1. Ouvrez **Gestion de stratégie de groupe** (`gpmc.msc`).
2. Faites un **Clic droit** sur l'UO **VAUBAN**.
3. Choisissez **"Créer un objet GPO dans ce domaine, et le lier ici..."**.
4. Nom : **`GPO_Restrictions_Securite`**.
5. Cliquez sur **OK**.
6. Faites ensuite un **Clic droit** sur l'UO **SOMME** > **"Lier un objet de stratégie de groupe existant..."**.
7. Sélectionnez la `GPO_Restrictions_Securite` pour qu'elle s'applique aussi au deuxième site.

### 4.2 : Sécurité Critique (Le Filtrage)

*C'est ici qu'on s'assure que l'Admin ne se fait pas bloquer.*

1. Dans la colonne de gauche, cliquez **une seule fois** sur `GPO_Restrictions_Securite` (ne l'ouvrez pas encore).
2. Regardez dans le volet de droite, l'onglet **Étendue** (Scope).
3. En bas, dans la section **"Filtrage de sécurité"** :
    - Vous voyez "Utilisateurs authentifiés" ? **Sélectionnez-le et cliquez sur SUPPRIMER.**
    - *Pourquoi ?* Parce que ce groupe inclut tout le monde, y compris l'Admin.
4. Cliquez sur **Ajouter...**.
5. Tapez : `GRP1` > Vérifier > OK.
6. Cliquez encore sur **Ajouter...**.
7. Tapez : `GRP2` > Vérifier > OK.
    - *Résultat : Seuls Paul, Pierre, Isabelle et Nathalie seront bloqués. L'Admin reste libre.*

Pour garantir que la GPO est bien détectée par Windows sans être appliquée à tout le monde :

1. Cliquez sur l'onglet **Délégation** (juste à côté de Étendue).
2. Cliquez sur le bouton **Avancé** (en bas à droite).
3. Cliquez sur **Ajouter...**.
4. Tapez : `Utilisateurs authentifiés` > OK.
5. Dans la liste des permissions pour ce groupe, cochez **uniquement** la case **Lire** (Read).
    - ⚠️ **Vérification cruciale :** Assurez-vous que la case **"Appliquer la stratégie de groupe"** est bien **DÉCOCHÉE**.
6. Validez par **OK**.

### 4.3. : Bloquer le Système (Panneau config, CMD)

Faites un Clic droit sur la GPO > Modifier....

Allez dans : Configuration utilisateur > Stratégies > Modèles d'administration.

**A. Panneau de Configuration**

1. Cliquez sur le dossier **Panneau de configuration**.
2. À droite, double-cliquez sur **"Interdire l'accès au Panneau de configuration et à l'application Paramètres du PC"**.
3. Cochez **Activé**.
4. **OK**.

**B. Invite de commande (CMD)**

1. Cliquez sur le dossier **Système**.
2. À droite, double-cliquez sur **"Empêcher l'accès à l'invite de commandes"**.
3. Cochez **Activé**.
4. ⚠️ **Important :** Dans la liste déroulante "Désactiver également le traitement des scripts...", choisissez **NON**.
    - *Pourquoi ?* Si vous mettez Oui, les scripts de connexion (logon scripts) ne marcheront plus.
5. **OK**.

**C. Bloquer PowerShell**

1. Toujours dans le dossier **Système**, double-cliquez sur **"Ne pas exécuter les applications Windows spécifiées"**.
2. Cochez **Activé**.
3. Cliquez sur le bouton **Afficher...** (Show).
4. Dans la liste, ajoutez deux lignes :
    - `powershell.exe`
    - `powershell_ise.exe`
5. **OK** > **OK**.

### 4.4. : Bloquer le Matériel (Disques et USB)

**A. Masquer les Disques Locaux (C:)**

1. Allez dans : **Modèles d'administration** > **Composants Windows** > **Explorateur de fichiers**.
2. Double-cliquez sur **"Masquer ces lecteurs dans le Poste de travail"**.
3. Cochez **Activé**.
4. Dans la liste déroulante, choisissez : **Restreindre les lecteurs A, B, C et D uniquement**.
    - *Ne choisissez PAS "Restreindre tous les lecteurs", sinon U: et T: disparaîtront aussi !*
5. **OK**.

**B. Bloquer les clés USB**

1. Allez dans : **Modèles d'administration** > **Système** > **Accès au stockage amovible**.
2. Cherchez la ligne : **"Toutes les classes de stockage amovible : Refuser tous les accès"**.
3. Double-cliquez.
4. Cochez **Activé**.
5. **OK**.

### 4.5. : Validation Finale

1. Fermez l'éditeur.
2. Sur le client, ouvrez une invite de commande (tant que vous êtes Admin).
3. Tapez `gpupdate /force`.
4. **Le test de vérité :**
    - Connectez-vous avec **Paul**.
    - Essayez d'ouvrir `C:` -> Bloqué ?
    - Essayez d'ouvrir `cmd` -> Bloqué ?
    - Connectez-vous avec **ADMIN**.
    - Essayez d'ouvrir `C:` -> Ça marche ? (Ça doit marcher).

---

## 5. Validation et Durcissement Réseau (Pare-feu pfSense)

**Objectif :** Transformer la configuration "Permissive" du LOT 1 en configuration "Sécurisée".

### 5.1. Nettoyage de l'Interface LAN

Au LOT 1, nous avons créé des règles anticipées (AD, DNS, SMB, RPC). Il est temps de les rendre effectives.

1. **Vérification des règles existantes** : S'assurer que les règles pour **DNS (53)**, **AD (389, 88, 636)**, **SMB (445)** et surtout **RPC Dynamiques (49152-65535)** sont bien présentes et activées (Voir Tableau 4.2 du LOT 1).
2. **Ajout de la règle de sécurité SAN** (Prioritaire, tout en haut) :
    - Action : **BLOCK**.
    - Source : `LAN Net`.
    - Destination : `SAN Net` (172.16.x.x).
    - *Objectif : Empêcher les élèves d'attaquer les baies de stockage.*
3. **Activation du filtrage (Le grand saut)** :
    - **Désactiver** ou **Supprimer** la règle du bas : *"Default allow LAN to any rule"*.
    - *Conséquence :* Désormais, seul ce qui est explicitement autorisé (AD, Fichiers, Web) passera. Tout le reste (P2P, Jeux, scans réseaux) sera bloqué.

### 5.2. Validation Interface SAN

- S'assurer qu'il n'y a **QUE** la règle autorisant le port **TCP 3260** (iSCSI) depuis les IPs des serveurs (`.10`, `.11`).
- Supprimer toute règle "Allow All" sur cette interface si elle existe.

---

## 6. Tests de Résilience et Validation (Recette)

### 6.1. Tests de Sécurité (GPO)

- [ ]  **USB :** Insertion d'une clé USB sur le poste de Paul -> **Accès Refusé**.
- [ ]  **Disque C: :** Tentative d'accès à `C:\` dans la barre d'adresse -> **Accès Refusé**.
- [ ]  **Panneau Config :** Lancement de `control.exe` -> **Bloqué**.
- [ ]  **Admin :** Connexion avec le compte `ADMIN` -> **Accès complet** (USB et C: fonctionnels).

### 6.2. Tests de Haute Disponibilité (LOT 2 & 3 validés)

- [ ]  **Panne DC :** Extinction de `STG-SRVW01`. Connexion d'un client -> **Succès** (Auth via SRVW02).
- [ ]  **Panne Fichier :** Accès à `\\IEF.LOCAL\INTRANET` avec SRVW01 éteint -> **Succès** (Bascule transparente DFS).

---

## 7. Difficultés Rencontrées (Synthèse)

**1. Blocage de l'Administrateur par GPO**

- *Symptôme :* Le compte ADMIN ne pouvait plus accéder au serveur.
- *Cause :* La GPO de restriction s'appliquait aux "Utilisateurs authentifiés", groupe qui inclut les admins.
- *Résolution :* Modification du filtrage de sécurité pour ne cibler que les groupes GRP1 et GRP2.

**2. Échec de Réplication DFS via VPN**

- *Symptôme :* Les fichiers ne se synchronisaient pas entre le Site A et le Site B.
- *Cause :* Le pare-feu pfSense bloquait les ports hauts (RPC) utilisés aléatoirement par le service de réplication.
- *Résolution :* Ajout de la règle LAN autorisant la plage TCP **49152-65535** vers les contrôleurs de domaine.

**3. Conflit de Masquage de Disques**

- *Symptôme :* L'option "Restreindre tous les lecteurs" masquait aussi les lecteurs réseaux U: et T:.
- *Résolution :* Passage à l'option "Restreindre A, B, C et D uniquement".
1. **Latence de Réplication GPO Inter-Sites (15 minutes)**
- *Symptôme :* Les restrictions (CMD bloqué) fonctionnaient sur le Site A, mais l'utilisateur du Site B gardait ses accès pendant les premières minutes.
- *Analyse :* Le Contrôleur du Site B n'avait pas encore reçu les fichiers de la GPO (dossier SYSVOL `{GUID}`) venant du Site A.
- *Résolution :* Nous avons constaté que le délai de convergence standard inter-sites est de **15 minutes**. La commande `repadmin /syncall` a forcé la topologie logique, et le service DFSR a transféré les fichiers ensuite. Le test a été validé avec succès après ce délai incompressible.

---

## 8. Bilan Final du Projet AP3

Le système d'information livré est désormais :

- ✅ **Fonctionnel** : Services AD, DNS, DHCP, Fichiers opérationnels sur 2 sites.
- ✅ **Redondant** : Bascule automatique des services (DFS, DHCP Failover) en cas de panne.
- ✅ **Sécurisé** : Cloisonnement réseau strict et environnement utilisateur verrouillé.
- ✅ **Sauvegardé** : Données protégées sur stockage SAN externe avec historique (Clichés).

---

**FIN DU LOT 4**

**FIN DE L’AP3.**

[⬅️ LOT précédent](%F0%9F%92%BE%20LOT%203%20-%20Configuration%20du%20Stockage%20(SAN%20NAS)%20et%20S%202c0dbb723a288006830ed1d4babe9b74.md) | [📂 Menu Livrable 2](../%F0%9F%A7%B0%20LIVRABLE%202%20%E2%80%93%20Documentation%20Technique%202dadbb723a28805eb87fca5c5941ed36.md)