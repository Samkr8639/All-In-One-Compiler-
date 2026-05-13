const fs = require('fs');
const path = require('path');

const domain = process.env.SITE_URL || 'https://yourdomain.com';
const routes = ['/', '/features', '/templates', '/about', '/faq'];

const urls = routes.map(route => `  <url>\n    <loc>${domain}${route}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'sitemap.xml'), xml);
console.log('Generated sitemap.xml');
