# Contrat CI et livraison

| Niveau | Contrôles | Preuve et limite |
|---|---|---|
| Documentaire | Structure minimale des documents | Aucune validité applicative |
| Baseline import | Cas fictifs sur sources intactes | 19 cas, 7 passent, 12 échouent ; produit non livrable |
| Rapide draft | Syntaxe, confidentialité, tests ciblés | Correctifs ciblés testés |
| Complet PR prête | Contrats stricts, cycles async, navigation, fraîcheur, recette locale pertinente | Révision candidate testée dans environnements cités |
| Révision intégrée | Checkout SHA fusionné, mêmes tests stricts et scan avant artefact | Combinaison réellement intégrée validée |
| Production | Version chargée + recette /map et Personnes | Usage réel pour les cases cochées |

Les workflows distants sont actifs sur les PR ; le workflow applicatif s’exécute également sur `main`. Le workflow documentaire hérité reste nommé comme tel. Le harnais baseline retourne 1 sur les défauts : ne jamais ajouter continue-on-error ni inverser ce résultat pour autoriser une release.

Le [recadrage du 8 septembre 2026](https://github.com/smornierHA/ha-board/pull/9#issuecomment-5581020279) autorise les pushes cohérents et les CI légères normales de PR dans leur lot, sans revue préalable à chaque CI et sans commits maintenus hors branche pour les éviter. Il prime sur l’ancien séquencement draft/rapide puis ready/complet. Pas de double pipeline lourd push + PR. Une PR modifiée invalide ses preuves. Une base évoluée exige revalidation de la combinaison ; un succès ancien du seul head ne suffit pas. Une revalidation courte sur SHA intégré est proportionnée au coût de ces cartes.

Concurrence par PR, annulation des runs dépassés, timeouts explicites. Précondition KO = arrêt avant déploiement, sans attente de plusieurs minutes. Mesurer durée/jobs/runs par révision sans confondre durée et facturation. Actions épinglées par SHA vérifié, permissions minimales, aucun secret/runner production pour PR. Les protections et possibilités de bypass sont à rafraîchir avant une livraison qui en dépend ; les droits admin d’autres dépôts n’en prouvent pas l’existence.

Une fusion, même documentaire, déclenche le job candidate sur `main`. Pour une version déjà publiée, le script vérifie l’ascendance du tag et l’identité du bundle, puis ne republie rien si ces conditions sont remplies ; voir [HACS](HACS.md#effet-dune-fusion-documentaire). Les promotions stables, installations et commandes HA restent des décisions distinctes.

## Contrôles météo #12

Le même workflow de PR contrôle les empreintes météo, les valeurs effectives et allers-retours de l’éditeur, la méthode HACS installée sur ressources fictives, les contrats sources/distribution, les 43 contrats Personnes et le rendu Chrome sur données fictives. Pas de workflow produit supplémentaire doublonnant push/PR. Les captures de la simulation sont jointes au run avec rétention 14 jours, nommées par le SHA réellement checkouté. Le fichier météo ne dépend d’aucun module JS externe. Le publisher vérifie tous les artefacts et notices ; la provenance `verified` doit rester reliée aux notices manifestées.

Le contrôle léger `scripts/check_project_docs.py` confronte aussi `dist/manifest.json` au README destiné à HACS (version de release et modules distribués) et au titre courant des notes de livraison. Il ne prouve ni fraîcheur du cache HACS ni installation ; la vérification après déploiement reste décrite dans [HACS](HACS.md#documentation-à-chaque-livraison).
