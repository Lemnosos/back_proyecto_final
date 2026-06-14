import morgan from 'morgan'
import { createWriteStream, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const logsDir = join(__dirname, '../../logs')

if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true })

/**
 * Middleware que captura el body de res.json() antes de enviarlo,
 * para que Morgan pueda acceder a él en los logs de error.
 */
export const capturarBody = (req, res, next) => {
    const originalJson = res.json.bind(res)
    res.json = function (body) {
        res._body = body
        return originalJson(body)
    }
    next()
}

const logStream = createWriteStream(
    join(logsDir, 'access.log'),
    { flags: 'a' }
)

const timestamp = () => {
    const d = new Date()
    return d.toLocaleString('es-ES', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
    }).replace(',', '')
}

const formato = (tokens, req, res) => {
    const ts = timestamp()
    const metodo = tokens.method(req, res)
    const ip = req.ip || req.connection?.remoteAddress || 'desconocida'
    const url = req.originalUrl
    const tiempo = tokens['response-time'](req, res)
    const cola = tiempo ? ` - ${Math.round(tiempo)} ms` : ''

    if (res.statusCode < 400) {
        return `[${ts}] Se ha establecido una conexion (${metodo}) desde ${ip} y todo ha salido bien${cola}`
    }

    const body = res._body ? JSON.stringify(res._body).slice(0, 300) : 'sin cuerpo'
    return `[${ts}] ERROR: (${metodo} ${url}) ${tokens.status(req, res)} - ${body}${cola}`
}

export const morganLogger = morgan(formato, {
    stream: {
        write: (msg) => {
            process.stdout.write(msg)
            logStream.write(msg)
        }
    }
})
