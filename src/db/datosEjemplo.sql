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
  ('Goblin',         50,  30,  20,  40,  'normal'),
  ('Troll',          150, 60,  80,  20,  'normal'),
  ('Dragón de Fuego', 300, 120, 100, 80, 'boss'),
  ('Esqueleto',      60,  45,  30,  55,  'normal'),
  ('Rey Demonio',    500, 150, 120, 60, 'boss'),
  ('Lemnos',        2500, 1000,250,100,'boss');

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