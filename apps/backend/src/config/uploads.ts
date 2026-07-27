import { fileURLToPath } from "url"
import path from "path"
import fs from "fs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const uploadsDir = path.resolve(__dirname, "../../uploads")

fs.mkdirSync(uploadsDir, { recursive: true })
