/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/18000-%E8%A1%8C%E4%BB%A3%E7%A0%81%E6%88%91%E4%BB%8E%E6%B2%A1%E5%8F%AB%E8%BF%87%E4%B8%80%E4%B8%AA%E7%A8%8B%E5%BA%8F%E5%91%98vibe-coding-%E4%B8%80%E5%B9%B4%E5%90%8E%E7%9A%84%E7%9C%9F%E5%AE%9E%E8%B4%A6%E5%8D%95",
        destination: "/blog/18000-lines-vibe-coding-real-cost",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
