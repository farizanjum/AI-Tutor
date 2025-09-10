/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Netlify-specific configurations
  trailingSlash: true,
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Enable static optimization for better performance
  output: 'standalone',
  // Configure for Netlify Functions
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: '/api/:path*',
    },
  ],
}

export default nextConfig