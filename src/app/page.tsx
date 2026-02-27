import ProductsGrid from "@/components/ProductsGrid";
import SeasonsBar from "@/components/SeasonsBar";

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6">
      <SeasonsBar />
      <ProductsGrid />
    </div>
  );
}
