export async function GET() {
  return new Response(JSON.stringify({
    // Chrome DevTools配置
    version: "1.0",
    name: "Magnify",
  }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
