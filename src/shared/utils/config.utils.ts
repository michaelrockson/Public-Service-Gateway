import dotenv from "dotenv";
import path from "path";
import { logBootstrapStep, logProcess } from "./logger.utils.js";
import { WeatherController } from "../../modules/weather/weather.controller.js";
import { NewsController } from "../../modules/news/news.controller.js";
import { CurrencyController } from "../../modules/currency/currency.controller.js";
import { HolidayController } from "../../modules/holidays/holiday.controller.js";
import { SportsController } from "../../modules/sports/sports.controller.js";
import { WeatherService } from "../../modules/weather/weather.service.js";
import { NewsService } from "../../modules/news/news.service.js";
import { CurrencyService } from "../../modules/currency/currency.service.js";
import { HolidayService } from "../../modules/holidays/holiday.service.js";
import { SportsService } from "../../modules/sports/sports.service.js";

export const envPath = path.join(process.cwd(), ".env");

dotenv.config({
  path: envPath,
});

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

export function getEnvVar(key: string, fallback?: string): string {
  const value: string | undefined = process.env[key] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

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
export function validateInfisicalCredentials(
  clientId: string,
  clientSecret: string,
) {
  if (!clientId || !clientSecret) {
    throw new Error("Missing infisical credentials for authentication");
  }
}

export type GatewayControllers = {
  "Weather Controller": WeatherController;
  "News Controller": NewsController;
  "Currency Controller": CurrencyController;
  "Holiday Controller": HolidayController;
  "Sports Controller": SportsController;
};

export type GatewayServices = {
  "Weather Service": WeatherService;
  "News Service": NewsService;
  "Currency Service": CurrencyService;
  "Holiday Service": HolidayService;
  "Sports Service": SportsService;
};

export function validateGatewayResources(
  gatewayControllers: GatewayControllers,
  gatewayServices: GatewayServices,
) {
  let isGatewayServicesBooted: boolean | undefined = undefined;
  let isGatewayControllersBooted: boolean | undefined = undefined;

  for (const [key, gatewayService] of Object.entries(gatewayServices)) {
    if (!gatewayService) {
      throw new Error(`${key} failed to boot, check module service`);
    }
    isGatewayServicesBooted = true;
  }

  for (const [key, gatewayController] of Object.entries(gatewayControllers)) {
    if (!gatewayController) {
      throw new Error(`${key} failed to boot, check module controller`);
    }
    isGatewayControllersBooted = true;
  }

  if (isGatewayServicesBooted && isGatewayControllersBooted) {
    logBootstrapStep("Gateway Services and Controllers booted successfully");
  }
}
