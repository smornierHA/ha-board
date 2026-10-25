# Projet HA-BOARD

## Intégration de la présentation iOS — 25 octobre 2026

L’utilisateur accepte `weather-ios-compact-icons.fragment.html` (« Ok on part la dessus »). Le candidat `0.4.0-rc.1` intègre cette direction via `layout: ios`, sur les adaptateurs de données, sources secondaires, risques et actions existants. `layout: classic` reste le défaut des configurations existantes. Dépôt public adapté au code et fixtures fictives ; aucune configuration domestique ou capture réelle versionnée. Installation candidate limitée à la météo ; statut et preuves dans STATUS.

## Pictogrammes horaires compacts — 25 octobre 2026

L’utilisateur valide l’icône d’en-tête mais écarte la recomposition et l’agrandissement des symboles du slider. Référence courante : `weather-ios-compact-icons.fragment.html`. Retour aux compositions Lucide précédentes, superpositions conservées, dessin complet de 24 px maximum et centre optique commun. Le dépôt public et les droits d’écriture sont reconfirmés ; seules maquette fictive et références changent, sans delta runtime ou HA.

## Dessins météo et footer sobre — 25 octobre 2026

`weather-ios-optical.fragment.html` devient la référence après le retour sur la taille et l’alignement des dessins, et sur le footer. Normalisation de la base et de la taille des nuages visibles, symbole principal lié aux métriques réelles des chiffres, footer réduit à une ligne sobre. Dépôt public et droits d’écriture reconfirmés ; contenu fictif uniquement. Aucun changement de source runtime, package ou HA.

## Hauteur stable et footer météo — 25 octobre 2026

`weather-ios-fixed.fragment.html` devient la référence de maquette : icône de la taille des degrés, alignements communs, toutes les alertes dans le footer, couleurs de seuil et géométrie constante entre vues. Dépôt public et droits d’écriture reconfirmés ; exemple et mesures fictifs uniquement sur la branche de #19. Aucun changement de runtime, de package ou de configuration HA.

## Ajustements de la maquette météo — 25 octobre 2026

Dépôt public et droits d’écriture reconfirmés. La proposition à trois vues reste la base demandée ; `weather-ios-refined.fragment.html` ajoute des pictogrammes colorés, le graphe du vent, la jauge mini/maxi et la mise en évidence des alertes importantes. Données et alertes sont fictives. Seuls l’exemple et ses références/preuves évoluent sur la branche de #19 ; aucun delta runtime, package ou HA.

## Révision de maquette météo — 24 octobre 2026

Le retour utilisateur remplace la proposition initiale, trop dense, par un aperçu à trois vues Météo/Pluie/Vent inspiré du guide Apple iOS 27 actuel. Dépôt public et droits d’écriture reconfirmés ; branche existante de #19. Seuls l’exemple fictif, ses références et sa preuve évoluent. Le code distribué et l’instance HA ne sont pas modifiés dans cette révision.

## Incrément gestes et maquette météo — 24 octobre 2026

Dépôt public et droits push/admin reconfirmés. La branche `feat/weather-atmosphere-20261024` et la PR draft #19 accueillent le correctif de défilement `0.3.1-rc.2`, puis une maquette iOS distincte du composant installé. Seuls du code et des données fictives sont versionnés ; aucun export HA réel ni capture privée. La production conserve son interface existante ; la nouvelle disposition reste une proposition à examiner.

## Incrément atmosphère météo — 24 octobre 2026

Dépôt `smornierHA/ha-board` confirmé public, avec droits d’écriture. Cette visibilité reste adaptée au code frontend et aux exemples fictifs. Configuration domestique, noms/entités réels, URLs internes et captures de l’instance restent exclus du dépôt. Base locale `0a46049e784f4cf8a1484272e8474d0b20a872a6`, branche `feat/weather-atmosphere-20261024` ; seul le composant météo évolue. Les sources `src/` d’import restent intactes. Le détail testé/déployé est maintenu dans STATUS et dans la preuve de cet incrément.

| Champ | Valeur |
|---|---|
| Dépôt vérifié le 6 septembre 2026 | [smornierHA/ha-board](https://github.com/smornierHA/ha-board), accessible avec droits d'administration et d'écriture |
| Visibilité observée | Public ; code, documentation expurgée et exemples fictifs uniquement |
| Branche initialisée | main, README uniquement, SHA `ff9cd91848ad8548be0b5ef6b70add8d45f56669` relu |
| Protections observées | `protected:false` ; checks requis vides ; rulesets vides |
| Conservation privée | project-archives privé ; petite archive familiale à chiffrer côté client, clé hors GitHub ; aucun envoi effectué |
| Coffre NAS | Volume 3 reporté pour les petites archives ; sauvegarde HA réelle distincte toujours requise avant Core |
| Profil | Home Assistant ; complément MCP pour livraison assistée |
| Socle | Exigences HA de RC.6 partiellement adoptées ; RC.7 disponible sur `4c20e6361dbe6320f17c380fff050010ef7a7a40`, sans adoption complète revendiquée |
| Responsable | Propriétaire du dépôt |
| Produit | Cartes frontend locales et configuration Lovelace expurgée |
| Base observée au cycle initial | Core 2026.8.3 ; Person History 1.4.0 ; Person Rich 3.4.3 |
| Cible officielle MAP | Core 2026.9.1 ; préconditions non toutes levées |
| Données exclues du dépôt public | Noms/entités domestiques, positions, historiques, images réelles, sauvegardes, secrets |
| Livraison | Bundle immuable + SHA/empreinte, ressources ciblées, recette HA |

Preuve d'amorçage : `evidence/github-bootstrap-2026-09-06.json`. Le socle est dans project-playbook privé ; project-archives est également privé. Leur accès ne prouve ni l'import des préparatifs ni la disponibilité d'une sauvegarde.

Une version de socle disponible ou préparée n'est pas adoptée tant que son diff projet n'est pas intégré. La révision RC.4 reste historique et n’est pas réimportée. La maintenance mensuelle existante n'est pas dupliquée.

## Cycle pilote météo #12

Le 9 septembre, le dépôt public est relu via GitHub avec droits push/admin ; la préparation a été réalisée sur branche dédiée. Sources privées météo et configuration ciblée conservées hors Git ; seules les références expurgées et données fictives sont admises ici. Le profil HA et la coordination RC.8 ont été relus et appliqués aux parties concernées, sans adoption complète. Package 0.2.0-rc.1 désormais publié, installé, chargé et accepté en recette HA ciblée le 9 septembre ; Personnes 0.1.2-rc.1 inchangé. Statut et preuves courants dans STATUS ; provenance dans WEATHER-PROVENANCE. La documentation affichée par HACS est contrôlée à chaque livraison selon docs/HACS.md.

## Préparation Garage #13

Le lot Garage est préparé sur une branche dédiée à partir du `main` observé après #17. L’original actif et son rollback restent hors Git public ; seuls un export expurgé, des fixtures fictives, la source candidate et le module autonome sont versionnés. Le candidat package `0.3.0-rc.1` ajoute Garage `1.1.0` sans modifier les octets Personnes/météo. Son statut reste **préparé et testé**, pas fusionné, publié, installé, chargé ni accepté en recette HA. La bascule et le rollback Garage seuls sont décrits dans `docs/HACS.md` mais ne sont pas exécutés dans ce lot.
