import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { capturarBody, morganLogger } from './utils/morganConfig.js'

const URL_BASE = process.env.URL_BASE
const puerto = process.env.PORT

const app = express()
const port = puerto || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// ─── CORS: descomentar según entorno ───────────────────
// PRODUCCIÓN (Render):
const CORS_ORIGIN = 'https://front-proyecto-final-4apg.onrender.com'
// LOCAL (comentar lo de arriba, descomentar esto):
// const CORS_ORIGIN = 'http://localhost:5173'

app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}))

app.use(capturarBody)
app.use(morganLogger)

import { router as authRoutes } from './routes/auth.routes.js'
import { router as adminRoutes } from './routes/admin.routes.js'
import { router as userRoutes } from './routes/user.routes.js'
import { router as docsRoutes } from './docs/swagger.js'

app.use('/', docsRoutes)
app.use(`${URL_BASE}/public`, authRoutes)
app.use(`${URL_BASE}/admin`, adminRoutes)
app.use(`${URL_BASE}/users`, userRoutes)

app.get('/health', (req, res) => res.json({ ok: true }))
app.get(`${URL_BASE}/health`, (req, res) => res.json({ ok: true }))

app.listen(port, () => {
    console.log(`Server on port ${port}`)
})

export { app }