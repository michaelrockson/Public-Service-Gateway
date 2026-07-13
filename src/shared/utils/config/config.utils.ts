import dotenv from "dotenv";
import path from "path";
import { logBootstrapStep, logProcess } from "../logger.utils.js";
import { GatewayControllers, GatewayServices } from "./config.types.js";

export const envPath = path.join(process.cwd(), ".env");

dotenv.config({
  path: envPath,
});

/**
 * Validates that all provided environment variables are set.
 *
 * @param secrets - A map of environment variable names to their resolved values.
 * @throws {Error} If one or more values are `undefined`, `null`, or an empty string.
 */
export function validateEnvs(secrets: Record<string, unknown>) {
  let missingEnvs: string[] = [];

  for (const [key, value] of Object.entries(secrets)) {
    if (value === undefined || value === null || value === "") {
      missingEnvs.push(key);
    }
  }

  if (missingEnvs.length > 0) {
    throw new Error(
      `${missingEnvs.length} missing environment variable(s): 
      ${missingEnvs.join(", ")}`,
    );
  }
}

/**
 * Validates secrets fetched from Infisical, logging how many were successfully
 * injected and throwing if any required secrets are missing.
 *
 * @param secrets - A map of secret names to their fetched values.
 * @throws {Error} If one or more values are `undefined`, `null`, or an empty string.
 */
export function validateInfisicalSecrets(secrets: Record<string, unknown>) {
  let missingSecrets: string[] = [];
  let fetchedSecrets: string[] = [];

  for (const [key, value] of Object.entries(secrets)) {
    if (value === undefined || value === null || value === "") {
      missingSecrets.push(key);
    }
    fetchedSecrets.push(key);
  }
  if (fetchedSecrets.length > 0) {
    logProcess(`${fetchedSecrets.length} secret(s) injected from Infisical}`);
  }

  if (missingSecrets.length > 0) {
    throw new Error(
      `${missingSecrets.length} missing environment variable(s): \n
      ${missingSecrets.join("\n ").toUpperCase()}`,
    );
  }
}

/**
 * Retrieves a string environment variable, optionally falling back to a default value.
 *
 * @param key - The name of the environment variable to read.
 * @param fallback - A default value to use if the environment variable is not set.
 * @returns The environment variable's value, or the fallback if provided.
 * @throws {Error} If the environment variable is not set and no fallback is provided.
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value: string | undefined = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

/**
 * Retrieves a numeric environment variable, optionally falling back to a default value.
 *
 * @param key - The name of the environment variable to read.
 * @param fallback - A default numeric value to use if the environment variable is not set.
 * @returns The parsed numeric value, or the fallback if provided.
 * @throws {Error} If the environment variable is not set and no fallback is provided,
 * or if the value cannot be parsed as a number.
 */
export function getEnvNumber(key: string, fallback?: number): number {
  const raw: string | undefined = process.env[key];
  if (raw === undefined) {
    if (fallback === undefined) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return fallback;
  }
  const parsed = Number(raw);
  if (Number.isNaN(parsed)) {
    throw new Error(
      `Environment variable ${key} must be a number, got: ${raw}`,
    );
  }
  return parsed;
}

/**
 * Validates that Infisical authentication credentials are present.
 *
 * @param clientId - The Infisical client ID.
 * @param clientSecret - The Infisical client secret.
 * @throws {Error} If either the client ID or client secret is missing.
 */
export function validateInfisicalCredentials(
  clientId: string,
  clientSecret: string,
) {
  if (!clientId || !clientSecret) {
    throw new Error("Missing infisical credentials for authentication");
  }
}

/**
 * Validates that all gateway services and controllers booted successfully,
 * logging a success message if so.
 *
 * @param gatewayControllers - A map of controller names to their booted instances.
 * @param gatewayServices - A map of service names to their booted instances.
 * @throws {Error} If any service or controller entry is falsy (failed to boot).
 */
export function validateGatewayResources(
  gatewayControllers: any,
  gatewayServices: any,
): void {
  let isGatewayServicesBooted: boolean | undefined = undefined;
  let isGatewayControllersBooted: boolean | undefined = undefined;

  for (const [key, gatewayService] of Object.entries(gatewayServices)) {
    if (!gatewayService) {
      throw new Error(
        `${key} service is not registered, check module resource registry`,
      );
    }
    isGatewayServicesBooted = true;
  }

  for (const [key, gatewayController] of Object.entries(gatewayControllers)) {
    if (!gatewayController) {
      throw new Error(
        `${key} controller is not registered, check module resource registry`,
      );
    }
    isGatewayControllersBooted = true;
  }

  if (isGatewayServicesBooted && isGatewayControllersBooted) {
    logBootstrapStep("Gateway Services and Controllers booted successfully");
  }
}

export function unpackResourceControllers(gatewayControllerRegistry: {}) {
  const resourceControllers = {};

  for (const [key, controller] of Object.entries(gatewayControllerRegistry)) {
    if (controller) {
      resourceControllers[key] = controller;
    }
  }

  return resourceControllers;
}
