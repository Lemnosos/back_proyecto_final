// Ejecutar desde la raíz del backend:
//   node src/db/sembrarCombates.js

import 'dotenv/config'
import pg from 'pg'

const pool = new pg.Pool({
    user: process.env.SQL_USER,
    host: process.env.SQL_HOST,
    database: process.env.SQL_DB,
    password: process.env.SQL_PASS,
    port: Number(process.env.SQL_PORT),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000
})

const TOTAL_COMBATES = 2000
const LOTES = 100

const PERSONAJES = [
  { id: 37, nombre: 'Lemnos', vida: 2000, ataque: 2000, defensa: 2000, velocidad: 2000 },
  { id: 38, nombre: 'Damisa', vida: 100, ataque: 100, defensa: 100, velocidad: 100 },
  { id: 39, nombre: 'Aragonte', vida: 200, ataque: 200, defensa: 200, velocidad: 150 }
]

const ENEMIGOS = [
  { id: 6, nombre: 'Rey Demonio', vida: 500, ataque: 150, defensa: 120, velocidad: 60 },
  { id: 4, nombre: 'Dragón de Fuego', vida: 300, ataque: 120, defensa: 100, velocidad: 80 },
  { id: 7, nombre: 'Lemnos', vida: 2500, ataque: 1000, defensa: 250, velocidad: 100 },
  { id: 30, nombre: 'Goblin', vida: 50, ataque: 50, defensa: 50, velocidad: 50 },
  { id: 5, nombre: 'Esqueleto', vida: 60, ataque: 45, defensa: 30, velocidad: 55 },
  { id: 3, nombre: 'Troll', vida: 150, ataque: 60, defensa: 80, velocidad: 20 },
  { id: 32, nombre: 'Slime', vida: 10, ataque: 10, defensa: 10, velocidad: 40 }
]

function probabilidadVictoria(personaje, enemigo) {
  const ratio =
    (personaje.ataque / enemigo.defensa) * 0.4 +
    (personaje.defensa / enemigo.ataque) * 0.3 +
    (personaje.vida / enemigo.vida) * 0.2 +
    (personaje.velocidad / enemigo.velocidad) * 0.1
  return 0.05 + 0.90 / (1 + Math.exp(-(ratio - 1) * 1.5))
}

function generarCombate() {
  const personaje = PERSONAJES[Math.floor(Math.random() * PERSONAJES.length)]
  const enemigo = ENEMIGOS[Math.floor(Math.random() * ENEMIGOS.length)]

  const prob = probabilidadVictoria(personaje, enemigo)
  const rand = Math.random()

  const randAbandono = Math.random()
  const abandono = randAbandono < 0.10
  let resultado
  if (abandono) resultado = 'derrota'
  else if (rand < prob) resultado = 'victoria'
  else resultado = 'derrota'

  const equilibrio = 1 - Math.abs(prob - 0.5) * 2
  const turnos = abandono ? Math.floor(Math.random() * 3) + 1 : Math.round(3 + equilibrio * 12)

  return {
    id_personaje: personaje.id,
    id_enemigo: enemigo.id,
    personaje_nombre: personaje.nombre,
    enemigo_nombre: enemigo.nombre,
    resultado,
    turnos,
    abandono
  }
}

async function insertarLote(client, combates) {
  const values = combates.map((_, i) =>
    `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`
  ).join(', ')

  const params = combates.flatMap(c => [c.id_personaje, c.id_enemigo, c.resultado, c.turnos])
  await client.query(
    `INSERT INTO combate (id_personaje, id_enemigo, resultado, turnos) VALUES ${values}`,
    params
  )
}

async function main() {
  console.log(`Generando ${TOTAL_COMBATES} combates...`)

  const combates = Array.from({ length: TOTAL_COMBATES }, () => generarCombate())

  const client = await pool.connect()
  try {
    for (let i = 0; i < combates.length; i += LOTES) {
      const lote = combates.slice(i, i + LOTES)
      await insertarLote(client, lote)
      process.stdout.write(`\rInsertados ${Math.min(i + LOTES, combates.length)} / ${combates.length}`)
    }
    console.log('\n\n✅ Inserción completada')
  } catch (error) {
    console.error('\n❌ Error:', error.message)
    throw error
  } finally {
    client.release()
  }

  const conteo = {}
  let abandonos = 0
  for (const c of combates) {
    if (c.abandono) abandonos++
    if (!conteo[c.personaje_nombre]) conteo[c.personaje_nombre] = { total: 0, victoria: 0, derrota: 0 }
    conteo[c.personaje_nombre].total++
    conteo[c.personaje_nombre][c.resultado]++
  }

  const v = combates.filter(c => c.resultado === 'victoria').length
  const d = combates.filter(c => c.resultado === 'derrota').length
  const totalTurnos = combates.reduce((s, c) => s + c.turnos, 0)

  console.log('\n📊 Resumen:')
  for (const [nombre, stats] of Object.entries(conteo)) {
    console.log(`   ${nombre.padEnd(10)} ${stats.total} combates  (${stats.victoria}V / ${stats.derrota}D)`)
  }
  console.log(`\n   Victorias: ${v} (${(v / TOTAL_COMBATES * 100).toFixed(1)}%)`)
  console.log(`   Derrotas:  ${d} (${(d / TOTAL_COMBATES * 100).toFixed(1)}%)  (${abandonos} abandonos simulados)`)
  console.log(`   Media turnos: ${(totalTurnos / TOTAL_COMBATES).toFixed(1)}`)
  console.log('')
}

main().catch(() => process.exit(1))
