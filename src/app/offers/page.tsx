import Hero from "@/components/Hero";
import OffersGrid from "@/components/OffersGrid";

export const metadata = {
  title: "العروض | JoodKids",
};

export default function OffersPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <Hero />
      <OffersGrid />
    </div>
  );
}
