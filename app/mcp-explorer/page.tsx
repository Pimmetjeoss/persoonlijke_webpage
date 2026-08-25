export default function McpExplorerPage() {
  return (
    <iframe
      src="/mcp-explorer/index.html"
      title="MCP Explorer — Windows 98 demo"
      className="block"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        border: "none",
        backgroundColor: "#008080",
        zIndex: 50,
      }}
    />
  );
}
