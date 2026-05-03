/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Externalize @xenova/transformers and its ONNX runtime dependencies
  // so they run in Node.js at runtime rather than being bundled by webpack.
  // This is required because onnxruntime-node has native bindings.
  experimental: {
    serverComponentsExternalPackages: [
      "@xenova/transformers",
      "onnxruntime-node",
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent webpack from trying to bundle native modules
      config.externals = config.externals || [];
      config.externals.push({
        "@xenova/transformers": "@xenova/transformers",
        "onnxruntime-node": "onnxruntime-node",
      });
    }
    return config;
  },
};

module.exports = nextConfig;
