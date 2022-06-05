
import qs from "qs"
import { AxiosResponse, AxiosInstance } from "axios"
import { errorHandler } from "src/exceptions/error-handler"

interface IResponseLoginData {
    access_token: string
    expires_in: number
    refresh_expires_in: number
    refresh_token: string
    token_type: string
    session_state: string
    scope: string
}

export interface IRequestLoginData{
  client_id?: string
  client_secret?: string
  grant_type?: "password" | "client_credentials" | "refresh_token"
  username?: string
  password?: string
}

export class Login {
  private authApi: AxiosInstance
  constructor (authApi: AxiosInstance) {
    this.authApi = authApi
  }

  async execute (dataRequest: IRequestLoginData) {
    const dataFormat = qs.stringify(
      {
        client_id: dataRequest.client_id || process.env.CLIENT_ID,
        client_secret: dataRequest.client_secret || process.env.CLIENT_SECRET,
        grant_type: dataRequest.grant_type,
        username: dataRequest.username || null,
        password: dataRequest.password || null
      }
    )

    const { data }: AxiosResponse<IResponseLoginData> = await this.authApi.post(`/realms/${process.env.KEYCLOAK_HELM}/protocol/openid-connect/token`, dataFormat, {
      headers: { "content-type": "application/x-www-form-urlencoded" }
    })
    return data
  }
}
