import { PrismaClient } from '@prisma/client';

const EXTERNAL_DATA_URL = 'http://localhost:3000/berita';

function generateSiteMap(news) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
     <!-- Halaman Statis -->
     <url>
       <loc>http://localhost:3000</loc>
       <changefreq>hourly</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>http://localhost:3000/data-publik</loc>
       <changefreq>daily</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>http://localhost:3000/about</loc>
       <changefreq>monthly</changefreq>
       <priority>0.5</priority>
     </url>
     <!-- Halaman Berita Dinamis -->
     ${news
       .map(({ id, tanggal, judul }) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${id}`}</loc>
           <lastmod>${new Date(tanggal).toISOString()}</lastmod>
           <changefreq>never</changefreq>
           <priority>0.7</priority>
           <news:news>
              <news:publication>
                <news:name>Insight Berita</news:name>
                <news:language>id</news:language>
              </news:publication>
              <news:publication_date>${new Date(tanggal).toISOString()}</news:publication_date>
              <news:title>${judul.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
           </news:news>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const prisma = new PrismaClient();
  
  try {
    // Ambil 100 berita terbaru untuk sitemap
    const news = await prisma.news.findMany({
      orderBy: { tanggal: 'desc' },
      take: 100,
      select: { id: true, tanggal: true, judul: true }
    });

    const sitemap = generateSiteMap(news);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.setHeader('Content-Type', 'text/xml');
    res.write('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
    res.end();
  } finally {
    await prisma.$disconnect();
  }

  return {
    props: {},
  };
}
