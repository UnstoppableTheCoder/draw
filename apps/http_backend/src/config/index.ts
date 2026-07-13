import dotenv from "dotenv";

type ServerConfig = {
  PORT: number;
};

function loadEnv() {
  dotenv.config();
  console.log("Environment Variables loaded");
}

loadEnv();

export const serverConfig: ServerConfig = {
  PORT: Number(process.env.PORT) || 4001,
};
