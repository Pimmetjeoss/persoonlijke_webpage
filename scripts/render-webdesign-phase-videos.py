from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public" / "webdesign"
OUT = PUBLIC / "videos"
POSTERS = PUBLIC / "posters"
TMP = ROOT / ".tmp-webdesign-phase-videos"

W, H = 1280, 720
FPS = 24
DURATION = 16
FRAMES = FPS * DURATION

DARK = (3, 54, 28)
MINT = (218, 253, 230)
PAPER = (246, 255, 250)
INK = (19, 45, 31)
MUTED = (86, 96, 112)
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)

try:
    FONT_DISPLAY = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf", 94)
    FONT_TITLE = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf", 70)
    FONT_SUB = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf", 50)
    FONT_BODY = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 54)
    FONT_BODY_BOLD = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64)
    FONT_SMALL = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf", 34)
except Exception:
    FONT_DISPLAY = FONT_TITLE = FONT_SUB = FONT_BODY = FONT_BODY_BOLD = FONT_SMALL = ImageFont.load_default()

STEPS = [
    {
        "slug": "verkenning",
        "num": "1",
        "title": "Verkenning",
        "accent": (37, 164, 92),
        "layout": "split-left",
        "mascot": "verkenning.png",
        "hook": "Eerst snappen. Dan pas bouwen.",
        "lines": ["Doelen, doelgroep en twijfel scherp", "Sfeer, structuur en techniek vastleggen", "Geen losse smaak, maar een duidelijke richting"],
        "chips": ["Doelen", "Doelgroep", "Richting"],
        "result": "Resultaat: iedereen weet wat de site moet doen.",
    },
    {
        "slug": "realisatie",
        "num": "2",
        "title": "Realisatie",
        "accent": (219, 176, 55),
        "layout": "split-right",
        "mascot": "realisatie.png",
        "hook": "Van richting naar schermen.",
        "lines": ["Ontwerp, code en content groeien samen", "Snel iets klikbaars om op te reageren", "Vroeg bijsturen, niet laat repareren"],
        "chips": ["Design", "Code", "Feedback"],
        "result": "Resultaat: een echte site, geen losse schets.",
    },
    {
        "slug": "testen-en-redactie",
        "num": "3",
        "title": "Testen & redactie",
        "accent": (229, 75, 70),
        "layout": "stack",
        "mascot": "testen-en-redactie.png",
        "hook": "Nu halen we de rafels eruit.",
        "lines": ["Teksten lezen alsof je bezoeker bent", "Formulieren, mobiel en klikpaden nalopen", "Alleen live met pagina's die echt kloppen"],
        "chips": ["Copy", "QA", "Mobiel"],
        "result": "Resultaat: de site voelt af en logisch.",
    },
    {
        "slug": "go-live",
        "num": "4",
        "title": "Go-live",
        "accent": (33, 150, 243),
        "layout": "hero-video",
        "mascot": "go-live.png",
        "hook": "Live gaan zonder paniek.",
        "lines": ["Domein, redirects en analytics controleren", "Formulieren en performance nog één keer testen", "Na livegang direct meekijken"],
        "chips": ["Domein", "Checks", "Live"],
        "result": "Resultaat: live, gecontroleerd en meetbaar.",
    },
    {
        "slug": "onderhoud",
        "num": "5",
        "title": "Onderhoud",
        "accent": (107, 129, 77),
        "layout": "dark-card",
        "mascot": "onderhoud.png",
        "hook": "De site moet blijven werken.",
        "lines": ["Updates eerst testen, daarna pas live", "Kleine vragen snel oppakken", "Techniek bewaken voordat iets stukloopt"],
        "chips": ["Updates", "Support", "Monitoring"],
        "result": "Resultaat: rust, snelheid en minder verrassingen.",
    },
    {
        "slug": "optimalisatie",
        "num": "6",
        "title": "Optimalisatie",
        "accent": (116, 204, 66),
        "layout": "diagonal",
        "mascot": "optimalisatie.png",
        "hook": "Na livegang begint het leren.",
        "lines": ["Kijken waar bezoekers klikken en afhaken", "Ideeën kiezen op impact, niet op onderbuik", "Kleine verbeteringen blijven doorvoeren"],
        "chips": ["Data", "Impact", "Groei"],
        "result": "Resultaat: van goed naar beter, stap voor stap.",
    },
]


def ease(x: float) -> float:
    x = max(0, min(1, x))
    return 1 - (1 - x) ** 3


def draw_round(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def text_size(draw, text, font):
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def fit_text(draw, text, font, max_w):
    words = text.split()
    lines = []
    cur = ""
    for word in words:
        nxt = (cur + " " + word).strip()
        if text_size(draw, nxt, font)[0] <= max_w or not cur:
            cur = nxt
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def draw_wrapped(draw, xy, text, font, fill, max_w, line_gap=8):
    x, y = xy
    for line in fit_text(draw, text, font, max_w):
        draw.text((x, y), line, font=font, fill=fill)
        y += text_size(draw, line, font)[1] + line_gap
    return y


def shadowed_card(base, xy, radius, fill, outline=DARK, width=4, shadow=True):
    if shadow:
        sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
        sd = ImageDraw.Draw(sh)
        sd.rounded_rectangle((xy[0] + 10, xy[1] + 14, xy[2] + 10, xy[3] + 14), radius=radius, fill=(0, 0, 0, 55))
        sh = sh.filter(ImageFilter.GaussianBlur(10))
        base.alpha_composite(sh)
    d = ImageDraw.Draw(base)
    d.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def draw_background(base, accent, t, layout):
    d = ImageDraw.Draw(base)
    d.rectangle((0, 0, W, H), fill=MINT)
    # subtle big geometric shapes, deterministic
    drift = math.sin(t * math.pi * 2) * 18
    pale = (*accent, 38)
    d.polygon([(0, 110), (135 + drift, 42), (235 + drift, 265), (0, 340)], fill=pale)
    d.ellipse((760 - drift, 92, 1120 - drift, 452), outline=(*DARK, 30), width=2)
    d.arc((910 + drift, 315, 1190 + drift, 610), 15, 330, fill=(0, 0, 0, 48), width=15)
    for i in range(9):
        x = 90 + ((i * 147 + int(t * 80)) % 1100)
        y = 70 + ((i * 83) % 560)
        r = 13 + (i % 3) * 4
        d.ellipse((x, y, x + r * 2, y + r * 2), fill=(*accent, 105))
    # black monitor-ish border
    d.rounded_rectangle((10, 10, W - 10, H - 10), radius=22, outline=DARK, width=5)
    d.rectangle((10, 10, W - 10, 52), fill=None, outline=DARK, width=5)


def paste_mascot(base, path, box, t, mirror=False):
    img = Image.open(path).convert("RGBA")
    if mirror:
        img = img.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    max_w, max_h = box[2] - box[0], box[3] - box[1]
    img.thumbnail((max_w, max_h), Image.Resampling.LANCZOS)
    bob = int(math.sin(t * math.pi * 2) * 10)
    x = box[0] + (max_w - img.width) // 2
    y = box[1] + (max_h - img.height) // 2 + bob
    # glow
    glow = Image.new("RGBA", base.size, (0, 0, 0, 0))
    glow.alpha_composite(img, (x, y))
    alpha = glow.split()[3].filter(ImageFilter.GaussianBlur(24))
    colored = Image.new("RGBA", base.size, (255, 255, 255, 0))
    colored.putalpha(alpha.point([min(110, i) for i in range(256)]))
    base.alpha_composite(colored)
    base.alpha_composite(img, (x, y))


def scene_index(sec):
    if sec < 4.7:
        return 0
    if sec < 10.8:
        return 1
    return 2


def draw_video_frame(step, frame_no, mascot_path):
    sec = frame_no / FPS
    t = sec / DURATION
    local_scene = scene_index(sec)
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_background(base, step["accent"], t, step["layout"])
    d = ImageDraw.Draw(base)

    # top labels
    d.text((42, 78), f"Stap {step['num']}", font=FONT_SMALL, fill=step["accent"])
    d.text((42, 105), step["title"], font=FONT_TITLE, fill=DARK)

    progress = sec / DURATION
    d.rounded_rectangle((42, H - 48, W - 42, H - 34), radius=8, fill=(255, 255, 255, 150), outline=DARK, width=2)
    d.rounded_rectangle((42, H - 48, 42 + int((W - 84) * progress), H - 34), radius=8, fill=step["accent"])

    if local_scene == 0:
        a = ease(sec / 1.0)
        shadowed_card(base, (54, 185, 760, 510), 26, PAPER)
        d = ImageDraw.Draw(base)
        d.text((92, 225 - int((1 - a) * 24)), step["hook"], font=FONT_DISPLAY, fill=DARK)
        d.text((96, 330), "Deze fase bepaalt wat er straks op de site moet gebeuren.", font=FONT_BODY, fill=MUTED)
        for i, chip in enumerate(step["chips"]):
            x = 96 + i * 170
            d.rounded_rectangle((x, 405, x + 130, 450), radius=22, fill=MINT, outline=DARK, width=2)
            d.text((x + 18, 416), chip, font=FONT_SMALL, fill=DARK)
        paste_mascot(base, mascot_path, (790, 122, 1215, 610), t)
    elif local_scene == 1:
        # information cards; varied placement by layout
        if step["layout"] in ["split-right", "hero-video"]:
            paste_mascot(base, mascot_path, (56, 155, 435, 620), t, mirror=step["layout"] == "split-right")
            card = (430, 135, 1225, 575)
        elif step["layout"] == "stack":
            paste_mascot(base, mascot_path, (835, 128, 1218, 590), t)
            card = (60, 150, 810, 580)
        elif step["layout"] == "dark-card":
            paste_mascot(base, mascot_path, (815, 145, 1215, 610), t)
            card = (60, 145, 790, 585)
        elif step["layout"] == "diagonal":
            paste_mascot(base, mascot_path, (760, 105, 1195, 600), t)
            card = (70, 175, 750, 575)
        else:
            paste_mascot(base, mascot_path, (805, 125, 1210, 610), t)
            card = (65, 145, 770, 585)
        fill = DARK if step["layout"] == "dark-card" else PAPER
        text_col = MINT if fill == DARK else DARK
        muted_col = (235, 255, 241) if fill == DARK else DARK
        shadowed_card(base, card, 26, fill)
        d = ImageDraw.Draw(base)
        d.text((card[0] + 38, card[1] + 34), "Wat gebeurt hier?", font=FONT_SUB, fill=text_col)
        y = card[1] + 105
        reveal_count = min(3, max(1, int((sec - 4.7) / 1.4) + 1))
        for i, line in enumerate(step["lines"][:reveal_count]):
            yy = y + i * 118
            d.ellipse((card[0] + 42, yy + 15, card[0] + 88, yy + 61), fill=step["accent"])
            draw_wrapped(d, (card[0] + 112, yy), line, FONT_BODY_BOLD, muted_col, card[2] - card[0] - 160)
    else:
        a = ease((sec - 10.8) / 1.0)
        shadowed_card(base, (96, 155, 1184, 560), 34, DARK)
        d = ImageDraw.Draw(base)
        d.text((138, 205), "Kort samengevat", font=FONT_SMALL, fill=step["accent"])
        draw_wrapped(d, (138, 248), step["result"], FONT_TITLE, MINT, 680)
        paste_mascot(base, mascot_path, (805 + int((1-a)*40), 178, 1160 + int((1-a)*40), 545), t)
        d.rounded_rectangle((138, 455, 495, 505), radius=24, fill=MINT, outline=WHITE, width=2)
        d.text((162, 468), "Volgende stap klaar →", font=FONT_SMALL, fill=DARK)

    # watermark, small and readable
    d.text((W - 250, H - 78), "Code Lieshout webdesign", font=FONT_SMALL, fill=(3, 54, 28, 150))
    return base.convert("RGB")


def render_step(step):
    out_dir = TMP / step["slug"]
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    mascot_path = PUBLIC / "mascots" / step["mascot"]
    if not mascot_path.exists():
        raise FileNotFoundError(mascot_path)
    poster = None
    for f in range(FRAMES):
        img = draw_video_frame(step, f, mascot_path)
        frame_path = out_dir / f"frame_{f:04d}.jpg"
        img.save(frame_path, quality=92, optimize=True)
        if f == FPS * 2:
            poster = img.copy()
    if poster is None:
        poster = draw_video_frame(step, 0, mascot_path)
    POSTERS.mkdir(parents=True, exist_ok=True)
    poster.save(POSTERS / f"{step['slug']}.jpg", quality=92, optimize=True)
    OUT.mkdir(parents=True, exist_ok=True)
    raw = OUT / f"{step['slug']}.mp4"
    cmd = [
        "ffmpeg", "-y", "-v", "error", "-framerate", str(FPS),
        "-i", str(out_dir / "frame_%04d.jpg"),
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-shortest", "-t", str(DURATION),
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        "-c:a", "aac", "-b:a", "64k",
        str(raw),
    ]
    subprocess.run(cmd, check=True)
    shutil.rmtree(out_dir)


def main():
    TMP.mkdir(parents=True, exist_ok=True)
    for step in STEPS:
        render_step(step)
        print(f"rendered {step['slug']}")
    shutil.rmtree(TMP, ignore_errors=True)


if __name__ == "__main__":
    main()
