import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { stats, cards } = await req.json();

  const { error: statsError } = await supabase
    .from("anki_stats")
    .upsert({ id: 1, ...stats });

  if (statsError) return NextResponse.json({ error: statsError.message }, { status: 500 });

  const { error: cardsError } = await supabase
    .from("hanzi_cards")
    .upsert(cards);

  if (cardsError) return NextResponse.json({ error: cardsError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
