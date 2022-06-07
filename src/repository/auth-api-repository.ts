import { clientRedis } from "@Infra/services/redis/config"
import { IRepositoryDbMethodsBase, IGetTokenResposeDataDto } from "./interfaces"

export interface IAuthApiRepositoryDbMethods extends IRepositoryDbMethodsBase<any> {
    saveToken(apiId: string, token: string): Promise<any>;
    getToken(apiId: string): Promise<any>;
}

export class AuthApiRepository implements IAuthApiRepositoryDbMethods {
  async saveToken (apiId: string, token: string) {
    await clientRedis.connect()
    const savedToken = await clientRedis.set(apiId, token, { EX: 290, NX: true })
    await clientRedis.disconnect()
    return savedToken
  }

  async getToken (apiId: string) {
    await clientRedis.connect()
    const getExpiresTime = await clientRedis.sendCommand(["TTL", apiId])
    const getTokenRes = await clientRedis.get(apiId)
    if (getExpiresTime == -2 || !getExpiresTime) {
      await clientRedis.del(apiId)
    }
    await clientRedis.disconnect()
    return {
      token: getTokenRes,
      expires: getExpiresTime
    } as IGetTokenResposeDataDto
  }
}
