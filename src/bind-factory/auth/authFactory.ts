import { Login } from "@Core/use-cases/auth/login"
import { CreateUser } from "@Core/use-cases/user/create-user"
import { SaveTokenApi } from "@Core/use-cases/auth/save-token-api"
import { apiKeycloack } from "@Infra/services/keycloakApi"
import { AuthApiRepository } from "@Repository/auth-api-repository"
import { GetTokenApi } from "@Core/use-cases/auth/get-token-db"

export function authFactory () {
  const login = new Login(apiKeycloack)
  const createUser = new CreateUser(apiKeycloack)
  const authApiRepository = new AuthApiRepository()
  const saveTokenApi = new SaveTokenApi(authApiRepository)
  const getTokenApi = new GetTokenApi(authApiRepository)
  return {
    login,
    createUser,
    saveTokenApi,
    getTokenApi
  }
}
