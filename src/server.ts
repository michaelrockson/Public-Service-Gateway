import express, { type Express } from "express";
import morgan from "morgan";
import { useGatewayRouters } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./shared/bootstrap/bootstrap.infisical.js";
import {
  consoleLogger,
  createMorganStream,
  logProcess,
} from "./shared/logger/logger.utils.js";
import { bootGatewayControllers } from "./shared/bootstrap/bootstrap.utils.js";
import { BootstrapSystem } from "./shared/bootstrap/bootstrap.system.js";
import { BootstrapModule } from "./shared/bootstrap/bootstrap.module.js";
import { WinstonLogger } from "./shared/logger/winston.logger.js";
import { ControllerResponseHandler } from "./shared/http/response.handler.js";
import { SharedDependencies } from "./shared/bootstrap/bootstrap.types.js";

async function startServer(): Promise<void> {
  const serverSecrets = await injectSecretsFromInfisical();

  const systemConfig = new BootstrapSystem(serverSecrets.systemConfig);
  const moduleConfig = new BootstrapModule(serverSecrets.moduleConfig);
  const logger = new WinstonLogger(systemConfig);
  const responseHandler = new ControllerResponseHandler(
    systemConfig.environment,
  );

  const sharedDependencies: SharedDependencies = {
    systemConfig,
    moduleConfig,
    logger,
    responseHandler,
  };

  const controllers = bootGatewayControllers(sharedDependencies);

  const server: Express = express();

  const port: number = Number(systemConfig.port) || 3000;
  const environment: string = systemConfig.environment ?? "dev";
  const gatewayRouter = useGatewayRouters(controllers);

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
