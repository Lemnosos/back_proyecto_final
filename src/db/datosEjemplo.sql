-- Usuarios (contraseñas hasheadas con bcryptjs, generadas con seed.js)
INSERT INTO usuario (nombre, apodo, email, password, rol) VALUES
  ('Admin Principal', 'admin',    'admin@test.com',    '$2b$12$UMVTGDM2TZtqVvs8nbl.8.U/3hmPq5zllDs2OKdeRHB4kslZ1ZY3W', 'admin'),--pass:Admin1234
  ('Jugador Uno',     'jugon',    'jugador@test.com',  '$2b$12$UMVTGDM2TZtqVvs8nbl.8.EUiellDX/cuJ8sKcq1V67v7hbe5Mn1y', 'user'), --pass:Jugador1234
  ('Jugador Dos',     'pro-player', 'pro@test.com',   '$2b$12$UMVTGDM2TZtqVvs8nbl.8.z4e1isYvWn9G6VjUHNxVUhpmF391hRO', 'user');  --pass: ProPlayer1234

-- Personajes
INSERT INTO personaje (usuario_id, nombre, vida, ataque, defensa, velocidad, experiencia) VALUES
  (1, 'Guts',   120, 85,  70, 60,  450),
  (2, 'Shadow', 90,  95,  55, 110, 780),
  (3, 'Aragonte', 250,100,100,200,700);

-- Enemigos
INSERT INTO enemigo (nombre, vida, ataque, defensa, velocidad, tipo) VALUES
  ('Slime',           10,   10,   10,   40, 'normal', 'https://www.magnific.com/es/psd-premium/hermosos-hielos-iridescentes-aislados-sobre-fondo-transparente_378607764.htm#fromView=search&page=1&position=8&uuid=3bd1fa60-8e48-4b2c-a1c7-1b590797c73c&query=slime+monstruo'),
  ('Goblin',          50,   30,   20,   40, 'normal', 'https://www.magnific.com/es/psd-premium/duende-solo-sobre-fondo-transparente_286756460.htm#fromView=search&page=1&position=17&uuid=22b97f8e-011b-4e2f-8d03-e974b8288a23&query=goblin+monstruo'),
  ('Troll',           150,  60,   80,   20, 'normal'  'https://www.magnific.com/es/psd-premium/ogre-aislado-contra-telon-fondo-transparente_295080474.htm#fromView=search&page=1&position=11&uuid=256a1585-6eaf-4d0a-baf2-f1d7b55cf1c0&query=troll+monstruo'),
  ('Dragón de Fuego', 300,  120,  100,  80, 'boss',   'https://www.magnific.com/es/psd-premium/dragon-fuego-pie-roca-aislada-fondo-transparente-png_134300378.htm#fromView=search&page=2&position=34&uuid=bd2fe92a-a798-4373-ab1f-d09bb0e8782b&query=dragon+de+fuego+monstruo'),
  ('Esqueleto',       60,   45,   30,   55, 'normal', 'https://www.magnific.com/es/psd-premium/wendigo-monstruosa-criatura-esqueletica-ciervo-fondo-transparente_371278064.htm#fromView=keyword&page=3&position=16&uuid=0c87c327-c18b-4237-b5f8-e2f422a591d0&query=Esqueleto+extra%C3%B1o+extra%C3%B1o'),
  ('Rey Demonio',     500,  150,  120,  60, 'boss',   'https://www.magnific.com/es/psd-premium/diablo-rojo-realista-aislado-fondo-transparente-generativo-ai_237168260.htm#fromView=search&page=1&position=48&uuid=fedac122-9633-4dc6-8b3f-c4daeff2e172&query=rey+demonio'),
  ('Lemnos',          2500, 1000, 250, 100, 'boss',   'https://www.magnific.com/es/psd-premium/cartel-caballero-espada-fondo-rojo_263109720.htm#fromView=search&page=2&position=32&uuid=65816a01-1bf4-4773-8644-cee3a04bc1e9&query=guerrero+paladin');

-- Combates
INSERT INTO combate (id_personaje, id_enemigo, resultado, turnos) VALUES
  (1, 1, 'victoria', 3),
  (1, 2, 'victoria', 7),
  (1, 3, 'derrota',  12),
  (2, 1, 'victoria', 2),
  (2, 4, 'victoria', 4),
  (3, 6, 'derrota', 50),
  (3, 6, 'derrota', 51),
  (3, 6, 'derrota', 60),
  (3, 6, 'derrota', 42),
  (3, 6, 'victoria',120);