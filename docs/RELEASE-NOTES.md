# HA-BOARD 0.2.0-rc.1 — candidate préparée

Pilote météo #12 : ressource indépendante, type YAML conservé, W1 corrigé, éditeur complet et catalogue. Les octets du bundle Personnes 0.1.2-rc.1 restent inchangés. Aucune publication, installation ni recette HA du candidat. Réserve de licence explicite avant publication ; voir WEATHER-PROVENANCE.md. Bascule et rollback par ressource dans HACS.md. Garage #13, Portail #14 et historique #10 exclus.

## Historique

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
