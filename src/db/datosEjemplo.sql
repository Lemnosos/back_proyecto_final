-- Usuarios (contraseñas hasheadas con bcryptjs, generadas con seed.js)
INSERT INTO usuario (nombre, apodo, email, password, rol) VALUES
("Admin Principal",	"admin"   ,	"admin@test.com"	 , "$2b$12$UMVTGDM2TZtqVvs8nbl.8.U/3hmPq5zllDs2OKdeRHB4kslZ1ZY3W",	"admin","2026-06-19 10:40:32.555643"),
("Antonio"        , "Aragonte",	"aragonte@test.com", "$2b$10$fauPbDCAF6arpRGers7WwOiQXRfSUD.EmUmPISkb1uc/WeWQXZcnu",	"user",	"2026-06-25 17:42:18.869233"),
("dani"           ,	"Damisa"  ,	"damisa@test.com"  , "$2b$10$62MO7RNEdZKxrsKv/styAOQWD7hAE52meZU6pGqIj6eouPsG6/rvy",	"user",	"2026-06-26 07:13:32.119137"),
("rafa"           ,	"Lemnos"  ,	"rafa@test.com"    , "$2b$10$mLhar.sw/VXucrzcII7IbOU8ulx.Ta/.1oUctnDBvlkxlGK5fYxua",	"user",	"2026-06-22 10:57:07.973455")
  
-- Personajes
INSERT INTO personaje (usuario_id, nombre, vida, ataque, defensa, velocidad, experiencia) VALUES
(	4,	"Lemnos"  ,2000,	2000,	2000,	200, 11616),
(	2,	"Aragonte",200 ,	200 ,	200 ,	200, 350  ),
(	3,	"Damisa"	,200 ,	200	, 200	, 200, 150  )

-- Enemigos
INSERT INTO enemigo (nombre, vida, ataque, defensa, velocidad, tipo) VALUES
("Troll"          ,	150 ,	60  ,	80 ,	20 ,	"normal",	"https://res.cloudinary.com/dymas3eqs/image/upload/v1782286528/Troll_tchsnt.jpg"),
("Dragón de Fuego",	300 ,	120 ,	100,	80 ,	"boss"  ,	"https://res.cloudinary.com/dymas3eqs/image/upload/v1782286534/Dragon_de_fuego_qemwyo.jpg"),
("Esqueleto"      ,	60  ,	45  ,	30 ,	55 ,	"normal",	"https://res.cloudinary.com/dymas3eqs/image/upload/v1782286533/Esqueleto_hmykx2.jpg"),
("Rey Demonio"    ,	500 ,	150 ,	120,	60 ,	"boss"	, "https://res.cloudinary.com/dymas3eqs/image/upload/v1782286529/Rey_Demonio_kjkjtn.jpg"),
("Lemnos"         ,	2500,	1000,	250,	100,	"boss"  ,	"https://res.cloudinary.com/dymas3eqs/image/upload/v1782286526/Lemnos_kk7rn5.jpg"),
("Goblin"         ,	50  ,	50  ,	50 ,	50 ,	"boss"  ,	"https://res.cloudinary.com/dymas3eqs/image/upload/v1782307794/imagenes/Goblino.jpg"),
("Slime"          ,	10  ,	10  ,	10 ,	40 ,	"normal",	"https://res.cloudinary.com/dymas3eqs/image/upload/v1782400864/imagenes/Slime.jpg"),
("Antonios"       ,	150 ,	150 ,	150,	185,	"normal",	"https://res.cloudinary.com/dymas3eqs/image/upload/v1782408427/imagenes/Antonios.png")

-- Combates
INSERT INTO combate (id_personaje, id_enemigo, resultado, turnos) VALUES
  (1, 1, 'victoria', 3),
  (1, 2, 'victoria', 7),
  (1, 3, 'derrota',  12),
  (2, 1, 'victoria', 2),
  (2, 2, 'victoria', 4),
  (3, 1, 'derrota', 50),
  (3, 1, 'derrota', 51),
  (3, 1, 'derrota', 60),
  (3, 1, 'derrota', 42),
  (3, 1, 'victoria',120);