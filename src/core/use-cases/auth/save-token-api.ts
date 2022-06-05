import { IAuthApiRepositoryDbMethods } from "@Repository/auth-api-repository"

export class SaveTokenApi {
    private authApiRepository: IAuthApiRepositoryDbMethods
    constructor (authApiRepository: IAuthApiRepositoryDbMethods) {
      this.authApiRepository = authApiRepository
    }

    async execute (apiId: string, token: string) {
      return this.authApiRepository.saveToken(apiId, token)
    }
}
