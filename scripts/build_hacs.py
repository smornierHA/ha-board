#!/usr/bin/env python3
from pathlib import Path
import hashlib, json

root = Path(__file__).resolve().parents[1]
sources = [root / "src/candidate/person-history-map-card-v14.js", root / "src/candidate/person-rich-card-v34.js"]
banner = "/* HA-BOARD 0.1.2-rc.1 | History 1.4.2 | Rich 3.4.7 */\n"
bundle = banner + "\n".join(p.read_text(encoding="utf-8").rstrip() for p in sources) + "\n"
target = root / "dist/ha-board.js"
target.parent.mkdir(exist_ok=True)
target.write_text(bundle, encoding="utf-8", newline="\n")
manifest = {"package_version":"0.1.2-rc.1","entrypoint":"dist/ha-board.js","sha256":hashlib.sha256(bundle.encode()).hexdigest(),"components":{"person-history-map-card-v14":"1.4.2","person-rich-card-v34":"3.4.7"}}
(root / "dist/manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False)+"\n", encoding="utf-8")
print(json.dumps(manifest))
