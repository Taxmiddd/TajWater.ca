import type { NextConfig } from "next";

// Force redeploy: 2026-03-28T12:23:00

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // pay.tajwater.ca root → /pay
        {
          source: '/',
          has: [{ type: 'host', value: 'pay.tajwater.ca' }],
          destination: '/pay',
        },
        // pay.tajwater.ca/[path] → /pay/[path]
        {
          source: '/:path+',
          has: [{ type: 'host', value: 'pay.tajwater.ca' }],
          destination: '/pay/:path+',
        },
      ],
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mdsidfkfsddagsvkecba.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      // Noindex private/app routes
      {
        source: '/dashboard/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/auth/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/checkout',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/pay/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      // Security headers for all routes
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
