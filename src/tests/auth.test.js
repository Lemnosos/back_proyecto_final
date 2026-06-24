import { describe, it, expect, afterAll } from 'vitest'
import { app, request, URL_BASE, getToken, crearUsuarioTemporal, limpiarUsuario } from './setup.js'

const ENDPOINT = `${URL_BASE}/public`

describe('Auth - POST /public/new', () => {

  let tempUser
  let tempEmail

  afterAll(async () => {
    if (tempUser) await limpiarUsuario(tempUser.id)
  })

  it('debería registrar un usuario nuevo y devolver token', async () => {
    const suffix = `auth_${Date.now()}`
    tempEmail = `test_${suffix}@test.com`

    const res = await request(app)
      .post(`${ENDPOINT}/new`)
      .send({ nombre: 'Test', email: tempEmail, password: '123456' })

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.headers['set-cookie']).toBeDefined()
    tempUser = { id: res.body.data.id, email: tempEmail }
  })

  it('debería dar 403 si el email ya está registrado', async () => {
    const res = await request(app)
      .post(`${ENDPOINT}/new`)
      .send({ nombre: 'Test', email: 'admin@test.com', password: '123456' })

    expect(res.status).toBe(403)
    expect(res.body.ok).toBe(false)
    expect(res.body.error).toMatch(/email/i)
  })
})

describe('Auth - POST /public', () => {

  it('debería loguear con credenciales correctas', async () => {
    const res = await request(app)
      .post(ENDPOINT)
      .send({ email: 'admin@test.com', password: 'Admin1234' })

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  it('debería dar 403 con contraseña incorrecta', async () => {
    const res = await request(app)
      .post(ENDPOINT)
      .send({ email: 'admin@test.com', password: 'wrongpass' })

    expect(res.status).toBe(403)
    expect(res.body.ok).toBe(false)
  })
})

describe('Auth - GET /public/delete', () => {

  it('debería renovar token si es válido', async () => {
    const token = await getToken('admin')

    const res = await request(app)
      .get(`${ENDPOINT}/delete`)
      .set('Cookie', `token=${token}`)

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  it('debería dar 200 aunque no haya token', async () => {
    const res = await request(app).get(`${ENDPOINT}/delete`)

    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })
})
