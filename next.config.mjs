/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "http://101.46.70.242/:path*",
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.dawaarly.com",
          },
        ],
        destination: "https://dawaarly.com/:path*",
        permanent: true,
      },
    ];
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;