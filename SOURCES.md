# Sources de référence

Consultation: 6 septembre 2026. Revalider avant une intervention dépendant d’une version. Les résumés sont des repères; les liens ne prouvent pas la compatibilité de notre installation.

| ID | Source | Usage |
|---|---|---|
| GH-01 | [GitHub / actions sûres](https://docs.github.com/en/actions/reference/security/secure-use) | Permissions réduites; SHA des actions; code non fiable isolé. |
| GH-02 | [GitHub / concurrence](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/control-workflow-concurrency) | Éviter les runs obsolètes, isoler la concurrence des déploiements. |
| GH-03 | [GitHub / templates](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository) | Les templates initialisent les projets; leur évolution doit être propagée explicitement. |
| GH-04 | [GitHub / rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) | Protection réellement activée; disponibilité dépend du plan/visibilité. |
| GH-05 | [GitHub / déclenchements](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow) | Vérifier les événements réels et effets du jeton utilisé sur le déclenchement des runs. |
| HA-01 | [HA / qualité intégrations](https://developers.home-assistant.io/docs/core/integration-quality-scale/) | Critères de configuration, stabilité, tests, diagnostics et maintenance; pas de label officiel pour nos customs. |
| HA-02 | [HA / carte personnalisée](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/) | Contrat setConfig/hass et intégration au frontend. |
| HA-03 | [HA / async](https://developers.home-assistant.io/docs/asyncio_working_with_async/) | Préserver la boucle événementielle et la gestion du cycle de vie. |
| PS-01 | [PrestaShop 9 / bonnes pratiques](https://devdocs.prestashop-project.org/9/modules/creation/good-practices/) | Modularité et conventions; adapter à la version réellement installée. |
| PS-02 | [PrestaShop 8 / hooks](https://devdocs.prestashop-project.org/8/modules/concepts/hooks/) | Étendre la boutique par points d’extension appropriés. |
| PS-03 | [PrestaShop 8 / overrides](https://devdocs.prestashop-project.org/8/modules/concepts/overrides/) | Overrides exclusifs, usage local exceptionnel et conflits à anticiper. |
| PS-04 | [PrestaShop 8 / update Webservice](https://devdocs.prestashop-project.org/8/webservice/tutorials/prestashop-webservice-lib/update-resource/) | Lecture puis édition de la ressource complète pour préserver son contenu. |
| MCP-01 | [MCP / sécurité](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) | Authentification et prévention du token passthrough. |
| MAP-01 | [HA / incident CARTO](https://github.com/home-assistant/frontend/issues/53800) | Incident signalé le 26 août 2026 pour HA 2026.8.3. |
| MAP-02 | [HA / remplacement fond de carte](https://github.com/home-assistant/frontend/pull/53816) | Fusion le 27 août: OpenStreetMap vectoriel et repli raster. |
| MAP-03 | [HA / changelog 2026.9](https://www.home-assistant.io/changelogs/core-2026.9/) | 2026.9.1 publié le 5 septembre, frontend 20260826.6. |
| MAP-04 | [HA / code frontend livré](https://github.com/home-assistant/frontend/blob/20260826.6/src/common/map/base-layer.ts) | Proxy HA pour tuiles, styles locaux, repli raster; aucune clé CARTO utilisateur. |
| MAP-05 | [CARTO / clé basemaps](https://carto.com/basemaps/apikey/) | Explique la demande de clé; ce n’est pas une configuration de notre wrapper HA. |

## Sources internes lues


- Comptes Courant: [standard NAS](https://github.com/smornierHA/comptes-courant/blob/main/docs/standards/WORKFLOW-GIT-GITHUB-DOCKER-AUTONOME.md), [stratégie CI du 6 septembre](https://github.com/smornierHA/comptes-courant/blob/main/docs/operations/CI-CD-STRATEGY.md), README et roadmap. La stratégie récente affine le standard historique.
- Livebox: [README de la branche autorisée](https://github.com/smornierHA/hass-livebox-component/blob/livebox-l2.17c/README.md) et [HA_LOGS_FORK.md](https://github.com/smornierHA/hass-livebox-component/blob/livebox-l2.17c/custom_components/livebox/HA_LOGS_FORK.md).
- MCP Perrotte: arbre main, package.json, MCP_CLIENT_STRATEGY.md et [preuve PUT mock-only](https://github.com/smornierHA/mp-mcp-hub/blob/main/docs/V0_3_14_2_PUT_SAFETY_TESTS_IMPLEMENTATION.md). Ce périmètre ne prouve pas la version du serveur connecté aujourd'hui.
- Frigate: frigate-reference-projet-2026-09-06.md, version documentaire R1, lue intégralement. Kit et preuve NAS restent des prérequis d'implémentation; ils n'ont pas été réaudités ni recopiés dans ce socle générique.
- HA en direct: code de person-history-map-card-v14, dashboard stratégie map, ressources et system health. Résumé expurgé dans evidence/observations-2026-09-06.json.

Chaque nouveau projet complète ce registre avec ses propres preuves et chemins. Ne pas embarquer de données domestiques/commerciales dans les templates. Pour reprendre Frigate, joindre séparément référence consolidée, kit, rapport V3 et capture DSM; ne pas remplacer ce dossier de reprise par ce socle général.

## Complément POC — observations de mise en œuvre

- Source originale Person History : SHA256 5f7eafddc9ad338e71030d759e373d51bfc6bf384e291b26cd11e5708031c0a4.
- Source originale Person Rich : SHA256 9b89f12c630750fe67000434b2ee9a9b92efab76413e83babad6a6ce17a18477.
- Collecte Lovelace complète : 22 vues traversées ; 8 cartes Rich et 1 History seulement, 42 ressources dont une de chaque. Rapprochement privé, exemples expurgés dans examples/.
- Référence Frigate actuelle relue : R2.6 du 6 septembre, intégration HA5.15.6 et lanceur E6D déjà déployés ; cette référence prime sur les statuts R1 ci-dessus.
- [CI Livebox observée](https://github.com/smornierHA/hass-livebox-component/actions/runs/33438188999) : échec environnement avant pytest sur head f5554bb.
- [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), relu le 6 septembre : disponibilité conditionnée plan/visibilité ; aucune protection privée vérifiable avant accès/création.
- [HA state object](https://www.home-assistant.io/docs/configuration/state_object/) : dates de mise à jour d'état distinctes d'une mesure GPS. Le contrat DATA-FRESHNESS est conservateur lorsque la source n'expose pas ce timestamp.
- [HA backups](https://www.home-assistant.io/common-tasks/general/#backups), relu le 6 septembre : archive chiffrée et clé/emergency kit, reprise à prévoir.

Les conclusions acquises sur CARTO ne sont pas un nouveau déploiement. Les dates de collecte complètes et empreintes se trouvent dans source-manifest.json et les rapports de tests.

## Rafraîchissement ciblé RC.4 — accès GitHub

Les constats initiaux d’inaccessibilité/protections non vérifiables sont historiques. Les trois dépôts sont maintenant accessibles et leurs README/main vérifiés ; tous non protégés, sans check requis. ha-board rulesets vide ; project-playbook et project-archives privés : API rulesets 403 avec exigence GitHub Pro. Preuve : evidence/github-bootstrap-2026-09-06.json. Cette reprise ne rafraîchit pas HA/Livebox/Frigate et ne modifie aucun JS produit.
