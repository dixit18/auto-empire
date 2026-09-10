"""Eval goldens for Team 12 recall (40 cases). Seeds entries, queries, scores precision@3.
Usage: python scripts/eval-memory.py [--base http://localhost:4100]
Pass bar for P2: precision@3 >= 0.8. Cases live in empire/12-memory-layer/RESEARCH/goldens.json."""
import json, sys, urllib.parse, urllib.request

BASE = sys.argv[sys.argv.index("--base") + 1] if "--base" in sys.argv else "http://localhost:4100"

def call(method, path, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(BASE + path, data=data, method=method,
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

goldens = json.load(open("empire/12-memory-layer/RESEARCH/goldens.json", encoding="utf-8"))
USER = "eval-golden"
for g in goldens:
    for s in g["seed"]:
        call("POST", "/api/memory", {"user": USER, "text": s["text"], "kind": s.get("kind", "fact")})
hits, total = 0, 0
for g in goldens:
    r = call("GET", "/api/memory?user=%s&q=%s&limit=3" % (USER, urllib.parse.quote(g["q"])))
    texts = " ".join(h["text"].lower() for h in r.get("hits", []))
    ok = any(e.lower() in texts for e in g["expect"])
    total += 1
    hits += 1 if ok else 0
    if not ok:
        print("MISS:", g["q"], "-> wanted one of", g["expect"])
print("precision@3: %d/%d = %.2f %s" % (hits, total, hits / total, "PASS" if hits / total >= 0.8 else "FAIL"))
