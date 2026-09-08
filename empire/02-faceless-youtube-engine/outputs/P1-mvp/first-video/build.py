"""Rebuild first-video: 5 captioned scenes (PIL) + 15s vertical MP4 (ffmpeg zoompan). Run: python build.py"""
import os, subprocess
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, "assets")
os.makedirs(A, exist_ok=True)
W, H = 720, 1280
INK, CREAM, RED = (23, 19, 16), (244, 237, 222), (200, 51, 37)
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
    ("BEAT 1 — HOOK", "THE $647 VET BILL", "for a 12-year-old's teeth"),
    ("BEAT 2 — FEAR", "ANESTHESIA AT 13?", "owners are scared — rightly"),
    ("BEAT 3 — TURN", "THE $35 RITUAL", "gel + brush + 14 days"),
    ("BEAT 4 — PROOF", "DAY 1 → DAY 14", "phone camera. no acting."),
    ("BEAT 5 — CTA", "FULL STORY", "on the channel. link below."),
]
for i, (kick, head, sub) in enumerate(beats, 1):
    img = Image.new("RGB", (W, H), INK); d = ImageDraw.Draw(img)
    d.rectangle([0, 0, W, 26], fill=RED)
    d.text((48, 120), kick, font=font(34), fill=RED)
    y = 200
    for ln in wrap(d, head, font(96), W - 96):
        d.text((48, y), ln, font=font(96), fill=CREAM); y += 112
    y += 24
    for ln in wrap(d, sub, font(44, False), W - 96):
        d.text((48, y), ln, font=font(44, False), fill=(180, 168, 145)); y += 58
    d.text((48, H - 120), "AUTO EMPIRE · TEAM 02 × 11", font=font(28, False), fill=(120, 110, 95))
    img.save(os.path.join(A, "scene-%d.png" % i))
segs = []
for i in range(1, 6):
    seg = os.path.join(A, "seg%d.mp4" % i)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-loop", "1", "-i", os.path.join(A, "scene-%d.png" % i),
        "-vf", "scale=1440:2560,zoompan=z='min(zoom+0.0012,1.12)':d=90:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=720x1280:fps=30",
        "-t", "3", "-c:v", "libx264", "-pix_fmt", "yuv420p", seg], check=True)
    segs.append(seg)
lst = os.path.join(A, "list.txt")
open(lst, "w").write("".join("file '%s'\n" % s.replace("\\", "/") for s in segs))
out = os.path.join(HERE, "video.mp4")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", out], check=True)
print("built", out, os.path.getsize(out), "bytes")
