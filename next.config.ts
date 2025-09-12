import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // output: "export",
  // images: {
  //   unoptimized: true,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.timeweb.cloud",
        port: "",
        pathname: "/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/uploads/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "s3.twcstorage.ru",
        port: "",
        pathname: "/f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb/uploads/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "avatars.mds.yandex.net",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
};
export default nextConfig;

// @type {import('next').NextConfig} */
// const nextConfig = {
// output: 'export',
// images: {
// unoptimized: true,
// },
// };

// module.exports = nextConfig;
