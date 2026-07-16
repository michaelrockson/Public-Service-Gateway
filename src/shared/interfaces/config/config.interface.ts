import { IServerConfig } from "./server.config.interface.js";
import { ILoggerConfig } from "./logger.config.interface.js";
import { IWeatherConfig } from "./weather.config.interface.js";
import { INewsConfig } from "./news.config.interface.js";
import { ICurrencyConfig } from "./currency.config.interface.js";
import { IHolidayConfig } from "./holiday.config.interface.js";
import { ISportsConfig } from "./sports.config.interface.js";
import { IAviationConfig } from "./aviation.config.interface.js";

/**
 * System-level config (port, environment, log levels).
 */
export type ISystemConfig = IServerConfig & ILoggerConfig;

/**
 * Module-level config (API URLs, keys, etc.).
 */
export type IModuleConfig = IWeatherConfig &
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
