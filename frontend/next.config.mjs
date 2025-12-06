/** @type {import('next').NextConfig} */

import dotenv from 'dotenv';
dotenv.config();

const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images-na.ssl-images-amazon.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'www.shadcnblocks.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'drive.google.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'image.gramedia.net',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'cdn.gramedia.com',
            port: '',
            pathname: '/**',
          },
        ],
        unoptimized: false,
    },
    env: {
        API_BASE_URL: process.env.API_BASE_URL || "/api",
        API_BASE_URL_PRODUCTION: process.env.API_BASE_URL_PRODUCTION || "/api",
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    },
};

export default nextConfig;