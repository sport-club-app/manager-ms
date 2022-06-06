import { NextFunction, Request, Response } from "express"
import { IRequestLoginData } from "@Core/use-cases/auth/login"
import { IRequestCreateUserDataDto } from "@Core/use-cases/user/create-user"
import { authFactory } from "@Factory/auth/authFactory"
import { APIError, HttpStatusCode } from "../exceptions/base-error"
import BusinessError from "@Exceptions/business-error"
import { errorHandler } from "@Exceptions/error-handler"
import { IGetTokenResposeDataDto } from "@Repository/auth-api-repository"
import jwt_decode from "jwt-decode"

const factory = authFactory()

class AuthController {
  async login (req: Request, res: Response, next: NextFunction) {
    const requestData: IRequestLoginData = req.body
    try {
      const token = await factory.login.execute(requestData)
      if (!token.access_token) {
        throw new APIError("NOT_FOUND", HttpStatusCode.NOT_FOUND, true, BusinessError.TOKEN_NOT_FOUND)
      }
      return res.json(token)
    } catch (error) {
      return errorHandler.returnError(error, req, res, next)
    }
  }

  async registerUser (req: Request, res: Response, next: NextFunction) {
    const userRequestData: IRequestCreateUserDataDto = req.body
    const access_token = req.headers.authorization
    try {
      const user: any = jwt_decode(access_token)
      const role = user.realm_access?.roles.find(r => r === "API")
      const httpStatus = await factory.createUser.execute({ ...userRequestData, enabled: role ? false : userRequestData.enabled }, access_token)
      return res.send(httpStatus)
    } catch (error) {
      return errorHandler.returnError(error, req, res, next)
    }
  }
}

export default new AuthController()
