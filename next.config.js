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
    domains: [
      'f003.backblazeb2.com',
      'fairytales-and-conspiracies-nfts.s3.eu-central-003.backblazeb2.com',
    ],
  },
};

module.exports = nextConfig;
