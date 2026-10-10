export const resolveImageUrl = (url?: string): string => {
  if (!url) return '/foods/foods_dryfruits.jpg';
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
