const DISCOVERY_WEBHOOK_URL =
  "https://zuleleee-education-chat.hf.space/webhook/e4ecfb1b-7ac2-4ba8-bf89-57abb6029805";

export async function POST(req: Request) {
  let body: { transcript?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const transcript = body.transcript;
  if (typeof transcript !== "string" || !transcript.trim()) {
    return Response.json(
      { error: "Missing or invalid 'transcript' field" },
      { status: 400 }
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
        { status: 502 }
      );
    }

    const data = await res.json().catch(() => ({}));
    return Response.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json(
      { error: "Failed to send transcript", details: message },
      { status: 500 }
    );
  }
}
