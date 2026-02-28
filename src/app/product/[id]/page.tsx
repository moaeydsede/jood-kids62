import ProductDetails from "@/components/ProductDetails";

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetails productId={params.id} />;
}
