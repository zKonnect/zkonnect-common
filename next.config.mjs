/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "pink-magnetic-panther-830.mypinata.cloud",
      },
    ],
  },
  output: "standalone",
  reactStrictMode: false,
};

export default nextConfig;
