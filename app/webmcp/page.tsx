export const metadata = {
  title: "Wat is WebMCP? — Uitleg voor iedereen",
  description:
    "WebMCP in gewone mensentaal: wat het is, hoe het werkt en wat je ermee kunt. Een uitleg in de stijl van een gebruiksaanwijzing — geen voorkennis nodig.",
};

/**
 * /webmcp — PRIKKEL-stijl uitlegpagina over WebMCP.
 * Statische one-pager uit public/webmcp/, getoond in een fullscreen iframe
 * (zelfde patroon als /mcp-explorer). De sub-route biedt ook directe toegang
 * zonder iframe-wrapper (dezelfde HTML, relatieve paden werken daar prima).
 */
export default function WebmcpPage() {
  return (
    <iframe
      src="/webmcp/index.html"
      title="Wat is WebMCP? — Uitleg in PRIKKEL-stijl"
      className="block"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        border: "none",
        backgroundColor: "#ffffff",
        zIndex: 50,
    }}
    />
  );
}
