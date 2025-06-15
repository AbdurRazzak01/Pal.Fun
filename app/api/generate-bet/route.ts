import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { input } = body;

  if (!input || typeof input !== "string") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const prompt = `
User has this bet idea: "${input}"

1. Is this a feasible bet/prediction to track on-chain? (yes/no)
2. Restate the bet clearly in one line.
3. Estimate a confidence score (0-100%) for feasibility and clarity.
4. Suggest **one direct, authoritative, specific URL** (not a description) that can be used to verify the outcome of the bet. If no such site exists, return an official news, data, or government URL.

Return as JSON, and the URL must be in the field "verificationUrl":
{
  "statement": "...",
  "feasible": "...",
  "confidence": ...,
  "verificationUrl": "https://example.com/official-or-definitive-url"
}
`.trim();

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      return new NextResponse(errText, { status: openaiRes.status });
    }

    const data = await openaiRes.json();

    // (Optional, but robust) Extract only a single URL from verificationUrl if model returns text with more than one URL
    const content = data.choices?.[0]?.message?.content ?? "";
    let parsed;
    try {
      parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    } catch {
      // Try to extract JSON block
      const match = content.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
    }

    // Always return only one valid URL in verificationUrl
    function extractFirstUrl(text: string) {
      const match = text?.match?.(/https?:\/\/[^\s]+/);
      return match ? match[0] : "";
    }

    if (parsed && parsed.verificationUrl) {
      parsed.verificationUrl = extractFirstUrl(parsed.verificationUrl);
    }

    return NextResponse.json({
      ...data,
      parsed, // You can use data.choices[0].message.content or the parsed, your frontend decides.
    });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
