/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['leaflet'],
  webpack: (config) => {
    config.externals.push({
      'leaflet': 'L'
    })
    return config
  }
}

module.exports = nextConfig