import { IServerConfig } from "./server.config.interface.js";
import { ILoggerConfig } from "./logger.config.interface.js";
import { IWeatherConfig } from "./weather.config.interface.js";
import { INewsConfig } from "./news.config.interface.js";
import { ICurrencyConfig } from "./currency.config.interface.js";
import { IHolidayConfig } from "./holiday.config.interface.js";
import { ISportsConfig } from "./sports.config.interface.js";

/**
 * Full application config — an intersection of all module-level config interfaces.
 * ConfigService implements this type.
 * Consumers that need only a subset should depend on the relevant sub-interface
 * (e.g. WinstonLogger depends on ILoggerConfig, not IConfig).
 */
export type IConfig = IServerConfig &
  ILoggerConfig &
  IWeatherConfig &
  INewsConfig &
  ICurrencyConfig &
  IHolidayConfig &
  ISportsConfig;

export type {
  IServerConfig,
  ILoggerConfig,
  IWeatherConfig,
  INewsConfig,
  ICurrencyConfig,
  IHolidayConfig,
  ISportsConfig,
};
