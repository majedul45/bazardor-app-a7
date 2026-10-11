'use client';
import { useMemo, useState } from 'react';
import { ChevronDown } from '@/components/Icons';
import ProductGrid from './ProductGrid';
import { productPrice } from '@/lib/api';

export default function SortProducts({ products }) {
  const [sort, setSort] = useState('default');
  const sorted = useMemo(() => {
    const list = [...products];
    if (sort === 'asc') list.sort((a, b) => productPrice(a) - productPrice(b));
    if (sort === 'desc') list.sort((a, b) => productPrice(b) - productPrice(a));
    return list;
  }, [products, sort]);

  return (
    <div className="category-products">
      <div className="category-sort-panel">
        <label className="category-sort-label">সাজান
          <span className="category-select-wrap">
            <select className="sort-select category-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </span>
        </label>
      </div>
      <div className="category-results-label">মোট {sorted.length}টি পণ্য দেখানো হচ্ছে</div>
      <ProductGrid products={sorted} />
    </div>
  );
}
