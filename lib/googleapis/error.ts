export class GoogleApiError extends Error {
  constructor(
    public message: string,
    public code: number,
    public errors: { domain: string; reason: string; message: string }[]
  ) {
    super(message);
    this.code = code;
    this.errors = errors;

    Object.setPrototypeOf(this, GoogleApiError.prototype);
  }
}
