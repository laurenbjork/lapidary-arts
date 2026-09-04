import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description = "Lapidary Arts Jewelry offers exquisite handcrafted fine jewelry, custom engagement rings, and vintage Rolex watches. Experience unparalleled artistry and bespoke craftsmanship for your future heirlooms.", 
  keywords = ["fine jewelry", "custom engagement rings", "vintage Rolex", "bespoke jeweler", "handcrafted jewelry"], 
  author = "Lapidary Arts Jewelry", 
  type = "website", 
  url = "https://www.lapidaryartsjewelry.com", 
  image = "/images/site-logo.jpg", 
  schema 
}) => {
  const siteName = 'Lapidary Arts Jewelry';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lapidary Arts Jewelry',
    url: 'https://www.lapidaryartsjewelry.com',
    logo: 'https://www.lapidaryartsjewelry.com/images/site-logo.jpg',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-972-964-1090',
      contactType: 'customer service',
    },
    sameAs: [
      "https://www.instagram.com/lapidaryartsjewelry/",
      "https://www.facebook.com/LapidaryArtsCJ/"
    ],
  };

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      {keywords && <meta name='keywords' content={Array.isArray(keywords) ? keywords.join(', ') : keywords} />}
      {author && <meta name='author' content={author} />}

      {/* Open Graph / Facebook tags */}
      <meta property='og:type' content={type} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={siteName} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content={image} />

      {/* Twitter card tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={image} />

      {/* Structured data */}
      <script type='application/ld+json'>
        {JSON.stringify(schema || defaultSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
