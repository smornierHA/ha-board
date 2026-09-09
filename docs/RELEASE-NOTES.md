# HA-BOARD 0.3.0-rc.1

- Ajoute Garage Control Card 1.1.0 comme troisième module autonome, sans import dans le bundle Personnes.
- Remplace l’import Lit CDN de l’original par `lit-element@4.2.0` et ses dépendances exactes verrouillées, incorporées au fichier distribué avec licence BSD-3-Clause.
- Corrige G1 : détachement ou reconfiguration annule le cycle de commande, réinitialise le verrou et ignore toute réponse de service devenue tardive ; l’anti-double clic reste actif.
- Distingue commande envoyée, confirmation par le capteur physique et expiration sans confirmation ; un succès de service seul n’est jamais affiché comme action physique réussie.
- Ajoute l’éditeur visuel natif complet, en conservant `false`, `0`, objets structurés, clés inconnues et sauvegarde/réouverture.
- Préserve les modes pulse/stateful/cover, états inconnus/indisponibles, caméras `picture-entity`, navigation/hash/Escape, détections, véhicules, images et plusieurs instances.
- Ajoute la bascule et le rollback Garage seuls ; Personnes reste la première ressource du namespace lors d’une mise à jour HACS ultérieure.
- Conserve Personnes et météo octet pour octet. Portail #14, historique #10 et tout essai physique restent hors de cette version.

Les tests utilisent exclusivement des services, entités, ressources et images fictifs. L’état daté de publication, installation, chargement et recette Home Assistant est maintenu dans `docs/STATUS.md` et dans les preuves de PR ; les présentes notes ne les déduisent pas de la version.

## Historique

# HA-BOARD 0.2.0-rc.1

- Ajoute le pilote Weather Combined Forecast comme ressource autonome, avec type YAML et rendu existants conservés.
- Corrige la libération d’un abonnement météo résolu après détachement et couvre reconnexion, reconfiguration et plusieurs instances.
- Aligne l’éditeur sur les valeurs effectives d’un YAML minimal, conserve les valeurs explicites et les clés inconnues, et retire des contrôles les trois unités historiques sans effet.
- Distribue les notices et la licence Apache-2.0 des tracés météo, avec provenance vérifiée et manifeste complet.
- Fournit la bascule qui place Personnes avant météo et met à jour explicitement la version/cache météo par les API de ressources supportées.
- Conserve le bundle Personnes 0.1.2-rc.1 octet pour octet. Garage #13, Portail #14 et historique #10 restent hors de cette version.

Publiée le 9 septembre 2026 depuis `a9c885419cea031fb307623076100b04feb78e98`, installée via HACS ; [chargement et recette HA ciblée confirmés](https://github.com/smornierHA/ha-board/pull/16#issuecomment-5602950067). Les contrôles CI utilisent des données fictives. Le rollback météo reste disponible et non exécuté ; aucune promotion stable. Les notes enregistrées lors de la publication restent la photographie de cette étape, complétée par cette preuve de recette.

# HA-BOARD 0.1.2-rc.1

Candidate de correctif visuel, pas une version stable.

- Retire de Person Rich le bandeau « Présence HA / Dernière position connue », le dépliant Qualité et la note de fraîcheur sous les capteurs de trajet, sans laisser leur espace.
- Affiche la zone HA nommée en priorité ; sinon le nom de ville seul dans les libellés compact et détail, sans rue, code postal ni pays.
- Conserve la ligne d’adresse distincte lorsqu’elle est cohérente avec la localisation présentée.
- Conserve en interne les contrôles de date, provenance, source future/incohérente et séparation d’adresse, sans réafficher ces avertissements techniques.
- Conserve Person History Map, les types YAML, Memoji, batteries/charge, équipements, Proximité/Trajet/Destination, navigation et éditeurs.
- Ne transforme toujours pas une durée hors domicile en durée passée dans une ville.

L’ancien U3 « adresse dans les bulles historiques natives » est écarté par décision utilisateur et n’est pas déclaré livré. Son remplacement est le backlog #10 (graphe historique durée + position dans chaque vignette) ; aucun prototype de ce graphe n’est inclus.

La validation Node/CI ne prouve pas le rendu Home Assistant réel. Mobile/desktop, thèmes, version réellement chargée et éventuel retour arrière restent à recetter sous mandat séparé. Aucune mise à jour Core, OS, NAS, Livebox ou Frigate n’est incluse.
