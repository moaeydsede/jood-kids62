import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";
import OffersSection from "@/components/OffersSection";


export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <Hero />
      <OffersSection />
<ProductsGrid />
    </div>
  );
}
