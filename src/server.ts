import express, { type Express } from "express";
import morgan from "morgan";
import logger from "./shared/server.logger.js";
import { createGatewayRouter } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./shared/services/infisical.service.js";
import { populateEnvProvider } from "./shared/env.config.js";
import { createMorganStream, logProcess } from "./shared/utils/logger.utils.js";
import { bootServices } from "./shared/utils/server.utils.js";

async function startServer(): Promise<void> {
  const serverSecrets = await injectSecretsFromInfisical();
  populateEnvProvider(serverSecrets);

  const controllers = bootServices();

  const server: Express = express();

  const port: number = Number(serverSecrets.port) || 3000;
  const environment: string = serverSecrets.environment ?? "dev";
  const gatewayRouter = createGatewayRouter(controllers);

  server.use(morgan("combined", { stream: createMorganStream() }));
  server.use(express.json());
  server.use("/api/v1", gatewayRouter);

  server.listen(port, (): void => {
    logProcess(`Server running on ${port}`);
    logProcess(`Server environment: ${environment}`);
  });
}

await startServer().catch((error) => {
  logger.error(`Error starting Server: ${error}`);
});
