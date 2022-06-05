
import "dotenv/config"
import express from "express"
import cors from "cors"
import { router } from "./routes"
import swaggerUi from "swagger-ui-express"
import swaggerDocument from "../src/docs/swagger.json"
import { getVersionApi } from "@Utils/getVersion"
import { errorHandler } from "src/exceptions/error-handler"

export const server = express()
server.use(cors())
server.use(express.json())

server.get(`/${getVersionApi()}/health`, (_, res) => res.send({ message: "manager-ms is running", date: new Date() }))
server.use(`/${getVersionApi()}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocument))
server.get("/", (_, res) => {
  res.redirect(`/${getVersionApi()}/health`)
})

// process.on("unhandledRejection", (reason, promise) => {
//   console.log("Unhandled Rejection at:", reason)
//   process.exit(1)
// })

server.use(errorHandler.logErrorMiddleware)
server.use(errorHandler.returnError)

server.use(`/${getVersionApi()}`, router)
