/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Node 24 + eslint-config-next 14 can crash loading eslint-plugin-react
  // ("Cannot read properties of undefined (reading 'deprecated')").
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
