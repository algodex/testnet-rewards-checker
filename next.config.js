/* 
 * Algodex Service 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
