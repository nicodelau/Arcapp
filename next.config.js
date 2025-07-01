/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  generateBuildId: async () => {
    // You can, for example, get the latest git commit hash here
    return 'my-build-id'
  },
}

module.exports = nextConfig
