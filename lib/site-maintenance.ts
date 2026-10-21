/** Temporary public maintenance gate. Set to false and deploy to restore the site. */
export const MAINTENANCE_ENABLED = true;

export const maintenanceHeaders = {
  'Cache-Control': 'no-store, max-age=0',
  'Retry-After': '3600',
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
};

export function isMaintenanceAsset(pathname: string) {
  return pathname.startsWith('/_next/static/') ||
    pathname === '/maintenance/fjalla-one.ttf' ||
    pathname === '/maintenance/cactus.webp' ||
    pathname === '/favicon.ico';
}

export const maintenanceHtml = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#052e16">
<title>Even verbouwen. Gewoon bereikbaar. | Code Lieshout</title>
<meta name="description" content="Code Lieshout krijgt een nieuwe website. Pim van Lieshout blijft bereikbaar via pim@code-lieshout.nl of 06 12419980.">
<link rel="icon" href="/favicon.ico">
<link rel="preload" href="/maintenance/fjalla-one.ttf" as="font" type="font/ttf" crossorigin>
<style>
@font-face{font-family:Fjalla;src:url('/maintenance/fjalla-one.ttf') format('truetype');font-weight:400;font-display:swap}
:root{color-scheme:light;--ink:#052e16;--paper:#dcfce7;--mint:#bbf7d0;--green:#16a34a;--line:3px solid var(--ink)}
*{box-sizing:border-box}html{background:var(--paper);color:var(--ink)}body{margin:0;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased}a{color:inherit}a:focus-visible{outline:3px solid var(--ink);outline-offset:6px}.skip{position:fixed;top:-100px;left:16px;padding:12px;background:white;z-index:5}.skip:focus{top:16px}
.shell{max-width:1600px;margin:auto;min-height:100svh;display:flex;flex-direction:column}.masthead{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 5.5%;border-bottom:var(--line)}.wordmark{font-family:Fjalla,Impact,sans-serif;font-size:25px;letter-spacing:-.03em}.status{display:flex;align-items:center;gap:9px;font:11px/1.5 monospace;letter-spacing:.13em;text-transform:uppercase}.dot{width:8px;height:8px;background:var(--ink);border-radius:50%;flex-shrink:0}
main{flex:1;display:flex;flex-direction:column}.hero{position:relative;display:grid;grid-template-columns:1.35fr 1fr;gap:24px;padding:64px 5.5% 44px;align-items:center;flex:1;overflow:hidden}.eyebrow{font:11px/1.6 monospace;letter-spacing:.16em;text-transform:uppercase;margin:0 0 26px;display:flex;gap:12px;align-items:center}.eyebrow:before{content:'';width:32px;border-top:2px solid var(--ink)}h1{font-family:Fjalla,Impact,'Arial Narrow',sans-serif;font-weight:400;font-size:clamp(68px,8.4vw,126px);line-height:.99;letter-spacing:-.045em;text-transform:uppercase;margin:0;position:relative;z-index:1}.outline{display:inline-block;font-size:.58em;line-height:1.25;letter-spacing:-.025em;margin-top:.2em;-webkit-text-stroke:1.3px var(--ink);color:transparent}.intro{max-width:470px;font-size:18px;line-height:1.65;margin:28px 0 0}.intro strong{font-weight:700}.illustration{min-height:360px;position:relative;display:flex;align-items:center;justify-content:center;align-self:stretch}.orbit{position:absolute;width:340px;height:340px;border:2px solid var(--ink);border-radius:50%;background:var(--mint)}.orbit:after{content:'+';position:absolute;top:21px;right:17px;background:var(--paper);font:42px/1 monospace;padding:0 7px}.mascot{position:relative;width:min(100%,365px);height:auto;transform:rotate(-6deg);filter:drop-shadow(0 18px 0 rgba(5,46,22,.06))}.note{position:absolute;bottom:6px;right:1%;border:2px solid var(--ink);background:#f7fee7;padding:13px 18px;transform:rotate(-5deg);font-family:Fjalla,Impact,sans-serif;font-size:21px;line-height:1.3;box-shadow:5px 5px 0 var(--ink)}.note span{font:11px/1.7 monospace;display:block;letter-spacing:.07em}.working{position:absolute;left:5%;top:16px;font:11px/1.5 monospace;letter-spacing:.1em;display:flex;align-items:center;gap:10px}.working svg{width:25px;height:25px}
.contact{border-top:var(--line);background:var(--mint)}.contact-top{display:flex;align-items:baseline;justify-content:space-between;gap:18px;padding:24px 5.5% 20px}.contact h2{font:400 clamp(24px,3vw,34px)/1.1 Fjalla,Impact,sans-serif;letter-spacing:-.02em;margin:0}.contact-top p{margin:0;font-size:14px;line-height:1.5}.contact-links{display:grid;grid-template-columns:1.45fr 1fr .7fr;margin:0 5.5% 30px;border:var(--line);border-radius:14px;overflow:hidden;background:var(--paper)}.contact-link{padding:22px 24px;text-decoration:none;min-width:0;display:flex;flex-direction:column;gap:12px;position:relative;transition:background-color .15s}.contact-link+.contact-link{border-left:var(--line)}.contact-link:hover{background:#86efac}.contact-link:focus-visible{outline-offset:-7px}.contact-label{font:10px/1.4 monospace;letter-spacing:.13em;text-transform:uppercase;display:flex;align-items:center;justify-content:space-between}.arrow{font-size:21px;line-height:1}.contact-value{font-family:Fjalla,Impact,sans-serif;font-size:clamp(20px,2.5vw,32px);letter-spacing:-.025em;overflow-wrap:anywhere}.contact-value.small{font-size:clamp(20px,2.3vw,28px)}footer{padding:17px 5.5%;display:flex;justify-content:space-between;gap:12px;border-top:var(--line);font:10px/1.7 monospace;letter-spacing:.04em}footer p{margin:0}.stripe{height:9px;background:repeating-linear-gradient(-45deg,var(--ink) 0,var(--ink) 10px,var(--mint) 10px,var(--mint) 20px);border-top:2px solid var(--ink)}
@media(min-width:1601px){.shell{border-left:var(--line);border-right:var(--line)}}
@media(max-width:900px){.hero{padding-top:44px;gap:10px;grid-template-columns:1.25fr 1fr}h1{font-size:clamp(60px,9vw,90px)}.orbit{width:250px;height:250px}.illustration{min-height:300px}.note{font-size:18px}.contact-links{grid-template-columns:1.3fr 1fr}.contact-link:last-child{grid-column:1/-1;border-left:0;border-top:var(--line);flex-direction:row;align-items:center;justify-content:space-between;padding:16px 24px}.contact-link:last-child .contact-label{gap:15px}.contact-top{align-items:flex-start;flex-direction:column;gap:10px}.intro{font-size:17px}}
@media(max-width:600px){.masthead{padding:20px 6%;gap:12px}.wordmark{font-size:22px}.status{font-size:9px;letter-spacing:.05em}.hero{display:flex;flex-direction:column;align-items:stretch;padding:36px 6% 30px;gap:10px}.eyebrow{margin-bottom:20px;font-size:10px}h1{font-size:clamp(58px,14vw,85px);letter-spacing:-.04em}.intro{font-size:16px;line-height:1.6;margin-top:22px;max-width:38ch}.illustration{min-height:330px;width:100%;margin-top:5px}.orbit{width:225px;height:225px}.mascot{width:225px}.working{left:0;top:0;font-size:10px;z-index:2;background:var(--paper);padding:3px 6px 3px 0}.note{bottom:0;right:3%;font-size:17px;padding:10px 13px}.note span{font-size:9px}.contact-top{padding:24px 6% 18px}.contact h2{font-size:29px}.contact-top p{font-size:14px}.contact-links{margin:0 6% 26px;grid-template-columns:1fr;border-radius:12px}.contact-link{padding:19px 20px;gap:9px}.contact-link+.contact-link{border-left:0;border-top:var(--line)}.contact-link:last-child{grid-column:auto;padding:19px 20px}.contact-value{font-size:26px}.contact-value.small{font-size:24px}footer{padding:18px 6%;flex-direction:column;gap:4px;font-size:10px}}
@media(prefers-reduced-motion:reduce){*{transition:none!important;scroll-behavior:auto!important}}
@media(forced-colors:active){.outline{color:CanvasText;-webkit-text-stroke:0}.orbit{border-color:CanvasText}}
</style>
</head>
<body>
<a class="skip" href="#inhoud">Naar de inhoud</a>
<div class="shell">
<header class="masthead"><span class="wordmark">CODE LIESHOUT</span><span class="status"><span class="dot" aria-hidden="true"></span>Tijdelijk in de steigers</span></header>
<main id="inhoud">
<section class="hero" aria-labelledby="titel">
<div><p class="eyebrow">Een nieuwe versie is in de maak</p><h1 id="titel">Even<br>verbouwen.<br><span class="outline">Niet verdwenen.</span></h1><p class="intro">Mijn website krijgt een flinke opknapbeurt. Achter de schermen bouw ik aan iets nieuws.<br><strong>Een vraag, idee of project? Je kunt gewoon bij mij terecht.</strong></p></div>
<div class="illustration"><span class="working"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m14 6 4-4 4 4-4 4M3 21l11-11M8 3l13 13-5 5L3 8z"/></svg>WERK IN UITVOERING</span><div class="orbit" aria-hidden="true"></div><img class="mascot" src="/maintenance/cactus.webp" width="450" height="560" alt="De cactus-ridder van Code Lieshout met zijn laptop, klaar om verder te bouwen."><div class="note">Website even op de werkbank.<span>IK BEN GEWOON BEREIKBAAR ↗</span></div></div>
</section>
<section class="contact" aria-labelledby="contact-titel"><div class="contact-top"><h2 id="contact-titel">De site is in de maak. Het contact niet.</h2><p>Pim van Lieshout · Code Lieshout</p></div><div class="contact-links"><a class="contact-link" href="mailto:pim@code-lieshout.nl"><span class="contact-label">Stuur me een mail <span class="arrow" aria-hidden="true">↗</span></span><span class="contact-value">pim@code-lieshout.nl</span></a><a class="contact-link" href="tel:+31612419980"><span class="contact-label">Bel me gerust <span class="arrow" aria-hidden="true">↗</span></span><span class="contact-value">06 12419980</span></a><a class="contact-link" href="https://wa.me/31612419980"><span class="contact-label">Liever een appje? <span class="arrow" aria-hidden="true">↗</span></span><span class="contact-value small">WhatsApp</span></a></div></section>
</main>
<footer><p>Code Lieshout · Pim van Lieshout</p><p>Eventer 17 · 5351 SK Berghem · KvK 99344882</p></footer><div class="stripe" aria-hidden="true"></div>
</div>
</body></html>`;
