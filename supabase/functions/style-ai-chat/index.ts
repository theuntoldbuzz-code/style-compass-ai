import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS configuration - restrict to allowed origins
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:8080',
  'http://localhost:3000',
];

// Check if origin is allowed (includes Lovable preview domains)
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovable\.app$/.test(origin)) return true;
  if (/^https:\/\/[a-z0-9-]+\.lovableproject\.com$/.test(origin)) return true;
  return false;
}

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = isAllowedOrigin(origin) ? origin! : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Credentials': 'true',
  };
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface RequestBody {
  message: string;
  history?: ChatMessage[];
}

// Input validation constants
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20;
const MAX_HISTORY_ITEM_LENGTH = 1000;

// Validate and sanitize chat message
function validateMessage(message: unknown): string {
  if (typeof message !== 'string') {
    throw new Error('Message must be a string');
  }
  const trimmed = message.trim();
  if (trimmed.length === 0) {
    throw new Error('Message cannot be empty');
  }
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    throw new Error(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
  }
  return trimmed;
}

// Validate chat history
function validateHistory(history: unknown): ChatMessage[] {
  if (!history) return [];
  if (!Array.isArray(history)) {
    throw new Error('History must be an array');
  }
  const historyArray: unknown[] = history.length > MAX_HISTORY_LENGTH 
    ? history.slice(-MAX_HISTORY_LENGTH) 
    : history;
  
  return historyArray.map((item: unknown, index: number) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`History item ${index} is invalid`);
    }
    const { role, content } = item as Record<string, unknown>;
    if (role !== 'user' && role !== 'assistant') {
      throw new Error(`History item ${index} has invalid role`);
    }
    if (typeof content !== 'string') {
      throw new Error(`History item ${index} has invalid content`);
    }
    const truncatedContent = content.length > MAX_HISTORY_ITEM_LENGTH 
      ? content.substring(0, MAX_HISTORY_ITEM_LENGTH) + '...' 
      : content;
    return { role, content: truncatedContent };
  });
}

// Convert chat messages to Gemini format
function convertToGeminiFormat(systemPrompt: string, history: ChatMessage[], userMessage: string) {
  const contents: any[] = [];
  
  // Add system instruction as the first user message
  contents.push({
    role: "user",
    parts: [{ text: systemPrompt + "\n\nNow respond to the user's questions." }]
  });
  contents.push({
    role: "model",
    parts: [{ text: "I understand! I'm StyleAI, ready to help with fashion advice. What would you like to know?" }]
  });
  
  // Add history
  for (const msg of history) {
    contents.push({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    });
  }
  
  // Add current user message
  contents.push({
    role: "user",
    parts: [{ text: userMessage }]
  });
  
  return contents;
}

serve(async (req) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate inputs
    const message = validateMessage(body.message);
    const history = validateHistory(body.history);
    
    const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    console.log(`Processing chat message (${message.length} chars, ${history.length} history items)`);

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

    const contents = convertToGeminiFormat(systemPrompt, history, message);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I'm not sure how to help with that. Could you rephrase your question?";

    return new Response(
      JSON.stringify({ response: assistantResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Style AI Chat error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    // Return user-friendly error for validation failures
    const isValidationError = errorMessage.includes('Message') || errorMessage.includes('History');
    return new Response(
      JSON.stringify({ error: isValidationError ? errorMessage : "An error occurred processing your request" }),
      { status: isValidationError ? 400 : 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
