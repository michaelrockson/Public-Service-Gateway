import { Response } from "express";

export class ControllerResponseHandler {
  constructor() {}

  /**
   * Send a JSON response with a given HTTP status code.
   *
   * @param res - Express response object.
   * @param statusCode - HTTP status code to send.
   * @param message - Primary error or success message.
   * @param details - Optional additional response details.
   */
  private send(
    res: Response,
    statusCode: number,
    message: string,
    details?: unknown,
  ): void {
    res.status(statusCode).json({
      message: message,
      ...(details ? { details: details } : {}),
    });
  }

  /**
   * Send a 200 success response.
   *
   * @param res - Express response object.
   * @param message - Optional success message.
   * @param details - Optional additional response details.
   */
  successResponse(res: Response, message = "Success", details?: unknown): void {
    this.send(res, 200, message, details);
  }

  /**
   * Send a 400 bad request response.
   *
   * @param res - Express response object.
   * @param message - Optional bad request message.
   * @param details - Optional additional response details.
   */
  badRequest(res: Response, message = "Bad Request", details?: unknown): void {
    this.send(res, 400, message, details);
  }

  /**
   * Send a 404 not found response.
   *
   * @param res - Express response object.
   * @param message - Optional not found message.
   * @param details - Optional additional response details.
   */
  notFound(res: Response, message = "Not Found", details?: unknown): void {
    this.send(res, 404, message, details);
  }

  /**
   * Send a 502 bad gateway response for upstream fetch failures.
   *
   * @param res - Express response object.
   * @param message - Optional failure message.
   * @param details - Optional additional response details.
   */
  badGatewayError(
    res: Response,
    message = "Failed to fetch upstream data",
    details?: unknown,
  ): void {
    this.send(res, 502, message, details);
  }

  /**
   * Send a 500 internal server error response.
   *
   * @param res - Express response object.
   * @param message - Optional error message.
   * @param details - Optional additional response details.
   */
  internalServerError(
    res: Response,
    message = "Internal Server Error",
    details?: any,
  ): void {
    this.send(res, 500, message, details);
  }
}

let responseHandler = new ControllerResponseHandler();

export default responseHandler;
