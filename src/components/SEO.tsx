
import React from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, any>;
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Buntudelice - Services à la demande à Kinshasa',
  description = 'Buntudelice: Commandez en ligne des repas, réservez un taxi, et plus encore à Kinshasa. Service rapide et pratique pour tous vos besoins quotidiens.',
  canonicalUrl = 'https://buntudelice.com',
  ogImage = '/og-image.svg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false,
}) => {
  const fullTitle = title.includes('Buntudelice') ? title : `${title} | Buntudelice`;
  
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Buntudelice',
    url: 'https://buntudelice.com',
    logo: 'https://buntudelice.com/logo.png',
    sameAs: [
      'https://www.facebook.com/buntudelice',
      'https://www.instagram.com/buntudelice',
      'https://twitter.com/buntudelice'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+243-000-000-000',
      contactType: 'customer service'
    }
  };
  
  const finalStructuredData = structuredData || baseStructuredData;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Structured data */}
      <script type="application/ld+json">
        {JSON.stringify(finalStructuredData)}
      </script>
      
      {/* No index if specified */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default SEO;
