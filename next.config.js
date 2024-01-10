/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**',
    },
  ],
}

module.exports = nextConfig
