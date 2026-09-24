import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Mewa Masala Ghar — Premium Dry Fruits, Spices & Nutrition',
  description = 'Pure Indian Goodness, Rooted in Tradition. Shop premium dry fruits, cold-pressed seeds, stone-ground spices, baby nutrition, and personal care directly from APMC Vashi.',
  image = '/og-image.png',
}) => {
  useEffect(() => {
    document.title = title.includes('Mewa Masala Ghar') ? title : `${title} | Mewa Masala Ghar`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Open Graph
    const setOgTag = (property: string, content: string) => {
      let og = document.querySelector(`meta[property="${property}"]`);
      if (!og) {
        og = document.createElement('meta');
        og.setAttribute('property', property);
        document.head.appendChild(og);
      }
      og.setAttribute('content', content);
    };

    setOgTag('og:title', title);
    setOgTag('og:description', description);
    setOgTag('og:image', image);
    setOgTag('og:type', 'website');
  }, [title, description, image]);

  return null;
};
