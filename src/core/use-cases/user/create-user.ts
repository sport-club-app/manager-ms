import { AxiosInstance } from "axios"

export interface IRequestCreateUserDataDto {
    username: string
    password: string
    firstName: string
    lastName: string
    enabled: boolean
    realmRoles: string[]
    credentials: [{ type: "password" | "client_credentials", value: string, temporary: boolean }]
    emailVerified: boolean
    groups: string[]
}

export class CreateUser {
    private authApi: AxiosInstance;
    constructor (authApi: AxiosInstance) {
      this.authApi = authApi
    }

    async execute (dataRequest: IRequestCreateUserDataDto, tokenApi?: string) {
      const { status } = await this.authApi.post(`/admin/realms/${process.env.KEYCLOAK_HELM}/users`, dataRequest, {
        headers: { Authorization: `bearer ${tokenApi}` }
      })
      return status
    }
}
