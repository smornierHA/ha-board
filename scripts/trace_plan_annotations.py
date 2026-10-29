#!/usr/bin/env python3
"""Trace colored annotation pixels without inferring walls or room layout.

Private input images and generated geometry belong outside this public repository.
Requires Pillow and NumPy in the preparation environment, not in Home Assistant.
"""
from pathlib import Path
import argparse
import hashlib
import json
import numpy as np
from PIL import Image


def rectangles(mask):
    """Losslessly merge equal horizontal pixel runs across adjacent rows."""
    active, result = {}, []
    for y in range(mask.shape[0] + 1):
        row = mask[y] if y < mask.shape[0] else np.zeros(mask.shape[1], dtype=bool)
        edges = np.flatnonzero(np.diff(np.pad(row.astype(np.int8), (1, 1))))
        runs = set(zip(edges[::2].tolist(), edges[1::2].tolist()))
        for run in list(active):
            if run not in runs:
                start = active.pop(run)
                result.append((run[0], start, run[1] - run[0], y - start))
        for run in runs:
            if run not in active:
                active[run] = y
    return result


def trace(source):
    image = Image.open(source).convert('RGBA')
    rgba = np.asarray(image).astype(np.int16)
    r, g, b, a = (rgba[:, :, n] for n in range(4))
    masks = {
        'walls': (r > 180) & (g < 120) & (b < 130) & (a > 20),
        'doors': (g > 100) & (g > r * 1.3) & (g > b * 1.15) & (a > 20),
        'windows': (b > 160) & (g > 105) & (r < 130) & (a > 20),
        'stairs': (b > r * 1.3) & (b > g * 1.12) & (r < 70) & (g < 90) & (a > 20),
    }
    layers = {}
    for name, mask in masks.items():
        rects = rectangles(mask)
        rebuilt = np.zeros(mask.shape, dtype=bool)
        for x, y, w, h in rects:
            rebuilt[y:y+h, x:x+w] = True
        assert np.array_equal(mask, rebuilt), name
        layers[name] = {'pixels': int(mask.sum()), 'rectangles': len(rects),
                        'path': ''.join(f'M{x} {y}h{w}v{h}h{-w}Z' for x,y,w,h in rects)}
    return {'width': image.width, 'height': image.height,
            'source_sha256': hashlib.sha256(Path(source).read_bytes()).hexdigest(),
            'method': 'Exact classified-pixel coverage; no inferred walls or openings.',
            'layers': layers}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    result = trace(args.input)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({key: {k:v for k,v in value.items() if k != 'path'}
                      for key,value in result['layers'].items()}))
