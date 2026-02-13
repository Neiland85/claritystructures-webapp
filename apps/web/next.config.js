const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(__dirname, '../..'),
  },
  transpilePackages: [
    '@claritystructures/domain',
    '@claritystructures/types',
    '@claritystructures/config',
    '@claritystructures/infra-alerts',
    '@claritystructures/infra-prisma',
  ],
}

module.exports = nextConfig
