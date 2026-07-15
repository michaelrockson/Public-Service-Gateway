import { ILogger } from "../interfaces/infrastructure/logger.interface.js";

export function logProcess(logger: ILogger, step: string): void {
  logger.info(`[PROCESS] ${step}`);
}

export function logProcessError(
  logger: ILogger,
  step: string,
  error: unknown,
): void {
  logger.error(`[PROCESS] Failed at: ${step} | ${error}`);
}

export function logBootstrapStep(logger: ILogger, step: string): void {
  logger.info(`[BOOTSTRAP] ${step}`);
}

export function logBootstrapError(
  logger: ILogger,
  step: string,
  error: unknown,
): void {
  logger.error(`[BOOTSTRAP] Failed at: ${step} | ${error}`);
}

export function logInboundRaw(logger: ILogger, message: string): void {
  logger.info(`[INBOUND] ${message}`);
}

export function createMorganStream(logger: ILogger) {
  return {
    write: (message: string) => logInboundRaw(logger, message.trim()),
  };
}

export const consoleLogger: ILogger = {
  info: (msg, ...meta) => console.log(msg, ...meta),
  error: (msg, ...meta) => console.error(msg, ...meta),
  warn: (msg, ...meta) => console.warn(msg, ...meta),
  debug: (msg, ...meta) => console.debug(msg, ...meta),
};
