export const getSmartProductFallback = (productName?: string, categoryName?: string): string => {
  const name = (productName || '').toLowerCase();
  const cat = (categoryName || '').toLowerCase();

  // Dry Fruits
  if (name.includes('almond') || name.includes('badam')) return '/products/dry-fruits/almonds_badam.jpg';
  if (name.includes('cashew') || name.includes('kaju')) return '/products/dry-fruits/cashews_kaju.jpg';
  if (name.includes('pista') || name.includes('pistachio')) return '/products/dry-fruits/pistachios_pista.jpg';
  if (name.includes('anjeer') || name.includes('fig')) return '/products/dry-fruits/figs_anjeer.jpg';
  if (name.includes('kismis') || name.includes('kishmish') || name.includes('raisin')) return '/products/dry-fruits/raisins_kismis.jpg';
  if (name.includes('walnut') || name.includes('akhrot')) return '/products/dry-fruits/walnuts_akhrot.jpg';
  if (name.includes('mix dry fruit') || name.includes('panch mewa') || name.includes('punch') || name.includes('munch')) {
    return '/products/dry-fruits/royal_panch_mewa.jpg';
  }

  // Spices
  if (name.includes('haldi') || name.includes('turmeric')) return '/products/spices/haldi.jpg';
  if (name.includes('mirch') || name.includes('chilli')) return '/products/spices/lal_mirch.jpg';
  if (name.includes('dhaniya') || name.includes('coriander')) return '/products/spices/dhaniya.jpg';
  if (cat.includes('spice') || name.includes('masala')) return '/products/spices/spices_row_preview.jpg';

  // Seeds
  if (name.includes('chia')) return '/products/seeds-aata/chia_seeds.jpg';
  if (name.includes('flax') || name.includes('alsi')) return '/products/seeds-aata/flax_seeds.jpg';
  if (name.includes('pumpkin')) return '/products/seeds-aata/pumpkin_seeds.jpg';
  if (name.includes('sunflower')) return '/products/seeds-aata/sunflower_seeds.jpg';
  if (name.includes('mix seed') || cat.includes('seed')) return '/products/seeds-aata/mix_seeds.jpg';

  // Makhana
  if (name.includes('peri')) return '/foods/makhana/makhana_peri_peri.jpg';
  if (name.includes('cream') || name.includes('onion')) return '/foods/makhana/makhana_cream_onion.jpg';
  if (name.includes('mint') || name.includes('pudina')) return '/foods/makhana/makhana_mint_punch.jpg';
  if (name.includes('makhana') || cat.includes('makhana')) return '/foods/foods_makhana.jpg';

  // Personal Care / Jimmi Jaggu
  if (name.includes('dead sea') || name.includes('mud')) return '/assets/jimmi-jaggu/prod_dead_sea_mud.jpg';
  if (name.includes('pink multani') || name.includes('rose')) return '/assets/jimmi-jaggu/cat_ayurvedic_powder.jpg';
  if (name.includes('multani mitti') || cat.includes('care') || cat.includes('skincare')) return '/assets/jimmi-jaggu/prod_dead_sea_mud.jpg';
  if (name.includes('baby') || cat.includes('baby')) return '/assets/jimmi-jaggu/prod_baby_cream.jpg';

  return '/foods/foods_dryfruits.jpg';
};

export const resolveImageUrl = (url?: string, productName?: string, categoryName?: string): string => {
  if (!url) return getSmartProductFallback(productName, categoryName);
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  const normalized = url.startsWith('/') ? url : `/${url}`;

  if (normalized.startsWith('/uploads')) {
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : (import.meta.env.DEV ? 'http://localhost:5000' : 'https://api.mewamasalaghar.com');
    return `${baseUrl}${normalized}`;
  }

  return normalized;
};
