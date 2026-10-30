## Plan — deuxième pièce et détails du 30 octobre 2026

Le candidat autonome **0.13.0-rc.1** ajoute les primitives génériques ruban LED, bibliothèque à cases et purificateur vertical. Le modèle privé de la pièce pilote corrige trois détails sans déplacer les autres objets ; une seconde pièce reçoit ses vues 2D/3D, deux fenêtres et volets indépendants et douze associations natives vérifiées. Les scènes conservent éclairage solaire/local, sélection directe, édition des meubles et repères, cadrage et animations bornées. Les touches consécutives de placement lisent désormais la position enregistrée plutôt que celle du dernier dessin. Tests des nouvelles primitives, éclairage, interactions/éditeur et contrats existants réussis ; deux scènes privées sur quatre largeurs. Installé : quatre fichiers et configuration relus, seule ressource du plan actualisée et 43 autres conservées. Code et fixtures fictives publics ; photos, contours et associations domestiques privés. Preuve : `evidence/home-plan-room-expansion-2026-10-30.json`. Pas de fusion, release HACS ni recette physique iOS revendiquée.

Les objets `led-strip`, `shelf` et `tower-fan` utilisent la même scène locale. Les bibliothèques acceptent `columns` et `rows` entiers de 1 à 6 ; la géométrie est bornée. Les rubans suivent leur entité `light` et participent à l’éclairage de proximité. Un purificateur ne devient jamais une source de lumière. Les façades et placards utilisent `wallNormal` pour disparaître depuis l’extérieur. Les scènes de chaque pièce restent indépendantes ; la configuration d’une pièce ne remplace pas celle d’une autre.

# Plan de la maison — candidat autonome

`custom:home-plan-card` affiche un plan local, les pièces et leurs équipements réels. Le nom du sélecteur de cartes est **Plan de la maison**. Le candidat autonome ne modifie pas les distributions météo, Personnes ou Garage.

## Plusieurs niveaux

Le sélecteur du bandeau choisit le plan affiché. Le mode Lumières / Temp. / Ouvertures / Volets est conservé lors du changement ; les fiches précédentes sont fermées. Les associations, géométries et positions appartiennent à chaque niveau. Dans l’éditeur, choisir **Niveau** avant la pièce : déplacer un repère ne réécrit pas les positions d’un autre plan. Les politiques de volets et règles de signalement sont partagées. Une erreur de chargement conserve le sélecteur pour revenir à un autre niveau.

La configuration existante reste le niveau principal. `level_name` donne son libellé court. `levels` ajoute jusqu’à dix entrées uniques avec `id`, `floor`, `level_name`, `model_url` (ou `model`), `rooms`, `apertures` et `markers`. Ces listes sont propres au niveau et ne se mélangent pas aux listes du niveau principal. Les repères visuels mesurent 24 px, avec pictogramme de 14 px et cible tactile de 44 px. Un repère non concerné par le focus reste accessible avec une opacité réduite, comme les portes et volets.

Une pièce peut choisir une entité `climate` et `temperature_attribute: current_temperature` pour sa mesure ambiante. L’état `heat` et la consigne ne sont jamais utilisés comme température. Un modèle peut activer `compact_temperatures: true` pour une lecture à une décimale avec symbole degré sur le plan ; la fiche et le libellé accessible gardent la valeur complète et l’unité. Le périmètre **Pièces du plan** découvre aussi les diagnostics piles/défauts des zones du niveau et écarte les règles associées à un autre niveau. **Toute la maison** conserve une vue globale.

Les commandes groupées de volets découvrent également les autres niveaux natifs, développent les groupes en équipements terminaux et évitent un groupe identique au niveau courant. Les miniatures des volets et de l’écran restent inchangées.

## Proportions et ouvertures

La vignette du second niveau reprend les dimensions rendues de celle du premier ; le cadrage réserve l’espace nécessaire au-dessus des murs sans réduire l’échelle du dessin existant. Les boutons d’ouvrants et les jauges sont extérieurs et espacés selon la référence du premier niveau. Les placards du modèle privé épousent les limites des murs et baies, avec quatre vantaux pour les deux grands et deux pour les autres. Les coordonnées des repères d’équipement existants sont préservées.

## Chauffage et thermostats

La vue **Chauffage** remplace le libellé Temp. sur les niveaux équipés ; le mode technique `temperature` reste compatible. Le plan montre la mesure ambiante choisie, puis → la consigne en vue Chauffage. Il n’ajoute pas de repère flottant. L’activité utilise uniquement `hvac_action` : le mode `heat` et une température inférieure à la consigne ne prouvent pas une chauffe. Le mode HVAC définit l’activation : `heat` signifie **Activé**, `off` signifie **Éteint**. Une activité `idle` ou `off` avec mode Chauffage affiche **Activé · Au repos**, sans prétendre que le radiateur chauffe. Un profil STOP ne remplace jamais ce mode. Seul un vrai retour mode `off` + activité heating/cooling reste **À vérifier**.

Toucher une pièce équipée ouvre le thermostat, avec les commandes natives **Chauffage / Éteint** toujours accessibles, − / +, la mesure propre au régulateur, puis les profils dans **Profils du thermostat** replié. Le profil STOP conserve son libellé natif pour éviter de le confondre avec l’activation. Les détails HA restent accessibles. La fiche normale possède aussi un raccourci Chauffage. La mesure du thermostat peut différer d’un capteur indépendant explicitement choisi pour le plan ; la source est libellée. Auto, Confort, Éco, Hors-gel et STOP ne sont proposés que s’ils figurent dans les profils annoncés ; aucune programmation ni valeur de profil n’est inventée. Le panneau concerne le chauffage ; les autres fonctions éventuelles restent dans les détails HA.

Les thermostats sont découverts par les zones natives ou ajoutés explicitement avec `climate_entities` sur la pièce (sélecteur multiple dans l’éditeur). Les entités sont dédupliquées par niveau. Une consigne respecte les limites et le pas annoncés (0,5° si aucun pas n’est fourni). Sans cible ou bornes utilisables, le réglage reste désactivé. Les modes disponibles peuvent rester accessibles.

Une valeur demandée possède son propre état visuel ; elle n’est jamais écrite dans `hass.states`. Le retour HA confirme la cible. Après 15 secondes sans confirmation, la valeur native est réaffichée et la demande sans retour reste signalée. Des incréments successifs utilisent la dernière demande acceptée ; aucune relance automatique. Changer de niveau ou détacher la carte nettoie les demandes et temporisations. Les acquittements haptiques suivent le chemin de commande existant.

**Chauffage du niveau** présente les zones et ouvre leur thermostat. **Réglage pour tout le niveau** est replié : choisir une commande commune aux zones disponibles dans **Activation** ou **Profils du thermostat**, puis **Appliquer**. L’aperçu distingue le nombre de thermostats activés du nombre en chauffe. Les consignes restent individuelles. Les zones indisponibles sont ignorées et le bilan révèle les refus/échecs partiels. Aucun changement n’a lieu à la sélection d’un niveau, d’une pièce ou d’un mode dans le formulaire collectif.

Sources API : [Climate](https://www.home-assistant.io/integrations/climate/) et [Climate entity](https://contributors.home-assistant.io/core/entities/climate/).

## Côté de représentation du volet

Une ouverture peut définir `shutter_offset` dans le modèle ou ses associations : nombre de −40 à +40 unités du plan. Un décalage négatif place la barre à gauche d’un segment vertical ou au-dessus d’un segment horizontal ; un positif la place à droite ou en dessous. Les coordonnées du bouton restent indépendantes. Sans option, la convention existante est conservée (−12 vertical, +12 horizontal). Le décalage déplace seulement le dessin de progression ; le contact, les pourcentages et les commandes de volet ne changent pas.

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

## Explorer une pièce — 0.7.0-rc.2

Toucher une pièce ou la vignette ouvre une vue dédiée, avec visuel et commandes côte à côte sur grand écran et superposés dans le flux sur mobile. Illustration, photos et cadrage 2D restent accessibles. Une pièce disposant d’un modèle meublé ajoute les vues 2D/3D et des repères qui sélectionnent une commande, sans déclencher l’appareil. Sur mobile, la scène se compacte et reste visible lorsqu’une commande de repère est ouverte. Les commandes existantes, miniatures de volets, haptique et retours natifs sont conservés.

Le plan propose + / − / recentrage (100–300 %), déplacement à la souris ou au doigt après zoom, et un glissement horizontal pour le niveau voisin à 100 %. Le défilement vertical reste disponible à 100 % ; le mode placement conserve ses coordonnées et son glisser-déposer. Les boutons de niveau restent accessibles au clavier.

Modèle privé facultatif par pièce : `scene_url: /local/rooms/example.json`, `scene_entities: {desk: light.example, shutter: cover.example}`. Un `scene` inline équivalent convient aux aperçus hors ligne. Format version 1 : `size: [4, 3.5]`, contour facultatif `outline: [[-2,-1.75],[2,-1.75],[2,1.75],[-2,1.75]]`, `objects: [{type: bed, at: [0,0,0], size: [1.4,1.2,2]}]`, `hotspots: [{key: desk, label: Bureau, icon: mdi:desk-lamp, at: [-1,1,0]}]`. Les coordonnées du modèle utilisent x, hauteur y, profondeur z ; rotation autour de y en degrés. Les dimensions et le mobilier reconstitués visuellement ne constituent pas un relevé coté.

Le renderer WebGL2 est local, sans CDN, dépendance 3D externe, abonnement HA ni boucle de rendu permanente. Il dessine au changement de caméra, d’état ou de taille ; seule une scène visible avec TV ou écran PC actif peut demander une animation bornée, décrite ci-dessous. À la sortie, observateur, frame, buffers, programmes, textures et contexte GPU sont libérés. Le cache de modèles est borné à huit ; les requêtes sont annulées et les réponses tardives ignorées. Sans WebGL2, le plan meublé 2D conserve les commandes. Les pièces sans scène continuent de fonctionner. Les photos, géométries et associations réelles restent hors du dépôt public.

## Objets interactifs et configuration de pièce — 0.8.0-rc.1

En 3D, les pictogrammes flottants laissent place aux objets eux-mêmes : toucher une télévision, un PC, un éclairage mural ou la fenêtre sélectionne sa géométrie en bleu et affiche les commandes associées. Cette sélection ne déclenche aucun service. La liste sous la scène reste disponible pour le clavier et les composants de petite taille. Le volet se sélectionne sur son coffre ou son tablier ; le cadre et le vitrage sélectionnent le contact de fenêtre. Une caméra de capture de couleurs peut partager l’entité de son éclairage d’ambiance, sans inventer un flux vidéo.

Le signal qui anime un objet est défini par `bind`, puis l’entité correspondante dans `scene_entities`. Un repère accepte `states` pour préciser ses états actifs ; par exemple `['home']` pour une détection réseau de PC. Ce signal reste distinct de la lampe du bureau. Une présence réseau ne confirme pas à elle seule que l’ordinateur est alimenté. Les écrans ont une face active orientée vers la pièce. La TV utilise une animation originale de style manga à 10 images/s au maximum, uniquement lorsqu’elle est active et visible. Sortie de pièce, mode photo/2D, scène hors champ, onglet masqué et réduction des animations arrêtent le rendu animé ; aucun abonnement ni polling HA n’est ajouté.

Dans **Modifier la carte**, choisir le niveau et la pièce, puis **Pièce 2D / 3D**. L’onglet comprend Disposition 2D, Aperçu 3D, choix de l’objet, déplacement tactile et au clavier, coordonnées, dimensions, rotation, couleur, cadrage initial et associations HA. Le déplacement groupé peut être désactivé pour ajuster un élément séparément. Les objets d’architecture verrouillés ne sont pas déplacés. Cliquer sur **Enregistrer** dans l’éditeur HA conserve les modifications dans la configuration de la carte, sous `scene` ; le modèle local initial est conservé sous `scene_url` pour rétablir la disposition. Les associations restent propres à cette carte. Aucune commande d’appareil n’est envoyée depuis l’éditeur.

Les identifiants `id` des objets et les groupes `group` permettent l’édition. Un repère peut suivre un objet par `object` et un décalage local `offset` : ses commandes restent alignées après déplacement et rotation. La configuration réelle, l’annotation, les photos et le mobilier domestique restent privés.


## Murs adaptatifs et écrans séparés — 0.9.0-rc.1

La scène efface les parois placées entre la caméra et l’intérieur de la pièce, avec une transition d’opacité suivant l’angle horizontal. Les parois opposées restent pleines. Le bouton **Murs** désactive ce comportement pour inspecter les volumes complets. Une paroi effacée laisse sélectionner l’objet situé derrière ; une paroi pleine conserve son occlusion. Le mode 2D reste inchangé.

Un objet d’architecture peut fournir `wallNormal: [nx, nz]`, normale horizontale dirigée vers l’intérieur, dans le repère global de la scène. Le renderer sépare les passes opaque/transparente et adapte les ombres sans reconstruire le mobilier lors de la rotation. L’architecture privée garde des identifiants stables. Le dressing `wardrobe-inset` représente deux portes au nu du mur, sans armoire autonome.

Le type `monitor` représente un écran orienté avec son pied ; plusieurs écrans peuvent partager `bind: pc`. Le bureau accepte `screen: false` pour retirer son écran intégré et `openRight: true` pour un piètement ouvert. Le jeu spatial est un dessin original du shader, animé au maximum à 10 images/s dans une unique minuterie partagée avec la TV. L’état PC reste celui de la source configurée ; une détection réseau ne devient pas une mesure d’alimentation.

Les Nanoleaf `lines` acceptent `segments: [[[x1,y1],[x2,y2]], ...]` et les `blocks` des `panels: [[x,y,largeur,hauteur], ...]` en coordonnées locales métriques, avant rotation de l’objet. Les formats précédents restent valides. Les segments et panneaux suivent le déplacement et la rotation du groupe ; leurs dimensions locales sont définies dans le modèle.


## Cadrage et vue initiale — 0.10.0-rc.1

Les parois proches définies par `wallNormal` sont désormais entièrement masquées, sans seconde passe transparente. Leur ombre et leur interception de la sélection sont retirées ensemble ; le bouton **Murs** restaure les volumes opaques. La géométrie reste en mémoire, sans reconstruction lors de l’orbite.

En 2D, la taille du SVG comprend ses marges. Le dessin reste centré et entier au cadrage initial ; ses commandes sont en haut à droite. La chaise suit les dimensions configurées. Les zooms 2D et 3D sont distincts : passer par le plan 2D ne remplace pas le cadrage 3D. `scene.camera.zoom` accepte 0,7 à 2,6 ; le zoom 3D initial vaut 1,12 sans valeur explicite, celui du plan 2D vaut 1. **Garder ce cadrage** conserve angle et zoom 3D.

Dans **Modifier la carte**, choisir niveau et pièce, puis **Vue par défaut de cette pièce** : Illustration, Plan 2D ou Vue 3D, puis enregistrer dans Home Assistant. Le champ de pièce `default_view` prend `illustration`, `2d` ou `3d`. Le choix s’applique à chaque ouverture de la pièce ; les onglets restent utilisables pendant la visite. Si l’image ou la scène choisie manque, la vue 2D prend le relais. En l’absence de configuration, le comportement précédent est conservé (3D si une scène existe, sinon illustration disponible, sinon 2D).


## Placer les entités sur le plan de pièce — 0.11.0-rc.1

Dans **Modifier la carte → niveau → pièce → Pièce 2D / 3D**, choisir **Équipements 2D**. Tous les repères du modèle sont affichés, y compris les équipements indisponibles. Toucher une icône ou la choisir dans **Repère d’équipement**, puis la glisser, utiliser les flèches (5 cm ; Maj 1 cm) ou saisir X/Y. L’association Home Assistant du repère sélectionné reste modifiable sous le plan. Terminer par **Enregistrer** dans l’éditeur HA.

`hotspots[].plan: [x, z]` remplace uniquement l’emplacement de l’icône dans le plan 2D, en mètres. Le meuble et l’ancrage 3D (`object`/`offset` ou `at`) sont conservés. **Replacer sur l’objet** retire cette position manuelle et rétablit le suivi automatique. Les positions sont chargées lors des visites et des éditions suivantes. Le zoom de travail reste conservé pendant le placement ; les drags annulés ne changent pas la configuration et chaque geste garde son identifiant de pointeur. Aucun placement ne commande l’équipement.

**Meubles 2D** conserve les outils de mobilier et **Aperçu 3D** permet d’inspecter le résultat. Un meuble intégré peut employer `wallNormal` pour disparaître entièrement avec le mur depuis l’arrière ; son cadre et ses portes partagent ce masquage.


## Lumière et définition — 0.12.0-rc.1

La scène 3D lit le soleil HA (`sun.sun` par défaut, ou champ de pièce `scene_sun_entity`) depuis le snapshot déjà transmis à la carte. L’élévation fait varier jour/crépuscule/nuit ; les volets des fenêtres utilisent leur `current_position` de 0 % fermé à 100 % ouvert, avec repli sur leur état explicite. Un état solaire ou de volet inconnu utilise une ambiance neutre. Les repères 2D restent sur leur fond clair.

La couleur RGB, la température de blanc ou HS et la luminosité des éclairages actifs déterminent des halos locaux sur le sol, les murs et le mobilier. Les objets partageant une même entité forment une seule source ; les repères dépourvus de maillage lumineux peuvent employer leur ancrage 3D. Le champ `plan` de placement 2D ne déplace pas une source lumineuse. Le nombre de sources envoyé au GPU est limité à huit. Le calcul est une approximation de présentation ; il ne remplace pas un relevé de lux et ne calcule pas des ombres séparées pour chaque lampe.

Sur pointeur fin, le dessin utilise 1,5x au minimum, jusqu’à 2,5x suivant la densité de l’écran et un plafond de 2,6 millions de pixels ; les ombres passent à 2048 px. Sur appareil tactile, le plafond reste 2x et 1,2 million de pixels, avec ombres 1024 px. Les limites du GPU sont respectées. Une écoute de changement de densité suit le passage entre écrans ou le zoom du navigateur, puis est retirée au détachement.

Les variations solaires modifient les uniforms sans reconstruire la géométrie. Un éclairage statique n’ajoute aucune boucle de rendu ; les règles de visibilité et la minuterie commune à 10 images/s des écrans animés sont conservées. Aucun service, polling ou abonnement HA supplémentaire. Vérifications locales : `node tests/home-plan-lighting.mjs` et `CHROME_BIN=... node tests/home-plan-ambience.mjs`.
