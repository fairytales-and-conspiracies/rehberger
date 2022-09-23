/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/terms',
        destination: '/img/01-1.png',
      },
    ];
  },
  images: {
    domains: ['f004.backblazeb2.com'],
  },
};

module.exports = nextConfig;
