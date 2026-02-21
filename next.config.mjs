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
  async redirects() {
    return [
      // 301 redirect waitlistkit.dev → waitlistkit.ca (canonical domain)
      {
        source: "/:path*",
        has: [{ type: "host", value: "waitlistkit.dev" }],
        destination: "https://waitlistkit.ca/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.waitlistkit.dev" }],
        destination: "https://waitlistkit.ca/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  }
};

export default nextConfig;
