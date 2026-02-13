/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@claritystructures/domain',
    '@claritystructures/types',
    '@claritystructures/config',
    '@claritystructures/infra-alerts',
    '@claritystructures/infra-prisma',
  ],
}

module.exports = nextConfig
