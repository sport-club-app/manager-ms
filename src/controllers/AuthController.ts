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
    const access_token_admin = req.headers.authorization?.split(" ")[1]

    try {
      const { token, expires }:IGetTokenResposeDataDto = await factory.getTokenApi.execute(process.env.CLIENT_ID)
      if (!token || !expires || expires == -2) {
        const { access_token } = await factory.login.execute({ grant_type: "client_credentials" })

        const isSavedToken = await factory.saveTokenApi.execute(process.env.CLIENT_ID, access_token_admin || access_token)
        if (!isSavedToken) {
          throw new APIError("INTERNAL_SERVER", HttpStatusCode.INTERNAL_SERVER, true, BusinessError.SAVED_TOKEN)
        }
        const user: any = jwt_decode(access_token_admin || access_token)
        const httpStatus = await factory.createUser.execute({ ...userRequestData, enabled: user.preferred_username === "service-account-manager-ms" ? false : userRequestData.enabled }, access_token_admin || access_token)
        return res.send(httpStatus)
      }
      const user: any = jwt_decode(access_token_admin || token)
      const httpStatus = await factory.createUser.execute({ ...userRequestData, enabled: user.preferred_username === "service-account-manager-ms" ? false : userRequestData.enabled }, access_token_admin || token)
      return res.send(httpStatus)
    } catch (error) {
      return errorHandler.returnError(error, req, res, next)
    }
  }
}

export default new AuthController()
