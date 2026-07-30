import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/help",
        destination: "/faq",
        permanent: true,
      },
    ];
  },
  async headers() {
    // OG/Twitter 画像はプレビュー用。検索結果ページとしてインデックスさせない
    const noIndexImage = [
      { key: "X-Robots-Tag", value: "noindex, nofollow" },
    ];
    return [
      { source: "/opengraph-image", headers: noIndexImage },
      { source: "/opengraph-image/:path*", headers: noIndexImage },
      { source: "/twitter-image", headers: noIndexImage },
      { source: "/twitter-image/:path*", headers: noIndexImage },
    ];
  },
};

export default nextConfig;
