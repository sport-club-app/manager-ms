
import express from "express"
import AuthController from "@Controllers/AuthController"
export const router = express.Router()

router.post("/login", AuthController.login)
router.post("/register-user", AuthController.registerUser)
