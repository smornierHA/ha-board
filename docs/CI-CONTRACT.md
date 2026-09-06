# Contrat CI et livraison

| Niveau | Contrôles | Preuve et limite |
|---|---|---|
| Documentaire | Structure minimale des documents | Aucune validité applicative |
| Baseline import | Cas fictifs sur sources intactes | 19 cas, 7 passent, 12 échouent ; produit non livrable |
| Rapide draft | Syntaxe, confidentialité, tests ciblés | Correctifs ciblés testés |
| Complet PR prête | Contrats stricts, cycles async, navigation, fraîcheur, recette locale pertinente | Révision candidate testée dans environnements cités |
| Révision intégrée | Checkout SHA fusionné, mêmes tests stricts et scan avant artefact | Combinaison réellement intégrée validée |
| Production | Version chargée + recette /map et Personnes | Usage réel pour les cases cochées |

Aucune CI distante dans cette préparation. Le workflow documentaire hérité reste nommé comme tel. Le harnais baseline retourne 1 sur les défauts : ne jamais ajouter continue-on-error ni inverser ce résultat pour autoriser une release.

Stratégie inspirée de Comptes Courant : draft/rapide, ready/complet ; pas de double pipeline lourd push + PR. Une PR modifiée invalide ses preuves. Une base évoluée exige revalidation de la combinaison ; un succès ancien du seul head ne suffit pas. Une revalidation courte sur SHA intégré est proportionnée au coût de ces cartes.

Concurrence par PR, annulation des runs dépassés, timeouts explicites. Précondition KO = arrêt avant déploiement, sans attente de plusieurs minutes. Mesurer durée/jobs/runs par révision sans confondre durée et facturation. Actions épinglées par SHA vérifié, permissions minimales, aucun secret/runner production pour PR. Protections et bypass à relever dès accès ; les droits admin d'autres dépôts n'en prouvent pas l'existence.
