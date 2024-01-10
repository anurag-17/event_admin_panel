/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // remotePatterns: [
  //   {
  //     protocol: 'https',
  //     hostname: '**',
  //   },
  // ],
  images: {
    domains: ['*'],
  },
}

module.exports = nextConfig
