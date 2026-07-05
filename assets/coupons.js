// Lógica de cupones de descuento, compartida entre index.html y admin.html.

export function computeDiscount(baseTotal, coupon){
  if (!coupon) return 0;
  const value = Number(coupon.discount_value);
  if (coupon.discount_type === 'percentage') return Math.min(baseTotal, baseTotal * (value / 100));
  if (coupon.discount_type === 'fixed_amount') return Math.min(baseTotal, value);
  if (coupon.discount_type === 'fixed_price') return Math.max(0, baseTotal - value);
  return 0;
}

export async function lookupCoupon(supabase, codeRaw){
  const code = (codeRaw || '').trim().toUpperCase();
  if (!code) return { coupon: null, notFound: false };
  const { data, error } = await supabase.from('coupons').select('*').eq('code', code).eq('active', true).maybeSingle();
  if (error || !data) return { coupon: null, notFound: true };
  const today = new Date().toISOString().slice(0, 10);
  if (data.expires_at && data.expires_at < today) return { coupon: null, notFound: true, expired: true };
  return { coupon: data, notFound: false };
}

export function couponSummary(coupon){
  if (!coupon) return '';
  if (coupon.discount_type === 'percentage') return `${Number(coupon.discount_value)}% de descuento`;
  if (coupon.discount_type === 'fixed_amount') return `${Number(coupon.discount_value).toFixed(0)}€ de descuento`;
  if (coupon.discount_type === 'fixed_price') return `precio final de ${Number(coupon.discount_value).toFixed(0)}€`;
  return '';
}
