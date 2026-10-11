import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories, getCategoryProducts } from '@/lib/api';
import SortProducts from '@/components/SortProducts';

const icons = { chal: '🍚', rice: '🍚', sobji: '🥬', vegetables: '🥬', fish: '🐟', mangsho: '🍗', fruits: '🍎', dal: '🫘', oil: '🫙' };

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([getCategories(), getCategoryProducts(slug)]);
  const cat = categories.find(c => String(c.slug ?? c.id ?? c._id ?? c.category_id ?? '') === slug || String(c.name ?? c.name_bn ?? c.nameBn ?? c.title ?? c.title_bn ?? '') === decodeURIComponent(slug));
  if (!cat && !products.length) return notFound();

  const title = String(cat?.name_bn ?? cat?.nameBn ?? cat?.name ?? cat?.title_bn ?? cat?.title ?? slug);
  const emoji = cat?.emoji || cat?.icon || cat?.imageEmoji || icons[slug] || '🧺';

  return (
    <main className="category-page">
      <div className="container category-page-inner">
        <nav className="breadcrumb category-breadcrumb" aria-label="Breadcrumb"><Link href="/">হোম</Link><span>/</span><span>{title}</span></nav>

        <section className="category-title-panel">
          <div className="category-title-icon" aria-hidden="true">{emoji}</div>
          <div className="category-title-copy">
            <h1>{title}</h1>
            <p>{products.length}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
          </div>
        </section>

        <SortProducts products={products} />
      </div>
    </main>
  );
}
