const FIREFLIES_WEBHOOK_URL =
  "https://zuleleee-education-chat.hf.space/webhook/430efd7d-3ad3-4971-97db-f22bcc6d5244";

export const maxDuration = 120;

export async function POST(req: Request) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const url = body.url;
  if (typeof url !== "string" || !url.trim()) {
    return Response.json(
      { error: "Missing or invalid 'url' field (Fireflies recording link)" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(FIREFLIES_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: url.trim() }),
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        { error: "Webhook request failed", details: text },
        { status: 502 }
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
      { error: "Failed to process Fireflies recording", details: message },
      { status: 500 }
    );
  }
}
