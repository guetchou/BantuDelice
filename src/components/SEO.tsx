
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  url?: string;
  schemaData?: Record<string, any>;
  noindex?: boolean;
  canonical?: string;
  lang?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Buntudelice - Livraison de repas, taxi et services à Brazzaville',
  description = 'Commandez des repas de restaurants locaux, réservez un taxi ou accédez à des services professionnels à Brazzaville. Service rapide, pratique et fiable.',
  keywords = 'livraison repas, taxi, services, Brazzaville, Congo',
  ogImage = '/images/og-image.jpg',
  ogType = 'website',
  url = 'https://buntudelice.com',
  schemaData,
  noindex = false,
  canonical,
  lang = 'fr',
}) => {
  // Préparer les données structurées
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Buntudelice',
    url: 'https://buntudelice.com',
    logo: 'https://buntudelice.com/logo.png',
    description: description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brazzaville',
      addressCountry: 'CD',
    },
    sameAs: [
      'https://www.facebook.com/buntudelice',
      'https://twitter.com/buntudelice',
      'https://www.instagram.com/buntudelice/',
    ],
  };

  const schema = schemaData || defaultSchema;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* No index if needed */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      
      {/* Mobile meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#00C49A" />
      
      {/* Performance meta */}
      <link rel="preconnect" href="https://api.buntudelice.com" />
    </Helmet>
  );
};

export default SEO;
