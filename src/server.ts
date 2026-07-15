import express, { type Express } from "express";
import morgan from "morgan";
import { createGatewayRouter } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./shared/boostrap/infisical.config.js";
import {
  createMorganStream,
  logProcess,
  consoleLogger,
} from "./shared/logger/logger.utils.js";
import { bootGatewayControllers } from "./shared/boostrap/bootstrap.utils.js";
import { ConfigService } from "./shared/boostrap/config.service.js";
import { WinstonLogger } from "./shared/logger/winston.logger.js";
import { ControllerResponseHandler } from "./shared/http/response.handler.js";
import { SharedDependencies } from "./shared/boostrap/gateway.types.js";

async function startServer(): Promise<void> {
  const serverSecrets = await injectSecretsFromInfisical();

  const config = new ConfigService(serverSecrets);
  const logger = new WinstonLogger(config);
  const responseHandler = new ControllerResponseHandler(config.environment);

  const sharedDependencies: SharedDependencies = {
    config,
    logger,
    responseHandler,
  };

  const controllers = bootGatewayControllers(sharedDependencies);

  const server: Express = express();

  const port: number = Number(config.port) || 3000;
  const environment: string = config.environment ?? "dev";
  const gatewayRouter = createGatewayRouter(controllers);

  server.use(morgan("combined", { stream: createMorganStream(logger) }));
  server.use(express.json());
  server.use("/v1", gatewayRouter);

  server.listen(port, (): void => {
    logProcess(logger, `Server running on ${port}`);
    logProcess(logger, `Server environment: ${environment}`);
  });
}

await startServer().catch((error) => {
  consoleLogger.error(`Error starting Server: ${error}`);
});
