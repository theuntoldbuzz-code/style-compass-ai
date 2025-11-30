import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history = [] }: RequestBody = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are StyleAI, a friendly and knowledgeable Indian fashion advisor chatbot. You help users with:

1. **Outfit Recommendations**: Suggest complete outfits for occasions (weddings, office, dates, festivals, casual)
2. **Color Advice**: Recommend colors based on skin tone, occasion, and personal preferences
3. **Budget Shopping**: Find stylish options within specific budgets (in Indian Rupees ₹)
4. **Style Tips**: Share fashion tips, trending styles, and how to mix & match

Guidelines:
- Always be enthusiastic and encouraging about fashion
- Use Indian context (mention stores like Myntra, Ajio, Amazon India, Zara, H&M India)
- Give specific product suggestions with estimated price ranges in ₹
- Keep responses concise but helpful (2-3 short paragraphs max)
- Include emojis to make it friendly ✨
- When suggesting outfits, break them down by item (top, bottom, footwear, accessories)
- If asked about colors for skin tones, give specific color names and why they work

Example format for outfit suggestions:
"For a summer wedding under ₹3000, try:
👗 Top: Pastel kurta (₹800-1200)
👖 Bottom: Palazzo pants (₹600-900)
👠 Footwear: Block heels (₹800-1000)
💍 Accessories: Statement earrings (₹300-500)

This combo works great because..."`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.choices?.[0]?.message?.content || "I'm not sure how to help with that. Could you rephrase your question?";

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Style AI Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
