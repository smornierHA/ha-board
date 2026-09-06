# État courant — 6 septembre 2026

La première version HACS est fonctionnelle selon le retour général de l’utilisateur. Cette appréciation conserve `v0.1.0-rc.2` comme base ; elle ne valide pas implicitement chaque essai mobile, thème, éditeur ou retour arrière.

| Étape | État prouvé | Référence |
|---|---|---|
| Code intégré | Fusionné sur `main` | `eeb56c9b66346b90275820a6d6fb4ca0fb94cebe`, arbre `537ce93b8d97e2586530c5418fb846137992c441` |
| Contrats | CI intégrée réussie | run `34044344961` ; 28/28 sur sources et bundle, quatre gates publication, intégrité/syntaxe/docs |
| Candidate | Publiée | prérelease `v0.1.0-rc.2` sur le SHA intégré |
| Artefact | Relu | `ha-board.js`, 32 195 octets, SHA256 `79df079bdc2c752956e808df2c492791213eaebe36fe854f60bfecb0061160c8` |
| Installation HACS | Déployée et relue | `installed_version=v0.1.0-rc.2`, `pending_upgrade=false`; fichier HA identique à l’artefact |
| Ressource frontend | Unique | `/hacsfiles/ha-board/ha-board.js?hacstag=13590703610102`; aucune inscription `/local` concurrente |
| Originaux | Préservés | History SHA256 `5f7eafddc9ad338e71030d759e373d51bfc6bf384e291b26cd11e5708031c0a4`; Rich SHA256 `9b89f12c630750fe67000434b2ee9a9b92efab76413e83babad6a6ce17a18477` |
| Retour utilisateur | Favorable général | première version HACS jugée fonctionnelle et conservée comme base |
| Stable | Non promue | preuves ciblées restantes dans ACCEPTANCE ; aucune publication stable demandée |

Le passage de `c164258` à `v0.1.0-rc.2` a été exécuté via HACS. Le fallback par réactivation des deux ressources originales est documenté et les fichiers sont préservés ; le downgrade vers une release HACS antérieure n’a pas été exécuté.

Les contrats simulés et la CI ne prouvent pas le rendu Home Assistant. Les résultats détaillés non fournis par l’utilisateur restent « non établis », notamment version exécutée par le navigateur, édition/sauvegarde/réouverture pour les deux cartes, refresh/navigation à froid répétés, mobile/desktop, clair/sombre et downgrade HACS.

HA-BOARD applique les exigences HA de RC.6 (éditeurs visuels, catalogue, noms sans version, bouton et livraison HACS). Cela constitue une adoption partielle bornée, pas l’adoption complète de toutes les règles du socle.

Aucun changement Core, OS, NAS, Livebox ou Frigate n’appartient à ce lot. Les états d’import RC.4 et de RC.1 en échec sont historiques et ne remplacent pas ce point courant.
