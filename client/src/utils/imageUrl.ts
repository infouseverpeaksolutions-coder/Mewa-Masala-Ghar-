export const resolveImageUrl = (url?: string): string => {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads')) {
    const baseUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')
      : (import.meta.env.DEV ? 'http://localhost:5000' : '');
    return `${baseUrl}${url}`;
  }
  return url;
};
