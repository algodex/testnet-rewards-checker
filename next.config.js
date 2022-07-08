const withPWA = require('next-pwa')
const { i18n } = require('./next-i18next.config')
/** @type {import('next').NextConfig} */

const rewrites = () => {
  return [
    {
      source: '/pouch/:db*',
      destination: `${process.env.DB_BASE_URL}/:db*`,
    },
  ]
}

const nextConfig = {
  eslint: {ignoreDuringBuilds: true},
  reactStrictMode: true,
  i18n,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  rewrites,
}

module.exports = withPWA(nextConfig)
