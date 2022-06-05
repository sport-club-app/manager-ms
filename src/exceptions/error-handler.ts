import { logger } from "@Infra/services/logger/config"
import { Response, Request, NextFunction } from "express"
import { BaseError } from "./base-error"
import businessError from "./business-error"

// free to extend the BaseError

class ErrorHandler {
  public async logError (err) {
    await logger.error(
      "Error message from the centralized error-handling component",
      err
    )
  }

  public async logErrorMiddleware (err, req: Request, res: Response, next: NextFunction) {
    if (!err) {
      next("route")
    }
    this.logError(err)
    next(err)
  }

  public async returnError (error, req: Request, res: Response, next: NextFunction) {
    return res.status(error.response?.status || error.httpCode || 500).send(error.response?.data || error || businessError.GENERIC)
  }

  public async isOperationalError (error) {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}
export const errorHandler = new ErrorHandler()
