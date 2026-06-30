from __future__ import annotations

import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIDEO_DIR = ROOT / "public/webdesign/videos"
POSTER_DIR = ROOT / "public/webdesign/posters"
MASCOT_DIR = ROOT / "public/webdesign/mascots"
BRAG_DIR = ROOT / "brag-output-webdesign-phases"
COMP_ROOT = BRAG_DIR / "composition"
QA_DIR = BRAG_DIR / "qa-frames"
W, H = 1280, 720
DURATION = 16

DARK = "#03361c"
MINT = "#ddffe8"
PAPER = "#fbfffd"

STEPS = [
    {
        "slug": "verkenning",
        "num": "1",
        "title": "Verkenning",
        "accent": "#1ca65b",
        "intro": "We maken scherp wat de site moet doen, voor wie hij is en welke richting past.",
        "bullets": ["Doel en doelgroep", "Structuur en stijl", "Techniek en planning"],
        "result": "Een helder plan voordat we bouwen.",
    },
    {
        "slug": "realisatie",
        "num": "2",
        "title": "Realisatie",
        "accent": "#dcae2c",
        "intro": "Ontwerp, techniek en inhoud worden omgezet naar echte pagina’s.",
        "bullets": ["Werkende schermen", "Feedback snel verwerken", "Content op de juiste plek"],
        "result": "Van idee naar klikbare website.",
    },
    {
        "slug": "testen-en-redactie",
        "num": "3",
        "title": "Testen & redactie",
        "accent": "#e73e3b",
        "intro": "We controleren of de site logisch voelt, goed werkt en prettig leest.",
        "bullets": ["Mobiel en formulieren", "Links en snelheid", "Tekst en beelden"],
        "result": "Klaar voor echte bezoekers.",
    },
    {
        "slug": "go-live",
        "num": "4",
        "title": "Go-live",
        "accent": "#2c8fde",
        "intro": "Alles wordt gecontroleerd klaargezet zodat de site zonder chaos live kan.",
        "bullets": ["Domein en redirects", "Analytics en formulieren", "Laatste live-check"],
        "result": "Online met controle.",
    },
    {
        "slug": "onderhoud",
        "num": "5",
        "title": "Onderhoud",
        "accent": "#6c804b",
        "intro": "Na livegang houden we de website veilig, actueel en bruikbaar.",
        "bullets": ["Updates eerst testen", "Support bij vragen", "Kleine verbeteringen"],
        "result": "De site blijft goed werken.",
    },
    {
        "slug": "optimalisatie",
        "num": "6",
        "title": "Optimalisatie",
        "accent": "#6cce38",
        "intro": "We kijken naar data en gedrag en verbeteren stap voor stap wat meer resultaat oplevert.",
        "bullets": ["Data bekijken", "Kansen prioriteren", "Gericht verbeteren"],
        "result": "Meer rendement uit je site.",
    },
]


def run(cmd: list[str], cwd: Path) -> None:
    print("$", " ".join(cmd), "(cwd", cwd, ")")
    subprocess.run(cmd, cwd=cwd, check=True)


def safe_json(value) -> str:
    return json.dumps(value, ensure_ascii=False)


def write_composition(step: dict) -> Path:
    slug = step["slug"]
    comp = COMP_ROOT / slug
    if comp.exists():
        shutil.rmtree(comp)
    (comp / "assets").mkdir(parents=True)
    shutil.copy2(MASCOT_DIR / f"{slug}.png", comp / "assets" / "mascot.png")
    (comp / "package.json").write_text(json.dumps({
        "private": True,
        "type": "module",
        "scripts": {
            "check": "npx --yes hyperframes@0.7.21 lint && npx --yes hyperframes@0.7.21 validate && npx --yes hyperframes@0.7.21 inspect",
            "render": "npx --yes hyperframes@0.7.21 render --quality high"
        }
    }, indent=2))
    title = step["title"]
    html = f'''<!doctype html>
<html lang="nl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width={W}, height={H}" />
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <style>
    * {{ box-sizing: border-box; }}
    html, body {{ margin:0; width:{W}px; height:{H}px; overflow:hidden; background:{MINT}; }}
    body {{ font-family: Arial, Helvetica, sans-serif; color:{DARK}; }}
    #root {{ position:relative; width:{W}px; height:{H}px; overflow:hidden; background:{MINT}; }}
    .frame {{ position:absolute; inset:16px 18px 70px 18px; border:5px solid {DARK}; border-radius:16px; overflow:hidden; background:{MINT}; }}
    .topline {{ position:absolute; left:34px; right:34px; top:30px; height:34px; border-top:4px solid {DARK}; border-bottom:3px solid {DARK}; }}
    .accent {{ position:absolute; left:-20px; top:0; width:250px; height:650px; background:{step['accent']}; opacity:.85; clip-path:polygon(0 0, 100% 0, 55% 100%, 0 100%); }}
    .ring {{ position:absolute; right:70px; top:88px; width:330px; height:330px; border:3px solid {DARK}; border-radius:50%; opacity:.75; }}
    .kicker {{ position:absolute; left:72px; top:86px; font-size:28px; line-height:1; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }}
    .title {{ position:absolute; left:72px; top:122px; right:320px; font-size:58px; line-height:.96; font-weight:950; letter-spacing:.03em; text-transform:uppercase; white-space:nowrap; }}
    .mascotBox {{ position:absolute; right:72px; top:176px; width:270px; height:270px; border:4px solid {DARK}; border-radius:26px; background:rgba(251,255,253,.45); display:flex; align-items:center; justify-content:center; box-shadow:0 12px 0 rgba(3,54,28,.12); }}
    .mascot {{ max-width:230px; max-height:230px; object-fit:contain; filter:drop-shadow(0 10px 10px rgba(3,54,28,.18)); }}
    .panel {{ position:absolute; left:72px; top:220px; width:700px; height:310px; border:4px solid {DARK}; border-radius:24px; background:{PAPER}; box-shadow:0 16px 0 rgba(3,54,28,.12); padding:38px 42px; overflow:hidden; }}
    .panel.dark {{ background:{DARK}; color:{MINT}; border-color:{DARK}; }}
    .label {{ font-size:24px; line-height:1; font-weight:950; color:{step['accent']}; margin-bottom:18px; letter-spacing:.02em; }}
    .headline {{ font-size:44px; line-height:1.02; font-weight:950; margin-bottom:22px; max-width:610px; }}
    .body {{ font-size:32px; line-height:1.18; font-weight:850; max-width:590px; }}
    .check {{ display:flex; align-items:flex-start; gap:20px; margin:19px 0; font-size:34px; line-height:1.08; font-weight:950; }}
    .dot {{ flex:0 0 auto; width:24px; height:24px; margin-top:6px; border-radius:99px; background:{step['accent']}; border:3px solid {DARK}; }}
    .resultText {{ font-size:52px; line-height:1.02; font-weight:950; max-width:590px; }}
    .progressTrack {{ position:absolute; left:52px; right:52px; bottom:26px; height:14px; border:2px solid {DARK}; border-radius:99px; background:rgba(251,255,253,.55); overflow:hidden; }}
    .progress {{ width:0%; height:100%; background:{step['accent']}; }}
    .brand {{ position:absolute; right:60px; bottom:42px; font-size:20px; font-weight:950; letter-spacing:.01em; opacity:.55; }}
    .scene {{ position:absolute; inset:0; }}
    .scene2, .scene3 {{ opacity:0; }}
  </style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{DURATION}" data-width="{W}" data-height="{H}">
  <div id="phase-frame" class="frame clip" data-start="0" data-duration="{DURATION}" data-track-index="0">
    <div class="accent" data-layout-allow-overflow></div><div class="ring"></div><div class="topline"></div>
    <div class="kicker">STAP {step['num']}</div>
    <div class="title">{title.upper()}</div>
    <div class="mascotBox"><img class="mascot" src="assets/mascot.png" alt="" /></div>
    <div class="scene scene1">
      <div class="panel">
        <div class="label">Wat gebeurt er?</div>
        <div class="body">{step['intro']}</div>
      </div>
    </div>
    <div class="scene scene2">
      <div class="panel">
        <div class="label">Belangrijk in deze stap</div>
        <div class="check"><span class="dot"></span><span>{step['bullets'][0]}</span></div>
        <div class="check"><span class="dot"></span><span>{step['bullets'][1]}</span></div>
        <div class="check"><span class="dot"></span><span>{step['bullets'][2]}</span></div>
      </div>
    </div>
    <div class="scene scene3">
      <div class="panel dark">
        <div class="label">Resultaat</div>
        <div class="resultText">{step['result']}</div>
      </div>
    </div>
    <div class="brand">Code Lieshout</div>
    <div class="progressTrack"><div class="progress"></div></div>
  </div>
</div>
<script>
  window.__timelines = window.__timelines || {{}};
  const tl = gsap.timeline({{ paused: true }});
  tl.from('.frame', {{ opacity:0, scale:.985, duration:.55, ease:'power2.out' }}, .15);
  tl.from('.accent', {{ x:-160, duration:.7, ease:'expo.out' }}, .2);
  tl.from('.kicker', {{ y:-18, opacity:0, duration:.45, ease:'back.out(1.5)' }}, .35);
  tl.from('.title', {{ y:20, opacity:0, duration:.55, ease:'power3.out' }}, .55);
  tl.from('.mascotBox', {{ x:35, opacity:0, duration:.55, ease:'power2.out' }}, .75);
  tl.from('.scene1 .panel', {{ y:24, opacity:0, duration:.55, ease:'power3.out' }}, .9);
  tl.to('.progress', {{ width:'100%', duration:{DURATION}, ease:'none' }}, 0);

  // transition 1
  tl.to('.scene2', {{ opacity:1, duration:.01 }}, 4.1);
  tl.from('.scene2 .panel', {{ x:34, opacity:0, duration:.55, ease:'power2.out' }}, 4.12);
  tl.from('.scene2 .check', {{ x:-30, opacity:0, duration:.45, ease:'back.out(1.35)', stagger:.62 }}, 4.65);
  tl.to('.scene1', {{ opacity:0, duration:.18 }}, 4.15);

  // transition 2
  tl.to('.scene3', {{ opacity:1, duration:.01 }}, 11.15);
  tl.from('.scene3 .panel', {{ y:28, opacity:0, duration:.55, ease:'power4.out' }}, 11.18);
  tl.from('.scene3 .label', {{ x:-20, opacity:0, duration:.45, ease:'power2.out' }}, 11.45);
  tl.from('.scene3 .resultText', {{ y:18, opacity:0, duration:.55, ease:'power2.out' }}, 11.72);
  tl.to('.scene2', {{ opacity:0, duration:.18 }}, 11.18);

  tl.to('#root', {{ opacity:0, duration:.4, ease:'power1.inOut' }}, 15.55);
  window.__timelines['main'] = tl;
</script>
</body>
</html>'''
    (comp / "index.html").write_text(html)
    return comp


def render_one(step: dict) -> None:
    comp = write_composition(step)
    run(["npx", "--yes", "hyperframes@0.7.21", "lint", "--strict"], comp)
    run(["npx", "--yes", "hyperframes@0.7.21", "validate"], comp)
    run(["npx", "--yes", "hyperframes@0.7.21", "inspect"], comp)
    VIDEO_DIR.mkdir(parents=True, exist_ok=True)
    out_video = VIDEO_DIR / f"{step['slug']}.mp4"
    run(["npx", "--yes", "hyperframes@0.7.21", "render", "--quality", "high", "--fps", "30", "--output", str(out_video)], comp)
    POSTER_DIR.mkdir(parents=True, exist_ok=True)
    poster = POSTER_DIR / f"{step['slug']}.jpg"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", "00:00:01.0", "-i", str(out_video), "-frames:v", "1", "-q:v", "2", str(poster)], check=True)


def main() -> None:
    BRAG_DIR.mkdir(exist_ok=True)
    COMP_ROOT.mkdir(parents=True, exist_ok=True)
    QA_DIR.mkdir(parents=True, exist_ok=True)
    for step in STEPS:
        render_one(step)
    # QA contact sheet across the exact times the user complained about: checklist and result scenes.
    frames = []
    for step in STEPS:
        for sec in (1, 7, 13):
            target = QA_DIR / f"{step['slug']}-{sec:02d}.jpg"
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"00:00:{sec:02d}", "-i", str(VIDEO_DIR / f"{step['slug']}.mp4"), "-frames:v", "1", "-q:v", "2", str(target)], check=True)
            frames.append(str(target))
    listfile = QA_DIR / "frames.txt"
    listfile.write_text("".join(f"file '{p}'\n" for p in frames))
    contact = QA_DIR / "contact-sheet.jpg"
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", str(listfile), "-vf", "scale=320:-1,tile=3x6", "-frames:v", "1", str(contact)], check=True)
    print(contact)


if __name__ == "__main__":
    main()
