-- Tabla para guardar respuestas del formulario
CREATE TABLE IF NOT EXISTS respuestas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  edad INTEGER NOT NULL,
  cargo TEXT NOT NULL,
  created_at TEXT NOT NULL
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_respuestas_created ON respuestas (created_at);
CREATE INDEX IF NOT EXISTS idx_respuestas_nombre ON respuestas (nombre);
