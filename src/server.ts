import express, { type Express } from "express";
import morgan from "morgan";
import logger from "./shared/server.logger";
import { apiRouter } from "./modules/routes.registry";
import { config } from "./utils/env.config";

const server: Express = express();
const port: number = Number(config.port) || 3000;
const environment: string = config.environment ?? "dev";

server.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

server.use(express.json());
server.use("/api", apiRouter);

server.listen(port, (): void => {
  logger.info(`Server running on ${port}`);
  logger.info(`Server environment: ${environment}`);
});
