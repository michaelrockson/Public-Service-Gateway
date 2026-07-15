import { Request } from "express";
import { BadRequestError, NotFoundError } from "../errors/api.errors.js";

/**
 * Parses parameters from the request query string.
 *
 * @param req - Incoming Express request.
 * @param paramAttributes - Defined Parameter attributes of the request
 */
export function parseParams(req: Request, paramAttributes: string[]) {
  let parsedParams: Record<string, unknown> = {};

  for (const param of paramAttributes) {
    parsedParams[param] = req.query[param];
  }
  return parsedParams;
}

/**
 * Validates that required query parameters are present and numeric.
 *
 * @param params - Query parameters.
 */
export function validateParams(params: Record<string, unknown>) {
  let missingParams: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      missingParams.push(key);
    }
  }

  if (missingParams.length > 0) {
    throw new BadRequestError(`Missing required query parameter(s): ${missingParams.join(", ")}`);
  }
}

/**
 * Validates that the weather response exists before sending it.
 *
 * @param apiResponse - Response data from the service API.
 */
export function validateResponse(apiResponse: unknown) {
  if (apiResponse === undefined || apiResponse === null) {
    throw new NotFoundError("Requested data is unavailable");
  }
}
