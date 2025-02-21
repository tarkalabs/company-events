import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'undici': require.resolve('undici')
      };
    }
    return config;
  },
  transpilePackages: ['@firebase/auth']
};

export default nextConfig;