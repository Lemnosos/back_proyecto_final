import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { app, request, URL_BASE, getToken, crearUsuarioTemporal, limpiarUsuario } from './setup.js'

const ENDPOINT = `${URL_BASE}/users`

describe('User - Personaje', () => {
  let tempUser
  let userToken

  beforeAll(async () => {
    tempUser = await crearUsuarioTemporal(`pers_${Date.now()}`)
    const res = await request(app)
      .post(`${URL_BASE}/public`)
      .send({ email: tempUser.email, password: tempUser.password })
    userToken = res.body.data.token
  })

  afterAll(async () => {
    if (tempUser) await limpiarUsuario(tempUser.id)
  })

  it('GET /Personaje debería dar 404 si no tiene personaje', async () => {
    const res = await request(app)
      .get(`${ENDPOINT}/Personaje`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
  })

  it('PUT /Personaje debería dar 400 si falta nombre en body', async () => {
    const res = await request(app)
      .put(`${ENDPOINT}/Personaje`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ id: 999, vida: 100, ataque: 80, defensa: 60, velocidad: 70, experiencia: 0 })
    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
  })

  it('PUT /Personaje debería crear personaje correctamente', async () => {
    const res = await request(app)
      .put(`${ENDPOINT}/Personaje`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ id: 999, nombre: 'TestChar', vida: 100, ataque: 80, defensa: 60, velocidad: 70, experiencia: 0 })
    expect(res.status).toBe(201)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.personaje.nombre).toBe('TestChar')
  })

  it('PUT /Personaje debería dar 403 si ya tiene personaje', async () => {
    const res = await request(app)
      .put(`${ENDPOINT}/Personaje`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ id: 999, nombre: 'DupeChar', vida: 100, ataque: 80, defensa: 60, velocidad: 70, experiencia: 0 })
    expect(res.status).toBe(403)
    expect(res.body.ok).toBe(false)
  })

  it('DELETE /Personaje debería dar 404 con id inexistente', async () => {
    const res = await request(app)
      .delete(`${ENDPOINT}/Personaje`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ id: 9999 })
    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
  })
})

describe('User - Usuario', () => {

  it('GET /usuarios debería devolver datos propios', async () => {
    const token = await getToken('user')
    const res = await request(app)
      .get(`${ENDPOINT}/usuarios`)
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.usuario.email).toBe('jugador@test.com')
    expect(res.body.data.usuario.password).toBeUndefined()
  })
})

describe('User - Combates', () => {
  let userToken

  beforeAll(async () => {
    userToken = await getToken('user')
  })

  it('GET /historial debería devolver combates del personaje', async () => {
    const res = await request(app)
      .get(`${ENDPOINT}/historial`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(Array.isArray(res.body.data.combates)).toBe(true)
  })

  it('GET /enemigo debería devolver un enemigo aleatorio', async () => {
    const res = await request(app)
      .get(`${ENDPOINT}/enemigo`)
      .set('Authorization', `Bearer ${userToken}`)
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.enemigo.id).toBeDefined()
  })
})
