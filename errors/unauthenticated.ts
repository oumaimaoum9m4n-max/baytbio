import { CustomAPIError } from "./custom-api";

export class UnauthenticatedError extends CustomAPIError {
  constructor(message = "Authentication required") {
    super(message, 401);
    this.name = "UnauthenticatedError";
  }
}
