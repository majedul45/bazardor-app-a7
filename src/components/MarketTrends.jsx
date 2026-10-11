import ProductCard from '@/components/ProductCard';
import { changeValue } from '@/lib/api';

function TrendPanel({ title, products, kind }) {
  return (
    <section className="trend-section">
      <div className="trend-section-title">
        <span className={kind === 'up' ? 'trend-arrow-up' : 'trend-arrow-down'} aria-hidden="true">{kind === 'up' ? '▲' : '▼'}</span>
        <h2>{title}</h2>
      </div>
      {products.length ? <div className="product-grid trend-product-grid">{products.slice(0, 6).map((product, index) => <ProductCard key={String(product.id ?? product.slug ?? index)} product={product} />)}</div> : <p className="muted">দামের পরিবর্তনের তথ্য পাওয়া যায়নি।</p>}
    </section>
  );
}

export default function MarketTrends({ products }) {
  const changes = products.filter(product => changeValue(product) !== 0);
  const risers = [...changes].filter(product => changeValue(product) > 0).sort((a, b) => changeValue(b) - changeValue(a));
  const fallers = [...changes].filter(product => changeValue(product) < 0).sort((a, b) => changeValue(a) - changeValue(b));
  return <div id="দামের-পরিবর্তন" className="market-trends"><TrendPanel title="আজ দাম বেড়েছে" products={risers} kind="up" /><TrendPanel title="আজ দাম কমেছে" products={fallers} kind="down" /></div>;
}
