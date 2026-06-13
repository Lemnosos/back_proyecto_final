-- Usuarios (contraseñas ya hasheadas con bcryptjs)
INSERT INTO usuario (nombre, apodo, email, password, rol) VALUES
  ('Admin Principal', 'admin',    'admin@test.com',    'Admin1234',    'admin'),
  ('Jugador Uno',     'jugon',    'jugador@test.com',  'Jugador1234',  'user'),
  ('Jugador Dos',     'pro-player', 'pro@test.com',   'ProPlayer1234', 'user');

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