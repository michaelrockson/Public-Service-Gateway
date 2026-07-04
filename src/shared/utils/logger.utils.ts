import logger from "../server.logger.js";

// --- Bootstrap ---
export function logProcess(step: string): void {
  logger.info(`[PROCESS] ${step}`);
}

export function logProcessError(step: string, error: unknown): void {
  logger.error(`[PROCESS] Failed at: ${step} | ${error}`);
}

// --- Bootstrap ---
export function logBootstrapStep(step: string): void {
  logger.info(`[BOOTSTRAP] ${step}`);
}

export function logBootstrapError(step: string, error: unknown): void {
  logger.error(`[BOOTSTRAP] Failed at: ${step} | ${error}`);
}

// --- Inbound requests ---
export function logInboundRaw(message: string): void {
  logger.info(`[INBOUND] ${message}`);
}
export function createMorganStream() {
  return {
    write: (message: string) => logInboundRaw(message.trim()),
  };
}

export function logInboundRequest(
  method: string,
  path: string,
  params: Record<string, any>,
): void {
  logger.info(
    `[INBOUND REQUEST] ${method} ${path} | params: ${JSON.stringify(params)}`,
  );
}

export function logInboundWarning(
  method: string,
  path: string,
  reason: string,
): void {
  logger.warn(`[INBOUND] ${method} ${path} | ${reason}`);
}

export function logInboundError(
  method: string,
  path: string,
  error: unknown,
): void {
  logger.error(`[INBOUND] ${method} ${path} | ${error}`);
}

// --- Outbound requests ---
export function logOutboundRequest(method: string, url: string): void {
  logger.info(`[OUTBOUND REQUEST] ${method} ${url}`);
}

export function logOutboundResponse(
  method: string,
  url: string,
  status: number | string,
  durationMs: number | string,
): void {
  logger.info(
    `[OUTBOUND RESPONSE] ${status} ${method.toUpperCase()} ${url} | ${durationMs}ms`,
  );
}

export function logOutboundError(
  method: string,
  url: string,
  error: unknown,
): void {
  logger.error(`<-- FAILED ${method} ${url} | ${error}`);
}
