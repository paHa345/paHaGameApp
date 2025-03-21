import { POST as APIRoute } from "next-s3-upload/route";

export const POST = APIRoute.configure({
  accessKeyId: "RUEYZDINIEP2SO663H37",
  secretAccessKey: "zqvXoz5xz82HIGMBqI2vKLhKaPdwSDTh9tVld9GG",
  bucket: "f1525e96-2c5a759f-3888-4bd2-a52f-dbb62685b4bb",
  region: "ru-1",
  endpoint: "https://nyc3.digitaloceanspaces.com",
});
