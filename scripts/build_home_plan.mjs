import {build} from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
const root=path.resolve(import.meta.dirname,'..');
const license=fs.readFileSync(path.join(root,'third_party/lit-BSD-3-Clause.txt'),'utf8');
await build({entryPoints:[path.join(root,'src/candidate/home-plan-card.js')],outfile:process.env.HOME_PLAN_BUILD_OUTPUT||path.join(root,'candidates/home-plan/home-plan-card.js'),bundle:true,format:'esm',platform:'browser',target:['es2022'],charset:'utf8',legalComments:'none',loader:{'.css':'text'},banner:{js:'/* HA-BOARD Home Plan 0.2.0-rc.2 | Lit incorporated | see THIRD-PARTY-NOTICES.md\n'+license.replaceAll('*/','* /')+'\n*/'}});
