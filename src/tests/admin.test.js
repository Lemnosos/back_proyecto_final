import { describe, it, expect } from 'vitest'
import { app, request, URL_BASE, getToken } from './setup.js'

const ENDPOINT = `${URL_BASE}/admin`

describe('Admin - GET /admin/enemigos', () => {

  it('debería dar 401 sin token', async () => {
    const res = await request(app).get(`${ENDPOINT}/enemigos`)
    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
  })

  it('debería dar 403 con token de user', async () => {
    const token = await getToken('user')
    const res = await request(app)
      .get(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
    expect(res.status).toBe(403)
    expect(res.body.ok).toBe(false)
  })

  it('debería listar todos los enemigos', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .get(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data.enemigos.length).toBeGreaterThanOrEqual(5)
  })

  it('debería devolver un enemigo por ?id=', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .get(`${ENDPOINT}/enemigos?id=1`)
      .set('Cookie', `token=${token}`)
    expect(res.status).toBe(200)
    expect(res.body.data.enemigo.id).toBe(1)
  })

  it('debería dar 404 con ?id=9999', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .get(`${ENDPOINT}/enemigos?id=9999`)
      .set('Cookie', `token=${token}`)
    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
  })
})

describe('Admin - POST /admin/enemigos', () => {

  it('debería dar 400 si falta nombre', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .post(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
      .send({ vida: 50, ataque: 30, defensa: 20, velocidad: 40, tipo: 'normal' })
    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
    expect(res.body.error).toMatch(/validación/i)
  })

  it('debería dar 400 si tipo no es boss/normal', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .post(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
      .send({ nombre: 'Test', vida: 50, ataque: 30, defensa: 20, velocidad: 40, tipo: 'invalido' })
    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
  })

  it('debería crear un enemigo correctamente', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .post(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
      .send({ nombre: 'EnemigoTest', vida: 50, ataque: 30, defensa: 20, velocidad: 40, tipo: 'normal' })
    expect(res.status).toBe(201)
    expect(res.body.ok).toBe(true)
  })
})

describe('Admin - PATCH /admin/enemigos', () => {

  it('debería dar 400 si falta id en body', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .patch(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
      .send({ nombre: 'Test' })
    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
  })

  it('debería dar 404 con id inexistente', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .patch(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
      .send({ id: 9999, nombre: 'Test' })
    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
  })
})

describe('Admin - DELETE /admin/enemigos', () => {

  it('debería dar 404 con id inexistente', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .delete(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
      .send({ id: 9999 })
    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
  })

  it('debería dar 400 si id no es entero', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .delete(`${ENDPOINT}/enemigos`)
      .set('Cookie', `token=${token}`)
      .send({ id: 'abc' })
    expect(res.status).toBe(400)
    expect(res.body.ok).toBe(false)
  })
})

describe('Admin - GET /admin/usuarios/:id', () => {

  it('debería dar 404 con id inexistente', async () => {
    const token = await getToken('admin')
    const res = await request(app)
      .get(`${ENDPOINT}/usuarios/9999`)
      .set('Cookie', `token=${token}`)
    expect(res.status).toBe(404)
    expect(res.body.ok).toBe(false)
  })
})
