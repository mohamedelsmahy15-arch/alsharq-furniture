/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['localhost:3000', '*.trycloudflare.com', '192.168.1.*', '172.29.48.*'],
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.trycloudflare.com', '192.168.1.*', '172.29.48.*'],
    },
  },
}

export default nextConfig

