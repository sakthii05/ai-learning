import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', 
  serverExternalPackages: ['sharp', 'onnxruntime-node'],
};

export default nextConfig;
