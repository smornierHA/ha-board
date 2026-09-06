# Conservation privée — POC géolocalisation

Référence RC.4 du 6 septembre 2026. **Archive originale préservée ; chiffrement et transfert GitHub non réalisés.** Le dépôt privé project-archives est accessible et initialisé avec un README uniquement. Le coffre NAS Volume 3 est reporté pour ces petites archives. Ni une archive vérifiée à destination ni une récupération indépendante ne sont revendiquées.

## Archive originale à conserver

| Champ | Valeur vérifiée localement au cycle de collecte |
|---|---|
| Nom | `poc-geolocalisation-originaux-prives-2026-09-06.zip` |
| Emplacement de travail du cycle | `deliverables/poc-geolocalisation-originaux-prives-2026-09-06.zip`, hors de l'arbre du dépôt HA-BOARD |
| Taille | **19 964 octets** |
| SHA256 binaire | `2791f4c010ded28c062312e7e5228a5abca229656d4518c0ac98900283243ace` |
| Motif de conservation | Préserver les originaux et la configuration de référence avant modification du POC |
| Destination de l'enveloppe chiffrée | Dépôt privé `smornierHA/project-archives`, sous `home-assistant/ha-board/originaux/2026/09/06/<capture>/` |
| Chiffrement / transfert / relecture GitHub | Non réalisés |
| Copie NAS / restauration HA | Non effectuée ici / non démontrée |

Ce document ne contient pas l'inventaire familial, les identités d'entités, positions, images ou configurations privées. Le ZIP original en clair reste hors Git. Son chemin de travail permet de le retrouver dans le cycle ; il ne prouve pas une sauvegarde durable. Préserver ses octets et son empreinte : le chiffrement crée une enveloppe séparée, sans réécrire le ZIP.

Une collecte complémentaire indispensable reçoit un manifeste et une empreinte propres. Ne pas produire une nouvelle archive par habitude à chaque réponse ; les fichiers reproductibles depuis Git n'exigent pas cette conservation.

## Canal retenu

Appliquer `docs/PRIVATE-STORAGE-PROTOCOL.md`, copie du protocole du socle RC.4. `smornierHA/project-archives` est privé, accessible avec droits d'administration et d'écriture ; main a été initialisée avec un README uniquement au SHA `bce2c851355af670eb5e5aa62b41e1c5c4267684`, puis relue. Preuve : `evidence/github-bootstrap-2026-09-06.json`. Aucun original ni archive chiffrée n'y a été envoyé.

Le chiffrement côté client doit précéder tout envoi de l'archive familiale. La clé et le moyen de récupération sont conservés hors GitHub ; aucun secret dans les arguments de commandes, prompts, journaux ou manifestes publiés. Base64 est un encodage de transport, pas un chiffrement. Le choix et la disponibilité du moyen de déchiffrement restent à établir avant publication de l'enveloppe.

## Transfert et preuve attendus

1. Retrouver le ZIP original et vérifier ses **19 964 octets** et son SHA256 ci-dessus. Relire la visibilité privée, la branche et les droits du dépôt de destination juste avant l'écriture.
2. Établir un moyen de chiffrement pris en charge et une clé récupérable hors GitHub. Chiffrer côté client dans un nouveau fichier ; effectuer un déchiffrement de contrôle et comparer les octets originaux. Si la récupération de la clé n'est pas établie, préparer le transfert sans publier l'archive et préciser l'action nécessaire.
3. Déposer uniquement l'enveloppe chiffrée et un manifeste expurgé, sur une branche dédiée et par PR, dans une capture datée nouvelle. Le manifeste indique motif, format de chiffrement, taille et SHA256 de l'enveloppe ; les détails privés restent dans l'enveloppe. Ne pas écraser une capture existante.
4. Relire les octets stockés sur GitHub et vérifier l'empreinte de l'enveloppe. Consigner commit, date, chemin, résultat et état `vérifié` uniquement après cette comparaison. Un envoi positif ou un README initial ne constitue pas cette preuve.
5. Vérifier que l'archive peut être récupérée et déchiffrée avec la clé conservée séparément. Garder l'original tant que le transfert et cette récupération ne sont pas vérifiés. La preuve publique HA-BOARD ne contient que la synthèse expurgée nécessaire.

## NAS et sauvegarde HA distincts

Le script PowerShell d'amorçage du coffre reste conservé comme préparation historique ; ne pas le relancer pour débloquer ces petites archives. Les anciens refus d'accès HA-MCP ne sont plus un préalable au versionnement du POC. Aucune configuration de partage ou copie Volume 3 n'est annoncée dans ce cycle.

Une sauvegarde HA actuelle et exploitable, avec Recorder, kit de déchiffrement hors instance et moyen de reprise indépendant, reste nécessaire avant une mise à jour Core. Le ZIP du POC et son enveloppe GitHub ne la remplacent pas. Les sauvegardes complètes, bases, médias et archives fréquentes relèvent d'un stockage de sauvegarde dédié ; leur destination et leur restauration sont à établir selon le besoin.

Les actions NAS, Frigate et Comptes Courant restent dans leurs chantiers respectifs. Ce changement documentaire et d'archivage n'autorise aucune mise à jour applicative, système ou serveur.
