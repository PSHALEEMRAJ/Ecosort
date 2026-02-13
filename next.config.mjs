/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Turbopack configuration (Next.js 16+ default bundler)
  turbopack: {
    resolveAlias: {
      canvas: false,
    },
  },
  // Webpack configuration (for compatibility)
  webpack: (config) => {
    // Exclude TensorFlow.js node bindings from client bundle
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }
    return config
  },
}

export default nextConfig
