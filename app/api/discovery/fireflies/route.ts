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

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/pdf")) {
      const pdfBuffer = await res.arrayBuffer();
      return new Response(pdfBuffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="proposal.pdf"',
        },
      });
    }

    const data = await res.json().catch(() => ({}));
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: "Failed to process Fireflies recording", details: message },
      { status: 500 }
    );
  }
}
