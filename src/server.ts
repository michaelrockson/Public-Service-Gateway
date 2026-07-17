import express, { type Express } from "express";
import morgan from "morgan";
import { useGatewayRouters } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./bootstrap/providers/infisical.provider.js";
import {
  createMorganStream,
  defaultLogger,
  logProcess,
} from "./app/logger/logger.utils.js";
import { bootGatewayControllers } from "./bootstrap/bootstrap.utils.js";
import { SystemEnvs } from "./bootstrap/envs/system.envs.js";
import { ModuleEnvs } from "./bootstrap/envs/module.envs.js";
import { WinstonLogger } from "./app/logger/winston.logger.js";
import { ControllerResponseHandler } from "./app/http/handlers/response.handler.js";
import { SharedDependencies } from "./bootstrap/bootstrap.types.js";

async function startServer(): Promise<void> {
  try {
    const serverSecrets = await injectSecretsFromInfisical();

    const systemEnvs = new SystemEnvs(serverSecrets.systemEnvs);
    const moduleEnvs = new ModuleEnvs(serverSecrets.moduleEnvs);
    const logger = new WinstonLogger(systemEnvs);
    const responseHandler = new ControllerResponseHandler(
      systemEnvs.environment,
    );

    const sharedDependencies: SharedDependencies = {
      systemEnvs,
      moduleEnvs,
      logger,
      responseHandler,
    };

    const controllers = bootGatewayControllers(sharedDependencies);

    const server: Express = express();

    const port: number = Number(systemEnvs.port) || 3000;
    const environment: string = systemEnvs.environment ?? "dev";
    const gatewayRouter = useGatewayRouters(controllers);

    server.use(morgan("combined", { stream: createMorganStream(logger) }));
    server.use(express.json());
    server.use("/v1", gatewayRouter);

    server.listen(port, (): void => {
      logProcess(logger, `Server running on ${port}`);
      logProcess(logger, `Server environment: ${environment}`);
    });
  } catch (error) {
    defaultLogger.error(`Error starting Server: ${error}`);
  }
}

await startServer();
