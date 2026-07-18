import { IServerConfig } from "./system/server.system.interface.js";
import { ILoggerConfig } from "./system/logger.system.interface.js";
import { IWeatherConfig } from "./modules/weather.module.interface.js";
import { INewsConfig } from "./modules/news.module.interface.js";
import { ICurrencyConfig } from "./modules/currency.module.interface.js";
import { IHolidayConfig } from "./modules/holiday.module.interface.js";
import { ISportsConfig } from "./modules/sports.module.interface.js";
import { IAviationConfig } from "./modules/aviation.module.interface.js";
import { IAgroConfig } from "./modules/agro.module.interface.js";

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
  IAviationConfig &
  IAgroConfig;

export type {
  IServerConfig,
  ILoggerConfig,
  IWeatherConfig,
  INewsConfig,
  ICurrencyConfig,
  IHolidayConfig,
  ISportsConfig,
  IAviationConfig,
  IAgroConfig,
};
