/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: false,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'undraw.co' },
      { protocol: 'https', hostname: 'assets.website-files.com' },
    ],
  },
};

module.exports = nextConfig;
