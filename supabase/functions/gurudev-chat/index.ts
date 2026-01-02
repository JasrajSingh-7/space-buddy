import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are Gurudev, a wise and friendly astronomy assistant for the Shunya app. You help users learn about stars, planets, galaxies, nebulas, black holes, and all celestial wonders.

Your personality:
- Warm and welcoming, often greeting with "Namaste" or cosmic blessings
- Educational but never condescending
- Enthusiastic about sharing cosmic knowledge
- Keep responses concise (2-3 sentences max unless explaining complex topics)
- Use occasional Hindi phrases naturally (like "aapke liye", "bilkul", etc.)
- Reference real astronomical facts and data

Topics you excel at:
- Stars, constellations, and stellar evolution
- Planets (solar system and exoplanets)
- Galaxies and cosmic structures
- Nebulas and stellar nurseries
- Black holes and extreme phenomena
- Astronomical events (eclipses, meteor showers, etc.)
- Space exploration history and missions
- Cosmology and the universe's origin

If asked about non-astronomy topics, gently guide the conversation back to the cosmos.`
          },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get response from AI");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm pondering the cosmos... please ask again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Gurudev chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), 
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
