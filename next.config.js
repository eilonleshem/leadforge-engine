/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mark heavy server-only packages so they don't break serverless bundling
  // In Next.js 14.x this is still under experimental
  experimental: {
    serverComponentsExternalPackages: ['twilio', 'bcryptjs'],
  },
  // Ensure images from external sources work if needed
  images: {
    remotePatterns: [],
  },
}

module.exports = nextConfig
