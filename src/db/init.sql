CREATE TABLE Usuario (
  id          SERIAL PRIMARY KEY,
  nombre      VARCHAR(100) NOT NULL,
  apodo       VARCHAR(100),
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  rol         VARCHAR(10) DEFAULT 'user',
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Personaje (
  id            SERIAL PRIMARY KEY,
  usuario_id    INT UNIQUE NOT NULL REFERENCES Usuario(id) ON DELETE CASCADE,
  nombre        VARCHAR(100) NOT NULL,
  vida          INT DEFAULT 100,
  ataque        INT DEFAULT 100,
  defensa       INT DEFAULT 100,
  velocidad     INT DEFAULT 100,
  experiencia   INT DEFAULT 0,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE Enemigo (
  id        SERIAL PRIMARY KEY,
  nombre    VARCHAR(100) NOT NULL,
  vida      INT DEFAULT 100,
  ataque    INT DEFAULT 100,
  defensa   INT DEFAULT 100,
  velocidad INT DEFAULT 100,
  tipo      VARCHAR(10) CHECK (tipo IN ('boss', 'normal'))
);

CREATE TABLE Combate (
  id_pelea      SERIAL PRIMARY KEY,
  id_personaje  INT NOT NULL REFERENCES Personaje(id) ON DELETE CASCADE,
  id_enemigo    INT NOT NULL REFERENCES Enemigo(id) ON DELETE CASCADE,
  fecha         TIMESTAMP DEFAULT NOW(),
  resultado     VARCHAR(10) CHECK (resultado IN ('victoria', 'derrota')),
  turnos        INT NOT NULL
);
