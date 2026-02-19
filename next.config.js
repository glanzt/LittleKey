/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./src/generated/prisma/*.node"],
  },
};

module.exports = nextConfig;
