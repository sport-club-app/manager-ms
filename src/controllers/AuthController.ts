import { NextFunction, Request, Response } from "express"
import { IRequestLoginDTO, IRequestCreateUserDataDTO } from "@Core/use-cases/interfaces"
import { authFactory } from "src/bind-factory/auth/authFactory"
import { HttpStatusCode } from "../exceptions/interfaces"
import { APIError } from "../exceptions/base-error"
import BusinessError from "@Exceptions/business-error"
import { errorHandler } from "@Exceptions/error-handler"
import jwt_decode from "jwt-decode"
import { IControllerHttpMethods } from "./interfaces"

const factory = authFactory()

export interface IAuthControllerHttpMethods extends IControllerHttpMethods{
  login(req: Request, res: Response, next: NextFunction): Promise<Response<any>>
  registerUser(req: Request, res: Response, next: NextFunction): Promise<Response<any>>
  getRefreshToken(req: Request, res: Response, next: NextFunction): Promise<Response<any>>
}
class AuthController implements IAuthControllerHttpMethods {
  async login (req: Request, res: Response, next: NextFunction) {
    const requestData: IRequestLoginDTO = req.body
    try {
      const dataToken = await factory.login.execute(requestData)
      if (!dataToken.access_token) {
        throw new APIError("NOT_FOUND", HttpStatusCode.NOT_FOUND, true, BusinessError.TOKEN_NOT_FOUND)
      }

      const user: any = jwt_decode(dataToken.access_token)
      await factory.deleteTokenDb.execute(user.sub)
      await factory.saveTokenApi.execute(user.sub, dataToken.refresh_token)
      return res.json(dataToken)
    } catch (error) {
      return errorHandler.returnError(error, req, res, next)
    }
  }

  async registerUser (req: Request, res: Response, next: NextFunction) {
    const userRequestData: IRequestCreateUserDataDTO = req.body
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

  async getRefreshToken (req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = await factory.getTokenDb.execute(req.params.id)
      return res.json(refreshToken)
    } catch (error) {
      return errorHandler.returnError(error, req, res, next)
    }
  }
}

export default new AuthController()
