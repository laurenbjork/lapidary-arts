import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, author, type, url, image, schema }) => {
  const siteName = 'Lapidary Arts Jewelry';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      {keywords && <meta name='keywords' content={keywords.join(', ')} />}
      {author && <meta name='author' content={author} />}

      {/* Open Graph / Facebook tags */}
      <meta property='og:type' content={type || 'website'} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:site_name' content={siteName} />
      {url && <meta property='og:url' content={url} />}
      {image && <meta property='og:image' content={image} />}

      {/* Twitter card tags */}
      <meta name='twitter:card' content='summary_large_image' />
      {/* If you have a Twitter handle, add it here */}
      {/* <meta name='twitter:creator' content={'@YourTwitterHandle'} /> */}
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      {image && <meta name='twitter:image' content={image} />}

      {/* Structured data */}
      {schema && <script type='application/ld+json'>{JSON.stringify(schema)}</script>}
    </Helmet>
  );
};

export default SEO;
