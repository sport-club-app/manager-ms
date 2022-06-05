import { FgGreen } from "../console.color"
import { server } from "./server"
import { getVersionApi } from "@Utils/getVersion"

const { APP_HOST, APP_PORT } = process.env
server.listen(APP_PORT, () => {
  console.log(
    FgGreen,
        `Server start in ${APP_HOST}:${APP_PORT}/${getVersionApi()}`
  )
})
