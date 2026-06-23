import dotenv from "dotenv";
import express, { type Express } from "express";
import morgan from "morgan";
import logger from "./shared/server.logger";
import { apiRouter } from "./modules/routes.registry";

dotenv.config();

const server: Express = express();
const port: number = Number(process.env.PORT) || 3000;
server.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

server.use(express.json());
server.use("/api", apiRouter);

server.listen(port, (): void => {
  logger.info(`Server running on ${port}`, {
    serverEnvironment: process.env.ENVIRONMENT ?? "dev",
  });
});
