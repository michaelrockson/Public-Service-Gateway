import logger from "../server.logger.js";

export function logProcess(step: string): void {
  logger.info(`[PROCESS] ${step}`);
}

export function logProcessError(step: string, error: unknown): void {
  logger.error(`[PROCESS] Failed at: ${step} | ${error}`);
}

export function logBootstrapStep(step: string): void {
  logger.info(`[BOOTSTRAP] ${step}`);
}

export function logBootstrapError(step: string, error: unknown): void {
  logger.error(`[BOOTSTRAP] Failed at: ${step} | ${error}`);
}

export function logInboundRaw(message: string): void {
  logger.info(`[INBOUND] ${message}`);
}
export function createMorganStream() {
  return {
    write: (message: string) => logInboundRaw(message.trim()),
  };
}
