import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createSupabaseClient, corsHeaders, handleCors } from './_shared.ts';
import OpenAI from 'https://esm.sh/openai@6.1.0';
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai@0.24.1';

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const supabase = createSupabaseClient(req);
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('plan, plan_expiry')
      .eq('id', userId)
      .single();

    if (profileErr) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();
    const active = profile?.plan && profile.plan !== 'trial' && (!profile?.plan_expiry || new Date(profile.plan_expiry) > now);
    if (!active) {
      return new Response(JSON.stringify({ error: 'AI Coach requires an active subscription' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: details, error } = await supabase
      .from('onboarding_details')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.warn('[AI] onboarding_details fetch error', error.message);
    }

    const basePlan = {
      generatedAt: new Date().toISOString(),
      summary: 'Personalized fitness, nutrition, and mindfulness plan',
      goals: details?.goals || [],
      weeks: 4,
      schedule: [
        { day: 'Mon', workout: 'Full-body strength', nutrition: 'High protein, balanced carbs', mindfulness: '10m breathing' },
        { day: 'Tue', workout: 'Zone 2 cardio 30m', nutrition: 'Mediterranean plate', mindfulness: 'Body scan 10m' },
        { day: 'Wed', workout: 'Mobility + core', nutrition: 'Balanced bowl', mindfulness: 'Gratitude journaling' },
        { day: 'Thu', workout: 'Upper strength', nutrition: 'High protein', mindfulness: 'Box breathing 8m' },
        { day: 'Fri', workout: 'Intervals 20m', nutrition: 'Complex carbs focus', mindfulness: 'Mindful walk' },
        { day: 'Sat', workout: 'Lower strength', nutrition: 'Protein + greens', mindfulness: 'Meditation 12m' },
        { day: 'Sun', workout: 'Rest / light yoga', nutrition: 'Free choice within macros', mindfulness: 'Reflection 10m' },
      ],
      personalization: {
        injuries: details?.injuries || [],
        allergies: details?.allergies || [],
        meditationExperience: details?.meditation_experience || 'beginner',
      }
    };

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const openaiKey = Deno.env.get('OPENAI_KEY');
    
    if (!geminiKey && !openaiKey) {
      return new Response(JSON.stringify({ plan: basePlan, status: 'ready', source: 'base' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      const systemPrompt = `You are a world-class health coach. Create a 4-week plan with fitness, nutrition, and mindfulness.
Respond in JSON with fields: generatedAt (ISO), summary (string), goals (array), weeks (number), schedule (array of 7 objects with day, workout, nutrition, mindfulness), personalization (object).`;
      const userPrompt = `User goals: ${JSON.stringify(details?.goals || [])}
Allergies: ${JSON.stringify(details?.allergies || [])}
Injuries: ${JSON.stringify(details?.injuries || [])}
Meditation experience: ${JSON.stringify(details?.meditation_experience || 'beginner')}`;

      if (geminiKey) {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `${systemPrompt}\n\n${userPrompt}\n\nReturn only valid JSON.`;
        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const parsed = JSON.parse(text);
        return new Response(JSON.stringify({ plan: parsed, status: 'ready', source: 'gemini' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const client = new OpenAI({ apiKey: openaiKey as string });
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });
      const content = completion.choices?.[0]?.message?.content || '';
      const parsed = JSON.parse(content);
      return new Response(JSON.stringify({ plan: parsed, status: 'ready', source: 'openai' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (llmErr: any) {
      console.warn('[AI] OpenAI error, falling back to base plan', llmErr?.message);
      return new Response(JSON.stringify({ plan: basePlan, status: 'processing' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (e: any) {
    console.error('[AI] generate-plan error', e);
    return new Response(JSON.stringify({ error: e?.message || 'Failed to generate plan' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

