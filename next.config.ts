// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Izinkan akses dari IP tertentu
  allowedDevOrigins: ['192.168.56.1', 'localhost', '127.0.0.1'],
  
  // Perbaiki warning images.domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },

  // Konfigurasi Turbopack (untuk Next.js 16)
  turbopack: {
    // Konfigurasi Turbopack jika diperlukan
    // Kosongkan dulu untuk menghilangkan error
  },
}

export default nextConfig