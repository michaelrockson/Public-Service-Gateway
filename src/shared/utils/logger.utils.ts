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
export function logInboundRequest(
  method: string,
  path: string,
  params: Record<string, unknown>,
): void {
  logger.info(
    `[INBOUND] ${method} ${path} | params: ${JSON.stringify(params)}`,
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
  logger.info(`--> ${method} ${url}`);
}

export function logOutboundResponse(
  method: string,
  url: string,
  status: number,
  durationMs: number,
): void {
  logger.info(`<-- ${status} ${method} ${url} | ${durationMs}ms`);
}

export function logOutboundError(
  method: string,
  url: string,
  error: unknown,
): void {
  logger.error(`<-- FAILED ${method} ${url} | ${error}`);
}
