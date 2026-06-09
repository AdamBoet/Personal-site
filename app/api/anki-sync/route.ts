import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { error: `Missing env vars:${!url ? " NEXT_PUBLIC_SUPABASE_URL" : ""}${!key ? " SUPABASE_SERVICE_ROLE_KEY" : ""}` },
      { status: 500 }
    );
  }

  const admin = createClient(url, key);
  const { stats, cards } = await req.json();

  const { error: statsError } = await admin
    .from("anki_stats")
    .upsert({ id: 1, ...stats });

  if (statsError) return NextResponse.json({ error: statsError.message }, { status: 500 });

  const { error: cardsError } = await admin
    .from("hanzi_cards")
    .upsert(cards);

  if (cardsError) return NextResponse.json({ error: cardsError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
