/**
 * Typed error so route handlers can throw with intent and the global
 * error middleware can shape a clean ApiErrorResponse without leaking
 * upstream provider details to TV clients.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = 'ApiError';
  }
}

export const Errors = {
  upstream: (provider: string) =>
    new ApiError(502, 'UPSTREAM_ERROR', `${provider} is currently unavailable.`),
  notConfigured: (provider: string) =>
    new ApiError(503, 'NOT_CONFIGURED', `${provider} credentials are not configured.`),
  badRequest: (message: string) => new ApiError(400, 'BAD_REQUEST', message),
  notFound: (resource: string) => new ApiError(404, 'NOT_FOUND', `${resource} not found.`),
};
