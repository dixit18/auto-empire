"""Rebuild second-video: 5 captioned scenes (PIL) + 15s vertical MP4 (ffmpeg zoompan). Run: python build.py"""
import os, subprocess
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, "assets")
os.makedirs(A, exist_ok=True)
W, H = 720, 1280
INK, CREAM, RED, GOLD = (23, 19, 16), (244, 237, 222), (200, 51, 37), (185, 138, 29)
FB, FR = "C:/Windows/Fonts/arialbd.ttf", "C:/Windows/Fonts/arial.ttf"
def font(sz, bold=True): return ImageFont.truetype(FB if bold else FR, sz)
def wrap(d, text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= maxw: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur); return lines
beats = [
    ("BEAT 1 — HOOK", "A $9.99 PLANNER", "outsells most SaaS", RED),
    ("BEAT 2 — NUMBERS", "10,500 REVIEWS", "do the math", GOLD),
    ("BEAT 3 — SECRET 1", "UNDATED = NO GUILT", "print only what you use", RED),
    ("BEAT 4 — SECRET 2", "BUNDLES BEAT SINGLES", "$6 order becomes $15", GOLD),
    ("BEAT 5 — CTA", "STEAL THE PLAYBOOK", "on the channel", RED),
]
for i, (kick, head, sub, acc) in enumerate(beats, 1):
    img = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 26], fill=acc)
    d.text((48, 120), kick, font=font(34), fill=acc)
    y = 200
    for ln in wrap(d, head, font(92), W - 96):
        d.text((48, y), ln, font=font(92), fill=CREAM); y += 108
    y += 24
    for ln in wrap(d, sub, font(44, False), W - 96):
        d.text((48, y), ln, font=font(44, False), fill=(180, 168, 145)); y += 58
    d.text((48, H - 120), "AUTO EMPIRE · TEAM 02 × 05", font=font(28, False), fill=(120, 110, 95))
    img.save(os.path.join(A, "scene-%d.png" % i))
segs = []
for i in range(1, 6):
    seg = os.path.join(A, "seg%d.mp4" % i)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", os.path.join(A, "scene-%d.png" % i),
        "-vf", "scale=1440:2560,zoompan=z='max(zoom-0.0012,1.0)':d=90:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=720x1280:fps=30",
        "-t", "3", "-c:v", "libx264", "-pix_fmt", "yuv420p", seg], check=True)
    segs.append(seg)
lst = os.path.join(A, "list.txt")
open(lst, "w").write("".join("file '%s'\n" % s.replace("\\", "/") for s in segs))
out = os.path.join(HERE, "video.mp4")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", out], check=True)
print("built", out, os.path.getsize(out), "bytes")
