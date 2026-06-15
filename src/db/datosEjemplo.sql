-- Usuarios (contraseñas hasheadas con bcryptjs, generadas con seed.js)
INSERT INTO usuario (nombre, apodo, email, password, rol) VALUES
  ('Admin Principal', 'admin',    'admin@test.com',    '$2b$12$UMVTGDM2TZtqVvs8nbl.8.U/3hmPq5zllDs2OKdeRHB4kslZ1ZY3W', 'admin'),
  ('Jugador Uno',     'jugon',    'jugador@test.com',  '$2b$12$UMVTGDM2TZtqVvs8nbl.8.EUiellDX/cuJ8sKcq1V67v7hbe5Mn1y', 'user'),
  ('Jugador Dos',     'pro-player', 'pro@test.com',   '$2b$12$UMVTGDM2TZtqVvs8nbl.8.z4e1isYvWn9G6VjUHNxVUhpmF391hRO', 'user');

-- Personajes
INSERT INTO personaje (usuario_id, nombre, vida, ataque, defensa, velocidad, experiencia) VALUES
  (2, 'Guts',   120, 85,  70, 60,  450),
  (3, 'Shadow', 90,  95,  55, 110, 780);

-- Enemigos
INSERT INTO enemigo (nombre, vida, ataque, defensa, velocidad, tipo) VALUES
  ('Goblin',         50,  30,  20,  40,  'normal'),
  ('Troll',          150, 60,  80,  20,  'normal'),
  ('Dragón de Fuego', 300, 120, 100, 80, 'boss'),
  ('Esqueleto',      60,  45,  30,  55,  'normal'),
  ('Rey Demonio',    500, 150, 120, 60, 'boss');

-- Combates
INSERT INTO combate (id_personaje, id_enemigo, resultado, turnos) VALUES
  (1, 1, 'victoria', 3),
  (1, 2, 'victoria', 7),
  (1, 3, 'derrota',  12),
  (2, 1, 'victoria', 2),
  (2, 4, 'victoria', 4);