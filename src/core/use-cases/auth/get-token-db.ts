import { IAuthApiRepositoryDbMethods } from "@Repository/auth-api-repository"
import { IUseCase } from "../interfaces"
export class GetTokenApi implements IUseCase {
    private authApiRepository: IAuthApiRepositoryDbMethods
    constructor (authApiRepository: IAuthApiRepositoryDbMethods) {
      this.authApiRepository = authApiRepository
    }

    async execute (apiId: string) {
      return this.authApiRepository.getToken(apiId)
    }
}
