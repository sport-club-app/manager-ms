
import express from "express"
import AuthController from "@Controllers/AuthController"
export const router = express.Router()

router.get("/refresh-token/:id", AuthController.getRefreshToken)
router.post("/login", AuthController.login)
router.post("/register-user", AuthController.registerUser)
