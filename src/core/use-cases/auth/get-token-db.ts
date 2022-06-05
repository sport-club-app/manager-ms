import { IAuthApiRepositoryDbMethods } from "@Repository/auth-api-repository"

export class GetTokenApi {
    private authApiRepository: IAuthApiRepositoryDbMethods
    constructor (authApiRepository: IAuthApiRepositoryDbMethods) {
      this.authApiRepository = authApiRepository
    }

    async execute (apiId: string) {
      return this.authApiRepository.getToken(apiId)
    }
}
