import mongoose from "mongoose";

export const connectMongoDB = async () => {
  console.log("connection");
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }
  return await mongoose.connect(
    // `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@95.140.157.193:27017/paHaGTSGameDB?authSource=admin&directConnection=true`

    `mongodb+srv://Vercel-Admin-${process.env.MONGODB_USERNAME}-VercelDB:${process.env.MONGODB_PASSWORD}@paha345-verceldb.z4hjuwq.mongodb.net/paHaGameDB?retryWrites=true&w=majority`,
    // `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/bnjpnqkq0agsple?replicaSet=rs0`
  );
};
