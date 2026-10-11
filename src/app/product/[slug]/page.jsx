import { notFound } from 'next/navigation';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import { getProduct, getProducts, productName, productPrice, productUnit, productCategory, productEmoji, changeValue, bnMoney, bnNumber } from '@/lib/api';

async function ProductDetail({slug}) {
  let product = await getProduct(slug);
  if (!product) {
    const all = await getProducts();
    product = all.find(p => String(p.slug ?? p.id ?? productName(p)).toLowerCase().replace(/\s+/g, '-') === slug) ?? null;
  }
  if (!product) return notFound();

  const price = productPrice(product);
  const min = Array.isArray(product.markets) && product.markets.length
    ? Math.min(...product.markets.map(m => Number(m.min ?? m.minPrice ?? m.minimumPrice ?? price)).filter(Number.isFinite))
    : Number(product.minPrice ?? product.minimumPrice ?? price);
  const max = Array.isArray(product.markets) && product.markets.length
    ? Math.max(...product.markets.map(m => Number(m.max ?? m.maxPrice ?? m.maximumPrice ?? price)).filter(Number.isFinite))
    : Number(product.maxPrice ?? product.maximumPrice ?? price);
  const avg = Array.isArray(product.markets) && product.markets.length
    ? product.markets.reduce((sum, m) => sum + ((Number(m.min ?? price) + Number(m.max ?? price)) / 2), 0) / product.markets.length
    : Number(product.averagePrice ?? product.avgPrice ?? price);
  const change = changeValue(product);
  const marketRows = Array.isArray(product.markets) ? product.markets : Array.isArray(product.bazars) ? product.bazars : Array.isArray(product.marketPrices) ? product.marketPrices : [];

  return <div className="container page-wrap product-detail-page">
    <div className="breadcrumb"><Link href="/">হোম</Link><span>›</span><Link href={`/category/${encodeURIComponent(productCategory(product))}`}>{productCategory(product)}</Link><span>›</span><span>{productName(product)}</span></div>

    <section className="product-detail-hero">
      <div className="product-detail-identity">
        <div className="product-detail-icon" aria-hidden="true">{productEmoji(product)}</div>
        <div className="product-detail-copy">
          <h1>{productName(product)}</h1>
          <p className="product-detail-unit">{productUnit(product)} · {productCategory(product)}</p>
          <p className="product-detail-change">{change > 0 ? 'গতকালের তুলনায় আজ দাম বেড়েছে' : change < 0 ? 'গতকালের তুলনায় আজ দাম কমেছে' : 'গতকালের তুলনায় আজ দামে পরিবর্তন নেই'}{change !== 0 ? ` · ${product.priceChangeAmount ?? product.changeAmount ? bnMoney(Math.abs(Number(product.priceChangeAmount ?? product.changeAmount))) : `${bnNumber(Math.abs(change))}%`}` : ''}</p>
        </div>
      </div>
      <div className="product-today-price"><span>আজকের দাম</span><strong>{bnNumber(price)}</strong><small>টাকা / {productUnit(product).replace(/^প্রতি\s*/, '')}</small><em className={change > 0 ? 'detail-change-up' : change < 0 ? 'detail-change-down' : 'detail-change-flat'}>{change > 0 ? '▲' : change < 0 ? '▼' : '—'} {bnNumber(Math.abs(change))}%</em></div>
    </section>

    <section className="product-detail-panel">
      <h2 className="section-title">দামের সারসংক্ষেপ</h2>
      <div className="price-summary">
        <div className="summary-box"><small>সর্বনিম্ন দাম</small><strong className="summary-min">{bnMoney(min)}</strong><span>সবচেয়ে কম দামের বাজার</span></div>
        <div className="summary-box"><small>সর্বোচ্চ দাম</small><strong className="summary-max">{bnMoney(max)}</strong><span>সবচেয়ে বেশি দামের বাজার</span></div>
        <div className="summary-box"><small>গড় দাম</small><strong className="summary-avg">{bnMoney(avg)}</strong><span>{productUnit(product)}-এর হিসাবে</span></div>
      </div>

      <h2 className="section-title market-heading">বাজারভিত্তিক আজকের দাম</h2>
      {marketRows.length ? <div className="market-table-wrap"><table className="market-table"><thead><tr><th>বাজার</th><th>বিভাগ</th><th>সর্বনিম্ন</th><th>সর্বোচ্চ</th><th className="market-average-cell">গড়</th></tr></thead><tbody>{marketRows.map((market, index) => {
        const marketMin = Number(market.min ?? market.minPrice ?? market.minimumPrice ?? price);
        const marketMax = Number(market.max ?? market.maxPrice ?? market.maximumPrice ?? price);
        const marketAvg = (marketMin + marketMax) / 2;
        return <tr key={market.id ?? index}><td>{market.market ?? market.marketName ?? market.bazar ?? market.name ?? `বাজার ${bnNumber(index + 1)}`}</td><td>{market.division ?? market.district ?? market.area ?? market.location ?? '—'}</td><td>{bnMoney(marketMin)}</td><td>{bnMoney(marketMax)}</td><td className="market-average-cell"><strong>{bnMoney(marketAvg)}</strong></td></tr>;
      })}</tbody></table></div> : <div className="empty-state market-empty"><div className="empty-icon">🏪</div><h3>বাজারভিত্তিক আলাদা দাম পাওয়া যায়নি</h3><p className="muted">বাজারের তথ্য পাওয়া গেলে এখানে সর্বনিম্ন, সর্বোচ্চ ও গড় দাম দেখানো হবে।</p></div>}
      <Link href="/#সব-পণ্য" className="product-detail-back">← সব পণ্যে ফিরে যান</Link>
    </section>
  </div>;
}

export default async function ProductPage({params}) {
  const {slug} = await params;
  return <RequireAuth><ProductDetail slug={decodeURIComponent(slug)} /></RequireAuth>;
}
