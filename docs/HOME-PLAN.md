# Plan de la maison — candidat autonome

`custom:home-plan-card` affiche un plan local, les pièces et leurs équipements réels. Le nom du sélecteur de cartes est **Plan de la maison**. Le candidat autonome ne modifie pas les distributions météo, Personnes ou Garage.

## Utilisation

- Plan / Pièces change la présentation. Pièces, Lumières, Temp., Ouvertures et Volets sélectionne les informations mises en évidence.
- Toucher une pièce ouvre sa fiche : illustration/photo, lumières, volets, contacts, détecteurs et autres équipements. Les équipements secondaires ouvrent leur fiche Home Assistant native.
- Toucher une fenêtre ou son repère donne les commandes du volet associé. Le pourcentage indique la fraction ouverte : 0 = fermé, 100 = ouvert. Les commandes respectent les capacités de l’entité ; une position inconnue désactive uniquement le réglage de position. Une entité indisponible désactive les commandes.
- Un contact physique reste indépendant du volet. L’orange repère une ouverture physique ; le bleu les volets. Les commandes n’inventent aucun retour d’état.
- Une porte commandée par impulsion présente **Actionner la porte** et un accès aux détails natifs ; aucun état physique n’est déduit de l’impulsion. Une protection de deux secondes évite les doubles appuis.
- Les commandes de volets se regroupent par pièce ; le mode **Volets** donne accès à **Tous les volets du niveau**. La fiche peut sélectionner les autres niveaux configurés, à partir de leurs groupes HA existants ; l’éditeur permet d’ajouter ces groupes. Les groupes sont développés en entités terminales et dédupliqués ; les équipements indisponibles ou sans la capacité demandée sont ignorés avec un bilan. Les écrans de projection et portes/portails ne sont pas inclus.
- Un écran de projection affiche **Déployer / Rentrer**, avec un pourcentage de déploiement et une course maximale configurable. La limite est appliquée aux commandes envoyées depuis cette carte ; elle ne modifie pas les automatisations ou commandes natives externes. Un ancien retour de position supérieur à la limite reste affiché fidèlement.
- Les groupes de lumières sont développés en lampes uniques. Un seul ensemble **Tout allumer / Tout éteindre** commande la pièce. Les repères de lumière se commandent sur le plan et deviennent lumineux quand le retour HA les indique allumés.
- La fiche possède deux vues : **Commandes** (accès courants et favoris) et **Équipements** (informations et réglages regroupés par appareil, repliés par défaut). Les capteurs de porte de type enum, les prises et les réglages principaux sont inclus, indépendamment de leur domaine. Les diagnostics/configurations automatiques restent exclus ; ils peuvent être ajoutés explicitement.
- La température ambiante est choisie explicitement dans l’éditeur. Aucune mesure d’appareil n’est automatiquement utilisée comme température de pièce. Les icônes d’entités utilisent le composant natif HA et ses personnalisations.
- Les détecteurs de fumée et autres alertes sont visibles dans la fiche et dans le résumé. Leurs repères deviennent des alertes lorsque le capteur le signale. La carte ne remplace pas les fonctions d’alarme des équipements.

## Ajouter ou associer un équipement

Accueil → Modifier le tableau de bord → Modifier la carte **Maison** → éditeur visuel.

1. Choisir la pièce.
2. Choisir sa zone Home Assistant et activer l’affichage automatique pour suivre les associations de cette zone. Les affectations d’appareils et entités se gèrent dans Paramètres → Appareils et services → Zones. Les entités sans zone propre héritent de celle de leur appareil.
3. Ajouter des entités dans **Équipements ajoutés à cette pièce**. Cela configure la carte sans déplacer l’appareil dans le registre global. Les équipements automatiques indésirables peuvent être masqués.
4. Dans Fenêtres et portes, associer séparément le contact physique, le volet et l’éventuelle commande motorisée.
5. Le plan de placement montre tous les repères existants, y compris ceux du modèle. Glisser un détecteur, une lumière ou la commande d’une ouverture pour le placer. Les flèches du clavier déplacent de 5 unités (Maj : 1 unité) ; les champs X/Y restent disponibles. Le déplacement d’une commande ne change pas la géométrie de la fenêtre. **Placer les lumières** ajoute les lumières de la pièce qui n’ont pas encore de repère.
6. Enregistrer la carte dans Home Assistant.

Les identifiants de pièces, ouvertures et repères restent stables lors des modifications. Aucun équipement n’est renommé ou déplacé globalement par l’éditeur de la carte.

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
markers: []
```

Le modèle JSON contient `bounds: [x,y,largeur,hauteur]`, les surfaces de `rooms` (id, path, x/y/w/h, label), le tracé `artwork`, les `apertures` (id, room, segment, control) et les `markers` (id, room, point). Les photos/illustrations sont des URLs locales. `model` permet aussi un modèle incorporé pour les tests. Seules les URLs `/local/` de la même origine sont chargées ; le tracé SVG est limité aux primitives de dessin, sans scripts ou contenu HTML.

## Construction et contrôle

`node scripts/build_home_plan.mjs` produit `candidates/home-plan/home-plan-card.js` avec le runtime Lit verrouillé par `package-lock.json`. Aucun import CDN ou dépendance à une autre carte à l’exécution. Les [notices propres au candidat](HOME-PLAN-NOTICES.md) recensent le runtime ; la licence BSD est incorporée dans le module. Les notices du package HACS existant sont conservées à l’identique.

`node tests/home-plan-browser.mjs` contrôle les thèmes et formats 320/390/736 px, les cibles de commandes, l’indépendance contact/volet, l’absence d’état optimiste, les capacités, indisponibilités, erreurs de service et de plan, l’éditeur, l’héritage de zone et le nettoyage des abonnements, le dédoublonnage des groupes, les portes enum, les limites de course et les cibles des commandes groupées, ainsi que le glisser-déposer et le déplacement clavier sans action physique. Il utilise des doubles HA et ne commande aucun équipement réel. `CHROME_BIN` sélectionne Chromium. Les contrôles privés peuvent utiliser un modèle fourni hors Git.

## Installation candidate et retour arrière

Avant modification, conserver la carte remplacée, la liste des ressources et les propriétés des seuls appareils/entités déplacés. Publier le module et les actifs dans de nouveaux chemins, vérifier les empreintes relues, puis remplacer uniquement la carte ciblée avec le `config_hash` courant. Une seule ressource de module est ajoutée. Aucun redémarrage HA n’est nécessaire.

Inverse : remettre la carte préservée par l’API Lovelace, rétablir les zones et noms capturés pour les appareils/entités concernés, puis supprimer uniquement la ressource candidate ajoutée si la carte n’est plus utilisée. Ne pas restaurer une sauvegarde globale pour cette modification locale. Les zones nouvelles peuvent rester vides ; leur suppression est une action distincte. Ne supprimer aucun fichier antérieur.

Statut d’installation et preuves exactes : `HOME-PLAN-PREVIEW.md` et `evidence/home-plan-native-2026-10-25.json`. Une recette simulée ne prouve ni l’exécution physique des moteurs ni le rendu sur l’iPhone de l’utilisateur.
