import express, { type Express } from "express";
import morgan from "morgan";
import logger from "./shared/server.logger.js";
import { createGatewayRouter } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./shared/infisical.service.js";
import { populateEnvProvider } from "./shared/env.config.js";
import { bootServices } from "./shared/utils/config.utils.js";
import { logBootstrapStep } from "./shared/utils/logger.utils.js";

async function startServer() {
  const serverSecrets = await injectSecretsFromInfisical();
  populateEnvProvider(serverSecrets);

  const controllers = bootServices();

  const server: Express = express();

  const port: number = Number(serverSecrets.port) || 3000;
  const environment: string = serverSecrets.environment ?? "dev";
  const gatewayRouter = createGatewayRouter(controllers);

  server.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    }),
  );

  server.use(express.json());
  server.use("/api", gatewayRouter);

  server.listen(port, (): void => {
    logger.info(`Server running on ${port}`);
    logger.info(`Server environment: ${environment}`);
  });
}

await startServer().catch((error) => {
  logger.error(`Error starting Server: ${error}`);
});
