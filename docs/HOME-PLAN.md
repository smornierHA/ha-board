# Plan de la maison — candidat autonome

`custom:home-plan-card` affiche un plan local, les pièces et leurs équipements réels. Le nom du sélecteur de cartes est **Plan de la maison**. Le candidat autonome ne modifie pas les distributions météo, Personnes ou Garage.

## Plusieurs niveaux

Le sélecteur du bandeau choisit le plan affiché. Le mode Lumières / Temp. / Ouvertures / Volets est conservé lors du changement ; les fiches précédentes sont fermées. Les associations, géométries et positions appartiennent à chaque niveau. Dans l’éditeur, choisir **Niveau** avant la pièce : déplacer un repère ne réécrit pas les positions d’un autre plan. Les politiques de volets et règles de signalement sont partagées. Une erreur de chargement conserve le sélecteur pour revenir à un autre niveau.

La configuration existante reste le niveau principal. `level_name` donne son libellé court. `levels` ajoute jusqu’à dix entrées uniques avec `id`, `floor`, `level_name`, `model_url` (ou `model`), `rooms`, `apertures` et `markers`. Ces listes sont propres au niveau et ne se mélangent pas aux listes du niveau principal. Les repères visuels mesurent 24 px, avec pictogramme de 14 px et cible tactile de 44 px. Un repère non concerné par le focus reste accessible avec une opacité réduite, comme les portes et volets.

Une pièce peut choisir une entité `climate` et `temperature_attribute: current_temperature` pour sa mesure ambiante. L’état `heat` et la consigne ne sont jamais utilisés comme température. Un modèle peut activer `compact_temperatures: true` pour une lecture à une décimale avec symbole degré sur le plan ; la fiche et le libellé accessible gardent la valeur complète et l’unité. Le périmètre **Pièces du plan** découvre aussi les diagnostics piles/défauts des zones du niveau et écarte les règles associées à un autre niveau. **Toute la maison** conserve une vue globale.

Les commandes groupées de volets découvrent également les autres niveaux natifs, développent les groupes en équipements terminaux et évitent un groupe identique au niveau courant. Les miniatures des volets et de l’écran restent inchangées.

## Utilisation

- Plan / Pièces change la présentation. Pièces, Lumières, Temp., Ouvertures et Volets sélectionne les informations mises en évidence. Lumières et Ouvertures montrent toutes les pièces équipées, même éteintes ou fermées ; les couleurs continuent de porter les états réels.
- Toucher une pièce ouvre sa fiche : illustration/photo, lumières, volets, contacts, détecteurs et autres équipements. Les équipements secondaires ouvrent leur fiche Home Assistant native.
- Toucher une fenêtre ou son repère donne les commandes du volet associé. Le pourcentage indique la fraction ouverte : 0 = fermé, 100 = ouvert. Les commandes respectent les capacités de l’entité ; une position inconnue désactive uniquement le réglage de position. Une entité indisponible désactive les commandes.
- Un contact physique reste indépendant du volet. L’orange repère une ouverture physique ; le bleu les volets. Les commandes n’inventent aucun retour d’état.
- Une porte commandée par impulsion présente **Actionner la porte** et un accès aux détails natifs ; aucun état physique n’est déduit de l’impulsion. Une protection de deux secondes évite les doubles appuis.
- Les commandes de volets se regroupent par pièce ; le mode **Volets** donne accès à **Tous les volets du niveau**. La fiche peut sélectionner les autres niveaux configurés, à partir de leurs groupes HA existants ; l’éditeur permet d’ajouter ces groupes. Les groupes sont développés en entités terminales et dédupliqués ; les équipements indisponibles ou sans la capacité demandée sont ignorés avec un bilan. Les écrans de projection et portes/portails ne sont pas inclus.
- Un écran de projection affiche **Déployer / Rentrer**, avec un pourcentage de déploiement et une course maximale configurable. La limite est appliquée aux commandes envoyées depuis cette carte ; elle ne modifie pas les automatisations ou commandes natives externes. Un ancien retour de position supérieur à la limite reste affiché fidèlement.
- Les groupes de lumières sont développés en lampes uniques. Un seul ensemble **Tout allumer / Tout éteindre** commande la pièce. Le mode Lumières propose **Toutes les lumières du niveau**, les commandes individuelles et les commandes groupées. Le sélecteur découvre les autres niveaux avec éclairages par les registres natifs zones/appareils/entités ; les exclusions du plan courant sont respectées et les membres de groupes sont dédupliqués. Les repères de lumière se commandent sur le plan et deviennent lumineux quand le retour HA les indique allumés.
- La fiche possède deux vues : **Commandes** (accès courants et favoris) et **Équipements** (informations et réglages regroupés par appareil, repliés par défaut). Les capteurs de porte de type enum, les prises et les réglages principaux sont inclus, indépendamment de leur domaine. Les diagnostics/configurations automatiques restent exclus ; ils peuvent être ajoutés explicitement.
- La température ambiante est choisie explicitement dans l’éditeur. Aucune mesure d’appareil n’est automatiquement utilisée comme température de pièce. Les icônes d’entités utilisent le composant natif HA et ses personnalisations.
- Les détecteurs de fumée, de gaz et de fuite au repos sont masqués sur le plan et dans les commandes courantes. Ils restent dans l’inventaire et dans le mode de placement. Leur repère apparaît lors d’un signalement ; une alarme de fumée/fuite est prioritaire, un défaut de capteur relève de la maintenance. La carte ne remplace pas les fonctions d’alarme des équipements.
- Le pied de carte compte uniquement les signalements actifs : **Alertes**, **À récupérer**, **Piles**, **Entretien**, **Actifs**. Le panneau distingue Priorités, À récupérer, Piles, Entretien et Infos, avec filtres de niveau et de pièce. Une priorité de fumée/fuite est mise en évidence ; les ouvrants physiques ouverts sont aussi prioritaires. Les piles faibles possèdent leur propre catégorie ; défauts et consommables relèvent de l’entretien. Les appareils raccordés au suivi persistant restent **À récupérer** jusqu’à une ouverture réelle de leur porte après la fin du cycle, même si le programme conserve son ancien état terminé. Voir [le suivi natif](HOME-PLAN-COLLECTION.md). Un cycle natif non raccordé reste un signal brut ; une consommation nulle ne suffit pas à déduire une fin de cycle. Chaque appareil concerné possède un seul repère de signalement dans sa pièce. Les informations d’activité gardent un petit pictogramme bleu discret. Le repère affiche le nombre de besoins indépendants et adopte la couleur du plus prioritaire : alerte, piles, entretien, récupération, information. Un appui ouvre tous ses signalements ordonnés, même de catégories différentes. Les deux filtres d’un réfrigérateur ne produisent qu’un seul repère, tout en comptant deux interventions distinctes. Les règles utilisent les états courants et ne créent aucune notification externe.
- Un robot sur sa base est exclu du compteur actif, y compris pendant lavage/séchage en station. Seuls nettoyage/déplacement de retour hors base sont proposés par la règle domestique.
- Les actions de commande émettent le signal frontend HA `haptic` de type `light` immédiatement après validation. Un échec émet `failure` ; une commande groupée produit un seul signal initial. Les boutons, repères et curseurs partagent ce chemin. Le mode de placement et la navigation n’émettent pas d’acquittement de commande. Le message visible distingue envoi, réception API et état physique. La vibration dépend de l’app Companion et des réglages système ; elle n’est pas garantie dans Safari.
- La jauge d’un volet est pleine fermé et vide ouvert ; le texte reste le pourcentage ouvert. Celle d’un écran suit son déploiement. Les illustrations retenues sont conservées.
- Un équipement d’un groupe affecté à une autre zone reste dans sa propre pièce. Les commandes de pièce ne suivent pas aveuglément les anciens groupes globaux.

## Ajouter ou associer un équipement

Accueil → Modifier le tableau de bord → Modifier la carte **Maison** → éditeur visuel.

1. Choisir la pièce.
2. Choisir sa zone Home Assistant et activer l’affichage automatique pour suivre les associations de cette zone. Les affectations d’appareils et entités se gèrent dans Paramètres → Appareils et services → Zones. Les entités sans zone propre héritent de celle de leur appareil.
3. Ajouter des entités dans **Équipements ajoutés à cette pièce**. Cela configure la carte sans déplacer l’appareil dans le registre global. Les équipements automatiques indésirables peuvent être masqués.
4. Dans Fenêtres et portes, associer séparément le contact physique, le volet et l’éventuelle commande motorisée.
5. Le plan de placement montre tous les repères existants, y compris ceux du modèle. Glisser un détecteur, une lumière ou la commande d’une ouverture pour le placer. Les flèches du clavier déplacent de 5 unités (Maj : 1 unité) ; les champs X/Y restent disponibles. Le déplacement d’une commande ne change pas la géométrie de la fenêtre. **Placer les lumières** ajoute les lumières de la pièce qui n’ont pas encore de repère.
6. Enregistrer la carte dans Home Assistant.

Les repères de signalement peuvent être déplacés comme les autres. L’option **Afficher seulement si un signalement est actif** les masque au repos ; ils restent visibles dans le placement. Les repères automatiques peuvent aussi être sélectionnés et enregistrés sans persister leur contenu de notification.

Les identifiants de pièces, ouvertures et repères restent stables lors des modifications. Aucun équipement n’est renommé ou déplacé globalement par l’éditeur de la carte.

## Signalements et mode Art

L’éditeur **Alertes et informations** choisit le périmètre du plan ou de la maison, les zones/équipements exclus, les contacts physiques supplémentaires et des règles d’état ou de seuil. Les diagnostics pertinents de pile/défaut sont surveillés même quand ils ne figurent pas dans les commandes courantes. Un appareil mobile ou une zone réseau peut être exclu du résumé sans modifier son registre HA.

Une règle peut utiliser `state_entity` comme source et `aliases` pour plusieurs entités du même équipement. L’exception `unless` permet de traiter un mode Art confirmé comme repos et `idle_label` l’affiche dans la fiche. Une source inconnue ne prouve pas que la TV fonctionne. Aucune présence réseau n’est assimilée à un PC allumé. Les règles de consommables doivent utiliser les états fournis par leur intégration ; **installed** ne signifie pas vide. `fallback_for` conserve un diagnostic agrégé seulement lorsqu’aucune règle détaillée de sa liste n’est active. Les problèmes indépendants sont comptés séparément ; deux sources de la même pile ne créent pas deux avertissements.

Le résumé se met à jour avec HA ; il ne mémorise pas d’anciennes alertes. Un cycle reste « terminé » tant que l’intégration conserve cet état. Les inconnus/indisponibles ne sont pas transformés en états sains.

## Configuration et fichiers

Le module est générique. Les plans, illustrations, photos et identifiants de l’habitation restent hors du dépôt public.

```yaml
type: custom:home-plan-card
name: Maison
floor: Rez-de-chaussée
model_url: /local/example/plan.json?v=1
rooms:
  - id: living
    name: Séjour
    area_id: example_living
    auto_area: true
    entities:
      - light.example_living
apertures:
  - id: living_window
    room: living
    opening_entity: binary_sensor.example_window
    cover_entity: cover.example_living
cover_options:
  - entity: cover.example_screen
    kind: screen
    max_position: 90
    invert_position: false
notification_scope: plan
notification_rules:
  - id: example_filter
    entity: sensor.example_filter
    level: maintenance
    label: Filtre du purificateur
    states: [replace]
markers: []
```

Le modèle JSON contient `bounds: [x,y,largeur,hauteur]`, les surfaces de `rooms` (id, path, x/y/w/h, label), le tracé `artwork`, les `apertures` (id, room, segment, control) et les `markers` (id, room, point). Les photos/illustrations sont des URLs locales. `model` permet aussi un modèle incorporé pour les tests. Seules les URLs `/local/` de la même origine sont chargées ; le tracé SVG est limité aux primitives de dessin, sans scripts ou contenu HTML.

## Construction et contrôle

`node scripts/build_home_plan.mjs` produit `candidates/home-plan/home-plan-card.js` avec le runtime Lit verrouillé par `package-lock.json`. Aucun import CDN ou dépendance à une autre carte à l’exécution. Les [notices propres au candidat](HOME-PLAN-NOTICES.md) recensent le runtime ; la licence BSD est incorporée dans le module. Les notices du package HACS existant sont conservées à l’identique.

`node tests/home-plan-browser.mjs` contrôle les thèmes et formats 320/390/736 px, les cibles de commandes, l’indépendance contact/volet, l’absence d’état optimiste, les capacités, indisponibilités, erreurs de service et de plan, l’éditeur, l’héritage de zone et le nettoyage des abonnements, le dédoublonnage des groupes, les portes enum, les limites de course et les cibles des commandes groupées, ainsi que le glisser-déposer et le déplacement clavier sans action physique. Il utilise des doubles HA et ne commande aucun équipement réel. `CHROME_BIN` sélectionne Chromium. Les contrôles privés peuvent utiliser un modèle fourni hors Git.

`node tests/home-plan-notices.mjs` teste sans navigateur la classification, les inconnus, la déduplication, le mode Art, les consommables, les niveaux et la récupération. Ces contrats sont raccordés à la CI existante. Le banc navigateur reste local.

## Installation candidate et retour arrière

Avant modification, conserver la carte remplacée, la liste des ressources et les propriétés des seuls appareils/entités déplacés. Publier le module et les actifs dans de nouveaux chemins, vérifier les empreintes relues, puis remplacer uniquement la carte ciblée avec le `config_hash` courant. Une seule ressource de module est ajoutée. Aucun redémarrage HA n’est nécessaire.

Inverse : remettre la carte préservée par l’API Lovelace, rétablir les zones et noms capturés pour les appareils/entités concernés, puis supprimer uniquement la ressource candidate ajoutée si la carte n’est plus utilisée. Ne pas restaurer une sauvegarde globale pour cette modification locale. Les zones nouvelles peuvent rester vides ; leur suppression est une action distincte. Ne supprimer aucun fichier antérieur.

Statut d’installation et preuves exactes : `HOME-PLAN-PREVIEW.md` et `evidence/home-plan-native-2026-10-25.json`. Une recette simulée ne prouve ni l’exécution physique des moteurs ni le rendu sur l’iPhone de l’utilisateur.

Sources du retour tactile : [Companion Haptics](https://companion.home-assistant.io/docs/integrations/haptics/), `home-assistant/frontend` `src/data/haptics.ts` blob `55fab84f604a9cea50def54cc30b02d979685a36` et `src/common/dom/fire_event.ts` blob `3fe1f5103a5fde8d304fd538ef20d801ad56d6b4`, lus le 29 octobre 2026. Événement DOM natif documenté, sans nouvelle dépendance.
