import stats from "@/data/anki-stats.json";
import hanziCards from "@/data/hanzi-cards.json";
import HanziDashboard from "./HanziDashboard";
import { type HanziCard } from "./CharacterGrid";

export default function HanziPage() {
  return (
    <HanziDashboard
      initialStats={stats}
      initialCards={hanziCards as HanziCard[]}
    />
  );
}
