// lib/rssSources.js
export const RSS_SOURCES = [
  // KOMPAS.COM
  {
    id: 'kompas',
    name: 'Kompas.com',
    url: 'https://indeks.kompas.com/rss',
    category: 'Berita',
    sourceUrl: 'https://kompas.com',
    enabled: true
  },
  {
    id: 'kompas-news',
    name: 'Kompas News',
    url: 'https://news.kompas.com/rss',
    category: 'Berita',
    sourceUrl: 'https://news.kompas.com',
    enabled: true
  },
  {
    id: 'kompas-tech',
    name: 'Kompas Tekno',
    url: 'https://tekno.kompas.com/rss',
    category: 'Teknologi',
    sourceUrl: 'https://tekno.kompas.com',
    enabled: true
  },
  {
    id: 'kompas-sports',
    name: 'Kompas Sports',
    url: 'https://sports.kompas.com/rss',
    category: 'Olahraga',
    sourceUrl: 'https://sports.kompas.com',
    enabled: true
  },
  
  // DETIK.COM
  {
    id: 'detik-news',
    name: 'Detik News',
    url: 'https://news.detik.com/rss/index.xml',
    category: 'Berita',
    sourceUrl: 'https://news.detik.com',
    enabled: true
  },
  {
    id: 'detik-inet',
    name: 'Detik Inet',
    url: 'https://inet.detik.com/rss/index.xml',
    category: 'Teknologi',
    sourceUrl: 'https://inet.detik.com',
    enabled: true
  },
  {
    id: 'detik-sport',
    name: 'Detik Sport',
    url: 'https://sport.detik.com/rss/index.xml',
    category: 'Olahraga',
    sourceUrl: 'https://sport.detik.com',
    enabled: true
  },
  
  // CNN INDONESIA
  {
    id: 'cnn',
    name: 'CNN Indonesia',
    url: 'https://www.cnnindonesia.com/rss',
    category: 'Berita',
    sourceUrl: 'https://www.cnnindonesia.com',
    enabled: true
  },
  {
    id: 'cnn-tech',
    name: 'CNN Teknologi',
    url: 'https://www.cnnindonesia.com/teknologi/rss',
    category: 'Teknologi',
    sourceUrl: 'https://www.cnnindonesia.com',
    enabled: true
  },
  
  // TEMPO
  {
    id: 'tempo',
    name: 'Tempo.co',
    url: 'https://www.tempo.co/rss',
    category: 'Berita',
    sourceUrl: 'https://www.tempo.co',
    enabled: true
  },
  
  // LIPUTAN6
  {
    id: 'liputan6',
    name: 'Liputan6',
    url: 'https://www.liputan6.com/rss',
    category: 'Berita',
    sourceUrl: 'https://www.liputan6.com',
    enabled: true
  },
  
  // REPUBLIKA
  {
    id: 'republika',
    name: 'Republika',
    url: 'https://www.republika.co.id/rss',
    category: 'Berita',
    sourceUrl: 'https://www.republika.co.id',
    enabled: true
  }
];

export function getEnabledSources() {
  return RSS_SOURCES.filter(source => source.enabled);
} 