-- Modelo de datos del MVP (PostgreSQL)
-- Se ejecuta con: npm run db:init  (borra y vuelve a crear las tablas)

DROP TABLE IF EXISTS historial_etapas;
DROP TABLE IF EXISTS evaluaciones;
DROP TABLE IF EXISTS solicitudes;
DROP TABLE IF EXISTS candidatos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
  id            SERIAL PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  email         VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  rol           VARCHAR(20)  NOT NULL CHECK (rol IN ('analista', 'evaluador'))
);

CREATE TABLE candidatos (
  id             SERIAL PRIMARY KEY,
  nombre         VARCHAR(100) NOT NULL,
  email          VARCHAR(120) NOT NULL,
  telefono       VARCHAR(20)  NOT NULL,
  cargo          VARCHAR(100) NOT NULL,
  familia_cargo  VARCHAR(50)  NOT NULL,
  ubicacion      VARCHAR(60)  NOT NULL DEFAULT '',
  origen         VARCHAR(10)  NOT NULL DEFAULT 'Interno' CHECK (origen IN ('Interno', 'Externo')),
  fecha_registro DATE         NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE solicitudes (
  id               SERIAL PRIMARY KEY,
  candidato_id     INTEGER      NOT NULL REFERENCES candidatos(id) ON DELETE CASCADE,
  cargo            VARCHAR(100) NOT NULL,
  familia_cargo    VARCHAR(50)  NOT NULL,
  ubicacion        VARCHAR(60)  NOT NULL DEFAULT '',
  analista         VARCHAR(100) NOT NULL,
  responsable_id   INTEGER      REFERENCES usuarios(id),
  etapa            VARCHAR(20)  NOT NULL DEFAULT 'recibida'
                   CHECK (etapa IN ('recibida', 'agendada', 'realizada', 'enviado')),
  fecha_solicitud  DATE         NOT NULL DEFAULT CURRENT_DATE,
  fecha_entrevista DATE,
  observaciones    TEXT         NOT NULL DEFAULT ''
);

CREATE TABLE evaluaciones (
  id               SERIAL PRIMARY KEY,
  solicitud_id     INTEGER     NOT NULL UNIQUE REFERENCES solicitudes(id) ON DELETE CASCADE,
  fecha_evaluacion DATE        NOT NULL,
  resultado        VARCHAR(40) NOT NULL,
  observaciones    TEXT        NOT NULL,
  estado           VARCHAR(20) NOT NULL DEFAULT 'En proceso' CHECK (estado IN ('En proceso', 'Finalizada'))
);

CREATE TABLE historial_etapas (
  id           SERIAL PRIMARY KEY,
  solicitud_id INTEGER     NOT NULL REFERENCES solicitudes(id) ON DELETE CASCADE,
  etapa        VARCHAR(20) NOT NULL,
  fecha        DATE        NOT NULL DEFAULT CURRENT_DATE,
  comentario   VARCHAR(200) NOT NULL DEFAULT '',
  usuario      VARCHAR(100) NOT NULL DEFAULT ''
);
