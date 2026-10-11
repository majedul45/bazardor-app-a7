export const API_BASE = 'https://openapi.programming-hero.com/api/bazardor';
async function getJson(url) {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API request failed (${res.status})`);
  return res.json();
}
function unwrap(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return [];
  for (const key of ['data', 'products', 'categories', 'items', 'results', 'records']) {
    if (Array.isArray(data[key])) return data[key];
  }
  // Some APIs wrap the array one level deeper, e.g. { success: true, data: { products: [] } }.
  for (const key of ['data', 'result', 'payload']) {
    const nested = data[key];
    if (nested && typeof nested === 'object') {
      const found = unwrapArray(nested);
      if (found) return found;
    }
  }
  return [data];
}
function unwrapArray(data) {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== 'object') return null;
  for (const key of ['products', 'categories', 'items', 'results', 'records']) {
    if (Array.isArray(data[key])) return data[key];
  }
  return null;
}
function firstValue(obj, keys) {
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}
function numericValue(value) {
  if (value && typeof value === 'object') {
    value = firstValue(value, ['amount', 'value', 'price', 'current', 'today']);
  }
  if (typeof value === 'string') value = value.replace(/[^0-9.+-]/g, '');
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
export async function getProducts() { try { return unwrap(await getJson(`${API_BASE}/products`)); } catch { return []; } }
export async function getCategories() { try { return unwrap(await getJson(`${API_BASE}/categories`)); } catch { return []; } }
export async function getProduct(id) { try { const data = await getJson(`${API_BASE}/products/${encodeURIComponent(id)}`); const item = data?.data?.product ?? data?.data?.data ?? data?.data ?? data?.product ?? data?.result ?? data; if (Array.isArray(item)) return item[0] ?? null; return item && typeof item === 'object' ? item : null; } catch { const all = await getProducts(); return all.find(p => String(p.id ?? p._id ?? p.product_id) === String(id) || p.slug === id) ?? null; } }
export async function getCategoryProducts(slug) { try { return unwrap(await getJson(`${API_BASE}/products?category=${encodeURIComponent(slug)}`)); } catch { return []; } }
export const productName = (p) => String(firstValue(p, ['name', 'name_bn', 'nameBn', 'product_name_bn', 'productNameBn', 'product_name', 'productName', 'title_bn', 'titleBn', 'title', 'label']) ?? 'পণ্যের নাম');
export const productPrice = (p) => {
  const raw = firstValue(p, ['today', 'price', 'current_price', 'currentPrice', 'today_price', 'todayPrice', 'price_today', 'priceToday', 'market_price', 'marketPrice', 'average_price', 'averagePrice', 'avg_price', 'avgPrice', 'min_price', 'minPrice']);
  const value = numericValue(raw);
  return value !== undefined && value >= 0 ? value : 0;
};
export const productUnit = (p) => String(firstValue(p, ['unit_bn', 'unitBn', 'unit', 'unit_name', 'unitName', 'measurement_unit', 'measurementUnit', 'measurement', 'price_unit', 'priceUnit', 'quantity_unit', 'quantityUnit']) ?? 'প্রতি কেজি');
export const productCategory = (p) => { const value = firstValue(p, ['categoryNameBn', 'category_name_bn', 'category_name', 'categoryName', 'category', 'category_id', 'categoryId', 'category_slug', 'categorySlug']); if (value && typeof value === 'object') return String(firstValue(value, ['name_bn', 'nameBn', 'name', 'title', 'slug', 'id']) ?? 'অন্যান্য'); return String(value ?? 'অন্যান্য'); };
export const productEmoji = (p) => String(firstValue(p, ['emoji', 'categoryIcon', 'icon', 'imageEmoji', 'image']) ?? emojiFor(productName(p)));
export function emojiFor(name) { const n=name.toLowerCase(); if (/চাল|rice/.test(n)) return '🍚'; if (/ডাল|lentil/.test(n)) return '🫘'; if (/আলু|potato/.test(n)) return '🥔'; if (/পেঁয়াজ|পিঁয়াজ|onion/.test(n)) return '🧅'; if (/রসুন|garlic/.test(n)) return '🧄'; if (/মরিচ|chili/.test(n)) return '🌶️'; if (/মাছ|fish|ইলিশ/.test(n)) return '🐟'; if (/মুরগি|মাংস|chicken/.test(n)) return '🍗'; if (/ডিম|egg/.test(n)) return '🥚'; if (/আদা|ginger/.test(n)) return '🫚'; if (/তেল|oil/.test(n)) return '🫙'; return '🥬'; }
export function bnNumber(n) { return new Intl.NumberFormat('bn-BD', { maximumFractionDigits: 2 }).format(n); }
export function bnMoney(n) { return `${bnNumber(n)} টাকা`; }
export function changeValue(p) {
  // The BazarDor API provides the canonical change in change.pct.
  const apiChange = p?.change;
  if (apiChange && typeof apiChange === 'object') {
    const pct = numericValue(apiChange.pct);
    if (pct !== undefined) {
      const dir = String(apiChange.dir ?? '').toLowerCase();
      if (dir === 'up') return Math.abs(pct);
      if (dir === 'down') return -Math.abs(pct);
      return pct;
    }
  }
  const raw = firstValue(p, ['change_percent', 'changePercent', 'price_change_percent', 'priceChangePercent', 'change_percentage', 'changePercentage', 'percentage_change', 'percentageChange', 'price_change', 'priceChange']);
  const value = numericValue(raw);
  if (value !== undefined) return value;
  const current = numericValue(firstValue(p, ['today', 'price', 'current_price', 'currentPrice', 'today_price', 'todayPrice', 'price_today', 'priceToday', 'market_price', 'marketPrice']));
  const previous = numericValue(firstValue(p, ['yesterday', 'previous_price', 'previousPrice', 'yesterday_price', 'yesterdayPrice', 'last_price', 'lastPrice', 'old_price', 'oldPrice', 'price_yesterday', 'priceYesterday']));
  if (current !== undefined && previous !== undefined && previous > 0) return ((current - previous) / previous) * 100;
  return 0;
}
export function safeSlug(p) { return String(p.slug ?? p.id ?? productName(p)).toLowerCase().replace(/\s+/g,'-'); }
