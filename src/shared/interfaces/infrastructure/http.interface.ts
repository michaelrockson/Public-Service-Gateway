export interface IHttpClient {
  makeApiRequest<T = unknown>(
    endpoint?: string,
    params?: Record<string, unknown>,
    additionalUris?: string[],
  ): Promise<{ data: T; status?: number }>;

  handleApiErrors(error: unknown): never;
}
