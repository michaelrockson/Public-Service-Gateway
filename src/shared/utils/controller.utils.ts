import { Request, Response } from "express";
import responseHandler from "../http.controller";

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
 * @param res - Response Object
 */
export function validateParams(params: Record<string, unknown>, res: Response) {
  let missingParams: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") {
      missingParams.push(key);
    }
  }

  if (missingParams.length > 0) {
    responseHandler.badRequest(
      res,
      `Missing required query parameter(s): ${missingParams.join(", ")}`,
    );
  }
}

/**
 * Validates that the weather response exists before sending it.
 *
 * @param apiResponse - Response data from the service API.
 * @param res
 */
export function validateResponse(apiResponse: unknown, res: Response) {
  if (!apiResponse) {
    responseHandler.notFound(res, "current weather is unavailable");
  }
}
