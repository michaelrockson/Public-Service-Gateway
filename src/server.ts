import express, { type Express } from "express";
import morgan from "morgan";
import logger from "./shared/server.logger.js";
import { createGatewayRouter } from "./modules/routes.registry.js";
import { injectSecretsFromInfisical } from "./shared/infisical.service.js";
import { populateEnvProvider } from "./shared/env.config.js";
import { bootServices } from "./shared/utils/config.utils.js";

/**
 * Bootstraps and starts the Express server.
 *
 * Startup sequence:
 * 1. Fetches secrets from Infisical and injects them into `process.env`.
 * 2. Populates the app-wide env provider with the resolved config.
 * 3. Initializes all services and controllers via `setServices()`.
 * 4. Configures middleware (request logging, JSON body parsing).
 * 5. Mounts the API router under `/api`.
 * 6. Starts listening on the configured port.
 *
 * @throws {Error} If secrets cannot be fetched from Infisical, or if
 *   the server fails to bind to the configured port.
 */
async function startServer() {
  const serverSecrets = await injectSecretsFromInfisical();
  populateEnvProvider(serverSecrets);

  const server: Express = express();

  const port: number = Number(serverSecrets.port) || 3000;
  const environment: string = serverSecrets.environment ?? "dev";
  const controllers = bootServices();
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

await startServer();
