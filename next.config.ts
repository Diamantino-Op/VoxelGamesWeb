import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
    i18n: {
        locales: ['en-US', 'it-IT'],
        defaultLocale: 'en-US',
    },
    trailingSlash: false
}