import { site } from './site.config.mjs';
export const websiteSchema = site.url ? JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Yeuanne Berry', url: site.url + '/' }).replaceAll('<', '\\u003c') : '';
