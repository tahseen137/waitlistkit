/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // For hackathon speed - disable during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // For hackathon speed - disable strict type checking during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
