from __future__ import annotations

import shutil
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
VIDEO_DIR = ROOT / "public/webdesign/videos"
POSTER_DIR = ROOT / "public/webdesign/posters"
MASCOT_DIR = ROOT / "public/webdesign/mascots"
TMP = ROOT / ".tmp-webdesign-video-frames"
W, H = 1280, 720
FPS = 12
DURATION = 16

DARK = (3, 54, 28)
MINT = (221, 255, 232)
PAPER = (250, 255, 252)

FONT_DISPLAY = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 82)
FONT_TITLE = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
FONT_BODY = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 42)
FONT_SMALL = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)

STEPS = [
    ("verkenning", "1", "Verkenning", (28, 166, 91), ["Doel en doelgroep scherp", "Structuur en sfeer bepalen", "Techniek en planning helder"], "Eerst richting. Dan bouwen."),
    ("realisatie", "2", "Realisatie", (220, 174, 44), ["Ontwerp wordt werkend scherm", "Feedback vroeg verwerken", "Snel zien wat er staat"], "Van plan naar pagina."),
    ("testen-en-redactie", "3", "Testen & redactie", (231, 62, 59), ["Mobiel, formulieren en links testen", "Teksten en beelden aanscherpen", "Laatste fouten eruit halen"], "Kloppen in gebruik én verhaal."),
    ("go-live", "4", "Go-live", (44, 143, 222), ["Domein en redirects klaarzetten", "Analytics en formulieren checken", "Gecontroleerd live zetten"], "Live zonder chaos."),
    ("onderhoud", "5", "Onderhoud", (108, 128, 75), ["Updates eerst testen", "Support en kleine aanpassingen", "Site veilig en actueel houden"], "Blijven werken na livegang."),
    ("optimalisatie", "6", "Optimalisatie", (108, 206, 56), ["Data en gedrag bekijken", "Kansen prioriteren", "Stap voor stap verbeteren"], "Meer resultaat uit je site."),
]


def ease(t: float) -> float:
    t = max(0, min(1, t))
    return 1 - (1 - t) ** 3


def wrap(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines, cur = [], ""
    for word in words:
        test = (cur + " " + word).strip()
        if draw.textbbox((0, 0), test, font=font)[2] <= max_width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def text(draw, xy, text, font, fill, max_width=None, spacing=8):
    x, y = xy
    if max_width:
        for line in wrap(draw, text, font, max_width):
            draw.text((x, y), line, font=font, fill=fill)
            y += font.getbbox(line)[3] - font.getbbox(line)[1] + spacing
    else:
        draw.text((x, y), text, font=font, fill=fill)


def mascot(slug: str, size=330) -> Image.Image:
    im = Image.open(MASCOT_DIR / f"{slug}.png").convert("RGBA")
    im.thumbnail((size, size), Image.Resampling.LANCZOS)
    return im


def card(draw, box, fill=PAPER, outline=DARK):
    x1, y1, x2, y2 = box
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.rounded_rectangle((x1+10, y1+12, x2+10, y2+12), radius=22, fill=(0, 0, 0, 48))
    return shadow.filter(ImageFilter.GaussianBlur(10))


def frame(slug, num, title, accent, bullets, payoff, sec):
    im = Image.new("RGBA", (W, H), MINT + (255,))
    d = ImageDraw.Draw(im)
    # background shapes
    d.polygon([(0, 0), (230, 0), (70, 720), (0, 720)], fill=accent + (80,))
    d.ellipse((805, 95, 1230, 520), outline=DARK + (90,), width=3)
    d.line((32, 34, 1248, 34), fill=DARK, width=4)
    d.line((32, 64, 1248, 64), fill=DARK, width=3)
    d.rounded_rectangle((12, 12, 1268, 708), radius=10, outline=DARK, width=5)

    # step label
    d.text((70, 92), f"STAP {num}", font=FONT_SMALL, fill=DARK)
    d.text((70, 125), title.upper(), font=FONT_TITLE, fill=DARK)

    # mascot always fully visible, never covering text
    m = mascot(slug)
    im.alpha_composite(m, (890, 225))

    # readable content card
    box = (70, 225, 820, 610)
    im.alpha_composite(card(d, box))
    d.rounded_rectangle(box, radius=24, fill=PAPER, outline=DARK, width=4)

    if sec < 4.3:
        d.text((110, 275), "Wat gebeurt er?", font=FONT_TITLE, fill=DARK)
        text(d, (112, 365), "In deze fase maken we concreet wat nodig is om de website goed te laten werken.", FONT_BODY, DARK, 630, 12)
    elif sec < 12.2:
        d.text((110, 258), "Belangrijk in deze stap", font=FONT_TITLE, fill=DARK)
        reveal = min(3, max(1, int((sec - 4.3) / 2.3) + 1))
        y = 360
        for b in bullets[:reveal]:
            d.ellipse((112, y+8, 150, y+46), fill=accent)
            text(d, (172, y), b, FONT_BODY, DARK, 560, 10)
            y += 88
    else:
        d.rounded_rectangle((70, 225, 1185, 610), radius=24, fill=DARK, outline=DARK, width=4)
        d.text((115, 285), "Resultaat", font=FONT_TITLE, fill=accent)
        text(d, (115, 380), payoff, FONT_DISPLAY, MINT, 720, 12)
        im.alpha_composite(mascot(slug, 260), (890, 310))

    # progress bar
    d.rounded_rectangle((42, 674, 1238, 690), radius=8, outline=DARK, width=2)
    d.rounded_rectangle((42, 674, 42 + int(1196 * (sec / DURATION)), 690), radius=8, fill=accent)
    d.text((1048, 635), "Code Lieshout webdesign", font=FONT_SMALL, fill=DARK)
    return im.convert("RGB")


def render_one(step):
    slug, num, title, accent, bullets, payoff = step
    out = TMP / slug
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    total = DURATION * FPS
    for i in range(total):
        sec = i / FPS
        frame(slug, num, title, accent, bullets, payoff, sec).save(out / f"frame_{i:04d}.jpg", quality=92)
    POSTER_DIR.mkdir(parents=True, exist_ok=True)
    (out / "frame_0000.jpg").replace(POSTER_DIR / f"{slug}.jpg")
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    subprocess.run([
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-framerate", str(FPS),
        "-i", str(out / "frame_%04d.jpg"), "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-movflags", "+faststart", "-vf", "scale=1280:720", str(VIDEO_DIR / f"{slug}.mp4")
    ], check=True)
    print(f"rendered {slug}")


def main():
    if TMP.exists():
        shutil.rmtree(TMP)
    TMP.mkdir()
    for step in STEPS:
        render_one(step)
    shutil.rmtree(TMP)

if __name__ == "__main__":
    main()
