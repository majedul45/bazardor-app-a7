import { getProducts } from '@/lib/api';
import ProductGrid from '@/components/ProductGrid';
import HeroSection from '@/components/HeroSection';
import MarketTrends from '@/components/MarketTrends';

export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <HeroSection />
      <div className="container home-content">
        <MarketTrends products={products} />
        <section id="সব-পণ্য" className="all-products-section">
          <div className="section-head"><div><h2 className="section-title">সব পণ্য</h2><p>মোট {products.length}টি পণ্যের দাম দেখানো হচ্ছে</p></div></div>
          <ProductGrid products={products} />
        </section>
      </div>
    </>
  );
}
