import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-st2.vigbo.com',
        pathname: '/u57016/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-st2.vigbo.tech',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
