"""Silent-cinema engine: procedural timelapse/hyperlapse/sleeploop films. No camera, no audio needed.
Usage: python engine.py plant|rain|sway   (renders into ./<scene>/frames, assembles <scene>.mp4, deletes frames)
720x1280 @24fps. Hook rule baked in: frame 0 is mid-action + <=7 words, visual change every ~2s."""
import math, os, random, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
W, H, FPS = 720, 1280, 24
FB = "C:/Windows/Fonts/arialbd.ttf"
FR = "C:/Windows/Fonts/arial.ttf"
def F(sz, bold=True): return ImageFont.truetype(FB if bold else FR, sz)
def ease(t): return t * t * (3 - 2 * t)
def textc(d, y, s, f, fill):
    w = d.textlength(s, font=f); d.text(((W - w) / 2, y), s, font=f, fill=fill)
def vgrad(top, bot):
    img = Image.new("RGB", (W, H)); d = ImageDraw.Draw(img)
    for y in range(H):
        k = y / (H - 1)
        d.line([(0, y), (W, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * k) for i in range(3)))
    return img
def assemble(d, name, secs):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-framerate", str(FPS), "-i",
        os.path.join(d, "frames", "f-%04d.png"), "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-crf", "20", os.path.join(d, name)], check=True)
    print("built", name, os.path.getsize(os.path.join(d, name)), "bytes")

def plant(d, secs=30):
    N = secs * FPS; fd = os.path.join(d, "frames"); os.makedirs(fd, exist_ok=True)
    bg = vgrad((8, 14, 10), (24, 34, 22))
    soil = Image.new("RGB", (W, H), (0, 0, 0)); sd = ImageDraw.Draw(soil)
    for y in range(1050, H):
        k = (y - 1050) / 230; sd.line([(0, y), (W, y)], fill=(int(46 + 20 * k), int(32 + 14 * k), int(20 + 8 * k)))
    rnd = random.Random(7)
    flies = [(rnd.uniform(0, W), rnd.uniform(200, 1000), rnd.uniform(0, 6.28), rnd.uniform(1, 3)) for _ in range(26)]
    for i in range(N):
        t = i / (N - 1)
        img = bg.copy(); dr = ImageDraw.Draw(img, "RGBA"); img.paste(soil, (0, 0), )
        bx, by = W / 2, 1052
        h = 40 + 700 * ease(t)
        pts = []
        for s in range(0, 41):
            k = s / 40
            x = bx + 22 * math.sin(2 * math.pi * 2 * t + k * 3) * k + k * k * 60 * math.sin(t * 2)
            y = by - h * k
            pts.append((x, y))
        dr.line(pts, fill=(74, 124, 62, 255), width=max(3, int(4 + 10 * t)))
        tx, ty = pts[-1]
        for L in range(6):
            f = L / 6 * 0.8 + 0.08
            lt = max(0.0, min(1.0, (t - f) * 3.2))
            if lt <= 0: continue
            nx = bx + 22 * math.sin(2 * math.pi * 2 * t + f * 3) * f + f * f * 60 * math.sin(t * 2)
            ny = by - h * f
            sz = 52 * ease(lt)
            ang = -38 - 22 * (1 - lt) if L % 2 == 0 else 38 + 22 * (1 - lt)
            dr.ellipse([nx - sz, ny - sz * 0.45, nx + sz, ny + sz * 0.45], fill=(58, 140, 74, 235))
            dr.ellipse([nx - sz, ny - sz * 0.45, nx + sz, ny + sz * 0.45], outline=(30, 90, 48, 255), width=2)
        bt = max(0.0, min(1.0, (t - 0.75) * 4))
        if bt > 0:
            r = 66 * ease(bt)
            for p in range(8):
                a = p / 8 * 2 * math.pi + t
                ex, ey = tx + r * 0.7 * math.cos(a), ty + r * 0.7 * math.sin(a)
                dr.ellipse([ex - r * 0.42, ey - r * 0.3, ex + r * 0.42, ey + r * 0.3], fill=(214, 96, 110, 235))
            dr.ellipse([tx - r * 0.28, ty - r * 0.28, tx + r * 0.28, ty + r * 0.28], fill=(240, 200, 90, 255))
        if t > 0.3:
            for fx, fy, ph, sp in flies:
                a = int(90 + 120 * abs(math.sin(t * 9 * sp + ph)))
                dr.ellipse([fx - 3, fy - 3, fx + 3, fy + 3], fill=(240, 230, 170, a))
        if i < 48:
            a = int(255 * (1 - i / 48))
            textc(dr, 300, "180 DAYS.", F(92), (244, 237, 222, a))
            textc(dr, 420, "ONE SEED.", F(44, False), (200, 170, 130, a))
        if i >= N - 60:
            a = int(255 * ((i - (N - 60)) / 60))
            textc(dr, 1080, "GROW WITH US.", F(40, False), (244, 237, 222, a))
        img.convert("RGB").save(os.path.join(fd, "f-%04d.png" % i))
    assemble(d, "plant-180days.mp4", secs)

def rain(d, secs=25):
    N = secs * FPS; fd = os.path.join(d, "frames"); os.makedirs(fd, exist_ok=True)
    sky = vgrad((10, 12, 26), (34, 30, 58))
    rnd = random.Random(21)
    clouds = []
    for _ in range(5):
        cw, chh = rnd.randint(220, 420), rnd.randint(70, 130)
        sp = Image.new("RGBA", (cw, chh), (0, 0, 0, 0)); sd = ImageDraw.Draw(sp)
        for _ in range(16):
            x, y = rnd.uniform(0, cw), rnd.uniform(0, chh)
            r = rnd.uniform(24, 60)
            sd.ellipse([x - r, y - r * 0.5, x + r, y + r * 0.5], fill=(70, 74, 110, 46))
        clouds.append((sp, rnd.uniform(0, W), rnd.uniform(120, 620), rnd.uniform(6, 16)))
    drops = [(rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(500, 900)) for _ in range(110)]
    lights = [(rnd.uniform(40, W - 40), rnd.uniform(980, 1180), rnd.uniform(0, 6.28)) for _ in range(40)]
    for i in range(N):
        t = i / (N - 1)
        img = sky.copy(); dr = ImageDraw.Draw(img, "RGBA")
        dr.ellipse([W - 200, 120, W - 60, 260], fill=(235, 238, 250, 210))
        dr.ellipse([W - 220, 100, W - 40, 280], outline=(235, 238, 250, 70), width=26)
        for sp, cx, cy, v in clouds:
            x = (cx + t * v * 60) % (W + 400) - 200
            img.paste(sp, (int(x), int(cy)), sp)
        dr.rectangle([0, 940, W, H], fill=(16, 18, 34, 255))
        for lx, ly, ph in lights:
            tw = 120 + int(100 * abs(math.sin(t * 7 + ph)))
            dr.ellipse([lx - 4, ly - 4, lx + 4, ly + 4], fill=(255, 200, 120, tw))
        dr.polygon([(0, 900), (200, 900), (120, 1280), (0, 1280)], fill=(8, 8, 14, 255))
        for k, (dx, dy, v) in enumerate(drops):
            ny = (dy + t * v * secs) % (H + 60) - 30
            nx = dx + ny * 0.08
            drops[k] = (dx, (dy + v / FPS) % (H + 60), v)
            dr.line([(nx, ny), (nx - 5, ny - 26)], fill=(200, 214, 240, 110), width=2)
        if i < 60:
            a = int(230 * (1 - i / 60))
            textc(dr, 560, "SOMEWHERE", F(54, False), (235, 238, 250, a))
            textc(dr, 630, "OVER WATER.", F(54, False), (235, 238, 250, a))
        img.convert("RGB").save(os.path.join(fd, "f-%04d.png" % i))
    assemble(d, "rain-window-night.mp4", secs)

def sway(d, secs=30):
    N = secs * FPS; fd = os.path.join(d, "frames"); os.makedirs(fd, exist_ok=True)
    bg = vgrad((6, 12, 9), (14, 26, 17))
    rnd = random.Random(4)
    layers = []
    for L in range(5):
        fr = []
        for _ in range(3):
            fr.append((rnd.uniform(60, W - 60), rnd.uniform(300, 1150), rnd.uniform(90, 200),
                       rnd.uniform(40, 90), rnd.uniform(0, 6.28), rnd.choice([1, 2]), (30 + L * 14, 90 + L * 22, 40 + L * 10)))
        layers.append((L, fr))
    for i in range(N):
        t = i / N
        img = bg.copy(); dr = ImageDraw.Draw(img)
        for L, fr in layers:
            for x, y, rw, rh, ph, cyc, col in fr:
                dx = 34 * math.sin(2 * math.pi * (cyc * t + ph))
                dr.ellipse([x - rw + dx, y - rh, x + rw + dx, y + rh], fill=col)
        img.save(os.path.join(fd, "f-%04d.png" % i))
    assemble(d, "sway-loop.mp4", secs)

if __name__ == "__main__":
    here = os.path.dirname(os.path.abspath(__file__))
    which = sys.argv[1]
    secs = int(sys.argv[2]) if len(sys.argv) > 2 else (30 if which != "rain" else 25)
    d = os.path.join(here, {"plant": "plant-180days", "rain": "rain-window-night", "sway": "sway-loop"}[which])
    os.makedirs(d, exist_ok=True)
    {"plant": plant, "rain": rain, "sway": sway}[which](d, secs)
