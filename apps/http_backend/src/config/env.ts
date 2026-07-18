import dotenv from "dotenv";

type ENV_TYPES = {
  PORT: number;
  NODE_ENV: string;
  JWT_SECRET: string;
};

function loadEnv() {
  dotenv.config();
  console.log("Environment Variables loaded");
}

loadEnv();

export const env: ENV_TYPES = {
  PORT: Number(process.env.PORT) || 4001,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "jwt_secret",
};
