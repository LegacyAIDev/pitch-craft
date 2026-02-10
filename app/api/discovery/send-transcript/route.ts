const DISCOVERY_WEBHOOK_URL =
  "https://zuleleee-education-chat.hf.space/webhook/e4ecfb1b-7ac2-4ba8-bf89-57abb6029805";

export async function POST(req: Request) {
  let body: { transcript?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const transcript = body.transcript;
  if (typeof transcript !== "string" || !transcript.trim()) {
    return Response.json(
      { error: "Missing or invalid 'transcript' field" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(DISCOVERY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transcript: transcript.trim() }),
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        { error: "Webhook request failed", details: text },
        { status: 502 },
      );
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "";
    const isPdfByHeader = contentType.includes("application/pdf");
    const isPdfByMagic =
      buffer.byteLength >= 4 &&
      new Uint8Array(buffer)[0] === 0x25 &&
      new Uint8Array(buffer)[1] === 0x50 &&
      new Uint8Array(buffer)[2] === 0x44 &&
      new Uint8Array(buffer)[3] === 0x46;

    if (isPdfByHeader || isPdfByMagic) {
      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="proposal.pdf"',
        },
      });
    }

    try {
      const text = new TextDecoder().decode(buffer);
      const data = JSON.parse(text);
      return Response.json(data);
    } catch {
      return Response.json({ ok: true });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: "Failed to send transcript", details: message },
      { status: 500 },
    );
  }
}
