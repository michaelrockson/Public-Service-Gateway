import { IServerConfig } from "./system/server.config.interface.js";
import { ILoggerConfig } from "./system/logger.config.interface.js";
import { IWeatherConfig } from "./modules/weather.config.interface.js";
import { INewsConfig } from "./modules/news.config.interface.js";
import { ICurrencyConfig } from "./modules/currency.config.interface.js";
import { IHolidayConfig } from "./modules/holiday.config.interface.js";
import { ISportsConfig } from "./modules/sports.config.interface.js";
import { IAviationConfig } from "./modules/aviation.config.interface.js";

/**
 * System-level config (port, secrets, log levels).
 */
export type ISystemSecretsRegistry = IServerConfig & ILoggerConfig;

/**
 * Module-level config (API URLs, keys, etc.).
 */
export type IModuleSecretsRegistry = IWeatherConfig &
  INewsConfig &
  ICurrencyConfig &
  IHolidayConfig &
  ISportsConfig &
  IAviationConfig;

export type {
  IServerConfig,
  ILoggerConfig,
  IWeatherConfig,
  INewsConfig,
  ICurrencyConfig,
  IHolidayConfig,
  ISportsConfig,
  IAviationConfig,
};
