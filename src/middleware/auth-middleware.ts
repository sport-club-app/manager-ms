import { IRequestCreateUserDataDto } from "@Core/use-cases/user/create-user"
import { APIError, HttpStatusCode } from "@Exceptions/base-error"
import businessError from "@Exceptions/business-error"
import { errorHandler } from "@Exceptions/error-handler"
import { authFactory } from "@Factory/auth/authFactory"
import { IGetTokenResposeDataDto } from "@Repository/auth-api-repository"
import { NextFunction, Request, Response } from "express"

const factory = authFactory()

class GetTokenApi {
  public async execute () {
    const { token, expires }:IGetTokenResposeDataDto = await factory.getTokenApi.execute(process.env.CLIENT_ID)
    if (!token || !expires || expires == -2) {
      const { access_token } = await factory.login.execute({ grant_type: "client_credentials" })
      return {
        access_token: access_token,
        expires: expires
      }
    }
    return {
      access_token: token,
      expires: expires
    }
  }
}
export const getTokenApi = new GetTokenApi()

class SaveTokenDbCache {
  public async execute (access_token: string) {
    const isSavedToken = await factory.saveTokenApi.execute(process.env.CLIENT_ID, access_token)
    if (!isSavedToken) {
      throw new APIError("INTERNAL_SERVER", HttpStatusCode.INTERNAL_SERVER, true, businessError.SAVED_TOKEN)
    }
  }
}
export const saveTokendbCache = new SaveTokenDbCache()

class AuthMiddleware {
  public async execute (req: Request, res: Response, next: NextFunction) {
    const access_token_header = req.headers.authorization?.split(" ")[1]
    try {
      const { access_token, expires } = await getTokenApi.execute()
      if (access_token && expires <= 20) {
        await saveTokendbCache.execute(access_token)
      }
      if (access_token) {
        req.headers.authorization = access_token
      }
      if (access_token_header) {
        req.headers.authorization = access_token_header
      }
      next()
    } catch (error) {
      return errorHandler.returnError(error, req, res, next)
    }
  }
}

export const authMiddleware = new AuthMiddleware()
