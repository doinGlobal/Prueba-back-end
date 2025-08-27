// functions/api/respuestas.js

export async function onRequestPost(context) {
  const { request, env } = context;

  // Seguridad básica de contenido
  if (request.headers.get('content-type')?.includes('application/json') !== true) {
    return json({ error: 'Content-Type debe ser application/json' }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'JSON inválido' }, 400);
  }

  const nombre = String(body?.nombre ?? '').trim();
  const edad = Number(body?.edad);
  const cargo = String(body?.cargo ?? '').trim();

  // Validación mínima
  if (!nombre || !cargo || !Number.isFinite(edad)) {
    return json({ error: 'Faltan campos: nombre, edad y cargo son obligatorios' }, 400);
  }
  if (edad < 0 || edad > 120) {
    return json({ error: 'Edad fuera de rango' }, 400);
  }
  if (nombre.length > 120 || cargo.length > 120) {
    return json({ error: 'Longitud máxima: 120 caracteres' }, 400);
  }

  // Insertar en D1
  try {
    const createdAt = new Date().toISOString();
    const stmt = env.DB.prepare(
      `INSERT INTO respuestas (nombre, edad, cargo, created_at)
       VALUES (?, ?, ?, ?)`
    ).bind(nombre, edad, cargo, createdAt);

    const result = await stmt.run();
    return json({ ok: true, id: result.lastRowId, created_at: createdAt }, 201);
  } catch (e) {
    console.error(e);
    return json({ error: 'Error guardando en la base de datos' }, 500);
  }
}

export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, nombre, edad, cargo, created_at
       FROM respuestas
       ORDER BY id DESC
       LIMIT 100`
    ).all();
    return json({ items: results ?? [] });
  } catch (e) {
    console.error(e);
    return json({ error: 'Error leyendo de la base de datos' }, 500);
  }
}

// Helper para responder JSON
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' }
  });
}
