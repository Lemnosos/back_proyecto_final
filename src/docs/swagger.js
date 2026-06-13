import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { load } from 'js-yaml'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const yamlPath = join(__dirname, 'openapi.yaml')
const yamlContent = readFileSync(yamlPath, 'utf8')
const swaggerDocument = load(yamlContent)

export const router = Router()

router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerDocument))
